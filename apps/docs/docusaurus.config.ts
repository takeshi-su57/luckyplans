const appUrl =
  process.env.DOCS_APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://app.luckyplans.xyz';

const config = {
  title: 'LuckyPlans Docs',
  tagline: 'Architecture, guides, and technical reference for LuckyPlans.',
  favicon: 'img/brand.png',
  url: 'https://docs.luckyplans.xyz',
  baseUrl: '/',
  organizationName: 'takeshi-su57',
  projectName: 'luckyplans',
  onBrokenLinks: 'throw',
  trailingSlash: false,
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/takeshi-su57/luckyplans/tree/main/apps/docs',
        },
        blog: {
          path: 'blog',
          routeBasePath: 'blog',
          showReadingTime: true,
          blogTitle: 'LuckyPlans Lab Notes',
          blogDescription: 'Build notes, release context, and engineering observations.',
          editUrl: 'https://github.com/takeshi-su57/luckyplans/tree/main/apps/docs',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],
  themeConfig: {
    image: 'img/brand.png',
    navbar: {
      title: 'LuckyPlans',
      logo: {
        alt: 'LuckyPlans',
        src: 'img/brand.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          href: appUrl,
          label: 'App',
          position: 'right',
        },
        {
          href: 'https://github.com/luckyplans',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Architecture', to: '/architecture/overview' },
            { label: 'Quickstart', to: '/guides/quickstart' },
            { label: 'GraphQL Reference', to: '/reference/graphql-reference' },
          ],
        },
        {
          title: 'Project',
          items: [
            { label: 'App', href: appUrl },
            { label: 'GitHub', href: 'https://github.com/luckyplans' },
            { label: 'Frontend Repo', href: 'https://github.com/takeshi-su57/lucky-plan-fe' },
            { label: 'Backend Repo', href: 'https://github.com/takeshi-su57/lucky-plan-be' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LuckyPlans.`,
    },
    prism: {
      theme: {
        plain: {
          color: '#dbe4ff',
          backgroundColor: '#10213b',
        },
        styles: [],
      },
      darkTheme: {
        plain: {
          color: '#dbe4ff',
          backgroundColor: '#081325',
        },
        styles: [],
      },
    },
  },
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/docs',
            to: '/',
          },
        ],
      },
    ],
  ],
};

export default config;
