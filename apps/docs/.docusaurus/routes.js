import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '6ee'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '182'),
    exact: true
  },
  {
    path: '/blog/lab-notes-coming-soon',
    component: ComponentCreator('/blog/lab-notes-coming-soon', '53f'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '287'),
    exact: true
  },
  {
    path: '/blog/tags/updates',
    component: ComponentCreator('/blog/tags/updates', '106'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '210'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'da0'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '978'),
            routes: [
              {
                path: '/architecture/argocd',
                component: ComponentCreator('/architecture/argocd', 'eb0'),
                exact: true
              },
              {
                path: '/architecture/ci-cd-pipeline',
                component: ComponentCreator('/architecture/ci-cd-pipeline', '90f'),
                exact: true
              },
              {
                path: '/architecture/copy-trading-engine',
                component: ComponentCreator('/architecture/copy-trading-engine', 'a75'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/data-flow',
                component: ComponentCreator('/architecture/data-flow', 'f0d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/database-design',
                component: ComponentCreator('/architecture/database-design', '581'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/decisions/2026-03-10-functional-decomposition',
                component: ComponentCreator('/architecture/decisions/2026-03-10-functional-decomposition', '575'),
                exact: true
              },
              {
                path: '/architecture/decisions/2026-03-10-graphql-code-first',
                component: ComponentCreator('/architecture/decisions/2026-03-10-graphql-code-first', '600'),
                exact: true
              },
              {
                path: '/architecture/decisions/2026-03-10-redis-pub-sub-transport',
                component: ComponentCreator('/architecture/decisions/2026-03-10-redis-pub-sub-transport', 'b88'),
                exact: true
              },
              {
                path: '/architecture/decisions/2026-03-11-graphql-codegen-client-preset',
                component: ComponentCreator('/architecture/decisions/2026-03-11-graphql-codegen-client-preset', '95e'),
                exact: true
              },
              {
                path: '/architecture/decisions/2026-03-11-keycloak-oidc-nextauth',
                component: ComponentCreator('/architecture/decisions/2026-03-11-keycloak-oidc-nextauth', '17b'),
                exact: true
              },
              {
                path: '/architecture/decisions/2026-03-11-nextra-docs-route',
                component: ComponentCreator('/architecture/decisions/2026-03-11-nextra-docs-route', '007'),
                exact: true
              },
              {
                path: '/architecture/decisions/2026-03-12-custom-auth-pages-ropc',
                component: ComponentCreator('/architecture/decisions/2026-03-12-custom-auth-pages-ropc', 'a91'),
                exact: true
              },
              {
                path: '/architecture/decisions/2026-03-12-gateway-managed-sessions',
                component: ComponentCreator('/architecture/decisions/2026-03-12-gateway-managed-sessions', 'c06'),
                exact: true
              },
              {
                path: '/architecture/decisions/2026-03-13-bitnami-sealed-secrets',
                component: ComponentCreator('/architecture/decisions/2026-03-13-bitnami-sealed-secrets', '0b0'),
                exact: true
              },
              {
                path: '/architecture/decisions/2026-03-16-prisma-postgresql-persistence',
                component: ComponentCreator('/architecture/decisions/2026-03-16-prisma-postgresql-persistence', '871'),
                exact: true
              },
              {
                path: '/architecture/decisions/2026-05-21-gateway-edge-orchestration',
                component: ComponentCreator('/architecture/decisions/2026-05-21-gateway-edge-orchestration', 'cbe'),
                exact: true
              },
              {
                path: '/architecture/decisions/2026-06-05-defer-edge-websocket-sessions',
                component: ComponentCreator('/architecture/decisions/2026-06-05-defer-edge-websocket-sessions', '406'),
                exact: true
              },
              {
                path: '/architecture/decisions/2026-06-05-defer-task-artifact-transfer',
                component: ComponentCreator('/architecture/decisions/2026-06-05-defer-task-artifact-transfer', '652'),
                exact: true
              },
              {
                path: '/architecture/decisions/2026-06-25-standalone-docs-app',
                component: ComponentCreator('/architecture/decisions/2026-06-25-standalone-docs-app', 'fdd'),
                exact: true
              },
              {
                path: '/architecture/helm-deployment',
                component: ComponentCreator('/architecture/helm-deployment', 'e8b'),
                exact: true
              },
              {
                path: '/architecture/indexing-pipeline',
                component: ComponentCreator('/architecture/indexing-pipeline', '655'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/infrastructure',
                component: ComponentCreator('/architecture/infrastructure', '895'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/overview',
                component: ComponentCreator('/architecture/overview', '67c'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/security-model',
                component: ComponentCreator('/architecture/security-model', '7b3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/service-map',
                component: ComponentCreator('/architecture/service-map', '675'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/simulation-engine',
                component: ComponentCreator('/architecture/simulation-engine', '0f4'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/tls-certificates',
                component: ComponentCreator('/architecture/tls-certificates', '4ce'),
                exact: true
              },
              {
                path: '/contributing/adr/contract-versioning-by-block-range',
                component: ComponentCreator('/contributing/adr/contract-versioning-by-block-range', 'a1f'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/contributing/adr/deterministic-simulation-engine',
                component: ComponentCreator('/contributing/adr/deterministic-simulation-engine', 'a05'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/contributing/adr/platform-adapter-architecture',
                component: ComponentCreator('/contributing/adr/platform-adapter-architecture', 'ba4'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/contributing/architecture-decisions',
                component: ComponentCreator('/contributing/architecture-decisions', '0b6'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/contributing/coding-standards',
                component: ComponentCreator('/contributing/coding-standards', '801'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/contributing/contribution-guide',
                component: ComponentCreator('/contributing/contribution-guide', 'cda'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/contributing/pull-request-guide',
                component: ComponentCreator('/contributing/pull-request-guide', 'f96'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/add-new-chain',
                component: ComponentCreator('/guides/add-new-chain', 'a7f'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/add-new-contract-version',
                component: ComponentCreator('/guides/add-new-contract-version', 'f55'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/add-new-platform',
                component: ComponentCreator('/guides/add-new-platform', '0c3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/analyze-leaderboard',
                component: ComponentCreator('/guides/analyze-leaderboard', '524'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/create-simulation',
                component: ComponentCreator('/guides/create-simulation', 'bbd'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/deployment',
                component: ComponentCreator('/guides/deployment', 'f7c'),
                exact: true
              },
              {
                path: '/guides/deployment-guide',
                component: ComponentCreator('/guides/deployment-guide', 'e44'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/developer',
                component: ComponentCreator('/guides/developer', 'f70'),
                exact: true
              },
              {
                path: '/guides/environment-setup',
                component: ComponentCreator('/guides/environment-setup', '8de'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/local-development',
                component: ComponentCreator('/guides/local-development', '3bb'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/quickstart',
                component: ComponentCreator('/guides/quickstart', 'f45'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/run-with-docker',
                component: ComponentCreator('/guides/run-with-docker', '199'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/intro/core-concepts',
                component: ComponentCreator('/intro/core-concepts', '516'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/intro/current-status',
                component: ComponentCreator('/intro/current-status', '7fb'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/intro/what-is-luckyplans',
                component: ComponentCreator('/intro/what-is-luckyplans', '337'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/operations/database-migration',
                component: ComponentCreator('/operations/database-migration', '154'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/operations/deployment-runbook',
                component: ComponentCreator('/operations/deployment-runbook', '66b'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/operations/incident-response',
                component: ComponentCreator('/operations/incident-response', '457'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/operations/monitoring',
                component: ComponentCreator('/operations/monitoring', 'a51'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/operations/reindexing-runbook',
                component: ComponentCreator('/operations/reindexing-runbook', '2cb'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/operations/rollback-runbook',
                component: ComponentCreator('/operations/rollback-runbook', '4f4'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/reference/api-reference',
                component: ComponentCreator('/reference/api-reference', 'b59'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/reference/configuration-reference',
                component: ComponentCreator('/reference/configuration-reference', '0a9'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/reference/database-models',
                component: ComponentCreator('/reference/database-models', '085'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/reference/environment-variables',
                component: ComponentCreator('/reference/environment-variables', 'c4d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/reference/error-codes',
                component: ComponentCreator('/reference/error-codes', '742'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/reference/graphql-reference',
                component: ComponentCreator('/reference/graphql-reference', 'ffd'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/reference/helm-values',
                component: ComponentCreator('/reference/helm-values', '872'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/reference/message-patterns',
                component: ComponentCreator('/reference/message-patterns', 'ebe'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/roadmap',
                component: ComponentCreator('/roadmap', '571'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/roadmap/changelog',
                component: ComponentCreator('/roadmap/changelog', 'b9d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/security/disclosure-policy',
                component: ComponentCreator('/security/disclosure-policy', '55b'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/security/impersonation-warning',
                component: ComponentCreator('/security/impersonation-warning', 'feb'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/security/official-links',
                component: ComponentCreator('/security/official-links', 'f61'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/security/security-best-practices',
                component: ComponentCreator('/security/security-best-practices', '3b2'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/system/api',
                component: ComponentCreator('/system/api', '68f'),
                exact: true
              },
              {
                path: '/system/configuration',
                component: ComponentCreator('/system/configuration', '3ac'),
                exact: true
              },
              {
                path: '/',
                component: ComponentCreator('/', '697'),
                exact: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
