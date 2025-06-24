import {
  Coupon,
  CouponType,
} from "../../../src/coupons/entities/coupon.entity";

describe("Coupon Entity", () => {
  let coupon: Coupon;

  beforeEach(() => {
    coupon = new Coupon();
    coupon.id = 1;
    coupon.code = "TEST10";
    coupon.type = CouponType.PERCENT;
    coupon.value = 10;
    coupon.one_shot = false;
    coupon.max_uses = 100;
    coupon.uses_count = 0;
    coupon.valid_from = new Date("2025-01-01");
    coupon.valid_until = new Date("2025-12-31");
    coupon.created_at = new Date();
    coupon.updated_at = new Date();
    coupon.applications = [];
  });

  describe("isValid getter", () => {
    it("should return true when current date is within validity period", () => {
      const now = new Date("2025-06-15");
      jest.spyOn(global, "Date").mockImplementation(() => now as any);

      expect(coupon.isValid).toBe(true);

      jest.restoreAllMocks();
    });

    it("should return false when current date is before valid_from", () => {
      const now = new Date("2024-12-31");
      jest.spyOn(global, "Date").mockImplementation(() => now as any);

      expect(coupon.isValid).toBe(false);

      jest.restoreAllMocks();
    });

    it("should return false when current date is after valid_until", () => {
      const now = new Date("2026-01-01");
      jest.spyOn(global, "Date").mockImplementation(() => now as any);

      expect(coupon.isValid).toBe(false);

      jest.restoreAllMocks();
    });
  });

  describe("canBeUsed getter", () => {
    beforeEach(() => {
      const now = new Date("2025-06-15");
      jest.spyOn(global, "Date").mockImplementation(() => now as any);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return true when coupon is valid and not reached max uses", () => {
      coupon.max_uses = 100;
      coupon.uses_count = 50;

      expect(coupon.canBeUsed).toBe(true);
    });

    it("should return false when max uses reached", () => {
      coupon.max_uses = 100;
      coupon.uses_count = 100;

      expect(coupon.canBeUsed).toBe(false);
    });

    it("should return true when max_uses is 0 (unlimited)", () => {
      coupon.max_uses = 0;
      coupon.uses_count = 1000;

      expect(coupon.canBeUsed).toBe(true);
    });

    it("should return false when uses exceed max_uses", () => {
      coupon.max_uses = 100;
      coupon.uses_count = 101;

      expect(coupon.canBeUsed).toBe(false);
    });
  });

  describe("CouponType enum", () => {
    it("should have correct values", () => {
      expect(CouponType.PERCENT).toBe("percent");
      expect(CouponType.FIXED).toBe("fixed");
    });
  });
});
