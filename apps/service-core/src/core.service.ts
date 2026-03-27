import { Injectable, Logger } from '@nestjs/common';
import { generateId } from '@luckyplans/shared';
import type { UserProfileData } from '@luckyplans/shared';
import { PrismaService } from './prisma.service';

export interface Item {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

@Injectable()
export class CoreService {
  private readonly logger = new Logger(CoreService.name);

  // In-memory store placeholder — replace with database
  private items: Item[] = [];

  constructor(private readonly prisma: PrismaService) {}

  // ── Items (in-memory placeholder) ──────────────────────────────

  async getItems(page: number, limit: number) {
    const start = (page - 1) * limit;
    const paginatedItems = this.items.slice(start, start + limit);

    return {
      items: paginatedItems,
      total: this.items.length,
    };
  }

  async getItem(id: string) {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async createItem(name: string, description?: string) {
    const item: Item = {
      id: generateId(),
      name,
      description,
      createdAt: new Date(),
    };
    this.items.push(item);
    return item;
  }

  async updateItem(id: string, name?: string, description?: string) {
    const item = this.items.find((i) => i.id === id);
    if (!item) return null;

    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    return item;
  }

  async deleteItem(id: string) {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return { success: false };

    this.items.splice(index, 1);
    return { success: true };
  }

  // ── Profile (PostgreSQL via Prisma) ────────────────────────────

  async getProfile(userId: string): Promise<UserProfileData | null> {
    return this.prisma.profile.findUnique({ where: { userId } });
  }

  async getOrCreateProfile(data: {
    userId: string;
    email: string;
    name?: string;
  }): Promise<UserProfileData> {
    const existing = await this.prisma.profile.findUnique({
      where: { userId: data.userId },
    });
    if (existing) return existing;

    this.logger.log(`Creating profile for user ${data.userId}`);

    const [firstName, ...lastParts] = (data.name ?? '').split(' ');
    const lastName = lastParts.join(' ') || undefined;

    return this.prisma.profile.create({
      data: {
        userId: data.userId,
        email: data.email,
        firstName: firstName || undefined,
        lastName,
      },
    });
  }

  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
      bio?: string;
      headline?: string;
      location?: string;
    },
  ): Promise<UserProfileData | null> {
    const existing = await this.prisma.profile.findUnique({
      where: { userId },
    });
    if (!existing) return null;

    return this.prisma.profile.update({
      where: { userId },
      data,
    });
  }

  // ── Public Profile (full portfolio) ──────────────────────────

