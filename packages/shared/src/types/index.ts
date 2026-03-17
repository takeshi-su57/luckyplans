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
  createdAt: Date;
  updatedAt: Date;
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
}
