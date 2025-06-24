import { Test, TestingModule } from "@nestjs/testing";
import { ProductsController } from "../../src/products/products.controller";
import { ProductsService } from "../../src/products/products.service";
import { CreateProductDto } from "../../src/products/dto/create-product.dto";
import { UpdateProductDto } from "../../src/products/dto/update-product.dto";
import { ProductQueryDto } from "../../src/products/dto/product-query.dto";
import { ApplyCouponDto } from "../../src/products/dto/apply-coupon.dto";
import { ApplyPercentDiscountDto } from "../../src/products/dto/apply-percent-discount.dto";

describe("ProductsController", () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct = {
    id: 1,
    name: "test product",
    description: "Test description",
    price: 100.0,
    stock: 10,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    couponApplications: [],
  };

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
    applyCoupon: jest.fn(),
    removeDiscount: jest.fn(),
    applyPercentDiscount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a product", async () => {
      const createProductDto: CreateProductDto = {
        name: "Test Product",
        description: "Test description",
        price: 100.0,
        stock: 10,
      };

      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(service.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe("findAll", () => {
    it("should return paginated products", async () => {
      const query: ProductQueryDto = {
        page: 1,
        limit: 10,
      };

      const paginatedResult = {
        data: [mockProduct],
        meta: {
          page: 1,
          limit: 10,
          totalItems: 1,
          totalPages: 1,
        },
      };

      mockProductsService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe("findOne", () => {
    it("should return a product by id", async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });
  });

  describe("update", () => {
    it("should update a product", async () => {
      const updateProductDto: UpdateProductDto = {
        price: 150.0,
      };

      mockProductsService.update.mockResolvedValue(mockProduct);

      const result = await controller.update(1, updateProductDto);

      expect(service.update).toHaveBeenCalledWith(1, updateProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe("remove", () => {
    it("should remove a product", async () => {
      mockProductsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });

  describe("restore", () => {
    it("should restore a product", async () => {
      mockProductsService.restore.mockResolvedValue(mockProduct);

      const result = await controller.restore(1);

      expect(service.restore).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });
  });

  describe("applyPercentDiscount", () => {
    it("should apply percent discount", async () => {
      const applyPercentDiscountDto: ApplyPercentDiscountDto = {
        percentage: 20,
      };

      mockProductsService.applyPercentDiscount.mockResolvedValue(mockProduct);

      const result = await controller.applyPercentDiscount(
        1,
        applyPercentDiscountDto
      );

      expect(service.applyPercentDiscount).toHaveBeenCalledWith(1, 20);
      expect(result).toEqual(mockProduct);
    });
  });

  describe("applyCoupon", () => {
    it("should apply coupon to product", async () => {
      const applyCouponDto: ApplyCouponDto = {
        couponCode: "TEST10",
      };

      mockProductsService.applyCoupon.mockResolvedValue(mockProduct);

      const result = await controller.applyCoupon(1, applyCouponDto);

      expect(service.applyCoupon).toHaveBeenCalledWith(1, "TEST10");
      expect(result).toEqual(mockProduct);
    });
  });

  describe("removeDiscount", () => {
    it("should remove discount from product", async () => {
      mockProductsService.removeDiscount.mockResolvedValue(undefined);

      const result = await controller.removeDiscount(1);

      expect(service.removeDiscount).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
