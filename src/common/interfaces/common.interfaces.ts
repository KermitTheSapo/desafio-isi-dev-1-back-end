export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface DiscountInfo {
  type: 'percent' | 'fixed';
  value: number;
  applied_at: Date;
}

export interface QueryFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  hasDiscount?: boolean;
  onlyOutOfStock?: boolean;
  withCouponApplied?: boolean;
  includeDeleted?: boolean;
}

export interface SortOptions {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface CouponUsageStats {
  couponId: number;
  code: string;
  totalUses: number;
  maxUses: number;
  remainingUses: number;
  usagePercentage: number;
}
