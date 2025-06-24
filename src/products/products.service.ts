import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { ProductCouponApplication } from './entities/product-coupon-application.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductQueryBuilderService } from './services/product-query-builder.service';
import { ProductDiscountService } from './services/product-discount.service';
import { ProductValidationService } from './services/product-validation.service';
import { PaginatedResponse } from '../common/interfaces/common.interfaces';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectRepository(ProductCouponApplication)
    private readonly applicationRepository: Repository<ProductCouponApplication>,
    private readonly queryBuilderService: ProductQueryBuilderService,
    private readonly discountService: ProductDiscountService,
    private readonly validationService: ProductValidationService
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const normalizedName = this.discountService.normalizeName(
      createProductDto.name
    );

    await this.validationService.validateUniqueProductName(normalizedName);

    const product = this.productRepository.create({
      ...createProductDto,
      name: normalizedName,
    });

    return this.productRepository.save(product);
  }

  async findAll(query: ProductQueryDto): Promise<PaginatedResponse<Product>> {
    const {
      page = 1,
      limit = 10,
      search,
      minPrice,
      maxPrice,
      hasDiscount,
      sortBy = 'created_at',
      sortOrder = 'desc',
      includeDeleted = false,
      onlyOutOfStock = false,
      withCouponApplied = false,
    } = query;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect(
        'product.couponApplications',
        'application',
        'application.removed_at IS NULL'
      )
      .leftJoinAndSelect('application.coupon', 'coupon');

    const filters = {
      search,
      minPrice,
      maxPrice,
      hasDiscount,
      onlyOutOfStock,
      withCouponApplied,
      includeDeleted,
    };
    this.queryBuilderService.applyFilters(queryBuilder, filters);

    this.queryBuilderService.applySorting(queryBuilder, {
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
    });

    this.queryBuilderService.applyPagination(queryBuilder, { page, limit });

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      data: products,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Product> {
    return this.validationService.validateProductExists(id);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    const product = await this.validationService.validateProductExists(id);

    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const normalizedName = this.discountService.normalizeName(
        updateProductDto.name
      );
      await this.validationService.validateUniqueProductName(
        normalizedName,
        id
      );
      updateProductDto.name = normalizedName;
    }

    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.validationService.validateProductExists(id);
    await this.productRepository.softDelete(id);
  }

  async restore(id: number): Promise<Product> {
    await this.productRepository.restore(id);
    return this.findOne(id);
  }
  async applyCoupon(id: number, couponCode: string): Promise<Product> {
    const product = await this.validationService.validateProductExists(id);
    this.validationService.validateNoActiveDiscount(product);

    const coupon =
      await this.validationService.validateCouponExists(couponCode);
    this.validationService.validateCouponUsability(coupon);

    await this.validationService.validateCouponNotAlreadyUsed(
      id,
      coupon.id,
      coupon.one_shot
    );

    const finalPrice = this.discountService.calculateFinalPrice(
      Number(product.price),
      coupon
    );
    this.discountService.validateDiscountPrice(finalPrice);

    const application = this.applicationRepository.create({
      product_id: id,
      coupon_id: coupon.id,
    });
    await this.applicationRepository.save(application);

    await this.couponRepository.update(coupon.id, {
      uses_count: coupon.uses_count + 1,
    });

    return this.findOne(id);
  }

  async removeDiscount(id: number): Promise<void> {
    const product = await this.validationService.validateProductExists(id);
    const activeApplication =
      this.validationService.validateActiveDiscountExists(product);

    await this.applicationRepository.update(activeApplication.id, {
      removed_at: new Date(),
    });
  }

  async applyPercentDiscount(id: number, percentage: number): Promise<Product> {
    this.discountService.validatePercentageDiscount(percentage);

    const product = await this.validationService.validateProductExists(id);
    this.validationService.validateNoActiveDiscount(product);

    const finalPrice = Number(product.price) * (1 - percentage / 100);
    this.discountService.validateDiscountPrice(finalPrice);

    const systemCoupon = this.couponRepository.create({
      code: `SYSTEM_${id}_${Date.now()}`,
      type: 'percent' as any,
      value: percentage,
      one_shot: false,
      max_uses: 1,
      uses_count: 0,
      valid_from: new Date(),
      valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });

    const savedCoupon = await this.couponRepository.save(systemCoupon);

    const application = this.applicationRepository.create({
      product_id: id,
      coupon_id: savedCoupon.id,
    });

    await this.applicationRepository.save(application);

    return this.findOne(id);
  }
}
