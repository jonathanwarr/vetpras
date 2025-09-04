// src/app/find/page.jsx
import { supabase } from '@/lib/supabase';
import ContainerConstrained from '@/components/layout/container-constrained';
import Link from 'next/link';

export const metadata = {
  title: 'Find Veterinarians by City | Vet Clinics Across Canada | Vetpras',
  description:
    'Find trusted veterinarians in cities across Canada. Browse our city guides to discover vet clinics, animal hospitals, and emergency services near you.',
  openGraph: {
    title: 'Find Veterinarians Across Canada - City Directory',
    description:
      'Discover veterinary clinics in major Canadian cities. Compare services, read guides, and find the right vet for your pet.',
    url: 'https://vetpras.com/find',
    siteName: 'Vetpras',
    type: 'website',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Vets by City | Vetpras',
    description: 'Veterinary clinic directory for Canadian cities',
    site: '@vetpras',
  },
};

async function getCityHubs() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .eq('content_type', 'city_hub')
    .order('target_city', { ascending: true });

  if (error) {
    console.error('Error fetching city hubs:', error);
    return [];
  }

  return data || [];
}

// Province data with full names and major cities
const provinces = {
  BC: {
    name: 'British Columbia',
    majorCities: ['Vancouver', 'Victoria', 'Burnaby', 'Surrey', 'Richmond'],
  },
  AB: {
    name: 'Alberta',
    majorCities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge'],
  },
  SK: {
    name: 'Saskatchewan',
    majorCities: ['Saskatoon', 'Regina'],
  },
  MB: {
    name: 'Manitoba',
    majorCities: ['Winnipeg', 'Brandon'],
  },
  ON: {
    name: 'Ontario',
    majorCities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London', 'Kitchener'],
  },
  QC: {
    name: 'Quebec',
    majorCities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau'],
  },
  NB: {
    name: 'New Brunswick',
    majorCities: ['Fredericton', 'Moncton', 'Saint John'],
  },
  NS: {
    name: 'Nova Scotia',
    majorCities: ['Halifax', 'Dartmouth'],
  },
  PE: {
    name: 'Prince Edward Island',
    majorCities: ['Charlottetown'],
  },
  NL: {
    name: 'Newfoundland and Labrador',
    majorCities: ["St. John's"],
  },
};

// Group city hubs by province
function groupByProvince(hubs) {
  const grouped = {};

  hubs.forEach((hub) => {
    const province = hub.target_province;
    if (!grouped[province]) {
      grouped[province] = [];
    }
    grouped[province].push(hub);
  });

  // Sort provinces in a logical order (west to east)
  const provinceOrder = ['BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'PE', 'NS', 'NL'];
  const sortedGrouped = {};

  provinceOrder.forEach((prov) => {
    if (grouped[prov]) {
      sortedGrouped[prov] = grouped[prov];
    }
  });

  return sortedGrouped;
}

export default async function FindVetsPage() {
  const cityHubs = await getCityHubs();
  const groupedHubs = groupByProvince(cityHubs);
  const totalCities = cityHubs.length;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <ContainerConstrained>
        {/* Page Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4">
            <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-800">
              City Directory
            </span>
          </div>
          <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Find Veterinarians by City
          </h1>
          <p className="text-lg text-gray-600">
            Browse our comprehensive directory of veterinary clinics across Canada. Find trusted
            vets, compare services, and discover the best care options in your city.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{totalCities}</div>
            <div className="mt-1 text-sm text-gray-600">Cities Covered</div>
          </div>
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">
              {Object.keys(groupedHubs).length}
            </div>
            <div className="mt-1 text-sm text-gray-600">Provinces</div>
          </div>
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600">5,000+</div>
            <div className="mt-1 text-sm text-gray-600">Vet Clinics Listed</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mb-12 max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Quick search: Enter your city name..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-12 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Link
              href="/"
              className="absolute inset-y-0 right-0 flex items-center px-4 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Advanced Search →
            </Link>
          </div>
        </div>

        {/* Cities by Province */}
        {Object.keys(groupedHubs).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedHubs).map(([provinceCode, hubs]) => (
              <section key={provinceCode} className="scroll-mt-24" id={provinceCode}>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {provinces[provinceCode]?.name || provinceCode}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {hubs.length} {hubs.length === 1 ? 'city' : 'cities'}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {hubs.map((hub) => (
                    <Link
                      key={hub.id}
                      href={`/find/${hub.slug}`}
                      className="group relative rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                            {hub.target_city || hub.title.replace(' Veterinarians', '')}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                            {hub.excerpt ||
                              `Find veterinary clinics and animal hospitals in ${hub.target_city}`}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-gray-400 transition-colors group-hover:text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* View count or clinic count if available */}
                      <div className="mt-3 flex items-center text-xs text-gray-500">
                        <span>{hub.view_count || 0} views</span>
                        <span className="mx-2">•</span>
                        <span>
                          Updated{' '}
                          {new Date(hub.updated_at).toLocaleDateString('en-CA', {
                            month: 'short',
                            year: 'numeric',
                          })}
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No city guides yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              We're working on adding city guides. Check back soon!
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Search All Clinics
              </Link>
            </div>
          </div>
        )}

        {/* Coming Soon Cities */}
        <div className="mt-16 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Don't See Your City?</h2>
          <p className="mb-6 text-gray-600">
            We're constantly expanding our coverage across Canada. While we work on adding your
            city, you can still search for veterinary clinics using our main search tool.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Search for Vets
            </Link>
            <Link
              href="/submit-bill"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Contribute Price Data
            </Link>
          </div>
        </div>

        {/* Province Quick Links */}
        <div className="mt-12">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Navigation</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(groupedHubs).map(([provinceCode]) => (
              <a
                key={provinceCode}
                href={`#${provinceCode}`}
                className="inline-block rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                {provinces[provinceCode]?.name || provinceCode}
              </a>
            ))}
          </div>
        </div>
      </ContainerConstrained>
    </div>
  );
}
