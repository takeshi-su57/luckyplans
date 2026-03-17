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
    },
  ) {
    const { userId, ...updateData } = data;
    return this.coreService.updateProfile(userId, updateData);
  }
}
