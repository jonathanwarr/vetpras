// src/app/blog/page.jsx
import { supabase } from '@/lib/supabase';
import ContainerConstrained from '@/components/layout/container-constrained';
import Link from 'next/link';

export const metadata = {
  title: 'Blog | Vetpras',
  description: 'Latest insights on pet care costs, veterinary services, and pet health in Canada.',
};

async function getBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .eq('content_type', 'blog_post')
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data || [];
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <ContainerConstrained>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Blog
          </h1>
          <p className="text-lg text-gray-600">
            Latest insights on pet care costs and veterinary services
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-shadow hover:shadow-xl"
              >
                {post.featured_image && (
                  <div className="h-48 w-full overflow-hidden bg-gray-200">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-600">
                      {new Date(post.published_date).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <Link href={`/blog/${post.slug}`} className="mt-2 block">
                      <h2 className="text-xl font-semibold text-gray-900 transition-colors hover:text-blue-600">
                        {post.title}
                      </h2>
                      <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="text-sm text-gray-500">By {post.author || 'Vetpras Team'}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No blog posts available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </ContainerConstrained>
    </div>
  );
}
