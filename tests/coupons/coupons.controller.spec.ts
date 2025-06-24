import { Test, TestingModule } from "@nestjs/testing";
import { CouponsController } from "../../src/coupons/coupons.controller";
import { CouponsService } from "../../src/coupons/coupons.service";
import { CreateCouponDto } from "../../src/coupons/dto/create-coupon.dto";
import { UpdateCouponDto } from "../../src/coupons/dto/update-coupon.dto";

describe("CouponsController", () => {
  let controller: CouponsController;
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

  const mockCouponsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCode: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
    getStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponsController],
      providers: [
        {
          provide: CouponsService,
          useValue: mockCouponsService,
        },
      ],
    }).compile();

    controller = module.get<CouponsController>(CouponsController);
    service = module.get<CouponsService>(CouponsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a coupon", async () => {
      const createCouponDto: CreateCouponDto = {
        code: "TEST10",
        type: "percent" as any,
        value: 10,
        one_shot: false,
        max_uses: 100,
        valid_from: "2025-01-01T00:00:00.000Z",
        valid_until: "2025-12-31T23:59:59.000Z",
      };

      mockCouponsService.create.mockResolvedValue(mockCoupon);

      const result = await controller.create(createCouponDto);

      expect(service.create).toHaveBeenCalledWith(createCouponDto);
      expect(result).toEqual(mockCoupon);
    });
  });

  describe("findAll", () => {
    it("should return all coupons", async () => {
      mockCouponsService.findAll.mockResolvedValue([mockCoupon]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockCoupon]);
    });
  });

  describe("findOne", () => {
    it("should return a coupon by id", async () => {
      mockCouponsService.findOne.mockResolvedValue(mockCoupon);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCoupon);
    });
  });

  describe("findByCode", () => {
    it("should return a coupon by code", async () => {
      mockCouponsService.findByCode.mockResolvedValue(mockCoupon);

      const result = await controller.findByCode("TEST10");

      expect(service.findByCode).toHaveBeenCalledWith("TEST10");
      expect(result).toEqual(mockCoupon);
    });
  });

  describe("getStats", () => {
    it("should return coupon statistics", async () => {
      const mockStats = {
        coupon: {
          id: 1,
          code: "TEST10",
          type: "percent",
          value: 10,
          isValid: true,
          canBeUsed: true,
        },
        stats: {
          uses_count: 0,
          max_uses: 100,
          remaining_uses: 100,
          active_applications: 0,
          total_applications: 0,
          products_with_active_discount: [],
        },
      };

      mockCouponsService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats(1);

      expect(service.getStats).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockStats);
    });
  });

  describe("update", () => {
    it("should update a coupon", async () => {
      const updateCouponDto: UpdateCouponDto = {
        value: 15,
      };

      mockCouponsService.update.mockResolvedValue(mockCoupon);

      const result = await controller.update(1, updateCouponDto);

      expect(service.update).toHaveBeenCalledWith(1, updateCouponDto);
      expect(result).toEqual(mockCoupon);
    });
  });

  describe("remove", () => {
    it("should remove a coupon", async () => {
      mockCouponsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });

  describe("restore", () => {
    it("should restore a coupon", async () => {
      mockCouponsService.restore.mockResolvedValue(mockCoupon);

      const result = await controller.restore(1);

      expect(service.restore).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCoupon);
    });
  });
});
