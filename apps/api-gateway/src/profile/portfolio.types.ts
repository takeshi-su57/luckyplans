import { Field, ID, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export const Proficiency = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
  EXPERT: 'EXPERT',
} as const;
export type Proficiency = (typeof Proficiency)[keyof typeof Proficiency];

registerEnumType(Proficiency, { name: 'Proficiency' });

// ── Object Types ───────────────────────────────────────────────

@ObjectType()
export class Project {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string | null;

  @Field(() => [String])
  images!: string[];

  @Field({ nullable: true })
  liveUrl?: string | null;

  @Field({ nullable: true })
  repoUrl?: string | null;

  @Field(() => [String])
  tags!: string[];

  @Field(() => Int)
  sortOrder!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class SkillCategory {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => Int)
  sortOrder!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class Skill {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  categoryId?: string | null;

  @Field(() => SkillCategory, { nullable: true })
  category?: SkillCategory | null;

  @Field(() => Proficiency)
  proficiency!: Proficiency;

  @Field(() => Int)
  sortOrder!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class Experience {
  @Field(() => ID)
  id!: string;

  @Field()
  company!: string;

  @Field()
  role!: string;

  @Field(() => [String])
  description!: string[];

  @Field()
  startDate!: Date;

  @Field({ nullable: true })
  endDate?: Date | null;

  @Field(() => Int)
  sortOrder!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class Education {
  @Field(() => ID)
  id!: string;

  @Field()
  school!: string;

  @Field({ nullable: true })
  degree?: string | null;

  @Field({ nullable: true })
  field?: string | null;

  @Field()
  startDate!: Date;

  @Field({ nullable: true })
  endDate?: Date | null;

  @Field(() => [String])
  description!: string[];

  @Field(() => Int)
  sortOrder!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class Certification {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  issuer!: string;

  @Field({ nullable: true })
  issueDate?: Date | null;

  @Field({ nullable: true })
  expiryDate?: Date | null;

  @Field({ nullable: true })
  url?: string | null;

  @Field(() => Int)
  sortOrder!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class Language {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  proficiency!: string;

  @Field(() => Int)
  sortOrder!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class Award {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  issuer?: string | null;

  @Field({ nullable: true })
  date?: Date | null;

  @Field({ nullable: true })
  description?: string | null;

  @Field(() => Int)
  sortOrder!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class Hobby {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string | null;

  @Field(() => Int)
  sortOrder!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class SocialLink {
  @Field(() => ID)
  id!: string;

  @Field()
  platform!: string;

  @Field()
  url!: string;

  @Field({ nullable: true })
  label?: string | null;

  @Field(() => Int)
  sortOrder!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class PublicProfile {
  @Field()
  userId!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  firstName?: string | null;

  @Field({ nullable: true })
  lastName?: string | null;

  @Field({ nullable: true })
  avatarUrl?: string | null;

  @Field({ nullable: true })
  bio?: string | null;

  @Field({ nullable: true })
  headline?: string | null;

  @Field({ nullable: true })
  location?: string | null;

  @Field(() => [Project])
  projects!: Project[];

  @Field(() => [Skill])
  skills!: Skill[];

  @Field(() => [Experience])
  experiences!: Experience[];

  @Field(() => [SocialLink])
  socialLinks!: SocialLink[];

  @Field(() => [SkillCategory])
  skillCategories!: SkillCategory[];

  @Field(() => [Education])
  education!: Education[];

  @Field(() => [Certification])
  certifications!: Certification[];

  @Field(() => [Language])
  languages!: Language[];

  @Field(() => [Award])
  awards!: Award[];

  @Field(() => [Hobby])
  hobbies!: Hobby[];
}

@ObjectType()
export class DeleteResult {
  @Field()
  success!: boolean;
}

// ── Input Types ────────────────────────────────────────────────

@InputType()
export class CreateProjectInput {
  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field({ nullable: true })
  liveUrl?: string;

  @Field({ nullable: true })
  repoUrl?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}

@InputType()
export class UpdateProjectInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field({ nullable: true })
  liveUrl?: string;

  @Field({ nullable: true })
  repoUrl?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}

@InputType()
export class CreateSkillInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  categoryId?: string;

  @Field(() => Proficiency, { nullable: true })
  proficiency?: Proficiency;
}

@InputType()
export class UpdateSkillInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  categoryId?: string;

  @Field(() => Proficiency, { nullable: true })
  proficiency?: Proficiency;
}

@InputType()
export class CreateExperienceInput {
  @Field()
  company!: string;

  @Field()
  role!: string;

  @Field(() => [String], { nullable: true })
  description?: string[];

  @Field()
  startDate!: Date;

  @Field({ nullable: true })
  endDate?: Date;
}

@InputType()
export class UpdateExperienceInput {
  @Field({ nullable: true })
  company?: string;

  @Field({ nullable: true })
  role?: string;

  @Field(() => [String], { nullable: true })
  description?: string[];

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;
}

@InputType()
export class CreateSocialLinkInput {
  @Field()
  platform!: string;

  @Field()
  url!: string;

  @Field({ nullable: true })
  label?: string;
}

@InputType()
export class UpdateSocialLinkInput {
  @Field({ nullable: true })
  platform?: string;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  label?: string;
}

@InputType()
export class CreateSkillCategoryInput {
  @Field()
  name!: string;
}

@InputType()
export class UpdateSkillCategoryInput {
  @Field({ nullable: true })
  name?: string;
}

@InputType()
export class CreateEducationInput {
  @Field()
  school!: string;

  @Field({ nullable: true })
  degree?: string;

  @Field({ nullable: true })
  field?: string;

  @Field()
  startDate!: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => [String], { nullable: true })
  description?: string[];
}

@InputType()
export class UpdateEducationInput {
  @Field({ nullable: true })
  school?: string;

  @Field({ nullable: true })
  degree?: string;

  @Field({ nullable: true })
  field?: string;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => [String], { nullable: true })
  description?: string[];
}

@InputType()
export class CreateCertificationInput {
  @Field()
  name!: string;

  @Field()
  issuer!: string;

  @Field({ nullable: true })
  issueDate?: Date;

  @Field({ nullable: true })
  expiryDate?: Date;

  @Field({ nullable: true })
  url?: string;
}

@InputType()
export class UpdateCertificationInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  issuer?: string;

  @Field({ nullable: true })
  issueDate?: Date;

  @Field({ nullable: true })
  expiryDate?: Date;

  @Field({ nullable: true })
  url?: string;
}

@InputType()
export class CreateLanguageInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  proficiency?: string;
}

@InputType()
export class UpdateLanguageInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  proficiency?: string;
}

@InputType()
export class CreateAwardInput {
  @Field()
  title!: string;

  @Field({ nullable: true })
  issuer?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class UpdateAwardInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  issuer?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class CreateHobbyInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class UpdateHobbyInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class ReorderInput {
  @Field(() => [String])
  orderedIds!: string[];
}
