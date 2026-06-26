import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
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
    component: ComponentCreator('/', 'f44'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'a13'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'ccd'),
            routes: [
              {
                path: '/architecture/argocd',
                component: ComponentCreator('/architecture/argocd', '685'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/ci-cd-pipeline',
                component: ComponentCreator('/architecture/ci-cd-pipeline', '883'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/decisions/2026-03-10-functional-decomposition',
                component: ComponentCreator('/architecture/decisions/2026-03-10-functional-decomposition', '828'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/decisions/2026-03-10-graphql-code-first',
                component: ComponentCreator('/architecture/decisions/2026-03-10-graphql-code-first', 'e14'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/decisions/2026-03-10-redis-pub-sub-transport',
                component: ComponentCreator('/architecture/decisions/2026-03-10-redis-pub-sub-transport', 'b6d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/decisions/2026-03-11-graphql-codegen-client-preset',
                component: ComponentCreator('/architecture/decisions/2026-03-11-graphql-codegen-client-preset', '598'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/decisions/2026-03-11-keycloak-oidc-nextauth',
                component: ComponentCreator('/architecture/decisions/2026-03-11-keycloak-oidc-nextauth', 'fb0'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/decisions/2026-03-11-nextra-docs-route',
                component: ComponentCreator('/architecture/decisions/2026-03-11-nextra-docs-route', '1f8'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/decisions/2026-03-12-custom-auth-pages-ropc',
                component: ComponentCreator('/architecture/decisions/2026-03-12-custom-auth-pages-ropc', '126'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/decisions/2026-03-12-gateway-managed-sessions',
                component: ComponentCreator('/architecture/decisions/2026-03-12-gateway-managed-sessions', '56e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/decisions/2026-03-13-bitnami-sealed-secrets',
                component: ComponentCreator('/architecture/decisions/2026-03-13-bitnami-sealed-secrets', 'b24'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/decisions/2026-03-16-prisma-postgresql-persistence',
                component: ComponentCreator('/architecture/decisions/2026-03-16-prisma-postgresql-persistence', '660'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/decisions/2026-05-21-gateway-edge-orchestration',
                component: ComponentCreator('/architecture/decisions/2026-05-21-gateway-edge-orchestration', '369'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/decisions/2026-06-05-defer-edge-websocket-sessions',
                component: ComponentCreator('/architecture/decisions/2026-06-05-defer-edge-websocket-sessions', '967'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/decisions/2026-06-05-defer-task-artifact-transfer',
                component: ComponentCreator('/architecture/decisions/2026-06-05-defer-task-artifact-transfer', 'b3e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/decisions/2026-06-25-standalone-docs-app',
                component: ComponentCreator('/architecture/decisions/2026-06-25-standalone-docs-app', '2bb'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/helm-deployment',
                component: ComponentCreator('/architecture/helm-deployment', '1cb'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/overview',
                component: ComponentCreator('/architecture/overview', '5ac'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/tls-certificates',
                component: ComponentCreator('/architecture/tls-certificates', 'e92'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/deployment',
                component: ComponentCreator('/guides/deployment', '00d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/developer',
                component: ComponentCreator('/guides/developer', '013'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/system/api',
                component: ComponentCreator('/system/api', 'a4f'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/system/configuration',
                component: ComponentCreator('/system/configuration', 'a3e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/',
                component: ComponentCreator('/', '36e'),
                exact: true,
                sidebar: "docsSidebar"
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
