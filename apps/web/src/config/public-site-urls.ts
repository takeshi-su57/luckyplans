interface UrlEnv {
  NEXT_PUBLIC_DOCS_URL?: string;
  NODE_ENV?: string;
}

export function resolveDocsUrl(env: UrlEnv): string {
  if (env.NEXT_PUBLIC_DOCS_URL) {
    return env.NEXT_PUBLIC_DOCS_URL;
  }

  return env.NODE_ENV === 'production' ? 'https://docs.luckyplans.xyz' : '/docs';
}

export function resolveBlogUrl(env: UrlEnv): string {
  const docsUrl = resolveDocsUrl(env).replace(/\/$/, '');
  return `${docsUrl}/blog`;
}
