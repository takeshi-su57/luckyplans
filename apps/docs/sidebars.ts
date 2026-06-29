const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['intro/what-is-luckyplans', 'intro/current-status', 'intro/core-concepts'],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/service-map',
        'architecture/data-flow',
        'architecture/simulation-engine',
        'architecture/copy-trading-engine',
        'architecture/indexing-pipeline',
        'architecture/database-design',
        'architecture/infrastructure',
        'architecture/security-model',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/quickstart',
        'guides/local-development',
        'guides/environment-setup',
        'guides/run-with-docker',
        'guides/deployment-guide',
        'guides/add-new-platform',
        'guides/add-new-chain',
        'guides/add-new-contract-version',
        'guides/create-simulation',
        'guides/analyze-leaderboard',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/api-reference',
        'reference/graphql-reference',
        'reference/configuration-reference',
        'reference/environment-variables',
        'reference/message-patterns',
        'reference/database-models',
        'reference/helm-values',
        'reference/error-codes',
      ],
    },
    {
      type: 'category',
      label: 'Operations',
      items: [
        'operations/deployment-runbook',
        'operations/rollback-runbook',
        'operations/database-migration',
        'operations/reindexing-runbook',
        'operations/monitoring',
        'operations/incident-response',
      ],
    },
    {
      type: 'category',
      label: 'Security',
      items: [
        'security/official-links',
        'security/security-best-practices',
        'security/impersonation-warning',
        'security/disclosure-policy',
      ],
    },
    {
      type: 'category',
      label: 'Contributing',
      items: [
        'contributing/contribution-guide',
        'contributing/coding-standards',
        'contributing/pull-request-guide',
        'contributing/architecture-decisions',
        {
          type: 'category',
          label: 'ADRs',
          items: [
            'contributing/adr/deterministic-simulation-engine',
            'contributing/adr/contract-versioning-by-block-range',
            'contributing/adr/platform-adapter-architecture',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Roadmap',
      items: ['roadmap/roadmap', 'roadmap/changelog'],
    },
  ],
};

export default sidebars;
