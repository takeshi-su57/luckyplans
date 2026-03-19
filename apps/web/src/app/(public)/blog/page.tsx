import type { Metadata } from 'next';
import { getSanityClient } from '@/lib/sanity/client';
import { postsQuery } from '@/lib/sanity/queries';
import type { Post } from '@/lib/sanity/types';
import { BlogCard } from '@/components/blog/blog-card';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Lab Notes — LuckyPlans',
  description: 'Weekly observations from building in the open.',
};

export default async function BlogPage() {
  let posts: Post[] = [];

  const client = getSanityClient();
  if (client) {
    posts = await client.fetch<Post[]>(postsQuery);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 md:px-8 md:py-28">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
          Lab Notes
        </h1>
        <p className="max-w-2xl text-base text-neutral-600">
          Weekly observations from building in the open.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-neutral-300 p-8 text-center md:p-12">
          <p className="text-sm text-neutral-500">
            First entry publishing soon. Follow the repository for updates.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
