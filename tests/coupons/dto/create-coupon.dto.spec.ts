import { validate } from "class-validator";
import { CreateCouponDto } from "../../../src/coupons/dto/create-coupon.dto";
import { CouponType } from "../../../src/coupons/entities/coupon.entity";

describe("CreateCouponDto", () => {
  describe("code", () => {
    it("should accept valid coupon codes", async () => {
      const validCodes = [
        "SAVE10",
        "DISCOUNT",
        "TEST",
        "A".repeat(4),
        "A".repeat(20),
        "SUMMER2024",
        "CODE123",
        "SAVEMORE",
        "MIX3DC0D3T3ST",
      ];

      for (const code of validCodes) {
        const dto = new CreateCouponDto();
        dto.code = code;
        dto.type = CouponType.PERCENT;
        dto.value = 10;
        dto.valid_from = new Date().toISOString();
        dto.valid_until = new Date(Date.now() + 86400000).toISOString();

        const errors = await validate(dto);
        const codeErrors = errors.filter((error) => error.property === "code");
        expect(codeErrors).toHaveLength(0);
      }
    });

    it("should reject codes that are too short", async () => {
      const dto = new CreateCouponDto();
      dto.code = "ABC";
      dto.type = CouponType.PERCENT;
      dto.value = 10;
      dto.valid_from = new Date().toISOString();
      dto.valid_until = new Date(Date.now() + 86400000).toISOString();

      const errors = await validate(dto);
      const codeErrors = errors.filter((error) => error.property === "code");
      expect(codeErrors.length).toBeGreaterThan(0);
      expect(codeErrors[0].constraints?.isLength).toBeDefined();
    });

    it("should reject codes that are too long", async () => {
      const dto = new CreateCouponDto();
      dto.code = "A".repeat(21);
      dto.type = CouponType.PERCENT;
      dto.value = 10;
      dto.valid_from = new Date().toISOString();
      dto.valid_until = new Date(Date.now() + 86400000).toISOString();

      const errors = await validate(dto);
      const codeErrors = errors.filter((error) => error.property === "code");
      expect(codeErrors.length).toBeGreaterThan(0);
      expect(codeErrors[0].constraints?.isLength).toBeDefined();
    });

    it("should reject codes with invalid characters", async () => {
      const invalidCodes = [
        "discount@",
        "save#10",
        "test$code",
        "coupon%",
        "code!",
        "save_10",
        "save-10",
        "save 10",
        "code.test",
        "code,test",
      ];

      for (const code of invalidCodes) {
        const dto = new CreateCouponDto();
        dto.code = code;
        dto.type = CouponType.PERCENT;
        dto.value = 10;
        dto.valid_from = new Date().toISOString();
        dto.valid_until = new Date(Date.now() + 86400000).toISOString();

        const errors = await validate(dto);
        const codeErrors = errors.filter((error) => error.property === "code");
        expect(codeErrors.length).toBeGreaterThan(0);
        expect(codeErrors[0].constraints?.matches).toBeDefined();
      }
    });

    it("should be required", async () => {
      const dto = new CreateCouponDto();
      dto.type = CouponType.PERCENT;
      dto.value = 10;
      dto.valid_from = new Date().toISOString();
      dto.valid_until = new Date(Date.now() + 86400000).toISOString();

      const errors = await validate(dto);
      const codeErrors = errors.filter((error) => error.property === "code");
      expect(codeErrors.length).toBeGreaterThan(0);
      expect(codeErrors[0].constraints?.isNotEmpty).toBeDefined();
    });
  });

  describe("type", () => {
    it("should accept valid types", async () => {
      const validTypes = [CouponType.PERCENT, CouponType.FIXED];

      for (const type of validTypes) {
        const dto = new CreateCouponDto();
        dto.code = "TEST1234";
        dto.type = type;
        dto.value = 10;
        dto.valid_from = new Date().toISOString();
        dto.valid_until = new Date(Date.now() + 86400000).toISOString();

        const errors = await validate(dto);
        const typeErrors = errors.filter((error) => error.property === "type");
        expect(typeErrors).toHaveLength(0);
      }
    });

    it("should reject invalid types", async () => {
      const dto = new CreateCouponDto();
      dto.code = "TEST1234";
      dto.type = "invalid" as any;
      dto.value = 10;
      dto.valid_from = new Date().toISOString();
      dto.valid_until = new Date(Date.now() + 86400000).toISOString();

      const errors = await validate(dto);
      const typeErrors = errors.filter((error) => error.property === "type");
      expect(typeErrors.length).toBeGreaterThan(0);
      expect(typeErrors[0].constraints?.isEnum).toBeDefined();
    });

    it("should be required", async () => {
      const dto = new CreateCouponDto();
      dto.code = "TEST1234";
      dto.value = 10;
      dto.valid_from = new Date().toISOString();
      dto.valid_until = new Date(Date.now() + 86400000).toISOString();

      const errors = await validate(dto);
      const typeErrors = errors.filter((error) => error.property === "type");
      expect(typeErrors.length).toBeGreaterThan(0);
      expect(typeErrors[0].constraints?.isEnum).toBeDefined();
    });
  });
  describe("value", () => {
    it("should accept valid percentage values", async () => {
      const validValues = [1, 10, 25, 50, 80];

      for (const value of validValues) {
        const dto = new CreateCouponDto();
        dto.code = "TEST1234";
        dto.type = CouponType.PERCENT;
        dto.value = value;
        dto.valid_from = new Date().toISOString();
        dto.valid_until = new Date(Date.now() + 86400000).toISOString();

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
        const dto = new CreateCouponDto();
        dto.code = "TEST1234";
        dto.type = CouponType.FIXED;
        dto.value = value;
        dto.valid_from = new Date().toISOString();
        dto.valid_until = new Date(Date.now() + 86400000).toISOString();

        const errors = await validate(dto);
        const valueErrors = errors.filter(
          (error) => error.property === "value"
        );
        expect(valueErrors).toHaveLength(0);
      }
    });

    it("should accept valid values for either type", async () => {
      const dto = new CreateCouponDto();
      dto.code = "TEST1234";
      dto.type = CouponType.PERCENT;
      dto.value = 50;
      dto.valid_from = new Date().toISOString();
      dto.valid_until = new Date(Date.now() + 86400000).toISOString();

      const errors = await validate(dto);
      const valueErrors = errors.filter((error) => error.property === "value");
      expect(valueErrors).toHaveLength(0);
    });
  });

  describe("valid_from", () => {
    it("should accept valid date strings", async () => {
      const dto = new CreateCouponDto();
      dto.code = "TEST1234";
      dto.type = CouponType.PERCENT;
      dto.value = 10;
      dto.valid_from = new Date().toISOString();
      dto.valid_until = new Date(Date.now() + 86400000).toISOString();

      const errors = await validate(dto);
      const dateErrors = errors.filter(
        (error) => error.property === "valid_from"
      );
      expect(dateErrors).toHaveLength(0);
    });

    it("should reject invalid date strings", async () => {
      const dto = new CreateCouponDto();
      dto.code = "TEST1234";
      dto.type = CouponType.PERCENT;
      dto.value = 10;
      dto.valid_from = "invalid-date";
      dto.valid_until = new Date(Date.now() + 86400000).toISOString();

      const errors = await validate(dto);
      const dateErrors = errors.filter(
        (error) => error.property === "valid_from"
      );
      expect(dateErrors.length).toBeGreaterThan(0);
      expect(dateErrors[0].constraints?.isDateString).toBeDefined();
    });

    it("should be required", async () => {
      const dto = new CreateCouponDto();
      dto.code = "TEST1234";
      dto.type = CouponType.PERCENT;
      dto.value = 10;
      dto.valid_until = new Date(Date.now() + 86400000).toISOString();

      const errors = await validate(dto);
      const dateErrors = errors.filter(
        (error) => error.property === "valid_from"
      );
      expect(dateErrors.length).toBeGreaterThan(0);
      expect(dateErrors[0].constraints?.isDateString).toBeDefined();
    });
  });

  describe("valid_until", () => {
    it("should accept valid date strings", async () => {
      const dto = new CreateCouponDto();
      dto.code = "TEST1234";
      dto.type = CouponType.PERCENT;
      dto.value = 10;
      dto.valid_from = new Date().toISOString();
      dto.valid_until = new Date(Date.now() + 86400000).toISOString();

      const errors = await validate(dto);
      const dateErrors = errors.filter(
        (error) => error.property === "valid_until"
      );
      expect(dateErrors).toHaveLength(0);
    });

    it("should reject invalid date strings", async () => {
      const dto = new CreateCouponDto();
      dto.code = "TEST1234";
      dto.type = CouponType.PERCENT;
      dto.value = 10;
      dto.valid_from = new Date().toISOString();
      dto.valid_until = "invalid-date";

      const errors = await validate(dto);
      const dateErrors = errors.filter(
        (error) => error.property === "valid_until"
      );
      expect(dateErrors.length).toBeGreaterThan(0);
      expect(dateErrors[0].constraints?.isDateString).toBeDefined();
    });

    it("should be required", async () => {
      const dto = new CreateCouponDto();
      dto.code = "TEST1234";
      dto.type = CouponType.PERCENT;
      dto.value = 10;
      dto.valid_from = new Date().toISOString();

      const errors = await validate(dto);
      const dateErrors = errors.filter(
        (error) => error.property === "valid_until"
      );
      expect(dateErrors.length).toBeGreaterThan(0);
      expect(dateErrors[0].constraints?.isDateString).toBeDefined();
    });
  });

  describe("one_shot", () => {
    it("should accept valid boolean values", async () => {
      const validValues = [true, false];

      for (const one_shot of validValues) {
        const dto = new CreateCouponDto();
        dto.code = "TEST1234";
        dto.type = CouponType.PERCENT;
        dto.value = 10;
        dto.valid_from = new Date().toISOString();
        dto.valid_until = new Date(Date.now() + 86400000).toISOString();
        dto.one_shot = one_shot;

        const errors = await validate(dto);
        const oneShotErrors = errors.filter(
          (error) => error.property === "one_shot"
        );
        expect(oneShotErrors).toHaveLength(0);
      }
    });

    it("should be optional", async () => {
      const dto = new CreateCouponDto();
      dto.code = "TEST1234";
      dto.type = CouponType.PERCENT;
      dto.value = 10;
      dto.valid_from = new Date().toISOString();
      dto.valid_until = new Date(Date.now() + 86400000).toISOString();

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
        const dto = new CreateCouponDto();
        dto.code = "TEST1234";
        dto.type = CouponType.PERCENT;
        dto.value = 10;
        dto.valid_from = new Date().toISOString();
        dto.valid_until = new Date(Date.now() + 86400000).toISOString();
        dto.max_uses = max_uses;

        const errors = await validate(dto);
        const limitErrors = errors.filter(
          (error) => error.property === "max_uses"
        );
        expect(limitErrors).toHaveLength(0);
      }
    });

    it("should reject negative usage limits", async () => {
      const dto = new CreateCouponDto();
      dto.code = "TEST1234";
      dto.type = CouponType.PERCENT;
      dto.value = 10;
      dto.valid_from = new Date().toISOString();
      dto.valid_until = new Date(Date.now() + 86400000).toISOString();
      dto.max_uses = -1;

      const errors = await validate(dto);
      const limitErrors = errors.filter(
        (error) => error.property === "max_uses"
      );
      expect(limitErrors.length).toBeGreaterThan(0);
      expect(limitErrors[0].constraints?.min).toBeDefined();
    });

    it("should reject non-integer usage limits", async () => {
      const dto = new CreateCouponDto();
      dto.code = "TEST1234";
      dto.type = CouponType.PERCENT;
      dto.value = 10;
      dto.valid_from = new Date().toISOString();
      dto.valid_until = new Date(Date.now() + 86400000).toISOString();
      dto.max_uses = 1.5;

      const errors = await validate(dto);
      const limitErrors = errors.filter(
        (error) => error.property === "max_uses"
      );
      expect(limitErrors.length).toBeGreaterThan(0);
      expect(limitErrors[0].constraints?.isInt).toBeDefined();
    });

    it("should be optional", async () => {
      const dto = new CreateCouponDto();
      dto.code = "TEST1234";
      dto.type = CouponType.PERCENT;
      dto.value = 10;
      dto.valid_from = new Date().toISOString();
      dto.valid_until = new Date(Date.now() + 86400000).toISOString();

      const errors = await validate(dto);
      const limitErrors = errors.filter(
        (error) => error.property === "max_uses"
      );
      expect(limitErrors).toHaveLength(0);
    });
  });
});
