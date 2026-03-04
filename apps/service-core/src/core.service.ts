import { Injectable } from '@nestjs/common';
import { generateId } from '@luckyplans/shared';

export interface Item {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

@Injectable()
export class CoreService {
  // In-memory store placeholder — replace with database
  private items: Item[] = [];

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
}
