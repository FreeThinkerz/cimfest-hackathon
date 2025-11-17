export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  code?: string | number;
  message: string;
  details?: any;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  Pagination: Pagination;
}
