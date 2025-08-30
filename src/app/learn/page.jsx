// src/app/learn/page.jsx
import { supabase } from '@/lib/supabase';
import ContainerConstrained from '@/components/layout/container-constrained';
import Link from 'next/link';

export const metadata = {
  title: 'Learning Center | Vetpras',
  description:
    'Educational resources about pet health, veterinary care, and making informed decisions for your pet.',
};

async function getExplainers() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .eq('content_type', 'explainer')
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error fetching explainers:', error);
    return [];
  }

  return data || [];
}

export default async function LearnPage() {
  const explainers = await getExplainers();

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <ContainerConstrained>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Learning Center
          </h1>
          <p className="text-lg text-gray-600">
            Educational resources to help you make informed decisions about your pet's care
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {explainers.map((article) => (
              <article
                key={article.id}
                className="group relative flex flex-col overflow-hidden rounded-lg border transition-all hover:shadow-lg"
              >
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-block rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                    Guide
                  </span>
                </div>

                {article.featured_image && (
                  <div className="h-48 w-full overflow-hidden bg-gray-200">
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <Link href={`/learn/${article.slug}`}>
                      <h2 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                        {article.title}
                      </h2>
                    </Link>
                    <p className="mt-3 text-base text-gray-500">{article.excerpt}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {new Date(article.published_date).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <Link
                      href={`/learn/${article.slug}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Read Guide →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {explainers.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No educational guides available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </ContainerConstrained>
    </div>
  );
}
