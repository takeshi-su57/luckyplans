import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/image';

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  const slug = post.slug.current;

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
    >
      {post.mainImage && (
        <div className="relative aspect-video overflow-hidden bg-neutral-100">
          <Image
            src={urlFor(post.mainImage).width(640).height(360).auto('format').url()}
            alt={post.mainImage.alt || post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {post.categories && post.categories.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
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
        <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-green-600">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-neutral-500">
          {post.author && <span>{post.author.name}</span>}
          {post.author && post.publishedAt && <span>&middot;</span>}
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          )}
        </div>
      </div>
    </Link>
  );
}
