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
}
