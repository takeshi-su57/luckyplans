import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // Read schema directly from the gateway's auto-generated file (single source of truth).
  // Switch to 'http://localhost:3001/graphql' when running with a live gateway.
  schema: '../api-gateway/schema.graphql',
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    'src/generated/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        scalars: {
          DateTime: 'string',
        },
        avoidOptionals: false,
        enumsAsTypes: true,
        useTypeImports: true,
      },
    },
  },
  ignoreNoDocuments: false,
};

export default config;
