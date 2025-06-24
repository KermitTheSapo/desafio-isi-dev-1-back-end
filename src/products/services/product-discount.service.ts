import { Injectable, BadRequestException } from '@nestjs/common';
import { Coupon } from '../../coupons/entities/coupon.entity';

@Injectable()
export class ProductDiscountService {
  calculateFinalPrice(originalPrice: number, coupon: Coupon): number {
    if (coupon.type === 'percent') {
      return originalPrice * (1 - coupon.value / 100);
    } else {
      return Math.max(0.01, originalPrice - coupon.value);
    }
  }

  validateDiscountPrice(finalPrice: number): void {
    if (finalPrice < 0.01) {
      throw new BadRequestException(
        'Discount would make product price below minimum (R$ 0.01)'
      );
    }
  }

  validatePercentageDiscount(percentage: number): void {
    if (percentage < 1 || percentage > 80) {
      throw new BadRequestException(
        'Percentage discount must be between 1% and 80%'
      );
    }
  }

  normalizeName(name: string): string {
    return name
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
