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
    };
  }

  return {
    title: `${post.title} | Vetpras`,
    description: post.meta_description || post.excerpt,
    keywords: post.target_keywords?.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
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

  return (
    <>
      {renderFAQSchema()}
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
