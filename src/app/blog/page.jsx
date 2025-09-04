// src/app/blog/page.jsx
import { supabase } from '@/lib/supabase';
import ContainerConstrained from '@/components/layout/container-constrained';
import Link from 'next/link';

export const metadata = {
  title: 'Blog | Vetpras',
  description:
    'Latest insights on pet care, veterinary costs, and finding the right vet for your pet.',
  openGraph: {
    title: 'Vetpras Blog - Pet Care Insights & Veterinary Resources',
    description:
      'Stay informed with our latest articles on pet health, veterinary costs, and making the best decisions for your pet.',
    url: 'https://vetpras.com/blog',
    siteName: 'Vetpras',
    type: 'website',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vetpras Blog',
    description: 'Pet care insights and veterinary resources',
    site: '@vetpras',
  },
};

async function getAllPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data || [];
}

// Helper function to format content type labels
function getContentTypeLabel(contentType) {
  const labels = {
    city_hub: 'City Guide',
    price_guide: 'Cost Guide',
    explainer: 'Educational',
    blog_post: 'Article',
  };
  return labels[contentType] || 'Post';
}

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

export default async function BlogPage() {
  const posts = await getAllPosts();

  // Separate featured post (most recent) from the rest
  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-white pt-8 pb-16 sm:pt-24">
      <ContainerConstrained className="mt-8">
        {/* Page Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="mt-20 mb-2 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Vetpras Blog
          </h1>
          <p className="flex justify-center space-y-5 text-center font-sans text-lg font-light text-slate-900">
            Insights on pet care and veterian costs.
          </p>
        </div>

        {/* Featured Post - Only show if we have posts */}
        {featuredPost && (
          <div className="mb-16">
            <div className="overflow-hidden rounded-2xl bg-gray-50 lg:grid lg:grid-cols-2 lg:gap-8">
              {featuredPost.featured_image && (
                <div className="h-64 lg:h-full">
                  <img
                    src={featuredPost.featured_image}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="p-8 lg:p-12">
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getContentTypeColor(featuredPost.content_type)}`}
                  >
                    {getContentTypeLabel(featuredPost.content_type)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {calculateReadTime(featuredPost.content)}
                  </span>
                </div>

                <h2 className="mb-3 text-2xl font-bold text-gray-900 lg:text-3xl">
                  <Link
                    href={getPostUrl(featuredPost)}
                    className="transition-colors hover:text-blue-600"
                  >
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="mb-6 line-clamp-3 text-gray-600">
                  {featuredPost.excerpt || featuredPost.meta_description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{featuredPost.author || 'Vetpras Team'}</span>
                    <span>•</span>
                    <time dateTime={featuredPost.published_date}>
                      {new Date(featuredPost.published_date).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>

                  <Link
                    href={getPostUrl(featuredPost)}
                    className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="mx-auto max-w-7xl">
          {regularPosts.length > 0 && (
            <>
              <h2 className="mb-8 text-2xl font-semibold text-gray-900">Recent Posts</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {regularPosts.map((post) => (
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
                          <h3 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="mt-3 line-clamp-2 text-base text-gray-500">
                          {post.excerpt || post.meta_description}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <time dateTime={post.published_date}>
                            {new Date(post.published_date).toLocaleDateString('en-CA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </time>
                          <span>•</span>
                          <span>{calculateReadTime(post.content)}</span>
                        </div>
                        <Link
                          href={getPostUrl(post)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          aria-label={`Read more about ${post.title}`}
                        >
                          Read →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {posts.length === 0 && (
            <div className="py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first blog post.
              </p>
            </div>
          )}
        </div>

        {/* Newsletter CTA (optional) */}
        {posts.length > 0 && (
          <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-10 sm:px-10 sm:py-16 lg:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Help Us Make Pet Costs Transparent
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
                Submit your vet bill from the past two years anonymously and help bring transparency
                to vet costs for other pet owners
              </p>
              <Link
                href="/submit-bill"
                className="mt-8 inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
              >
                Submit a Bill
              </Link>
            </div>
          </div>
        )}
      </ContainerConstrained>
    </div>
  );
}
