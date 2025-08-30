// src/app/find/[city-slug]/page.jsx
import { supabase } from '@/lib/supabase';
import ContainerConstrained from '@/components/layout/container-constrained';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getCityHub(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('content_type', 'city_hub')
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

async function getClinicsForCity(city) {
  const { data, error } = await supabase
    .from('vet_clinics')
    .select('*')
    .eq('city', city)
    .order('clinic_name');

  if (error) {
    console.error('Error fetching clinics:', error);
    return [];
  }

  return data || [];
}

export async function generateMetadata({ params }) {
  const hub = await getCityHub(params['city-slug']);

  if (!hub) {
    return {
      title: 'City Not Found | Vetpras',
    };
  }

  return {
    title: `${hub.title} | Vetpras`,
    description: hub.meta_description || `Find veterinary clinics in ${hub.target_city}`,
    keywords: hub.target_keywords?.join(', '),
  };
}

export default async function CityHubPage({ params }) {
  const hub = await getCityHub(params['city-slug']);

  if (!hub) {
    notFound();
  }

  const clinics = await getClinicsForCity(hub.target_city);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <ContainerConstrained>
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            {hub.title}
          </h1>
          {hub.excerpt && <p className="mx-auto max-w-3xl text-lg text-gray-600">{hub.excerpt}</p>}
        </header>

        {/* Main Content */}
        {hub.content && (
          <div className="mx-auto mb-12 max-w-4xl">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: hub.content }}
            />
          </div>
        )}

        {/* Clinics Grid */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold">Veterinary Clinics in {hub.target_city}</h2>

          {clinics.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {clinics.map((clinic) => (
                <div
                  key={clinic.clinic_id}
                  className="rounded-lg border p-6 transition-shadow hover:shadow-lg"
                >
                  <h3 className="mb-2 text-lg font-semibold">{clinic.clinic_name}</h3>
                  <p className="mb-2 text-sm text-gray-600">{clinic.street_address}</p>
                  <div className="space-y-1 text-sm">
                    {clinic.exam_fee && (
                      <p>
                        Exam Fee: <span className="font-medium">${clinic.exam_fee}</span>
                      </p>
                    )}
                    {clinic.rating && (
                      <p>
                        Rating: <span className="font-medium">{clinic.rating.toFixed(1)} ⭐</span>
                      </p>
                    )}
                  </div>
                  {clinic.website && (
                    <a
                      href={clinic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No clinics found for this city.</p>
          )}
        </section>

        {/* FAQ Section */}
        {hub.faq_content?.questions && hub.faq_content.questions.length > 0 && (
          <section className="border-t pt-12">
            <h2 className="mb-6 text-2xl font-semibold">
              Frequently Asked Questions about Vets in {hub.target_city}
            </h2>
            <div className="space-y-6">
              {hub.faq_content.questions.map((item, index) => (
                <div key={index} className="border-b pb-6 last:border-0">
                  <h3 className="mb-2 text-lg font-semibold">{item.q}</h3>
                  <p className="text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <div className="mt-12 rounded-lg bg-blue-50 p-8 text-center">
          <h3 className="mb-4 text-xl font-semibold">
            Help Make Vet Costs Transparent in {hub.target_city}
          </h3>
          <p className="mb-6 text-gray-600">
            Share your vet bills to help other pet owners in your community
          </p>
          <Link
            href="/submit-bill"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Submit Your Bill
          </Link>
        </div>
      </ContainerConstrained>
    </div>
  );
}
