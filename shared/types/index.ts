export enum AdminRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export interface JwtPayload {
  sub: string;
  username: string;
  role: AdminRole;
}

export interface CurrentAdmin {
  id: string;
  username: string;
  role: AdminRole;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ClientJwtPayload {
  sub: string;
  telegramId: string;
}

export interface CurrentClient {
  id: string;
  telegramId: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}
