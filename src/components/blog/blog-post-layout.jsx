// src/components/blog/blog-post-layout.jsx
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import ContainerNarrow from '@/components/layout/container-narrow';
import RelatedArticles from '@/components/blog/related-articles';

export default function BlogPostLayout({
  post,
  backLink = '/blog',
  backLinkText = 'Back to Blog',
  contentType = 'blog',
}) {
  // Enhanced markdown components for better typography
  const markdownComponents = {
    h1: ({ children }) => (
      <h1 className="mt-16 text-4xl font-semibold tracking-tight text-pretty text-gray-900">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-16 text-3xl font-semibold tracking-tight text-pretty text-gray-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-2xl font-semibold tracking-tight text-gray-900">{children}</h3>
    ),
    p: ({ children }) => <p className="mt-6 text-gray-600">{children}</p>,
    ul: ({ children }) => (
      <ul role="list" className="mt-8 max-w-xl space-y-2 text-gray-600 list-disc pl-6">
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li>{children}</li>
    ),
    blockquote: ({ children }) => (
      <figure className="mt-10 border-l border-indigo-600 pl-9">
        <blockquote className="font-semibold text-gray-900">{children}</blockquote>
      </figure>
    ),
    img: ({ src, alt }) => (
      <figure className="mt-16">
        <img
          src={src}
          alt={alt || ''}
          className="aspect-video rounded-xl bg-gray-50 object-cover"
        />
        {alt && (
          <figcaption className="mt-4 flex gap-x-2 text-sm/6 text-gray-500">
            <InformationCircleIcon
              aria-hidden="true"
              className="mt-0.5 size-5 flex-none text-gray-300"
            />
            {alt}
          </figcaption>
        )}
      </figure>
    ),
    a: ({ href, children }) => {
      // Check if it's an external link
      const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            {children}
          </a>
        );
      }

      return (
        <Link href={href || '#'} className="font-semibold text-indigo-600 hover:text-indigo-500">
          {children}
        </Link>
      );
    },
    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
    table: ({ children }) => (
      <div className="mt-8 overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-50">{children}</thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
    ),
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{children}</td>
    ),
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base/7 text-gray-700">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href={backLink}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            ← {backLinkText}
          </Link>
        </div>

        {/* Category Badge */}
        {contentType && (
          <p className="text-base/7 font-semibold text-indigo-600">
            {contentType === 'city_hub'
              ? 'City Guide'
              : contentType === 'price_guide'
                ? 'Cost Guide'
                : contentType === 'explainer'
                  ? 'Educational'
                  : 'Article'}
          </p>
        )}

        {/* Title */}
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
          {post.title}
        </h1>

        {/* Excerpt/Lead */}
        {(post.excerpt || post.meta_description) && (
          <p className="mt-6 text-xl/8">{post.excerpt || post.meta_description}</p>
        )}

        {/* Meta Information */}
        <div className="mt-6 flex items-center gap-x-4 text-xs text-gray-500">
          <span>By {post.author || 'Vetpras Team'}</span>
          <span>•</span>
          <time dateTime={post.published_date}>{formatDate(post.published_date)}</time>
          {post.view_count > 0 && (
            <>
              <span>•</span>
              <span>{post.view_count.toLocaleString()} views</span>
            </>
          )}
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <figure className="mt-10">
            <img
              src={post.featured_image}
              alt={post.title}
              className="aspect-video rounded-xl bg-gray-50 object-cover"
            />
          </figure>
        )}

        {/* Main Content */}
        <div className="mt-10 max-w-2xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {post.content || ''}
          </ReactMarkdown>
        </div>

        {/* FAQ Section */}
        {post.faq_content?.questions && post.faq_content.questions.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-16">
            <h2 className="text-3xl font-semibold tracking-tight text-pretty text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="mt-10 space-y-8">
              {post.faq_content.questions.map((item, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900">{item.q}</h3>
                  <p className="mt-2 text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        <RelatedArticles currentPostId={post.id} limit={2} />
      </div>
    </article>
  );
}
