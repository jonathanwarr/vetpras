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
    };
  }

  return {
    title: `${guide.title} | Vetpras`,
    description: guide.meta_description || guide.excerpt,
    keywords: guide.target_keywords?.join(', '),
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      images: guide.featured_image ? [guide.featured_image] : [],
    },
  };
}

export default async function PriceGuidePage({ params }) {
  const guide = await getPriceGuide(params['service-slug']);

  if (!guide) {
    notFound();
  }

  // Render FAQ Schema if exists
  const renderFAQSchema = () => {
    if (!guide.faq_content?.questions) return null;

    const schema = {
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

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  };

  return (
    <>
      {renderFAQSchema()}
      <article className="min-h-screen bg-white pt-24 pb-16">
        <ContainerConstrained>
          {/* Header */}
          <header className="mb-12 text-center">
            <div className="mb-4">
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                Cost Guide
              </span>
            </div>
            <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              {guide.title}
            </h1>
            {guide.excerpt && (
              <p className="mx-auto max-w-3xl text-lg text-gray-600">{guide.excerpt}</p>
            )}
          </header>

          {/* Price Summary Box */}
          <div className="mx-auto mb-12 max-w-2xl">
            <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
              <h2 className="mb-4 text-center text-xl font-semibold">
                Average Cost Range in Canada
              </h2>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">$50 - $500</p>
                <p className="mt-2 text-sm text-gray-600">
                  *Prices vary by location, clinic, and specific requirements
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mx-auto max-w-4xl">
            {/* Main Content */}
            {guide.content && (
              <div className="prose prose-lg prose-headings:font-serif prose-a:text-blue-600 mb-12 max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{guide.content}</ReactMarkdown>
              </div>
            )}

            {/* Cost Factors Section */}
            <section className="mb-12 rounded-lg bg-gray-50 p-8">
              <h2 className="mb-6 text-2xl font-semibold">Factors Affecting Cost</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">•</span>
                  <span>Location and regional pricing differences</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">•</span>
                  <span>Clinic type (emergency, specialty, general practice)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">•</span>
                  <span>Pet size and breed requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">•</span>
                  <span>Additional services or complications</span>
                </li>
              </ul>
            </section>

            {/* FAQ Section */}
            {guide.faq_content?.questions && guide.faq_content.questions.length > 0 && (
              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-semibold">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {guide.faq_content.questions.map((item, index) => (
                    <div key={index} className="rounded-lg border bg-white p-6">
                      <h3 className="mb-2 text-lg font-semibold">{item.q}</h3>
                      <p className="text-gray-600">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Call to Action */}
            <div className="rounded-lg bg-blue-50 p-8 text-center">
              <h3 className="mb-4 text-xl font-semibold">Find Transparent Pricing Near You</h3>
              <p className="mb-6 text-gray-600">
                Search for veterinary clinics with verified pricing in your area
              </p>
              <Link
                href="/"
                className="mr-4 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
              >
                Search Clinics
              </Link>
              <Link
                href="/submit-bill"
                className="inline-block rounded-lg border border-blue-600 bg-white px-6 py-3 text-blue-600 transition-colors hover:bg-blue-50"
              >
                Submit Your Bill
              </Link>
            </div>

            {/* Internal Links */}
            {guide.internal_links && guide.internal_links.length > 0 && (
              <div className="mt-12 border-t p-6">
                <h3 className="mb-4 font-semibold">Related Guides</h3>
                <ul className="space-y-2">
                  {guide.internal_links.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link}
                        className="text-blue-600 transition-colors hover:text-blue-800"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ContainerConstrained>
      </article>
    </>
  );
}
