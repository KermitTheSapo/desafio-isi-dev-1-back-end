import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { Coupon } from "../coupons/entities/coupon.entity";
import { ProductCouponApplication } from "./entities/product-coupon-application.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductQueryDto } from "./dto/product-query.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectRepository(ProductCouponApplication)
    private readonly applicationRepository: Repository<ProductCouponApplication>
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const normalizedName = this.normalizeName(createProductDto.name);

    const existingProduct = await this.productRepository.findOne({
      where: { name: normalizedName },
      withDeleted: true,
    });

    if (existingProduct) {
      throw new ConflictException("Product name already exists");
    }

    const product = this.productRepository.create({
      ...createProductDto,
      name: normalizedName,
    });

    return this.productRepository.save(product);
  }

  async findAll(query: ProductQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      minPrice,
      maxPrice,
      hasDiscount,
      sortBy = "created_at",
      sortOrder = "desc",
      includeDeleted = false,
      onlyOutOfStock = false,
      withCouponApplied = false,
    } = query;

    const queryBuilder = this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect(
        "product.couponApplications",
        "application",
        "application.removed_at IS NULL"
      )
      .leftJoinAndSelect("application.coupon", "coupon");

    if (includeDeleted) {
      queryBuilder.withDeleted();
    }

    if (search) {
      queryBuilder.andWhere(
        "(product.name LIKE :search OR product.description LIKE :search)",
        { search: `%${search}%` }
      );
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere("product.price >= :minPrice", { minPrice });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere("product.price <= :maxPrice", { maxPrice });
    }

    if (onlyOutOfStock) {
      queryBuilder.andWhere("product.stock = 0");
    }

    if (withCouponApplied) {
      queryBuilder.andWhere("application.id IS NOT NULL");
    }

    if (hasDiscount !== undefined) {
      if (hasDiscount) {
        queryBuilder.andWhere("application.id IS NOT NULL");
      } else {
        queryBuilder.andWhere("application.id IS NULL");
      }
    }

    const orderDirection = sortOrder.toUpperCase() as "ASC" | "DESC";
    queryBuilder.orderBy(`product.${sortBy}`, orderDirection);

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

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
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ["couponApplications", "couponApplications.coupon"],
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const normalizedName = this.normalizeName(updateProductDto.name);
      const existingProduct = await this.productRepository.findOne({
        where: { name: normalizedName },
        withDeleted: true,
      });

      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException("Product name already exists");
      }

      updateProductDto.name = normalizedName;
    }

    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.productRepository.softDelete(id);
  }

  async restore(id: number): Promise<Product> {
    await this.productRepository.restore(id);
    return this.findOne(id);
  }
  async applyCoupon(id: number, couponCode: string): Promise<Product> {
    const product = await this.findOne(id);

    const hasActiveDiscount = product.couponApplications.some(
      (app) => app.removed_at === null
    );

    if (hasActiveDiscount) {
      throw new ConflictException("Product already has an active discount");
    }

    const coupon = await this.couponRepository.findOne({
      where: { code: couponCode.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundException("Coupon not found");
    }

    if (!coupon.canBeUsed) {
      throw new BadRequestException("Coupon is not valid or has expired");
    }

    if (coupon.one_shot) {
      const previousApplication = await this.applicationRepository.findOne({
        where: { product_id: id, coupon_id: coupon.id },
      });

      if (previousApplication) {
        throw new ConflictException(
          "This coupon has already been used for this product"
        );
      }
    }

    const finalPrice = this.calculateFinalPrice(Number(product.price), coupon);
    if (finalPrice < 0.01) {
      throw new UnprocessableEntityException(
        "Discount would make product price below minimum (R$ 0.01)"
      );
    }

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
    const product = await this.findOne(id);

    const activeApplication = product.couponApplications.find(
      (app) => app.removed_at === null
    );

    if (!activeApplication) {
      throw new NotFoundException("No active discount found for this product");
    }

    await this.applicationRepository.update(activeApplication.id, {
      removed_at: new Date(),
    });
  }

  async applyPercentDiscount(id: number, percentage: number): Promise<Product> {
    if (percentage < 1 || percentage > 80) {
      throw new BadRequestException(
        "Percentage discount must be between 1% and 80%"
      );
    }

    const product = await this.findOne(id);

    const hasActiveDiscount = product.couponApplications.some(
      (app) => app.removed_at === null
    );

    if (hasActiveDiscount) {
      throw new ConflictException("Product already has an active discount");
    }

    const finalPrice = Number(product.price) * (1 - percentage / 100);
    if (finalPrice < 0.01) {
      throw new UnprocessableEntityException(
        "Discount would make product price below minimum (R$ 0.01)"
      );
    }

    const systemCoupon = this.couponRepository.create({
      code: `SYSTEM_${id}_${Date.now()}`,
      type: "percent" as any,
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

  private normalizeName(name: string): string {
    return name
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  private calculateFinalPrice(originalPrice: number, coupon: Coupon): number {
    if (coupon.type === "percent") {
      return originalPrice * (1 - coupon.value / 100);
    } else {
      return Math.max(0.01, originalPrice - coupon.value);
    }
  }
}
