// src/app/learn/[topic-slug]/page.jsx
import { supabase } from '@/lib/supabase';
import ContainerNarrow from '@/components/layout/container-narrow';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

async function getExplainer(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('content_type', 'explainer')
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
  const explainer = await getExplainer(params['topic-slug']);

  if (!explainer) {
    return {
      title: 'Topic Not Found | Vetpras',
    };
  }

  return {
    title: `${explainer.title} | Vetpras`,
    description: explainer.meta_description || explainer.excerpt,
    keywords: explainer.target_keywords?.join(', '),
    openGraph: {
      title: explainer.title,
      description: explainer.excerpt,
      images: explainer.featured_image ? [explainer.featured_image] : [],
    },
  };
}

export default async function ExplainerPage({ params }) {
  const explainer = await getExplainer(params['topic-slug']);

  if (!explainer) {
    notFound();
  }

  // Render FAQ Schema if exists
  const renderFAQSchema = () => {
    if (!explainer.faq_content?.questions) return null;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: explainer.faq_content.questions.map((item) => ({
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
        <ContainerNarrow>
          {/* Header */}
          <header className="mb-12">
            <div className="mb-4">
              <Link
                href="/learn"
                className="text-sm text-blue-600 transition-colors hover:text-blue-800"
              >
                ← Back to Learning Center
              </Link>
            </div>

            <div className="mb-8 text-center">
              <span className="mb-4 inline-block rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-600">
                Educational Guide
              </span>
              <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                {explainer.title}
              </h1>
              {explainer.excerpt && (
                <p className="mx-auto max-w-2xl text-lg text-gray-600">{explainer.excerpt}</p>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>By {explainer.author || 'Vetpras Team'}</span>
              <span>•</span>
              <time dateTime={explainer.published_date}>
                {new Date(explainer.published_date).toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </header>

          {/* Table of Contents (if content has headings) */}
          <div className="mb-12 rounded-lg bg-gray-50 p-6">
            <h2 className="mb-4 font-semibold">In This Guide</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#overview" className="text-blue-600 hover:text-blue-800">
                  Overview
                </a>
              </li>
              <li>
                <a href="#key-points" className="text-blue-600 hover:text-blue-800">
                  Key Points to Remember
                </a>
              </li>
              {explainer.faq_content?.questions && (
                <li>
                  <a href="#faq" className="text-blue-600 hover:text-blue-800">
                    Frequently Asked Questions
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Main Content */}
          <div id="overview" className="mb-12">
            {explainer.featured_image && (
              <div className="mb-8 overflow-hidden rounded-lg">
                <img
                  src={explainer.featured_image}
                  alt={explainer.title}
                  className="h-auto w-full"
                />
              </div>
            )}

            <div className="prose prose-lg prose-headings:font-serif prose-a:text-blue-600 max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{explainer.content || ''}</ReactMarkdown>
            </div>
          </div>

          {/* Key Takeaways */}
          <section id="key-points" className="mb-12 rounded-lg bg-blue-50 p-8">
            <h2 className="mb-4 text-xl font-semibold">Key Takeaways</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mt-1 mr-2 text-blue-600">✓</span>
                <span>
                  Understanding this topic helps you make informed decisions about your pet's care
                </span>
              </li>
              <li className="flex items-start">
                <span className="mt-1 mr-2 text-blue-600">✓</span>
                <span>Knowledge of costs and options can save you money and stress</span>
              </li>
              <li className="flex items-start">
                <span className="mt-1 mr-2 text-blue-600">✓</span>
                <span>Being prepared helps ensure the best outcomes for your pet</span>
              </li>
            </ul>
          </section>

          {/* FAQ Section */}
          {explainer.faq_content?.questions && explainer.faq_content.questions.length > 0 && (
            <section id="faq" className="mb-12">
              <h2 className="mb-6 text-2xl font-semibold">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {explainer.faq_content.questions.map((item, index) => (
                  <details key={index} className="group rounded-lg border bg-white">
                    <summary className="cursor-pointer p-6 font-semibold transition-colors hover:bg-gray-50">
                      {item.q}
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related Resources */}
          <div className="mt-12 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
            <h3 className="mb-4 text-xl font-semibold">Continue Learning</h3>
            <p className="mb-6 text-gray-600">
              Explore more educational resources to help you navigate pet care
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/"
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
              >
                Find a Vet
              </Link>
              <Link
                href="/submit-bill"
                className="inline-block rounded-lg border border-blue-600 bg-white px-6 py-3 text-blue-600 transition-colors hover:bg-blue-50"
              >
                Share Your Experience
              </Link>
            </div>
          </div>

          {/* Internal Links */}
          {explainer.internal_links && explainer.internal_links.length > 0 && (
            <div className="mt-12 border-t pt-8">
              <h3 className="mb-4 font-semibold">Related Articles</h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {explainer.internal_links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link}
                      className="flex items-center text-blue-600 transition-colors hover:text-blue-800"
                    >
                      <span className="mr-2">→</span>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ContainerNarrow>
      </article>
    </>
  );
}
