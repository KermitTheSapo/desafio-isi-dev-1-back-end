import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CouponsService } from "../../src/coupons/coupons.service";
import { Coupon } from "../../src/coupons/entities/coupon.entity";
import { CreateCouponDto } from "../../src/coupons/dto/create-coupon.dto";
import { UpdateCouponDto } from "../../src/coupons/dto/update-coupon.dto";
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

describe("CouponsService", () => {
  let service: CouponsService;

  const mockCoupon = {
    id: 1,
    code: "TEST10",
    type: "percent",
    value: 10,
    one_shot: false,
    max_uses: 100,
    uses_count: 0,
    valid_from: new Date("2025-01-01"),
    valid_until: new Date("2025-12-31"),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    applications: [],
    isValid: true,
    canBeUsed: true,
  };

  const mockCouponRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponsService,
        {
          provide: getRepositoryToken(Coupon),
          useValue: mockCouponRepository,
        },
      ],
    }).compile();
    service = module.get<CouponsService>(CouponsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a coupon successfully", async () => {
      const createCouponDto: CreateCouponDto = {
        code: "TEST10",
        type: "percent" as any,
        value: 10,
        one_shot: false,
        max_uses: 100,
        valid_from: "2025-01-01T00:00:00.000Z",
        valid_until: "2025-12-31T23:59:59.000Z",
      };

      mockCouponRepository.findOne.mockResolvedValue(null);
      mockCouponRepository.create.mockReturnValue(mockCoupon);
      mockCouponRepository.save.mockResolvedValue(mockCoupon);

      const result = await service.create(createCouponDto);

      expect(mockCouponRepository.findOne).toHaveBeenCalledWith({
        where: { code: "TEST10" },
        withDeleted: true,
      });
      expect(result).toEqual(mockCoupon);
    });

    it("should throw BadRequestException if valid_until is before valid_from", async () => {
      const createCouponDto: CreateCouponDto = {
        code: "TEST10",
        type: "percent" as any,
        value: 10,
        one_shot: false,
        max_uses: 100,
        valid_from: "2025-12-31T00:00:00.000Z",
        valid_until: "2025-01-01T23:59:59.000Z",
      };

      await expect(service.create(createCouponDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it("should throw BadRequestException for reserved codes", async () => {
      const createCouponDto: CreateCouponDto = {
        code: "ADMIN",
        type: "percent" as any,
        value: 10,
        one_shot: false,
        max_uses: 100,
        valid_from: "2025-01-01T00:00:00.000Z",
        valid_until: "2025-12-31T23:59:59.000Z",
      };

      await expect(service.create(createCouponDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it("should throw BadRequestException if validity exceeds 5 years", async () => {
      const createCouponDto: CreateCouponDto = {
        code: "TEST10",
        type: "percent" as any,
        value: 10,
        one_shot: false,
        max_uses: 100,
        valid_from: "2025-01-01T00:00:00.000Z",
        valid_until: "2031-01-01T23:59:59.000Z",
      };

      await expect(service.create(createCouponDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it("should throw ConflictException if coupon code already exists", async () => {
      const createCouponDto: CreateCouponDto = {
        code: "TEST10",
        type: "percent" as any,
        value: 10,
        one_shot: false,
        max_uses: 100,
        valid_from: "2025-01-01T00:00:00.000Z",
        valid_until: "2025-12-31T23:59:59.000Z",
      };

      mockCouponRepository.findOne.mockResolvedValue(mockCoupon);

      await expect(service.create(createCouponDto)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe("findAll", () => {
    it("should return all coupons", async () => {
      mockCouponRepository.find.mockResolvedValue([mockCoupon]);

      const result = await service.findAll();

      expect(mockCouponRepository.find).toHaveBeenCalledWith({
        relations: ["applications", "applications.product"],
        order: { created_at: "DESC" },
      });
      expect(result).toEqual([mockCoupon]);
    });
  });

  describe("findOne", () => {
    it("should return a coupon by id", async () => {
      mockCouponRepository.findOne.mockResolvedValue(mockCoupon);

      const result = await service.findOne(1);

      expect(mockCouponRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ["applications", "applications.product"],
      });
      expect(result).toEqual(mockCoupon);
    });

    it("should throw NotFoundException if coupon not found", async () => {
      mockCouponRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe("findByCode", () => {
    it("should return a coupon by code", async () => {
      mockCouponRepository.findOne.mockResolvedValue(mockCoupon);

      const result = await service.findByCode("TEST10");

      expect(mockCouponRepository.findOne).toHaveBeenCalledWith({
        where: { code: "TEST10" },
        relations: ["applications", "applications.product"],
      });
      expect(result).toEqual(mockCoupon);
    });

    it("should throw NotFoundException if coupon not found by code", async () => {
      mockCouponRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCode("NOTFOUND")).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("update", () => {
    it("should update a coupon successfully", async () => {
      const updateCouponDto: UpdateCouponDto = {
        value: 15,
      };

      mockCouponRepository.findOne.mockResolvedValue(mockCoupon);
      mockCouponRepository.update.mockResolvedValue(undefined);

      const result = await service.update(1, updateCouponDto);

      expect(mockCouponRepository.update).toHaveBeenCalledWith(
        1,
        updateCouponDto
      );
      expect(result).toEqual(mockCoupon);
    });

    it("should validate dates when updating", async () => {
      const updateCouponDto: UpdateCouponDto = {
        valid_until: "2024-01-01T00:00:00.000Z",
      };

      mockCouponRepository.findOne.mockResolvedValue(mockCoupon);

      await expect(service.update(1, updateCouponDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it("should check 5 years limit when updating dates", async () => {
      const updateCouponDto: UpdateCouponDto = {
        valid_until: "2031-01-01T00:00:00.000Z",
      };

      mockCouponRepository.findOne.mockResolvedValue(mockCoupon);

      await expect(service.update(1, updateCouponDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe("remove", () => {
    it("should soft delete a coupon", async () => {
      const couponWithoutActiveApplications = {
        ...mockCoupon,
        applications: [{ removed_at: new Date() }],
      };

      mockCouponRepository.findOne.mockResolvedValue(
        couponWithoutActiveApplications
      );
      mockCouponRepository.softDelete.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockCouponRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it("should throw ConflictException if coupon has active applications", async () => {
      const couponWithActiveApplications = {
        ...mockCoupon,
        applications: [{ removed_at: null }],
      };

      mockCouponRepository.findOne.mockResolvedValue(
        couponWithActiveApplications
      );

      await expect(service.remove(1)).rejects.toThrow(ConflictException);
    });
  });

  describe("restore", () => {
    it("should restore a deleted coupon", async () => {
      mockCouponRepository.restore.mockResolvedValue(undefined);
      mockCouponRepository.findOne.mockResolvedValue(mockCoupon);

      const result = await service.restore(1);

      expect(mockCouponRepository.restore).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCoupon);
    });
  });

  describe("getStats", () => {
    it("should return coupon statistics", async () => {
      const couponWithApplications = {
        ...mockCoupon,
        applications: [
          {
            removed_at: null,
            product: {
              id: 1,
              name: "Product 1",
              price: 100,
            },
            applied_at: new Date(),
          },
          {
            removed_at: new Date(),
            product: {
              id: 2,
              name: "Product 2",
              price: 200,
            },
            applied_at: new Date(),
          },
        ],
      };

      mockCouponRepository.findOne.mockResolvedValue(couponWithApplications);

      const result = await service.getStats(1);

      expect(result).toEqual({
        coupon: {
          id: mockCoupon.id,
          code: mockCoupon.code,
          type: mockCoupon.type,
          value: mockCoupon.value,
          isValid: mockCoupon.isValid,
          canBeUsed: mockCoupon.canBeUsed,
        },
        stats: {
          uses_count: mockCoupon.uses_count,
          max_uses: mockCoupon.max_uses,
          remaining_uses: 100,
          active_applications: 1,
          total_applications: 2,
          products_with_active_discount: [
            {
              id: 1,
              name: "Product 1",
              original_price: 100,
              applied_at: expect.any(Date),
            },
          ],
        },
      });
    });

    it("should handle unlimited use coupons in stats", async () => {
      const unlimitedCoupon = {
        ...mockCoupon,
        max_uses: 0,
        applications: [],
      };

      mockCouponRepository.findOne.mockResolvedValue(unlimitedCoupon);

      const result = await service.getStats(1);

      expect(result.stats.remaining_uses).toBeNull();
    });
  });
});
