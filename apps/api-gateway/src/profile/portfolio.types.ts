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

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => [String])
  images!: string[];

  @Field(() => String, { nullable: true })
  liveUrl?: string | null;

  @Field(() => String, { nullable: true })
  repoUrl?: string | null;

  @Field(() => [String])
  tags!: string[];

  @Field(() => Int)
  sortOrder!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
export class SkillCategory {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => Int)
  sortOrder!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
export class Skill {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  categoryId?: string | null;

  @Field(() => SkillCategory, { nullable: true })
  category?: SkillCategory | null;

  @Field(() => Proficiency)
  proficiency!: Proficiency;

  @Field(() => Int)
  sortOrder!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
export class Experience {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  company!: string;

  @Field(() => String)
  role!: string;

  @Field(() => [String])
  description!: string[];

  @Field(() => Date)
  startDate!: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date | null;

  @Field(() => Int)
  sortOrder!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
export class Education {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  school!: string;

  @Field(() => String, { nullable: true })
  degree?: string | null;

  @Field(() => String, { nullable: true })
  field?: string | null;

  @Field(() => Date)
  startDate!: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date | null;

  @Field(() => [String])
  description!: string[];

  @Field(() => Int)
  sortOrder!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
export class Certification {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  issuer!: string;

  @Field(() => Date, { nullable: true })
  issueDate?: Date | null;

  @Field(() => Date, { nullable: true })
  expiryDate?: Date | null;

  @Field(() => String, { nullable: true })
  url?: string | null;

  @Field(() => Int)
  sortOrder!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
export class Language {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  proficiency!: string;

  @Field(() => Int)
  sortOrder!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
export class Award {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  issuer?: string | null;

  @Field(() => Date, { nullable: true })
  date?: Date | null;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Int)
  sortOrder!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
export class Hobby {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Int)
  sortOrder!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
export class SocialLink {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  platform!: string;

  @Field(() => String)
  url!: string;

  @Field(() => String, { nullable: true })
  label?: string | null;

  @Field(() => Int)
  sortOrder!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
export class PublicProfile {
  @Field(() => String)
  userId!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String, { nullable: true })
  firstName?: string | null;

  @Field(() => String, { nullable: true })
  lastName?: string | null;

  @Field(() => String, { nullable: true })
  avatarUrl?: string | null;

  @Field(() => String, { nullable: true })
  bio?: string | null;

  @Field(() => String, { nullable: true })
  headline?: string | null;

  @Field(() => String, { nullable: true })
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
  @Field(() => Boolean)
  success!: boolean;
}

// ── Input Types ────────────────────────────────────────────────

@InputType()
export class CreateProjectInput {
  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field(() => String, { nullable: true })
  liveUrl?: string;

  @Field(() => String, { nullable: true })
  repoUrl?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}

@InputType()
export class UpdateProjectInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field(() => String, { nullable: true })
  liveUrl?: string;

  @Field(() => String, { nullable: true })
  repoUrl?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}

@InputType()
export class CreateSkillInput {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => Proficiency, { nullable: true })
  proficiency?: Proficiency;
}

@InputType()
export class UpdateSkillInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => Proficiency, { nullable: true })
  proficiency?: Proficiency;
}

@InputType()
export class CreateExperienceInput {
  @Field(() => String)
  company!: string;

  @Field(() => String)
  role!: string;

  @Field(() => [String], { nullable: true })
  description?: string[];

  @Field(() => Date)
  startDate!: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;
}

@InputType()
export class UpdateExperienceInput {
  @Field(() => String, { nullable: true })
  company?: string;

  @Field(() => String, { nullable: true })
  role?: string;

  @Field(() => [String], { nullable: true })
  description?: string[];

  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;
}

@InputType()
export class CreateSocialLinkInput {
  @Field(() => String)
  platform!: string;

  @Field(() => String)
  url!: string;

  @Field(() => String, { nullable: true })
  label?: string;
}

@InputType()
export class UpdateSocialLinkInput {
  @Field(() => String, { nullable: true })
  platform?: string;

  @Field(() => String, { nullable: true })
  url?: string;

  @Field(() => String, { nullable: true })
  label?: string;
}

@InputType()
export class CreateSkillCategoryInput {
  @Field(() => String)
  name!: string;
}

@InputType()
export class UpdateSkillCategoryInput {
  @Field(() => String, { nullable: true })
  name?: string;
}

@InputType()
export class CreateEducationInput {
  @Field(() => String)
  school!: string;

  @Field(() => String, { nullable: true })
  degree?: string;

  @Field(() => String, { nullable: true })
  field?: string;

  @Field(() => Date)
  startDate!: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @Field(() => [String], { nullable: true })
  description?: string[];
}

@InputType()
export class UpdateEducationInput {
  @Field(() => String, { nullable: true })
  school?: string;

  @Field(() => String, { nullable: true })
  degree?: string;

  @Field(() => String, { nullable: true })
  field?: string;

  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @Field(() => [String], { nullable: true })
  description?: string[];
}

@InputType()
export class CreateCertificationInput {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  issuer!: string;

  @Field(() => Date, { nullable: true })
  issueDate?: Date;

  @Field(() => Date, { nullable: true })
  expiryDate?: Date;

  @Field(() => String, { nullable: true })
  url?: string;
}

@InputType()
export class UpdateCertificationInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  issuer?: string;

  @Field(() => Date, { nullable: true })
  issueDate?: Date;

  @Field(() => Date, { nullable: true })
  expiryDate?: Date;

  @Field(() => String, { nullable: true })
  url?: string;
}

@InputType()
export class CreateLanguageInput {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  proficiency?: string;
}

@InputType()
export class UpdateLanguageInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  proficiency?: string;
}

@InputType()
export class CreateAwardInput {
  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  issuer?: string;

  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => String, { nullable: true })
  description?: string;
}

@InputType()
export class UpdateAwardInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  issuer?: string;

  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => String, { nullable: true })
  description?: string;
}

@InputType()
export class CreateHobbyInput {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string;
}

@InputType()
export class UpdateHobbyInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;
}

@InputType()
export class ReorderInput {
  @Field(() => [String])
  orderedIds!: string[];
}
