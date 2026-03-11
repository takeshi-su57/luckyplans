import { generateStaticParamsFor, importPage } from 'nextra/pages';

export const generateStaticParams = generateStaticParamsFor('mdxPath');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mdxPath?: string[] }>;
}) {
  const { mdxPath } = await params;
  const { metadata } = await importPage(mdxPath);
  return metadata;
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{ mdxPath?: string[] }>;
}) {
  const { mdxPath } = await params;
  const { default: MdxContent } = await importPage(mdxPath);
  return <MdxContent />;
}
