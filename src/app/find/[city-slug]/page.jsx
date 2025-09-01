// src/app/find/[city-slug]/page.jsx
import { supabase } from '@/lib/supabase';
import ContainerConstrained from '@/components/layout/container-constrained';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

async function getCityHub(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('content_type', 'city_hub')
    .eq('is_published', true)
    .single();

  if (error || !data) {
    return null;
  }

  // Increment view count
  await supabase
    .from('blog_posts')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', data.id);

  return data;
}

// Province full names mapping
const provinceNames = {
  BC: 'British Columbia',
  AB: 'Alberta',
  SK: 'Saskatchewan',
  MB: 'Manitoba',
  ON: 'Ontario',
  QC: 'Quebec',
  NB: 'New Brunswick',
  PE: 'Prince Edward Island',
  NS: 'Nova Scotia',
  NL: 'Newfoundland and Labrador',
  YT: 'Yukon',
  NT: 'Northwest Territories',
  NU: 'Nunavut',
};

export async function generateMetadata({ params }) {
  const hub = await getCityHub(params['city-slug']);

  if (!hub) {
    return {
      title: 'City Not Found | Vetpras',
      description: 'The requested city page could not be found.',
    };
  }

  const baseUrl = 'https://vetpras.com';
  const canonicalUrl = hub.canonical_url || `${baseUrl}/find/${params['city-slug']}`;

  // Format city name for display
  const cityName = hub.target_city || hub.title.replace(' Veterinarians', '').replace(' Vets', '');
  const provinceName = hub.target_province ? provinceNames[hub.target_province] : '';
  const fullLocation = provinceName ? `${cityName}, ${provinceName}` : cityName;

  const description =
    hub.meta_description ||
    hub.excerpt ||
    `Find trusted veterinarians in ${fullLocation}. Compare vet clinics, services, prices, and book appointments near you.`;

  return {
    title: `Veterinarians in ${fullLocation} | Find a Vet Near You | Vetpras`,
    description: description,
    keywords:
      hub.target_keywords?.join(', ') ||
      `veterinarian ${cityName}, vet clinic ${cityName}, animal hospital ${cityName}, pet care ${cityName}, emergency vet ${cityName}`,
    authors: [{ name: hub.author || 'Vetpras Team' }],

    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph - optimized for local content
    openGraph: {
      title: `Find Veterinarians in ${fullLocation}`,
      description: description,
      url: canonicalUrl,
      siteName: 'Vetpras',
      type: 'website',
      images: hub.featured_image
        ? [
            {
              url: hub.featured_image,
              width: 1200,
              height: 630,
              alt: `Veterinary clinics in ${fullLocation}`,
            },
          ]
        : [
            {
              url: `${baseUrl}/images/vetpras-og-city.jpg`,
              width: 1200,
              height: 630,
              alt: `Find veterinarians in ${fullLocation} with Vetpras`,
            },
          ],
      locale: 'en_CA',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: `Vets in ${fullLocation}`,
      description: description,
      images: hub.featured_image ? [hub.featured_image] : [`${baseUrl}/images/vetpras-og-city.jpg`],
      site: '@vetpras',
      creator: '@vetpras',
    },

    // Additional meta tags for local SEO
    other: {
      'geo.region': `CA-${hub.target_province}`,
      'geo.placename': cityName,
      'geo.position': hub.geo_coordinates || '', // If you have coordinates
      ICBM: hub.geo_coordinates || '', // If you have coordinates
    },
  };
}

// Generate JSON-LD structured data for local SEO
function generateStructuredData(hub, slug) {
  const baseUrl = 'https://vetpras.com';
  const cityName = hub.target_city || hub.title.replace(' Veterinarians', '').replace(' Vets', '');
  const provinceName = hub.target_province ? provinceNames[hub.target_province] : '';
  const fullLocation = provinceName ? `${cityName}, ${provinceName}` : cityName;

  // LocalBusiness structured data for the directory page
  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Veterinary Clinics in ${fullLocation}`,
    description: hub.meta_description || hub.excerpt,
    url: `${baseUrl}/find/${slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Find a Vet',
          item: `${baseUrl}/find`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: fullLocation,
          item: `${baseUrl}/find/${slug}`,
        },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      name: `Veterinary Clinics in ${fullLocation}`,
      description: `Directory of veterinary clinics and animal hospitals in ${fullLocation}`,
      numberOfItems: hub.clinic_count || 0, // If you track this
    },
    areaServed: {
      '@type': 'City',
      name: cityName,
      containedInPlace: {
        '@type': 'State',
        name: provinceName,
        containedInPlace: {
          '@type': 'Country',
          name: 'Canada',
        },
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vetpras',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/vetpras-logo.png`,
      },
    },
  };

  // Add FAQ structured data if available
  if (hub.faq_content && hub.faq_content.questions) {
    const faqData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: hub.faq_content.questions.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    };

    return [localBusinessData, faqData];
  }

  return localBusinessData;
}

export default async function CityHubPage({ params }) {
  const hub = await getCityHub(params['city-slug']);

  if (!hub) {
    notFound();
  }

  const structuredData = generateStructuredData(hub, params['city-slug']);
  const cityName = hub.target_city || hub.title.replace(' Veterinarians', '').replace(' Vets', '');
  const provinceName = hub.target_province ? provinceNames[hub.target_province] : '';
  const fullLocation = provinceName ? `${cityName}, ${provinceName}` : cityName;

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <ContainerConstrained>
        <article className="py-12">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2">/</span>
                <Link href="/find" className="hover:text-gray-900">
                  Find a Vet
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-gray-900">{fullLocation}</span>
              </li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">{hub.title}</h1>

            {/* Location Badge */}
            <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {fullLocation}
            </div>

            {hub.excerpt && <p className="mb-4 text-xl text-gray-600">{hub.excerpt}</p>}

            <div className="flex items-center text-sm text-gray-500">
              <span>
                Updated{' '}
                {new Date(hub.updated_at).toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              {hub.view_count > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <span>{hub.view_count} views</span>
                </>
              )}
            </div>
          </header>

          {/* Call-to-Action Button */}
          <div className="mb-8">
            <Link
              href={`/search?city=${encodeURIComponent(cityName)}&province=${hub.target_province}`}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Search Vet Clinics in {cityName}
              <svg className="-mr-1 ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          {/* Featured Image */}
          {hub.featured_image && (
            <img
              src={hub.featured_image}
              alt={`Veterinary services in ${fullLocation}`}
              className="mb-8 h-auto w-full rounded-lg"
            />
          )}

          {/* Main Content */}
          <div className="prose prose-lg mb-12 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{hub.content}</ReactMarkdown>
          </div>

          {/* FAQ Section */}
          {hub.faq_content && hub.faq_content.questions && (
            <section className="mt-12 border-t pt-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Frequently Asked Questions About Vets in {cityName}
              </h2>
              <div className="space-y-6">
                {hub.faq_content.questions.map((item, index) => (
                  <div key={index} className="border-b pb-6 last:border-0">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.q}</h3>
                    <p className="text-gray-700">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Internal Links */}
          {hub.internal_links && hub.internal_links.length > 0 && (
            <section className="mt-12 border-t pt-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Related Resources for {cityName} Pet Owners
              </h2>
              <ul className="space-y-2">
                {hub.internal_links.map((link, index) => (
                  <li key={index}>
                    <Link href={link} className="text-blue-600 underline hover:text-blue-800">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </ContainerConstrained>
    </>
  );
}
