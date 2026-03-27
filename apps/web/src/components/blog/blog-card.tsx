import Link from 'next/link';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    publishedAt?: string | null;
  };
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#e8e7e4]/80 bg-white shadow-sm transition-all duration-200 hover:border-[#e8e7e4] hover:shadow-md"
    >
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg font-bold leading-snug text-[#37352f] transition-colors group-hover:text-[#0f7b6c]">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#787774]">
            {post.excerpt}
          </p>
        )}
        {post.publishedAt && (
          <div className="mt-auto pt-5 text-xs text-[#a3a29e]">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
        )}
      </div>
    </Link>
  );
}
