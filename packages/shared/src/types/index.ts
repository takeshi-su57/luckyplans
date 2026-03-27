export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  userId: string;
  email: string;
  name?: string;
  roles: string[];
}

export interface ServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T = unknown> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export enum ServiceName {
  CORE = 'service-core',
  API_GATEWAY = 'api-gateway',
}

export interface UserProfileData {
  id: string;
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  headline?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialLinkData {
  id: string;
  profileId: string;
  platform: string;
  url: string;
  label?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillCategoryData {
  id: string;
  profileId: string;
  name: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum Proficiency {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export interface ProjectData {
  id: string;
  profileId: string;
  title: string;
  description?: string;
  images: string[];
  liveUrl?: string;
  repoUrl?: string;
  tags: string[];
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillData {
  id: string;
  profileId: string;
  name: string;
  categoryId?: string;
  category?: SkillCategoryData;
  proficiency: Proficiency;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperienceData {
  id: string;
  profileId: string;
  company: string;
  role: string;
  description: string[];
  startDate: Date;
  endDate?: Date;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EducationData {
  id: string;
  profileId: string;
  school: string;
  degree?: string;
  field?: string;
  startDate: Date;
  endDate?: Date;
  description: string[];
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CertificationData {
  id: string;
  profileId: string;
  name: string;
  issuer: string;
  issueDate?: Date;
  expiryDate?: Date;
  url?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LanguageData {
  id: string;
  profileId: string;
  name: string;
  proficiency: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AwardData {
  id: string;
  profileId: string;
  title: string;
  issuer?: string;
  date?: Date;
  description?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HobbyData {
  id: string;
  profileId: string;
  name: string;
  description?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicProfileData extends UserProfileData {
  projects: ProjectData[];
  skills: SkillData[];
  experiences: ExperienceData[];
  socialLinks: SocialLinkData[];
  skillCategories: SkillCategoryData[];
  education: EducationData[];
  certifications: CertificationData[];
  languages: LanguageData[];
  awards: AwardData[];
  hobbies: HobbyData[];
}

export enum CoreMessagePattern {
  GET_ITEMS = 'core.getItems',
  GET_ITEM = 'core.getItem',
  CREATE_ITEM = 'core.createItem',
  UPDATE_ITEM = 'core.updateItem',
  DELETE_ITEM = 'core.deleteItem',
  GET_PROFILE = 'core.getProfile',
  GET_OR_CREATE_PROFILE = 'core.getOrCreateProfile',
  UPDATE_PROFILE = 'core.updateProfile',

  // Public profile (full portfolio)
  GET_PUBLIC_PROFILE = 'core.getPublicProfile',

  // Portfolio - Projects
  GET_PROJECTS = 'core.getProjects',
  CREATE_PROJECT = 'core.createProject',
  UPDATE_PROJECT = 'core.updateProject',
  DELETE_PROJECT = 'core.deleteProject',
  REORDER_PROJECTS = 'core.reorderProjects',

  // Portfolio - Skills
  GET_SKILLS = 'core.getSkills',
  CREATE_SKILL = 'core.createSkill',
  UPDATE_SKILL = 'core.updateSkill',
  DELETE_SKILL = 'core.deleteSkill',
  REORDER_SKILLS = 'core.reorderSkills',

  // Portfolio - Experience
  GET_EXPERIENCES = 'core.getExperiences',
  CREATE_EXPERIENCE = 'core.createExperience',
  UPDATE_EXPERIENCE = 'core.updateExperience',
  DELETE_EXPERIENCE = 'core.deleteExperience',
  REORDER_EXPERIENCES = 'core.reorderExperiences',

  // Portfolio - Social Links
  CREATE_SOCIAL_LINK = 'core.createSocialLink',
  UPDATE_SOCIAL_LINK = 'core.updateSocialLink',
  DELETE_SOCIAL_LINK = 'core.deleteSocialLink',
  REORDER_SOCIAL_LINKS = 'core.reorderSocialLinks',

  // Portfolio - Skill Categories
  GET_SKILL_CATEGORIES = 'core.getSkillCategories',
  CREATE_SKILL_CATEGORY = 'core.createSkillCategory',
  UPDATE_SKILL_CATEGORY = 'core.updateSkillCategory',
  DELETE_SKILL_CATEGORY = 'core.deleteSkillCategory',

  // Portfolio - Education
  CREATE_EDUCATION = 'core.createEducation',
  UPDATE_EDUCATION = 'core.updateEducation',
  DELETE_EDUCATION = 'core.deleteEducation',
  REORDER_EDUCATION = 'core.reorderEducation',

  // Portfolio - Certifications
  CREATE_CERTIFICATION = 'core.createCertification',
  UPDATE_CERTIFICATION = 'core.updateCertification',
  DELETE_CERTIFICATION = 'core.deleteCertification',
  REORDER_CERTIFICATIONS = 'core.reorderCertifications',

  // Portfolio - Languages
  CREATE_LANGUAGE = 'core.createLanguage',
  UPDATE_LANGUAGE = 'core.updateLanguage',
  DELETE_LANGUAGE = 'core.deleteLanguage',
  REORDER_LANGUAGES = 'core.reorderLanguages',

  // Portfolio - Awards
  CREATE_AWARD = 'core.createAward',
  UPDATE_AWARD = 'core.updateAward',
  DELETE_AWARD = 'core.deleteAward',
  REORDER_AWARDS = 'core.reorderAwards',

  // Portfolio - Hobbies
  CREATE_HOBBY = 'core.createHobby',
  UPDATE_HOBBY = 'core.updateHobby',
  DELETE_HOBBY = 'core.deleteHobby',
  REORDER_HOBBIES = 'core.reorderHobbies',
}
