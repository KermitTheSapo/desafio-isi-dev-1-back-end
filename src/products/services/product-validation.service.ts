import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { ProductCouponApplication } from '../entities/product-coupon-application.entity';

@Injectable()
export class ProductValidationService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectRepository(ProductCouponApplication)
    private readonly applicationRepository: Repository<ProductCouponApplication>
  ) {}

  async validateProductExists(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['couponApplications', 'couponApplications.coupon'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async validateUniqueProductName(
    name: string,
    excludeId?: number
  ): Promise<void> {
    const existingProduct = await this.productRepository.findOne({
      where: { name },
      withDeleted: true,
    });

    if (existingProduct && existingProduct.id !== excludeId) {
      throw new ConflictException('Product name already exists');
    }
  }

  validateNoActiveDiscount(product: Product): void {
    const hasActiveDiscount = product.couponApplications.some(
      app => app.removed_at === null
    );

    if (hasActiveDiscount) {
      throw new ConflictException('Product already has an active discount');
    }
  }

  async validateCouponExists(couponCode: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { code: couponCode.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return coupon;
  }

  validateCouponUsability(coupon: Coupon): void {
    if (!coupon.canBeUsed) {
      throw new BadRequestException('Coupon is not valid or has expired');
    }
  }

  async validateCouponNotAlreadyUsed(
    productId: number,
    couponId: number,
    isOneShot: boolean
  ): Promise<void> {
    if (!isOneShot) return;

    const previousApplication = await this.applicationRepository.findOne({
      where: { product_id: productId, coupon_id: couponId },
    });

    if (previousApplication) {
      throw new ConflictException(
        'This coupon has already been used for this product'
      );
    }
  }

  validateActiveDiscountExists(product: Product): ProductCouponApplication {
    const activeApplication = product.couponApplications.find(
      app => app.removed_at === null
    );

    if (!activeApplication) {
      throw new NotFoundException('No active discount found for this product');
    }

    return activeApplication;
  }
}
