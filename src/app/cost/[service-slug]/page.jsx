// src/app/cost/[service-slug]/page.jsx
import { supabase } from '@/lib/supabase';
import ContainerConstrained from '@/components/layout/container-constrained';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

async function getPriceGuide(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('content_type', 'price_guide')
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

export async function generateMetadata({ params }) {
  const guide = await getPriceGuide(params['service-slug']);

  if (!guide) {
    return {
      title: 'Price Guide Not Found | Vetpras',
      description: 'The requested price guide could not be found.',
    };
  }

  const baseUrl = 'https://vetpras.com';
  const canonicalUrl = guide.canonical_url || `${baseUrl}/cost/${params['service-slug']}`;

  const description =
    guide.meta_description ||
    guide.excerpt ||
    `Complete cost guide for ${guide.title} in Canada. Learn about pricing factors, average costs, and how to save money.`;

  return {
    title: `${guide.title} Cost Guide | Vetpras`,
    description: description,
    keywords: guide.target_keywords?.join(', '),
    authors: [{ name: guide.author || 'Vetpras Team' }],

    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      title: `${guide.title} - Veterinary Cost Guide`,
      description: description,
      url: canonicalUrl,
      siteName: 'Vetpras',
      type: 'article',
      publishedTime: guide.published_date,
      modifiedTime: guide.updated_at,
      authors: [guide.author || 'Vetpras Team'],
      images: guide.featured_image
        ? [
            {
              url: guide.featured_image,
              width: 1200,
              height: 630,
              alt: `${guide.title} Cost Guide`,
            },
          ]
        : [
            {
              url: `${baseUrl}/images/vetpras-og-cost-guide.jpg`,
              width: 1200,
              height: 630,
              alt: 'Vetpras - Veterinary Cost Guides',
            },
          ],
      locale: 'en_CA',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: `${guide.title} Cost Guide`,
      description: description,
      images: guide.featured_image
        ? [guide.featured_image]
        : [`${baseUrl}/images/vetpras-og-cost-guide.jpg`],
      site: '@vetpras',
      creator: '@vetpras',
    },

    // Additional meta tags
    other: {
      'article:published_time': guide.published_date,
      'article:modified_time': guide.updated_at,
      'article:author': guide.author || 'Vetpras Team',
      'article:section': 'Cost Guides',
    },
  };
}

// Generate JSON-LD structured data
function generateStructuredData(guide, slug) {
  const baseUrl = 'https://vetpras.com';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.meta_description || guide.excerpt,
    image: guide.featured_image || `${baseUrl}/images/vetpras-og-cost-guide.jpg`,
    datePublished: guide.published_date,
    dateModified: guide.updated_at,
    author: {
      '@type': 'Organization',
      name: 'Vetpras',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vetpras',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/vetpras-logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/cost/${slug}`,
    },
  };

  // Add FAQ structured data if available
  if (guide.faq_content && guide.faq_content.questions) {
    const faqData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: guide.faq_content.questions.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    };

    return [structuredData, faqData];
  }

  return structuredData;
}

export default async function PriceGuidePage({ params }) {
  const guide = await getPriceGuide(params['service-slug']);

  if (!guide) {
    notFound();
  }

  const structuredData = generateStructuredData(guide, params['service-slug']);

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
                <Link href="/cost" className="hover:text-gray-900">
                  Cost Guides
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-gray-900">{guide.title}</span>
              </li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">{guide.title}</h1>

            {guide.excerpt && <p className="mb-4 text-xl text-gray-600">{guide.excerpt}</p>}

            <div className="flex items-center text-sm text-gray-500">
              <span>By {guide.author || 'Vetpras Team'}</span>
              <span className="mx-2">•</span>
              <time dateTime={guide.published_date}>
                {new Date(guide.published_date).toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {guide.view_count > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <span>{guide.view_count} views</span>
                </>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {guide.featured_image && (
            <img
              src={guide.featured_image}
              alt={guide.title}
              className="mb-8 h-auto w-full rounded-lg"
            />
          )}

          {/* Main Content */}
          <div className="prose prose-lg mb-12 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{guide.content}</ReactMarkdown>
          </div>

          {/* FAQ Section */}
          {guide.faq_content && guide.faq_content.questions && (
            <section className="mt-12 border-t pt-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {guide.faq_content.questions.map((item, index) => (
                  <div key={index} className="border-b pb-6 last:border-0">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.q}</h3>
                    <p className="text-gray-700">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Internal Links */}
          {guide.internal_links && guide.internal_links.length > 0 && (
            <section className="mt-12 border-t pt-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Related Resources</h2>
              <ul className="space-y-2">
                {guide.internal_links.map((link, index) => (
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
