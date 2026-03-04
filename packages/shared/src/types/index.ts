export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
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
  AUTH = 'service-auth',
  CORE = 'service-core',
  API_GATEWAY = 'api-gateway',
}

export enum AuthMessagePattern {
  VALIDATE = 'auth.validate',
  LOGIN = 'auth.login',
  REGISTER = 'auth.register',
  PROFILE = 'auth.profile',
}

export enum CoreMessagePattern {
  GET_ITEMS = 'core.getItems',
  GET_ITEM = 'core.getItem',
  CREATE_ITEM = 'core.createItem',
  UPDATE_ITEM = 'core.updateItem',
  DELETE_ITEM = 'core.deleteItem',
}
