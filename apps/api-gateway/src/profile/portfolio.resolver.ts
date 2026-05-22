import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { AuthUser } from '@luckyplans/shared';
import { CurrentUser } from '../auth/current-user.decorator';
import { SessionGuard } from '../auth/session.guard';
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
import { ProfileService } from './profile.service';

@Resolver()
export class PortfolioResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => PublicProfile, { nullable: true })
  async getPublicProfile(@Args('userId') userId: string): Promise<PublicProfile | null> {
    return this.profileService.getPublicProfile(userId);
  }

  @Mutation(() => Project)
  @UseGuards(SessionGuard)
  async createProject(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateProjectInput,
  ): Promise<Project> {
    return this.profileService.createProject(user.userId, input);
  }

  @Mutation(() => Project, { nullable: true })
  @UseGuards(SessionGuard)
  async updateProject(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateProjectInput,
  ): Promise<Project | null> {
    return this.profileService.updateProject(user.userId, id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteProject(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.profileService.deleteProject(user.userId, id);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderProjects(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return this.profileService.reorderProjects(user.userId, input.orderedIds);
  }

  @Mutation(() => Skill)
  @UseGuards(SessionGuard)
  async createSkill(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateSkillInput,
  ): Promise<Skill> {
    return this.profileService.createSkill(user.userId, input);
  }

  @Mutation(() => Skill, { nullable: true })
  @UseGuards(SessionGuard)
  async updateSkill(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateSkillInput,
  ): Promise<Skill | null> {
    return this.profileService.updateSkill(user.userId, id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteSkill(@CurrentUser() user: AuthUser, @Args('id') id: string): Promise<DeleteResult> {
    return this.profileService.deleteSkill(user.userId, id);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderSkills(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return this.profileService.reorderSkills(user.userId, input.orderedIds);
  }

  @Mutation(() => Experience)
  @UseGuards(SessionGuard)
  async createExperience(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateExperienceInput,
  ): Promise<Experience> {
    return this.profileService.createExperience(user.userId, input);
  }

  @Mutation(() => Experience, { nullable: true })
  @UseGuards(SessionGuard)
  async updateExperience(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateExperienceInput,
  ): Promise<Experience | null> {
    return this.profileService.updateExperience(user.userId, id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteExperience(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.profileService.deleteExperience(user.userId, id);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderExperiences(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return this.profileService.reorderExperiences(user.userId, input.orderedIds);
  }

  @Mutation(() => SocialLink)
  @UseGuards(SessionGuard)
  async createSocialLink(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateSocialLinkInput,
  ): Promise<SocialLink> {
    return this.profileService.createSocialLink(user.userId, input);
  }

  @Mutation(() => SocialLink, { nullable: true })
  @UseGuards(SessionGuard)
  async updateSocialLink(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateSocialLinkInput,
  ): Promise<SocialLink | null> {
    return this.profileService.updateSocialLink(user.userId, id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteSocialLink(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.profileService.deleteSocialLink(user.userId, id);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderSocialLinks(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return this.profileService.reorderSocialLinks(user.userId, input.orderedIds);
  }

  @Query(() => [SkillCategory])
  @UseGuards(SessionGuard)
  async getSkillCategories(@CurrentUser() user: AuthUser): Promise<SkillCategory[]> {
    return this.profileService.getSkillCategories(user.userId);
  }

  @Mutation(() => SkillCategory)
  @UseGuards(SessionGuard)
  async createSkillCategory(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateSkillCategoryInput,
  ): Promise<SkillCategory> {
    return this.profileService.createSkillCategory(user.userId, input);
  }

  @Mutation(() => SkillCategory, { nullable: true })
  @UseGuards(SessionGuard)
  async updateSkillCategory(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateSkillCategoryInput,
  ): Promise<SkillCategory | null> {
    return this.profileService.updateSkillCategory(user.userId, id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteSkillCategory(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.profileService.deleteSkillCategory(user.userId, id);
  }

  @Mutation(() => Education)
  @UseGuards(SessionGuard)
  async createEducation(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateEducationInput,
  ): Promise<Education> {
    return this.profileService.createEducation(user.userId, input);
  }

  @Mutation(() => Education, { nullable: true })
  @UseGuards(SessionGuard)
  async updateEducation(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateEducationInput,
  ): Promise<Education | null> {
    return this.profileService.updateEducation(user.userId, id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteEducation(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.profileService.deleteEducation(user.userId, id);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderEducation(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return this.profileService.reorderEducation(user.userId, input.orderedIds);
  }

  @Mutation(() => Certification)
  @UseGuards(SessionGuard)
  async createCertification(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateCertificationInput,
  ): Promise<Certification> {
    return this.profileService.createCertification(user.userId, input);
  }

  @Mutation(() => Certification, { nullable: true })
  @UseGuards(SessionGuard)
  async updateCertification(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateCertificationInput,
  ): Promise<Certification | null> {
    return this.profileService.updateCertification(user.userId, id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteCertification(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.profileService.deleteCertification(user.userId, id);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderCertifications(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return this.profileService.reorderCertifications(user.userId, input.orderedIds);
  }

  @Mutation(() => Language)
  @UseGuards(SessionGuard)
  async createLanguage(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateLanguageInput,
  ): Promise<Language> {
    return this.profileService.createLanguage(user.userId, input);
  }

  @Mutation(() => Language, { nullable: true })
  @UseGuards(SessionGuard)
  async updateLanguage(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateLanguageInput,
  ): Promise<Language | null> {
    return this.profileService.updateLanguage(user.userId, id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteLanguage(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.profileService.deleteLanguage(user.userId, id);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderLanguages(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return this.profileService.reorderLanguages(user.userId, input.orderedIds);
  }

  @Mutation(() => Award)
  @UseGuards(SessionGuard)
  async createAward(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateAwardInput,
  ): Promise<Award> {
    return this.profileService.createAward(user.userId, input);
  }

  @Mutation(() => Award, { nullable: true })
  @UseGuards(SessionGuard)
  async updateAward(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateAwardInput,
  ): Promise<Award | null> {
    return this.profileService.updateAward(user.userId, id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteAward(@CurrentUser() user: AuthUser, @Args('id') id: string): Promise<DeleteResult> {
    return this.profileService.deleteAward(user.userId, id);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderAwards(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return this.profileService.reorderAwards(user.userId, input.orderedIds);
  }

  @Mutation(() => Hobby)
  @UseGuards(SessionGuard)
  async createHobby(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateHobbyInput,
  ): Promise<Hobby> {
    return this.profileService.createHobby(user.userId, input);
  }

  @Mutation(() => Hobby, { nullable: true })
  @UseGuards(SessionGuard)
  async updateHobby(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateHobbyInput,
  ): Promise<Hobby | null> {
    return this.profileService.updateHobby(user.userId, id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async deleteHobby(@CurrentUser() user: AuthUser, @Args('id') id: string): Promise<DeleteResult> {
    return this.profileService.deleteHobby(user.userId, id);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(SessionGuard)
  async reorderHobbies(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ReorderInput,
  ): Promise<DeleteResult> {
    return this.profileService.reorderHobbies(user.userId, input.orderedIds);
  }
}
