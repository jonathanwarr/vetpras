// src/components/blog/related-articles.jsx
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Helper function to get content type colors
function getContentTypeColor(contentType) {
  const colors = {
    city_hub: 'bg-blue-50 text-blue-600',
    price_guide: 'bg-green-50 text-green-600',
    explainer: 'bg-purple-50 text-purple-600',
    blog_post: 'bg-gray-50 text-gray-600',
  };
  return colors[contentType] || 'bg-gray-50 text-gray-600';
}

// Helper function to get content type labels
function getContentTypeLabel(contentType) {
  const labels = {
    city_hub: 'City Guide',
    price_guide: 'Cost Guide',
    explainer: 'Educational',
    blog_post: 'Article',
  };
  return labels[contentType] || 'Post';
}

// Helper function to get the correct URL based on content type
function getPostUrl(post) {
  const urlMap = {
    city_hub: `/find/${post.slug}`,
    price_guide: `/cost/${post.slug}`,
    explainer: `/learn/${post.slug}`,
    blog_post: `/blog/${post.slug}`,
  };
  return urlMap[post.content_type] || `/blog/${post.slug}`;
}

// Helper function to calculate read time
function calculateReadTime(content) {
  if (!content) return '5 min read';
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
}

export default async function RelatedArticles({ currentPostId, limit = 2 }) {
  // Fetch related articles (excluding the current post)
  const { data: relatedPosts, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, meta_description, featured_image, content_type, content, published_date')
    .eq('is_published', true)
    .neq('id', currentPostId)
    .order('published_date', { ascending: false })
    .limit(limit);

  if (error || !relatedPosts || relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 border-t border-gray-200 pt-16">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">Related Articles</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {relatedPosts.map((post) => (
          <article
            key={post.id}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 transition-all hover:shadow-lg"
          >
            {/* Content Type Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span
                className={`inline-block rounded px-2 py-1 text-xs font-medium ${getContentTypeColor(post.content_type)}`}
              >
                {getContentTypeLabel(post.content_type)}
              </span>
            </div>

            {/* Featured Image */}
            {post.featured_image ? (
              <div className="h-48 w-full overflow-hidden bg-gray-200">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="h-48 w-full bg-gradient-to-br from-blue-50 to-indigo-100" />
            )}

            {/* Card Content */}
            <div className="flex flex-1 flex-col justify-between bg-white p-6">
              <div className="flex-1">
                <Link href={getPostUrl(post)}>
                  <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-indigo-600">
                    {post.title}
                  </h3>
                </Link>
                <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                  {post.excerpt || post.meta_description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">{calculateReadTime(post.content)}</span>
                <Link
                  href={getPostUrl(post)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  aria-label={`Read more about ${post.title}`}
                >
                  Read →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