  async getPublicProfile(userId: string) {
    return this.prisma.profile.findUnique({
      where: { userId },
      include: {
        projects: { orderBy: { sortOrder: 'asc' } },
        skills: { include: { category: true }, orderBy: { sortOrder: 'asc' } },
        experiences: { orderBy: { sortOrder: 'asc' } },
        socialLinks: { orderBy: { sortOrder: 'asc' } },
        skillCategories: { orderBy: { sortOrder: 'asc' } },
        education: { orderBy: { sortOrder: 'asc' } },
        certifications: { orderBy: { sortOrder: 'asc' } },
        languages: { orderBy: { sortOrder: 'asc' } },
        awards: { orderBy: { sortOrder: 'asc' } },
        hobbies: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  // ── Projects ─────────────────────────────────────────────────

  async getProjects(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return [];
    return this.prisma.project.findMany({
      where: { profileId: profile.id },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createProject(
    userId: string,
    data: {
      title: string;
      description?: string;
      images?: string[];
      liveUrl?: string;
      repoUrl?: string;
      tags?: string[];
    },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    const maxOrder = await this.prisma.project.aggregate({
      where: { profileId: profile.id },
      _max: { sortOrder: true },
    });

    return this.prisma.project.create({
      data: {
        profileId: profile.id,
        title: data.title,
        description: data.description,
        images: data.images ?? [],
        liveUrl: data.liveUrl,
        repoUrl: data.repoUrl,
        tags: data.tags ?? [],
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async updateProject(
    userId: string,
    id: string,
    data: {
      title?: string;
      description?: string;
      images?: string[];
      liveUrl?: string;
      repoUrl?: string;
      tags?: string[];
    },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return null;

    const existing = await this.prisma.project.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return null;

    return this.prisma.project.update({ where: { id }, data });
  }

  async deleteProject(userId: string, id: string): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    const existing = await this.prisma.project.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return { success: false };

    await this.prisma.project.delete({ where: { id } });
    return { success: true };
  }

  async reorderProjects(userId: string, orderedIds: string[]): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.project.updateMany({
          where: { id, profileId: profile.id },
          data: { sortOrder: index },
        }),
      ),
    );
    return { success: true };
  }

  // ── Skills ───────────────────────────────────────────────────

  async getSkills(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return [];
    return this.prisma.skill.findMany({
      where: { profileId: profile.id },
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createSkill(
    userId: string,
    data: { name: string; categoryId?: string; proficiency?: string },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    const maxOrder = await this.prisma.skill.aggregate({
      where: { profileId: profile.id },
      _max: { sortOrder: true },
    });

    return this.prisma.skill.create({
      data: {
        profileId: profile.id,
        name: data.name,
        categoryId: data.categoryId,
        proficiency: (data.proficiency as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT') ?? 'INTERMEDIATE',
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
      include: { category: true },
    });
  }

  async updateSkill(
    userId: string,
    id: string,
    data: { name?: string; categoryId?: string; proficiency?: string },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return null;

    const existing = await this.prisma.skill.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return null;

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.proficiency !== undefined) updateData.proficiency = data.proficiency;

    return this.prisma.skill.update({ where: { id }, data: updateData, include: { category: true } });
  }

  async deleteSkill(userId: string, id: string): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    const existing = await this.prisma.skill.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return { success: false };

    await this.prisma.skill.delete({ where: { id } });
    return { success: true };
  }

  async reorderSkills(userId: string, orderedIds: string[]): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.skill.updateMany({
          where: { id, profileId: profile.id },
          data: { sortOrder: index },
        }),
      ),
    );
    return { success: true };
  }

  // ── Experience ───────────────────────────────────────────────

  async getExperiences(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return [];
    return this.prisma.experience.findMany({
      where: { profileId: profile.id },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createExperience(
    userId: string,
    data: {
      company: string;
      role: string;
      description?: string[];
      startDate: Date;
      endDate?: Date;
    },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    const maxOrder = await this.prisma.experience.aggregate({
      where: { profileId: profile.id },
      _max: { sortOrder: true },
    });

    return this.prisma.experience.create({
      data: {
        profileId: profile.id,
        company: data.company,
        role: data.role,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async updateExperience(
    userId: string,
    id: string,
    data: {
      company?: string;
      role?: string;
      description?: string[];
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return null;

    const existing = await this.prisma.experience.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return null;

    return this.prisma.experience.update({ where: { id }, data });
  }

  async deleteExperience(userId: string, id: string): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    const existing = await this.prisma.experience.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return { success: false };

    await this.prisma.experience.delete({ where: { id } });
    return { success: true };
  }

  async reorderExperiences(userId: string, orderedIds: string[]): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.experience.updateMany({
          where: { id, profileId: profile.id },
          data: { sortOrder: index },
        }),
      ),
    );
    return { success: true };
  }

  // ── Social Links ─────────────────────────────────────────────

  async createSocialLink(
    userId: string,
    data: { platform: string; url: string; label?: string },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    const maxOrder = await this.prisma.socialLink.aggregate({
      where: { profileId: profile.id },
      _max: { sortOrder: true },
    });

    return this.prisma.socialLink.create({
      data: {
        profileId: profile.id,
        platform: data.platform,
        url: data.url,
        label: data.label,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async updateSocialLink(
    userId: string,
    id: string,
    data: { platform?: string; url?: string; label?: string },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return null;

    const existing = await this.prisma.socialLink.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return null;

    return this.prisma.socialLink.update({ where: { id }, data });
  }

  async deleteSocialLink(userId: string, id: string): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    const existing = await this.prisma.socialLink.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return { success: false };

    await this.prisma.socialLink.delete({ where: { id } });
    return { success: true };
  }

  async reorderSocialLinks(userId: string, orderedIds: string[]): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.socialLink.updateMany({
          where: { id, profileId: profile.id },
          data: { sortOrder: index },
        }),
      ),
    );
    return { success: true };
  }

  // ── Skill Categories ─────────────────────────────────────────

  async getSkillCategories(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return [];
    return this.prisma.skillCategory.findMany({
      where: { profileId: profile.id },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createSkillCategory(userId: string, data: { name: string }) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    const maxOrder = await this.prisma.skillCategory.aggregate({
      where: { profileId: profile.id },
      _max: { sortOrder: true },
    });

    return this.prisma.skillCategory.create({
      data: {
        profileId: profile.id,
        name: data.name,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async updateSkillCategory(userId: string, id: string, data: { name?: string }) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return null;

    const existing = await this.prisma.skillCategory.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return null;

    return this.prisma.skillCategory.update({ where: { id }, data });
  }

  async deleteSkillCategory(userId: string, id: string): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    const existing = await this.prisma.skillCategory.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return { success: false };

    await this.prisma.skillCategory.delete({ where: { id } });
    return { success: true };
  }

  // ── Education ───────────────────────────────────────────────

  async createEducation(
    userId: string,
    data: {
      school: string;
      degree?: string;
      field?: string;
      startDate: Date;
      endDate?: Date;
      description?: string[];
    },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    const maxOrder = await this.prisma.education.aggregate({
      where: { profileId: profile.id },
      _max: { sortOrder: true },
    });

    return this.prisma.education.create({
      data: {
        profileId: profile.id,
        school: data.school,
        degree: data.degree,
        field: data.field,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description ?? [],
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async updateEducation(
    userId: string,
    id: string,
    data: {
      school?: string;
      degree?: string;
      field?: string;
      startDate?: Date;
      endDate?: Date;
      description?: string[];
    },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return null;

    const existing = await this.prisma.education.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return null;

    return this.prisma.education.update({ where: { id }, data });
  }

  async deleteEducation(userId: string, id: string): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    const existing = await this.prisma.education.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return { success: false };

    await this.prisma.education.delete({ where: { id } });
    return { success: true };
  }

  async reorderEducation(userId: string, orderedIds: string[]): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.education.updateMany({
          where: { id, profileId: profile.id },
          data: { sortOrder: index },
        }),
      ),
    );
    return { success: true };
  }

  // ── Certifications ─────────────────────────────────────────

  async createCertification(
    userId: string,
    data: {
      name: string;
      issuer: string;
      issueDate?: Date;
      expiryDate?: Date;
      url?: string;
    },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    const maxOrder = await this.prisma.certification.aggregate({
      where: { profileId: profile.id },
      _max: { sortOrder: true },
    });

    return this.prisma.certification.create({
      data: {
        profileId: profile.id,
        name: data.name,
        issuer: data.issuer,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate,
        url: data.url,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async updateCertification(
    userId: string,
    id: string,
    data: {
      name?: string;
      issuer?: string;
      issueDate?: Date;
      expiryDate?: Date;
      url?: string;
    },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return null;

    const existing = await this.prisma.certification.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return null;

    return this.prisma.certification.update({ where: { id }, data });
  }

  async deleteCertification(userId: string, id: string): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    const existing = await this.prisma.certification.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return { success: false };

    await this.prisma.certification.delete({ where: { id } });
    return { success: true };
  }

  async reorderCertifications(userId: string, orderedIds: string[]): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.certification.updateMany({
          where: { id, profileId: profile.id },
          data: { sortOrder: index },
        }),
      ),
    );
    return { success: true };
  }

  // ── Languages ──────────────────────────────────────────────

  async createLanguage(
    userId: string,
    data: { name: string; proficiency?: string },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    const maxOrder = await this.prisma.language.aggregate({
      where: { profileId: profile.id },
      _max: { sortOrder: true },
    });

    return this.prisma.language.create({
      data: {
        profileId: profile.id,
        name: data.name,
        proficiency: data.proficiency ?? 'Conversational',
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async updateLanguage(
    userId: string,
    id: string,
    data: { name?: string; proficiency?: string },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return null;

    const existing = await this.prisma.language.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return null;

    return this.prisma.language.update({ where: { id }, data });
  }

  async deleteLanguage(userId: string, id: string): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    const existing = await this.prisma.language.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return { success: false };

    await this.prisma.language.delete({ where: { id } });
    return { success: true };
  }

  async reorderLanguages(userId: string, orderedIds: string[]): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.language.updateMany({
          where: { id, profileId: profile.id },
          data: { sortOrder: index },
        }),
      ),
    );
    return { success: true };
  }

  // ── Awards ─────────────────────────────────────────────────

  async createAward(
    userId: string,
    data: { title: string; issuer?: string; date?: Date; description?: string },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    const maxOrder = await this.prisma.award.aggregate({
      where: { profileId: profile.id },
      _max: { sortOrder: true },
    });

    return this.prisma.award.create({
      data: {
        profileId: profile.id,
        title: data.title,
        issuer: data.issuer,
        date: data.date,
        description: data.description,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async updateAward(
    userId: string,
    id: string,
    data: { title?: string; issuer?: string; date?: Date; description?: string },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return null;

    const existing = await this.prisma.award.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return null;

    return this.prisma.award.update({ where: { id }, data });
  }

  async deleteAward(userId: string, id: string): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    const existing = await this.prisma.award.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return { success: false };

    await this.prisma.award.delete({ where: { id } });
    return { success: true };
  }

  async reorderAwards(userId: string, orderedIds: string[]): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.award.updateMany({
          where: { id, profileId: profile.id },
          data: { sortOrder: index },
        }),
      ),
    );
    return { success: true };
  }

  // ── Hobbies ────────────────────────────────────────────────

  async createHobby(
    userId: string,
    data: { name: string; description?: string },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    const maxOrder = await this.prisma.hobby.aggregate({
      where: { profileId: profile.id },
      _max: { sortOrder: true },
    });

    return this.prisma.hobby.create({
      data: {
        profileId: profile.id,
        name: data.name,
        description: data.description,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async updateHobby(
    userId: string,
    id: string,
    data: { name?: string; description?: string },
  ) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return null;

    const existing = await this.prisma.hobby.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return null;

    return this.prisma.hobby.update({ where: { id }, data });
  }

  async deleteHobby(userId: string, id: string): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    const existing = await this.prisma.hobby.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) return { success: false };

    await this.prisma.hobby.delete({ where: { id } });
    return { success: true };
  }

  async reorderHobbies(userId: string, orderedIds: string[]): Promise<{ success: boolean }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { success: false };

    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.hobby.updateMany({
          where: { id, profileId: profile.id },
          data: { sortOrder: index },
        }),
      ),
    );
    return { success: true };
  }
}
