import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSanityClient } from '@/lib/sanity/client';
import { postBySlugQuery, postSlugsQuery } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';
import type { Post } from '@/lib/sanity/types';
import { PortableTextRenderer } from '@/components/blog/portable-text';

export const revalidate = 60;

export async function generateStaticParams() {
  const client = getSanityClient();
  if (!client) return [];
  const slugs = await client.fetch<string[]>(postSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = getSanityClient();
  if (!client) return {};

  const post = await client.fetch<Post | null>(postBySlugQuery, { slug });
  if (!post) return {};

  return {
    title: `${post.title} — LuckyPlans`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      ...(post.mainImage && {
        images: [{ url: urlFor(post.mainImage).width(1200).height(630).auto('format').url() }],
      }),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const client = getSanityClient();
  if (!client) notFound();

  const post = await client.fetch<Post | null>(postBySlugQuery, { slug });
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-20 md:px-8 md:py-28">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Lab Notes
      </Link>

      <header className="mb-10">
        {post.categories && post.categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {post.categories.map((cat) => (
              <span
                key={cat.slug.current}
                className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700"
              >
                {cat.title}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-neutral-500">
          {post.author && (
            <span className="font-medium text-neutral-700">{post.author.name}</span>
          )}
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
        </div>
      </header>

      {post.mainImage && (
        <div className="relative mb-10 aspect-video overflow-hidden rounded-xl bg-neutral-100">
          <Image
            src={urlFor(post.mainImage).width(960).auto('format').url()}
            alt={post.mainImage.alt || post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {post.body && <PortableTextRenderer value={post.body} />}
    </article>
  );
}
