import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import {
  Award,
  Certification,
  CreateAwardInput,
  CreateCertificationInput,
  CreateEducationInput,
  CreateExperienceInput,
  CreateHobbyInput,
  CreateLanguageInput,
  CreateProjectInput,
  CreateSkillCategoryInput,
  CreateSkillInput,
  CreateSocialLinkInput,
  DeleteResult,
  Education,
  Experience,
  Hobby,
  Language,
  Project,
  PublicProfile,
  ReorderInput,
  Skill,
  SkillCategory,
  SocialLink,
  UpdateAwardInput,
  UpdateCertificationInput,
  UpdateEducationInput,
  UpdateExperienceInput,
  UpdateHobbyInput,
  UpdateLanguageInput,
  UpdateProjectInput,
  UpdateSkillCategoryInput,
  UpdateSkillInput,
  UpdateSocialLinkInput,
} from './portfolio.types';

type MetadataTarget = abstract new (...args: never[]) => unknown;
type LazyMetadataStorageShape = {
  load: (types: MetadataTarget[]) => void;
};

const nodeRequire = createRequire(__filename);
const { LazyMetadataStorage } = nodeRequire(
  '@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage.js',
) as { LazyMetadataStorage: LazyMetadataStorageShape };

const portfolioTypes = [
  Project,
  SkillCategory,
  Skill,
  Experience,
  Education,
  Certification,
  Language,
  Award,
  Hobby,
  SocialLink,
  PublicProfile,
  DeleteResult,
  CreateProjectInput,
  UpdateProjectInput,
  CreateSkillInput,
  UpdateSkillInput,
  CreateExperienceInput,
  UpdateExperienceInput,
  CreateSocialLinkInput,
  UpdateSocialLinkInput,
  CreateSkillCategoryInput,
  UpdateSkillCategoryInput,
  CreateEducationInput,
  UpdateEducationInput,
  CreateCertificationInput,
  UpdateCertificationInput,
  CreateLanguageInput,
  UpdateLanguageInput,
  CreateAwardInput,
  UpdateAwardInput,
  CreateHobbyInput,
  UpdateHobbyInput,
  ReorderInput,
];

describe('portfolio GraphQL types', () => {
  it('loads GraphQL field metadata for schema generation', () => {
    expect(() => LazyMetadataStorage.load(portfolioTypes)).not.toThrow();
  });
});
