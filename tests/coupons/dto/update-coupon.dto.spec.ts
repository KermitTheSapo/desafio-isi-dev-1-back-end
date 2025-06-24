import { validate } from "class-validator";
import { UpdateCouponDto } from "../../../src/coupons/dto/update-coupon.dto";
import { CouponType } from "../../../src/coupons/entities/coupon.entity";

describe("UpdateCouponDto", () => {
  describe("type", () => {
    it("should accept valid types", async () => {
      const validTypes = [CouponType.PERCENT, CouponType.FIXED];

      for (const type of validTypes) {
        const dto = new UpdateCouponDto();
        dto.type = type;

        const errors = await validate(dto);
        const typeErrors = errors.filter((error) => error.property === "type");
        expect(typeErrors).toHaveLength(0);
      }
    });

    it("should reject invalid types", async () => {
      const dto = new UpdateCouponDto();
      dto.type = "invalid" as any;

      const errors = await validate(dto);
      const typeErrors = errors.filter((error) => error.property === "type");
      expect(typeErrors.length).toBeGreaterThan(0);
      expect(typeErrors[0].constraints?.isEnum).toBeDefined();
    });

    it("should be optional", async () => {
      const dto = new UpdateCouponDto();

      const errors = await validate(dto);
      const typeErrors = errors.filter((error) => error.property === "type");
      expect(typeErrors).toHaveLength(0);
    });
  });
  describe("value", () => {
    it("should accept valid percentage values", async () => {
      const validValues = [1, 10, 25, 50, 80];

      for (const value of validValues) {
        const dto = new UpdateCouponDto();
        dto.type = CouponType.PERCENT;
        dto.value = value;

        const errors = await validate(dto);
        const valueErrors = errors.filter(
          (error) => error.property === "value"
        );
        expect(valueErrors).toHaveLength(0);
      }
    });

    it("should accept valid fixed values", async () => {
      const validValues = [0.01, 1, 10, 100, 1000];

      for (const value of validValues) {
        const dto = new UpdateCouponDto();
        dto.type = CouponType.FIXED;
        dto.value = value;

        const errors = await validate(dto);
        const valueErrors = errors.filter(
          (error) => error.property === "value"
        );
        expect(valueErrors).toHaveLength(0);
      }
    });

    it("should accept valid values for either type", async () => {
      const dto = new UpdateCouponDto();
      dto.type = CouponType.PERCENT;
      dto.value = 50;

      const errors = await validate(dto);
      const valueErrors = errors.filter((error) => error.property === "value");
      expect(valueErrors).toHaveLength(0);
    });

    it("should be optional", async () => {
      const dto = new UpdateCouponDto();

      const errors = await validate(dto);
      const valueErrors = errors.filter((error) => error.property === "value");
      expect(valueErrors).toHaveLength(0);
    });
  });

  describe("valid_from", () => {
    it("should accept valid date strings", async () => {
      const dto = new UpdateCouponDto();
      dto.valid_from = new Date().toISOString();

      const errors = await validate(dto);
      const dateErrors = errors.filter(
        (error) => error.property === "valid_from"
      );
      expect(dateErrors).toHaveLength(0);
    });

    it("should reject invalid date strings", async () => {
      const dto = new UpdateCouponDto();
      dto.valid_from = "invalid-date";

      const errors = await validate(dto);
      const dateErrors = errors.filter(
        (error) => error.property === "valid_from"
      );
      expect(dateErrors.length).toBeGreaterThan(0);
      expect(dateErrors[0].constraints?.isDateString).toBeDefined();
    });

    it("should be optional", async () => {
      const dto = new UpdateCouponDto();

      const errors = await validate(dto);
      const dateErrors = errors.filter(
        (error) => error.property === "valid_from"
      );
      expect(dateErrors).toHaveLength(0);
    });
  });

  describe("valid_until", () => {
    it("should accept valid date strings", async () => {
      const dto = new UpdateCouponDto();
      dto.valid_until = new Date(Date.now() + 86400000).toISOString();

      const errors = await validate(dto);
      const dateErrors = errors.filter(
        (error) => error.property === "valid_until"
      );
      expect(dateErrors).toHaveLength(0);
    });

    it("should reject invalid date strings", async () => {
      const dto = new UpdateCouponDto();
      dto.valid_until = "invalid-date";

      const errors = await validate(dto);
      const dateErrors = errors.filter(
        (error) => error.property === "valid_until"
      );
      expect(dateErrors.length).toBeGreaterThan(0);
      expect(dateErrors[0].constraints?.isDateString).toBeDefined();
    });

    it("should be optional", async () => {
      const dto = new UpdateCouponDto();

      const errors = await validate(dto);
      const dateErrors = errors.filter(
        (error) => error.property === "valid_until"
      );
      expect(dateErrors).toHaveLength(0);
    });
  });

  describe("one_shot", () => {
    it("should accept valid boolean values", async () => {
      const validValues = [true, false];

      for (const one_shot of validValues) {
        const dto = new UpdateCouponDto();
        dto.one_shot = one_shot;

        const errors = await validate(dto);
        const oneShotErrors = errors.filter(
          (error) => error.property === "one_shot"
        );
        expect(oneShotErrors).toHaveLength(0);
      }
    });

    it("should be optional", async () => {
      const dto = new UpdateCouponDto();

      const errors = await validate(dto);
      const oneShotErrors = errors.filter(
        (error) => error.property === "one_shot"
      );
      expect(oneShotErrors).toHaveLength(0);
    });
  });

  describe("max_uses", () => {
    it("should accept valid usage limits", async () => {
      const validLimits = [0, 1, 10, 100, 1000];

      for (const max_uses of validLimits) {
        const dto = new UpdateCouponDto();
        dto.max_uses = max_uses;

        const errors = await validate(dto);
        const limitErrors = errors.filter(
          (error) => error.property === "max_uses"
        );
        expect(limitErrors).toHaveLength(0);
      }
    });

    it("should reject negative usage limits", async () => {
      const dto = new UpdateCouponDto();
      dto.max_uses = -1;

      const errors = await validate(dto);
      const limitErrors = errors.filter(
        (error) => error.property === "max_uses"
      );
      expect(limitErrors.length).toBeGreaterThan(0);
      expect(limitErrors[0].constraints?.min).toBeDefined();
    });

    it("should reject non-integer usage limits", async () => {
      const dto = new UpdateCouponDto();
      dto.max_uses = 1.5;

      const errors = await validate(dto);
      const limitErrors = errors.filter(
        (error) => error.property === "max_uses"
      );
      expect(limitErrors.length).toBeGreaterThan(0);
      expect(limitErrors[0].constraints?.isInt).toBeDefined();
    });

    it("should be optional", async () => {
      const dto = new UpdateCouponDto();

      const errors = await validate(dto);
      const limitErrors = errors.filter(
        (error) => error.property === "max_uses"
      );
      expect(limitErrors).toHaveLength(0);
    });
  });
});
