import { ObjectType, Field, ID, InputType, Int, registerEnumType } from '@nestjs/graphql';

// ── Enums ──────────────────────────────────────────────────────

export enum Proficiency {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

registerEnumType(Proficiency, { name: 'Proficiency' });

// ── Object Types ───────────────────────────────────────────────

@ObjectType()
export class Project {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String])
  images!: string[];

  @Field({ nullable: true })
  liveUrl?: string;

  @Field({ nullable: true })
  repoUrl?: string;

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
  categoryId?: string;

  @Field(() => SkillCategory, { nullable: true })
  category?: SkillCategory;

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
  endDate?: Date;

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
  degree?: string;

  @Field({ nullable: true })
  field?: string;

  @Field()
  startDate!: Date;

  @Field({ nullable: true })
  endDate?: Date;

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
  issueDate?: Date;

  @Field({ nullable: true })
  expiryDate?: Date;

  @Field({ nullable: true })
  url?: string;

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
  issuer?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  description?: string;

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
  description?: string;

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
  label?: string;

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
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  headline?: string;

  @Field({ nullable: true })
  location?: string;

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
