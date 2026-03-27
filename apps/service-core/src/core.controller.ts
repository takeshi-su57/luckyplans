import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CoreMessagePattern } from '@luckyplans/shared';
import { CoreService } from './core.service';

@Controller()
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @MessagePattern(CoreMessagePattern.GET_ITEMS)
  async getItems(@Payload() data: { page: number; limit: number }) {
    return this.coreService.getItems(data.page, data.limit);
  }

  @MessagePattern(CoreMessagePattern.GET_ITEM)
  async getItem(@Payload() data: { id: string }) {
    return this.coreService.getItem(data.id);
  }

  @MessagePattern(CoreMessagePattern.CREATE_ITEM)
  async createItem(@Payload() data: { name: string; description?: string }) {
    return this.coreService.createItem(data.name, data.description);
  }

  @MessagePattern(CoreMessagePattern.UPDATE_ITEM)
  async updateItem(@Payload() data: { id: string; name?: string; description?: string }) {
    return this.coreService.updateItem(data.id, data.name, data.description);
  }

  @MessagePattern(CoreMessagePattern.DELETE_ITEM)
  async deleteItem(@Payload() data: { id: string }) {
    return this.coreService.deleteItem(data.id);
  }

  @MessagePattern(CoreMessagePattern.GET_PROFILE)
  async getProfile(@Payload() data: { userId: string }) {
    return this.coreService.getProfile(data.userId);
  }

  @MessagePattern(CoreMessagePattern.GET_OR_CREATE_PROFILE)
  async getOrCreateProfile(
    @Payload() data: { userId: string; email: string; name?: string },
  ) {
    return this.coreService.getOrCreateProfile(data);
  }

  @MessagePattern(CoreMessagePattern.UPDATE_PROFILE)
  async updateProfile(
    @Payload()
    data: {
      userId: string;
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
      bio?: string;
      headline?: string;
      location?: string;
    },
  ) {
    const { userId, ...updateData } = data;
    return this.coreService.updateProfile(userId, updateData);
  }

  // ── Public Profile ─────────────────────────────────────────

  @MessagePattern(CoreMessagePattern.GET_PUBLIC_PROFILE)
  async getPublicProfile(@Payload() data: { userId: string }) {
    return this.coreService.getPublicProfile(data.userId);
  }

  // ── Projects ───────────────────────────────────────────────

  @MessagePattern(CoreMessagePattern.GET_PROJECTS)
  async getProjects(@Payload() data: { userId: string }) {
    return this.coreService.getProjects(data.userId);
  }

  @MessagePattern(CoreMessagePattern.CREATE_PROJECT)
  async createProject(
    @Payload() data: { userId: string; title: string; description?: string; images?: string[]; liveUrl?: string; repoUrl?: string; tags?: string[] },
  ) {
    const { userId, ...createData } = data;
    return this.coreService.createProject(userId, createData);
  }

  @MessagePattern(CoreMessagePattern.UPDATE_PROJECT)
  async updateProject(
    @Payload() data: { userId: string; id: string; title?: string; description?: string; images?: string[]; liveUrl?: string; repoUrl?: string; tags?: string[] },
  ) {
    const { userId, id, ...updateData } = data;
    return this.coreService.updateProject(userId, id, updateData);
  }

  @MessagePattern(CoreMessagePattern.DELETE_PROJECT)
  async deleteProject(@Payload() data: { userId: string; id: string }) {
    return this.coreService.deleteProject(data.userId, data.id);
  }

  @MessagePattern(CoreMessagePattern.REORDER_PROJECTS)
  async reorderProjects(@Payload() data: { userId: string; orderedIds: string[] }) {
    return this.coreService.reorderProjects(data.userId, data.orderedIds);
  }

  // ── Skills ─────────────────────────────────────────────────

  @MessagePattern(CoreMessagePattern.GET_SKILLS)
  async getSkills(@Payload() data: { userId: string }) {
    return this.coreService.getSkills(data.userId);
  }

  @MessagePattern(CoreMessagePattern.CREATE_SKILL)
  async createSkill(
    @Payload() data: { userId: string; name: string; categoryId?: string; proficiency?: string },
  ) {
    const { userId, ...createData } = data;
    return this.coreService.createSkill(userId, createData);
  }

  @MessagePattern(CoreMessagePattern.UPDATE_SKILL)
  async updateSkill(
    @Payload() data: { userId: string; id: string; name?: string; categoryId?: string; proficiency?: string },
  ) {
    const { userId, id, ...updateData } = data;
    return this.coreService.updateSkill(userId, id, updateData);
  }

  @MessagePattern(CoreMessagePattern.DELETE_SKILL)
  async deleteSkill(@Payload() data: { userId: string; id: string }) {
    return this.coreService.deleteSkill(data.userId, data.id);
  }

  @MessagePattern(CoreMessagePattern.REORDER_SKILLS)
  async reorderSkills(@Payload() data: { userId: string; orderedIds: string[] }) {
    return this.coreService.reorderSkills(data.userId, data.orderedIds);
  }

  // ── Experience ─────────────────────────────────────────────

  @MessagePattern(CoreMessagePattern.GET_EXPERIENCES)
  async getExperiences(@Payload() data: { userId: string }) {
    return this.coreService.getExperiences(data.userId);
  }

  @MessagePattern(CoreMessagePattern.CREATE_EXPERIENCE)
  async createExperience(
    @Payload() data: { userId: string; company: string; role: string; description?: string[]; startDate: Date; endDate?: Date },
  ) {
    const { userId, ...createData } = data;
    return this.coreService.createExperience(userId, createData);
  }

  @MessagePattern(CoreMessagePattern.UPDATE_EXPERIENCE)
  async updateExperience(
    @Payload() data: { userId: string; id: string; company?: string; role?: string; description?: string[]; startDate?: Date; endDate?: Date },
  ) {
    const { userId, id, ...updateData } = data;
    return this.coreService.updateExperience(userId, id, updateData);
  }

  @MessagePattern(CoreMessagePattern.DELETE_EXPERIENCE)
  async deleteExperience(@Payload() data: { userId: string; id: string }) {
    return this.coreService.deleteExperience(data.userId, data.id);
  }

  @MessagePattern(CoreMessagePattern.REORDER_EXPERIENCES)
  async reorderExperiences(@Payload() data: { userId: string; orderedIds: string[] }) {
    return this.coreService.reorderExperiences(data.userId, data.orderedIds);
  }

  // ── Social Links ───────────────────────────────────────────

  @MessagePattern(CoreMessagePattern.CREATE_SOCIAL_LINK)
  async createSocialLink(
    @Payload() data: { userId: string; platform: string; url: string; label?: string },
  ) {
    const { userId, ...createData } = data;
    return this.coreService.createSocialLink(userId, createData);
  }

  @MessagePattern(CoreMessagePattern.UPDATE_SOCIAL_LINK)
  async updateSocialLink(
    @Payload() data: { userId: string; id: string; platform?: string; url?: string; label?: string },
  ) {
    const { userId, id, ...updateData } = data;
    return this.coreService.updateSocialLink(userId, id, updateData);
  }

  @MessagePattern(CoreMessagePattern.DELETE_SOCIAL_LINK)
  async deleteSocialLink(@Payload() data: { userId: string; id: string }) {
    return this.coreService.deleteSocialLink(data.userId, data.id);
  }

  @MessagePattern(CoreMessagePattern.REORDER_SOCIAL_LINKS)
  async reorderSocialLinks(@Payload() data: { userId: string; orderedIds: string[] }) {
    return this.coreService.reorderSocialLinks(data.userId, data.orderedIds);
  }

  // ── Skill Categories ───────────────────────────────────────

  @MessagePattern(CoreMessagePattern.GET_SKILL_CATEGORIES)
  async getSkillCategories(@Payload() data: { userId: string }) {
    return this.coreService.getSkillCategories(data.userId);
  }

  @MessagePattern(CoreMessagePattern.CREATE_SKILL_CATEGORY)
  async createSkillCategory(@Payload() data: { userId: string; name: string }) {
    const { userId, ...createData } = data;
    return this.coreService.createSkillCategory(userId, createData);
  }

  @MessagePattern(CoreMessagePattern.UPDATE_SKILL_CATEGORY)
  async updateSkillCategory(@Payload() data: { userId: string; id: string; name?: string }) {
    const { userId, id, ...updateData } = data;
    return this.coreService.updateSkillCategory(userId, id, updateData);
  }

  @MessagePattern(CoreMessagePattern.DELETE_SKILL_CATEGORY)
  async deleteSkillCategory(@Payload() data: { userId: string; id: string }) {
    return this.coreService.deleteSkillCategory(data.userId, data.id);
  }

  // ── Education ─────────────────────────────────────────────

  @MessagePattern(CoreMessagePattern.CREATE_EDUCATION)
  async createEducation(
    @Payload() data: { userId: string; school: string; degree?: string; field?: string; startDate: Date; endDate?: Date; description?: string[] },
  ) {
    const { userId, ...createData } = data;
    return this.coreService.createEducation(userId, createData);
  }

  @MessagePattern(CoreMessagePattern.UPDATE_EDUCATION)
  async updateEducation(
    @Payload() data: { userId: string; id: string; school?: string; degree?: string; field?: string; startDate?: Date; endDate?: Date; description?: string[] },
  ) {
    const { userId, id, ...updateData } = data;
    return this.coreService.updateEducation(userId, id, updateData);
  }

  @MessagePattern(CoreMessagePattern.DELETE_EDUCATION)
  async deleteEducation(@Payload() data: { userId: string; id: string }) {
    return this.coreService.deleteEducation(data.userId, data.id);
  }

  @MessagePattern(CoreMessagePattern.REORDER_EDUCATION)
  async reorderEducation(@Payload() data: { userId: string; orderedIds: string[] }) {
    return this.coreService.reorderEducation(data.userId, data.orderedIds);
  }

  // ── Certifications ────────────────────────────────────────

  @MessagePattern(CoreMessagePattern.CREATE_CERTIFICATION)
  async createCertification(
    @Payload() data: { userId: string; name: string; issuer: string; issueDate?: Date; expiryDate?: Date; url?: string },
  ) {
    const { userId, ...createData } = data;
    return this.coreService.createCertification(userId, createData);
  }

  @MessagePattern(CoreMessagePattern.UPDATE_CERTIFICATION)
  async updateCertification(
    @Payload() data: { userId: string; id: string; name?: string; issuer?: string; issueDate?: Date; expiryDate?: Date; url?: string },
  ) {
    const { userId, id, ...updateData } = data;
    return this.coreService.updateCertification(userId, id, updateData);
  }

  @MessagePattern(CoreMessagePattern.DELETE_CERTIFICATION)
  async deleteCertification(@Payload() data: { userId: string; id: string }) {
    return this.coreService.deleteCertification(data.userId, data.id);
  }

  @MessagePattern(CoreMessagePattern.REORDER_CERTIFICATIONS)
  async reorderCertifications(@Payload() data: { userId: string; orderedIds: string[] }) {
    return this.coreService.reorderCertifications(data.userId, data.orderedIds);
  }

  // ── Languages ─────────────────────────────────────────────

  @MessagePattern(CoreMessagePattern.CREATE_LANGUAGE)
  async createLanguage(
    @Payload() data: { userId: string; name: string; proficiency?: string },
  ) {
    const { userId, ...createData } = data;
    return this.coreService.createLanguage(userId, createData);
  }

  @MessagePattern(CoreMessagePattern.UPDATE_LANGUAGE)
  async updateLanguage(
    @Payload() data: { userId: string; id: string; name?: string; proficiency?: string },
  ) {
    const { userId, id, ...updateData } = data;
    return this.coreService.updateLanguage(userId, id, updateData);
  }

  @MessagePattern(CoreMessagePattern.DELETE_LANGUAGE)
  async deleteLanguage(@Payload() data: { userId: string; id: string }) {
    return this.coreService.deleteLanguage(data.userId, data.id);
  }

  @MessagePattern(CoreMessagePattern.REORDER_LANGUAGES)
  async reorderLanguages(@Payload() data: { userId: string; orderedIds: string[] }) {
    return this.coreService.reorderLanguages(data.userId, data.orderedIds);
  }

  // ── Awards ────────────────────────────────────────────────

  @MessagePattern(CoreMessagePattern.CREATE_AWARD)
  async createAward(
    @Payload() data: { userId: string; title: string; issuer?: string; date?: Date; description?: string },
  ) {
    const { userId, ...createData } = data;
    return this.coreService.createAward(userId, createData);
  }

  @MessagePattern(CoreMessagePattern.UPDATE_AWARD)
  async updateAward(
    @Payload() data: { userId: string; id: string; title?: string; issuer?: string; date?: Date; description?: string },
  ) {
    const { userId, id, ...updateData } = data;
    return this.coreService.updateAward(userId, id, updateData);
  }

  @MessagePattern(CoreMessagePattern.DELETE_AWARD)
  async deleteAward(@Payload() data: { userId: string; id: string }) {
    return this.coreService.deleteAward(data.userId, data.id);
  }

  @MessagePattern(CoreMessagePattern.REORDER_AWARDS)
  async reorderAwards(@Payload() data: { userId: string; orderedIds: string[] }) {
    return this.coreService.reorderAwards(data.userId, data.orderedIds);
  }

  // ── Hobbies ───────────────────────────────────────────────

  @MessagePattern(CoreMessagePattern.CREATE_HOBBY)
  async createHobby(
    @Payload() data: { userId: string; name: string; description?: string },
  ) {
    const { userId, ...createData } = data;
    return this.coreService.createHobby(userId, createData);
  }

  @MessagePattern(CoreMessagePattern.UPDATE_HOBBY)
  async updateHobby(
    @Payload() data: { userId: string; id: string; name?: string; description?: string },
  ) {
    const { userId, id, ...updateData } = data;
    return this.coreService.updateHobby(userId, id, updateData);
  }

  @MessagePattern(CoreMessagePattern.DELETE_HOBBY)
  async deleteHobby(@Payload() data: { userId: string; id: string }) {
    return this.coreService.deleteHobby(data.userId, data.id);
  }

  @MessagePattern(CoreMessagePattern.REORDER_HOBBIES)
  async reorderHobbies(@Payload() data: { userId: string; orderedIds: string[] }) {
    return this.coreService.reorderHobbies(data.userId, data.orderedIds);
  }
}
