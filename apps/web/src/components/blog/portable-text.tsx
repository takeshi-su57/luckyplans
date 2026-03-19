import { PortableText } from '@portabletext/react';
import type { PortableTextComponents, PortableTextBlock } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity/image';

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-2xl font-semibold leading-tight text-gray-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-xl font-semibold leading-tight text-gray-900">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-3 text-lg font-semibold leading-tight text-gray-900">{children}</h4>
    ),
    normal: ({ children }) => <p className="mb-5 leading-7 text-neutral-700">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-neutral-300 pl-4 italic text-neutral-500">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm">{children}</code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-green-600 underline underline-offset-2 hover:text-green-700"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(960).auto('format').url()}
            alt={value.alt || ''}
            width={960}
            height={540}
            className="rounded-lg"
          />
          {value.alt && (
            <figcaption className="mt-2 text-center text-sm text-neutral-500">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul className="my-4 list-disc pl-6">{children}</ul>,
    number: ({ children }) => <ol className="my-4 list-decimal pl-6">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-1.5 leading-7 text-neutral-700">{children}</li>,
    number: ({ children }) => <li className="mb-1.5 leading-7 text-neutral-700">{children}</li>,
  },
};

interface PortableTextRendererProps {
  value: PortableTextBlock[];
}

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return <PortableText value={value} components={components} />;
}
