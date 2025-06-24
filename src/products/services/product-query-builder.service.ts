import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Product } from '../entities/product.entity';
import {
  QueryFilters,
  SortOptions,
  PaginationOptions,
} from '../../common/interfaces/common.interfaces';

@Injectable()
export class ProductQueryBuilderService {
  applyFilters(
    queryBuilder: SelectQueryBuilder<Product>,
    filters: QueryFilters
  ): SelectQueryBuilder<Product> {
    const {
      search,
      minPrice,
      maxPrice,
      onlyOutOfStock,
      withCouponApplied,
      hasDiscount,
      includeDeleted,
    } = filters;

    if (includeDeleted) {
      queryBuilder.withDeleted();
    }

    if (search) {
      queryBuilder.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (onlyOutOfStock) {
      queryBuilder.andWhere('product.stock = 0');
    }

    if (withCouponApplied) {
      queryBuilder.andWhere('application.id IS NOT NULL');
    }

    if (hasDiscount !== undefined) {
      if (hasDiscount) {
        queryBuilder.andWhere('application.id IS NOT NULL');
      } else {
        queryBuilder.andWhere('application.id IS NULL');
      }
    }

    return queryBuilder;
  }

  applySorting(
    queryBuilder: SelectQueryBuilder<Product>,
    sortOptions: SortOptions
  ): SelectQueryBuilder<Product> {
    const { sortBy, sortOrder } = sortOptions;
    const orderDirection = sortOrder.toUpperCase() as 'ASC' | 'DESC';
    return queryBuilder.orderBy(`product.${sortBy}`, orderDirection);
  }

  applyPagination(
    queryBuilder: SelectQueryBuilder<Product>,
    paginationOptions: PaginationOptions
  ): SelectQueryBuilder<Product> {
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;
    return queryBuilder.skip(skip).take(limit);
  }
}
