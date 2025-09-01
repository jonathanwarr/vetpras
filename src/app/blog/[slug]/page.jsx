// src/app/blog/[slug]/page.jsx
import { supabase } from '@/lib/supabase';
import ContainerNarrow from '@/components/layout/container-narrow';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

async function getPost(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
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
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | Vetpras',
      description: 'The requested blog post could not be found.',
    };
  }

  const baseUrl = 'https://vetpras.com'; // Update with your actual domain
  const canonicalUrl = `${baseUrl}/blog/${params.slug}`;

  // Generate a clean excerpt if not provided
  const description =
    post.meta_description ||
    post.excerpt ||
    (post.content ? post.content.substring(0, 160).replace(/[#*\n]/g, '') + '...' : '');

  return {
    title: `${post.title} | Vetpras Blog`,
    description: description,
    keywords: post.target_keywords?.join(', '),
    authors: [{ name: post.author || 'Vetpras Team' }],

    // Open Graph
    openGraph: {
      title: post.title,
      description: description,
      url: canonicalUrl,
      siteName: 'Vetpras',
      type: 'article',
      publishedTime: post.published_date,
      modifiedTime: post.updated_at,
      authors: [post.author || 'Vetpras Team'],
      images: post.featured_image
        ? [
            {
              url: post.featured_image,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [
            {
              url: `${baseUrl}/images/vetpras-og-default.jpg`, // Create a default OG image
              width: 1200,
              height: 630,
              alt: 'Vetpras - Transparent Vet Pricing',
            },
          ],
      locale: 'en_CA',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
      images: post.featured_image
        ? [post.featured_image]
        : [`${baseUrl}/images/vetpras-og-default.jpg`],
      creator: '@vetpras', // Add your Twitter handle
      site: '@vetpras',
    },

    // Other important meta
    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  // Render FAQ Schema if exists
  const renderFAQSchema = () => {
    if (!post.faq_content?.questions) return null;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faq_content.questions.map((item) => ({
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

  // Render Article Schema for SEO
  const renderArticleSchema = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt || post.meta_description,
      image: post.featured_image ? [post.featured_image] : undefined,
      author: {
        '@type': 'Person',
        name: post.author || 'Vetpras Team',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Vetpras',
        logo: {
          '@type': 'ImageObject',
          url: 'https://vetpras.com/images/vetpras-logo.svg',
        },
      },
      datePublished: post.published_date,
      dateModified: post.updated_at || post.published_date,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://vetpras.com/blog/${post.slug}`,
      },
      keywords: post.target_keywords?.join(', '),
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  };

  // Render BreadcrumbList Schema
  const renderBreadcrumbSchema = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://vetpras.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://vetpras.com/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `https://vetpras.com/blog/${post.slug}`,
        },
      ],
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
      {renderArticleSchema()}
      {renderBreadcrumbSchema()}
      <article className="min-h-screen bg-white pt-24 pb-16">
        <ContainerNarrow>
          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <Link
                href="/blog"
                className="text-sm text-blue-600 transition-colors hover:text-blue-800"
              >
                ← Back to Blog
              </Link>
            </div>

            <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>By {post.author || 'Vetpras Team'}</span>
              <span>•</span>
              <time dateTime={post.published_date}>
                {new Date(post.published_date).toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>•</span>
              <span>{post.view_count || 0} views</span>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8 overflow-hidden rounded-lg">
              <img src={post.featured_image} alt={post.title} className="h-auto w-full" />
            </div>
          )}

          {/* Article Content - Now using ReactMarkdown */}
          <div className="prose prose-lg prose-headings:font-serif prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content || ''}</ReactMarkdown>
          </div>

          {/* FAQ Section */}
          {post.faq_content?.questions && post.faq_content.questions.length > 0 && (
            <div className="mt-12 border-t pt-8">
              <h2 className="mb-6 text-2xl font-semibold">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {post.faq_content.questions.map((item, index) => (
                  <div key={index} className="border-b pb-6 last:border-0">
                    <h3 className="mb-2 text-lg font-semibold">{item.q}</h3>
                    <p className="text-gray-600">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internal Links */}
          {post.internal_links && post.internal_links.length > 0 && (
            <div className="mt-12 rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 font-semibold">Related Articles</h3>
              <ul className="space-y-2">
                {post.internal_links.map((link, index) => (
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
        </ContainerNarrow>
      </article>
    </>
  );
}
