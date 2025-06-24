import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../../src/products/products.service';
import { Product } from '../../src/products/entities/product.entity';
import { Coupon } from '../../src/coupons/entities/coupon.entity';
import { ProductCouponApplication } from '../../src/products/entities/product-coupon-application.entity';
import { ProductQueryBuilderService } from '../../src/products/services/product-query-builder.service';
import { ProductDiscountService } from '../../src/products/services/product-discount.service';
import { ProductValidationService } from '../../src/products/services/product-validation.service';
import { CreateProductDto } from '../../src/products/dto/create-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;
  let couponRepository: Repository<Coupon>;
  let applicationRepository: Repository<ProductCouponApplication>;
  let discountService: ProductDiscountService;
  let validationService: ProductValidationService;

  const mockProduct = {
    id: 1,
    name: 'test product',
    description: 'Test description',
    price: 100,
    stock: 10,
    created_at: new Date(),
    updated_at: new Date(),
    couponApplications: [],
  } as unknown as Product;

  const mockCoupon = {
    id: 1,
    code: 'TEST10',
    type: 'percent',
    value: 10,
    one_shot: false,
    max_uses: 100,
    uses_count: 0,
    valid_from: new Date(),
    valid_until: new Date(Date.now() + 86400000),
    canBeUsed: true,
  } as Coupon;

  const mockRepositoryMethods = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        ProductQueryBuilderService,
        ProductDiscountService,
        ProductValidationService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepositoryMethods,
        },
        {
          provide: getRepositoryToken(Coupon),
          useValue: mockRepositoryMethods,
        },
        {
          provide: getRepositoryToken(ProductCouponApplication),
          useValue: mockRepositoryMethods,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product)
    );
    couponRepository = module.get<Repository<Coupon>>(
      getRepositoryToken(Coupon)
    );
    applicationRepository = module.get<Repository<ProductCouponApplication>>(
      getRepositoryToken(ProductCouponApplication)
    );
    discountService = module.get<ProductDiscountService>(
      ProductDiscountService
    );
    validationService = module.get<ProductValidationService>(
      ProductValidationService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createProductDto: CreateProductDto = {
      name: 'Test Product',
      description: 'Test description',
      price: 100,
      stock: 10,
    };

    it('should create a product successfully', async () => {
      const normalizedName = 'test product';
      jest
        .spyOn(discountService, 'normalizeName')
        .mockReturnValue(normalizedName);
      jest
        .spyOn(validationService, 'validateUniqueProductName')
        .mockResolvedValue();
      jest.spyOn(productRepository, 'create').mockReturnValue(mockProduct);
      jest.spyOn(productRepository, 'save').mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);

      expect(discountService.normalizeName).toHaveBeenCalledWith(
        'Test Product'
      );
      expect(validationService.validateUniqueProductName).toHaveBeenCalledWith(
        normalizedName
      );
      expect(productRepository.create).toHaveBeenCalledWith({
        ...createProductDto,
        name: normalizedName,
      });
      expect(productRepository.save).toHaveBeenCalledWith(mockProduct);
      expect(result).toBe(mockProduct);
    });

    it('should throw ConflictException when product name already exists', async () => {
      const normalizedName = 'test product';
      jest
        .spyOn(discountService, 'normalizeName')
        .mockReturnValue(normalizedName);
      jest
        .spyOn(validationService, 'validateUniqueProductName')
        .mockRejectedValue(
          new ConflictException('Product name already exists')
        );

      await expect(service.create(createProductDto)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe('findOne', () => {
    it('should return a product when found', async () => {
      jest
        .spyOn(validationService, 'validateProductExists')
        .mockResolvedValue(mockProduct);

      const result = await service.findOne(1);

      expect(validationService.validateProductExists).toHaveBeenCalledWith(1);
      expect(result).toBe(mockProduct);
    });

    it('should throw NotFoundException when product not found', async () => {
      jest
        .spyOn(validationService, 'validateProductExists')
        .mockRejectedValue(new NotFoundException('Product not found'));

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('applyCoupon', () => {
    it('should apply coupon successfully', async () => {
      const mockApplication = { id: 1, product_id: 1, coupon_id: 1 };

      jest
        .spyOn(validationService, 'validateProductExists')
        .mockResolvedValue(mockProduct);
      jest
        .spyOn(validationService, 'validateNoActiveDiscount')
        .mockImplementation();
      jest
        .spyOn(validationService, 'validateCouponExists')
        .mockResolvedValue(mockCoupon);
      jest
        .spyOn(validationService, 'validateCouponUsability')
        .mockImplementation();
      jest
        .spyOn(validationService, 'validateCouponNotAlreadyUsed')
        .mockResolvedValue();
      jest.spyOn(discountService, 'calculateFinalPrice').mockReturnValue(90);
      jest.spyOn(discountService, 'validateDiscountPrice').mockImplementation();
      jest
        .spyOn(applicationRepository, 'create')
        .mockReturnValue(mockApplication as any);
      jest
        .spyOn(applicationRepository, 'save')
        .mockResolvedValue(mockApplication as any);
      jest
        .spyOn(couponRepository, 'update')
        .mockResolvedValue(undefined as any);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct);

      const result = await service.applyCoupon(1, 'TEST10');

      expect(validationService.validateProductExists).toHaveBeenCalledWith(1);
      expect(validationService.validateCouponExists).toHaveBeenCalledWith(
        'TEST10'
      );
      expect(discountService.calculateFinalPrice).toHaveBeenCalledWith(
        100,
        mockCoupon
      );
      expect(applicationRepository.save).toHaveBeenCalledWith(mockApplication);
      expect(result).toBe(mockProduct);
    });
  });

  describe('remove', () => {
    it('should soft delete a product', async () => {
      jest
        .spyOn(validationService, 'validateProductExists')
        .mockResolvedValue(mockProduct);
      jest
        .spyOn(productRepository, 'softDelete')
        .mockResolvedValue(undefined as any);

      await service.remove(1);

      expect(validationService.validateProductExists).toHaveBeenCalledWith(1);
      expect(productRepository.softDelete).toHaveBeenCalledWith(1);
    });
  });

  describe('restore', () => {
    it('should restore a soft deleted product', async () => {
      jest
        .spyOn(productRepository, 'restore')
        .mockResolvedValue(undefined as any);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct);

      const result = await service.restore(1);

      expect(productRepository.restore).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toBe(mockProduct);
    });
  });
});
