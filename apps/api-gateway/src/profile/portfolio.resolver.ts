import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CoreMessagePattern, injectTraceContext } from '@luckyplans/shared';
import type { AuthUser } from '@luckyplans/shared';
import { CurrentUser } from '../auth/current-user.decorator';
import { SessionGuard } from '../auth/session.guard';

/**
 * Converts ISO date strings back to Date objects in a Redis response.
 * Prisma returns Date objects, but Redis JSON serialization turns them into strings.
 * The GraphQL DateTime scalar requires Date objects in its serialize() method.
 */
const DATE_FIELDS = ['createdAt', 'updatedAt', 'startDate', 'endDate', 'issueDate', 'expiryDate', 'date'];

function reviveDates<T>(obj: T): T {
  if (obj == null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(reviveDates) as T;
  const result = { ...obj } as Record<string, unknown>;
  for (const key of Object.keys(result)) {
    const value = result[key];
    if (DATE_FIELDS.includes(key) && typeof value === 'string') {
      result[key] = new Date(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = reviveDates(value);
    }
  }
  return result as T;
}
import {
  PublicProfile,
  Project,
  Skill,
  SkillCategory,
  Experience,
  SocialLink,
  Education,
  Certification,
  Language,
  Award,
  Hobby,
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
} from './portfolio.types';

@Resolver()
export class PortfolioResolver {
  constructor(@Inject('CORE_SERVICE') private readonly coreClient: ClientProxy) {}

  // ── Public Query ─────────────────────────────────────────────

  @Query(() => PublicProfile, { nullable: true })
  async getPublicProfile(
    @Args('userId') userId: string,
  ): Promise<PublicProfile | null> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.GET_PUBLIC_PROFILE,
        injectTraceContext({ userId }),
      ),
    );
    return result ? reviveDates(result) : null;
  }

  // ── Projects ─────────────────────────────────────────────────

  @Mutation(() => Project)
  @UseGuards(SessionGuard)
  async createProject(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateProjectInput,
  ): Promise<Project> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.CREATE_PROJECT,
        injectTraceContext({ userId: user.userId, ...input }),
      ),
    );
    return reviveDates(result);
  }

  @Mutation(() => Project, { nullable: true })
  @UseGuards(SessionGuard)
  async updateProject(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateProjectInput,
  ): Promise<Project | null> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.UPDATE_PROJECT,
        injectTraceContext({ userId: user.userId, id, ...input }),
      ),
    );
    return result ? reviveDates(result) : null;
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteProject(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.DELETE_PROJECT,
        injectTraceContext({ userId: user.userId, id }),
      ),
    );
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderProjects(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.REORDER_PROJECTS,
        injectTraceContext({ userId: user.userId, orderedIds: input.orderedIds }),
      ),
    );
  }

  // ── Skills ───────────────────────────────────────────────────

  @Mutation(() => Skill)
  @UseGuards(SessionGuard)
  async createSkill(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateSkillInput,
  ): Promise<Skill> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.CREATE_SKILL,
        injectTraceContext({ userId: user.userId, ...input }),
      ),
    );
    return reviveDates(result);
  }

  @Mutation(() => Skill, { nullable: true })
  @UseGuards(SessionGuard)
  async updateSkill(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateSkillInput,
  ): Promise<Skill | null> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.UPDATE_SKILL,
        injectTraceContext({ userId: user.userId, id, ...input }),
      ),
    );
    return result ? reviveDates(result) : null;
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteSkill(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.DELETE_SKILL,
        injectTraceContext({ userId: user.userId, id }),
      ),
    );
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderSkills(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.REORDER_SKILLS,
        injectTraceContext({ userId: user.userId, orderedIds: input.orderedIds }),
      ),
    );
  }

  // ── Experience ───────────────────────────────────────────────

  @Mutation(() => Experience)
  @UseGuards(SessionGuard)
  async createExperience(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateExperienceInput,
  ): Promise<Experience> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.CREATE_EXPERIENCE,
        injectTraceContext({ userId: user.userId, ...input }),
      ),
    );
    return reviveDates(result);
  }

  @Mutation(() => Experience, { nullable: true })
  @UseGuards(SessionGuard)
  async updateExperience(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateExperienceInput,
  ): Promise<Experience | null> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.UPDATE_EXPERIENCE,
        injectTraceContext({ userId: user.userId, id, ...input }),
      ),
    );
    return result ? reviveDates(result) : null;
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteExperience(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.DELETE_EXPERIENCE,
        injectTraceContext({ userId: user.userId, id }),
      ),
    );
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderExperiences(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.REORDER_EXPERIENCES,
        injectTraceContext({ userId: user.userId, orderedIds: input.orderedIds }),
      ),
    );
  }

  // ── Social Links ─────────────────────────────────────────────

  @Mutation(() => SocialLink)
  @UseGuards(SessionGuard)
  async createSocialLink(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateSocialLinkInput,
  ): Promise<SocialLink> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.CREATE_SOCIAL_LINK,
        injectTraceContext({ userId: user.userId, ...input }),
      ),
    );
    return reviveDates(result);
  }

  @Mutation(() => SocialLink, { nullable: true })
  @UseGuards(SessionGuard)
  async updateSocialLink(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateSocialLinkInput,
  ): Promise<SocialLink | null> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.UPDATE_SOCIAL_LINK,
        injectTraceContext({ userId: user.userId, id, ...input }),
      ),
    );
    return result ? reviveDates(result) : null;
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteSocialLink(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.DELETE_SOCIAL_LINK,
        injectTraceContext({ userId: user.userId, id }),
      ),
    );
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderSocialLinks(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.REORDER_SOCIAL_LINKS,
        injectTraceContext({ userId: user.userId, orderedIds: input.orderedIds }),
      ),
    );
  }

  // ── Skill Categories ─────────────────────────────────────────

  @Query(() => [SkillCategory])
  @UseGuards(SessionGuard)
  async getSkillCategories(
    @CurrentUser() user: AuthUser,
  ): Promise<SkillCategory[]> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.GET_SKILL_CATEGORIES,
        injectTraceContext({ userId: user.userId }),
      ),
    );
    return reviveDates(result);
  }

  @Mutation(() => SkillCategory)
  @UseGuards(SessionGuard)
  async createSkillCategory(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateSkillCategoryInput,
  ): Promise<SkillCategory> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.CREATE_SKILL_CATEGORY,
        injectTraceContext({ userId: user.userId, ...input }),
      ),
    );
    return reviveDates(result);
  }

  @Mutation(() => SkillCategory, { nullable: true })
  @UseGuards(SessionGuard)
  async updateSkillCategory(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateSkillCategoryInput,
  ): Promise<SkillCategory | null> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.UPDATE_SKILL_CATEGORY,
        injectTraceContext({ userId: user.userId, id, ...input }),
      ),
    );
    return result ? reviveDates(result) : null;
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteSkillCategory(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.DELETE_SKILL_CATEGORY,
        injectTraceContext({ userId: user.userId, id }),
      ),
    );
  }

  // ── Education ──────────────────────────────────────────────

  @Mutation(() => Education)
  @UseGuards(SessionGuard)
  async createEducation(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateEducationInput,
  ): Promise<Education> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.CREATE_EDUCATION,
        injectTraceContext({ userId: user.userId, ...input }),
      ),
    );
    return reviveDates(result);
  }

  @Mutation(() => Education, { nullable: true })
  @UseGuards(SessionGuard)
  async updateEducation(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateEducationInput,
  ): Promise<Education | null> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.UPDATE_EDUCATION,
        injectTraceContext({ userId: user.userId, id, ...input }),
      ),
    );
    return result ? reviveDates(result) : null;
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteEducation(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.DELETE_EDUCATION,
        injectTraceContext({ userId: user.userId, id }),
      ),
    );
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderEducation(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.REORDER_EDUCATION,
        injectTraceContext({ userId: user.userId, orderedIds: input.orderedIds }),
      ),
    );
  }

  // ── Certifications ─────────────────────────────────────────

  @Mutation(() => Certification)
  @UseGuards(SessionGuard)
  async createCertification(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateCertificationInput,
  ): Promise<Certification> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.CREATE_CERTIFICATION,
        injectTraceContext({ userId: user.userId, ...input }),
      ),
    );
    return reviveDates(result);
  }

  @Mutation(() => Certification, { nullable: true })
  @UseGuards(SessionGuard)
  async updateCertification(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateCertificationInput,
  ): Promise<Certification | null> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.UPDATE_CERTIFICATION,
        injectTraceContext({ userId: user.userId, id, ...input }),
      ),
    );
    return result ? reviveDates(result) : null;
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteCertification(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.DELETE_CERTIFICATION,
        injectTraceContext({ userId: user.userId, id }),
      ),
    );
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderCertifications(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.REORDER_CERTIFICATIONS,
        injectTraceContext({ userId: user.userId, orderedIds: input.orderedIds }),
      ),
    );
  }

  // ── Languages ──────────────────────────────────────────────

  @Mutation(() => Language)
  @UseGuards(SessionGuard)
  async createLanguage(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateLanguageInput,
  ): Promise<Language> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.CREATE_LANGUAGE,
        injectTraceContext({ userId: user.userId, ...input }),
      ),
    );
    return reviveDates(result);
  }

  @Mutation(() => Language, { nullable: true })
  @UseGuards(SessionGuard)
  async updateLanguage(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateLanguageInput,
  ): Promise<Language | null> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.UPDATE_LANGUAGE,
        injectTraceContext({ userId: user.userId, id, ...input }),
      ),
    );
    return result ? reviveDates(result) : null;
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteLanguage(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.DELETE_LANGUAGE,
        injectTraceContext({ userId: user.userId, id }),
      ),
    );
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderLanguages(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.REORDER_LANGUAGES,
        injectTraceContext({ userId: user.userId, orderedIds: input.orderedIds }),
      ),
    );
  }

  // ── Awards ─────────────────────────────────────────────────

  @Mutation(() => Award)
  @UseGuards(SessionGuard)
  async createAward(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateAwardInput,
  ): Promise<Award> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.CREATE_AWARD,
        injectTraceContext({ userId: user.userId, ...input }),
      ),
    );
    return reviveDates(result);
  }

  @Mutation(() => Award, { nullable: true })
  @UseGuards(SessionGuard)
  async updateAward(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateAwardInput,
  ): Promise<Award | null> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.UPDATE_AWARD,
        injectTraceContext({ userId: user.userId, id, ...input }),
      ),
    );
    return result ? reviveDates(result) : null;
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteAward(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.DELETE_AWARD,
        injectTraceContext({ userId: user.userId, id }),
      ),
    );
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderAwards(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.REORDER_AWARDS,
        injectTraceContext({ userId: user.userId, orderedIds: input.orderedIds }),
      ),
    );
  }

  // ── Hobbies ────────────────────────────────────────────────

  @Mutation(() => Hobby)
  @UseGuards(SessionGuard)
  async createHobby(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateHobbyInput,
  ): Promise<Hobby> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.CREATE_HOBBY,
        injectTraceContext({ userId: user.userId, ...input }),
      ),
    );
    return reviveDates(result);
  }

  @Mutation(() => Hobby, { nullable: true })
  @UseGuards(SessionGuard)
  async updateHobby(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateHobbyInput,
  ): Promise<Hobby | null> {
    const result = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.UPDATE_HOBBY,
        injectTraceContext({ userId: user.userId, id, ...input }),
      ),
    );
    return result ? reviveDates(result) : null;
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteHobby(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.DELETE_HOBBY,
        injectTraceContext({ userId: user.userId, id }),
      ),
    );
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderHobbies(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.REORDER_HOBBIES,
        injectTraceContext({ userId: user.userId, orderedIds: input.orderedIds }),
      ),
    );
  }
}
