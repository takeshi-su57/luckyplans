import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // Use local schema file (mirrors the gateway's code-first schema).
  // Switch to 'http://localhost:3001/graphql' when running with a live gateway.
  schema: 'schema.graphql',
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
