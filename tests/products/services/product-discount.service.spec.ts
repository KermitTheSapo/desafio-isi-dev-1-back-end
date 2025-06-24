import { Test, TestingModule } from '@nestjs/testing';
import { ProductDiscountService } from '../../../src/products/services/product-discount.service';
import { BadRequestException } from '@nestjs/common';
import {
  Coupon,
  CouponType,
} from '../../../src/coupons/entities/coupon.entity';

describe('ProductDiscountService', () => {
  let service: ProductDiscountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductDiscountService],
    }).compile();

    service = module.get<ProductDiscountService>(ProductDiscountService);
  });

  describe('calculateFinalPrice', () => {
    it('should calculate percentage discount correctly', () => {
      const coupon = {
        type: CouponType.PERCENT,
        value: 10,
      } as Coupon;

      const result = service.calculateFinalPrice(100, coupon);
      expect(result).toBe(90);
    });

    it('should calculate fixed discount correctly', () => {
      const coupon = {
        type: CouponType.FIXED,
        value: 20,
      } as Coupon;

      const result = service.calculateFinalPrice(100, coupon);
      expect(result).toBe(80);
    });

    it('should respect minimum price of 0.01 for fixed discount', () => {
      const coupon = {
        type: CouponType.FIXED,
        value: 150,
      } as Coupon;

      const result = service.calculateFinalPrice(100, coupon);
      expect(result).toBe(0.01);
    });
  });

  describe('validateDiscountPrice', () => {
    it('should not throw error for valid price', () => {
      expect(() => service.validateDiscountPrice(50)).not.toThrow();
    });

    it('should throw error for price below minimum', () => {
      expect(() => service.validateDiscountPrice(0.005)).toThrow(
        BadRequestException
      );
    });
  });

  describe('validatePercentageDiscount', () => {
    it('should not throw error for valid percentage', () => {
      expect(() => service.validatePercentageDiscount(10)).not.toThrow();
    });

    it('should throw error for percentage below 1', () => {
      expect(() => service.validatePercentageDiscount(0)).toThrow(
        BadRequestException
      );
    });

    it('should throw error for percentage above 80', () => {
      expect(() => service.validatePercentageDiscount(85)).toThrow(
        BadRequestException
      );
    });
  });

  describe('normalizeName', () => {
    it('should remove accents', () => {
      const result = service.normalizeName('Açúcar Cristal');
      expect(result).toBe('acucar cristal');
    });

    it('should handle special characters', () => {
      const result = service.normalizeName('Café São Paulo');
      expect(result).toBe('cafe sao paulo');
    });
  });
});
