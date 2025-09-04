// src/app/cost/page.jsx
import { supabase } from '@/lib/supabase';
import ContainerConstrained from '@/components/layout/container-constrained';
import Link from 'next/link';

export const metadata = {
  title: 'Veterinary Cost Guides | Pet Care Pricing in Canada | Vetpras',
  description:
    'Transparent veterinary pricing guides for common procedures and services. Learn what to expect to pay for pet care across Canada.',
  openGraph: {
    title: 'Veterinary Cost Guides - Transparent Pet Care Pricing',
    description:
      'Complete pricing guides for veterinary services including vaccinations, surgeries, dental care, and emergency visits.',
    url: 'https://vetpras.com/cost',
    siteName: 'Vetpras',
    type: 'website',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vet Cost Guides | Vetpras',
    description: 'Transparent pricing for pet care services across Canada',
    site: '@vetpras',
  },
};

async function getPriceGuides() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .eq('content_type', 'price_guide')
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error fetching price guides:', error);
    return [];
  }

  return data || [];
}

// Group price guides by category (you can customize these categories)
function categorizePriceGuides(guides) {
  const categories = {
    'Routine Care': [],
    'Surgical Procedures': [],
    'Emergency & Urgent': [],
    'Dental Care': [],
    Diagnostics: [],
    'Other Services': [],
  };

  // Simple keyword matching for categorization
  guides.forEach((guide) => {
    const title = guide.title.toLowerCase();

    if (title.includes('vaccin') || title.includes('checkup') || title.includes('wellness')) {
      categories['Routine Care'].push(guide);
    } else if (title.includes('surgery') || title.includes('spay') || title.includes('neuter')) {
      categories['Surgical Procedures'].push(guide);
    } else if (title.includes('emergency') || title.includes('urgent')) {
      categories['Emergency & Urgent'].push(guide);
    } else if (title.includes('dental') || title.includes('teeth')) {
      categories['Dental Care'].push(guide);
    } else if (
      title.includes('xray') ||
      title.includes('x-ray') ||
      title.includes('ultrasound') ||
      title.includes('blood')
    ) {
      categories['Diagnostics'].push(guide);
    } else {
      categories['Other Services'].push(guide);
    }
  });

  // Remove empty categories
  return Object.entries(categories).filter(([_, guides]) => guides.length > 0);
}

export default async function CostGuidesPage() {
  const priceGuides = await getPriceGuides();
  const categorizedGuides = categorizePriceGuides(priceGuides);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <ContainerConstrained>
        {/* Page Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4">
            <span className="inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-800">
              Transparent Pricing
            </span>
          </div>
          <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Veterinary Cost Guides
          </h1>
          <p className="text-lg text-gray-600">
            Get transparent, accurate pricing information for common veterinary services across
            Canada. Know what to expect before you visit the vet.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">{priceGuides.length}</div>
            <div className="mt-1 text-sm text-gray-600">Price Guides</div>
          </div>
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">6-8%</div>
            <div className="mt-1 text-sm text-gray-600">Annual Price Increase</div>
          </div>
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600">60%+</div>
            <div className="mt-1 text-sm text-gray-600">Cost Variation Between Clinics</div>
          </div>
        </div>

        {/* Price Guides by Category */}
        {categorizedGuides.length > 0 ? (
          <div className="space-y-12">
            {categorizedGuides.map(([category, guides]) => (
              <section key={category}>
                <h2 className="mb-6 text-2xl font-semibold text-gray-900">{category}</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {guides.map((guide) => (
                    <Link
                      key={guide.id}
                      href={`/cost/${guide.slug}`}
                      className="group relative rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-green-200 hover:shadow-lg"
                    >
                      {/* Price Icon */}
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>

                      <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-green-600">
                        {guide.title}
                      </h3>

                      <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                        {guide.excerpt || guide.meta_description}
                      </p>

                      {/* Meta info */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          Updated{' '}
                          {new Date(guide.published_date).toLocaleDateString('en-CA', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="font-medium text-green-600 transition-transform group-hover:translate-x-1">
                          View guide →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-lg bg-white p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No price guides yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Check back soon for detailed pricing information on veterinary services.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white lg:p-12">
          <h2 className="mb-4 text-3xl font-bold">Can't Find Your Service?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-green-50">
            Help us expand our price guides by sharing your vet bills. Your contribution helps other
            pet owners make informed decisions.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/submit-bill"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-green-600 shadow-sm transition-colors hover:bg-green-50"
            >
              Submit Your Vet Bill
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border-2 border-white px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white hover:text-green-600"
            >
              Search for Vets
            </Link>
          </div>
        </div>

        {/* Educational Note */}
        <div className="mt-12 rounded-lg border border-amber-200 bg-amber-50 p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Important Note About Pricing</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  Prices can vary significantly based on location, clinic type, and individual pet
                  needs. These guides provide average ranges to help you budget, but always confirm
                  specific costs with your veterinarian.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ContainerConstrained>
    </div>
  );
}
