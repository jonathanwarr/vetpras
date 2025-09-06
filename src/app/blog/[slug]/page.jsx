// src/app/blog/[slug]/page.jsx
import { supabase } from '@/lib/supabase';
import BlogPostLayout from '@/components/blog/blog-post-layout';
import { notFound } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

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

  const canonicalUrl = `${baseUrl}/blog/${params.slug}`;
  const description = post.meta_description || post.excerpt || '';

  return {
    title: `${post.title} | Vetpras Blog`,
    description: description,
    keywords: post.target_keywords?.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: description,
      url: canonicalUrl,
      siteName: 'Vetpras',
      type: 'article',
      publishedTime: post.published_date,
      modifiedTime: post.updated_at,
      images: post.featured_image ? [{ url: post.featured_image }] : [],
    },
  };
}

// Generate structured data
function generateStructuredData(post, slug) {
  const schemas = [];

  // Article schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.meta_description,
    image: post.featured_image,
    author: {
      '@type': 'Person',
      name: post.author || 'Vetpras Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vetpras',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/vetpras-logo.svg`,
      },
    },
    datePublished: post.published_date,
    dateModified: post.updated_at || post.published_date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${slug}`,
    },
  });

  // FAQ schema if exists
  if (post.faq_content?.questions) {
    schemas.push({
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
    });
  }

  return schemas;
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const structuredData = generateStructuredData(post, params.slug);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <BlogPostLayout
        post={post}
        backLink="/blog"
        backLinkText="Back to Blog"
        contentType={post.content_type}
      />
    </>
  );
}
