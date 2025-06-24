import { validate } from "class-validator";
import { ApplyCouponDto } from "../../../src/products/dto/apply-coupon.dto";

describe("ApplyCouponDto", () => {
  describe("couponCode", () => {
    it("should accept valid coupon codes", async () => {
      const validCodes = [
        "SAVE10",
        "DISCOUNT",
        "TEST",
        "A".repeat(4),
        "A".repeat(20),
        "SUMMER2024",
      ];

      for (const couponCode of validCodes) {
        const dto = new ApplyCouponDto();
        dto.couponCode = couponCode;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });
    it("should reject codes that are too short", async () => {
      const dto = new ApplyCouponDto();
      dto.couponCode = "ABC";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should reject codes that are too long", async () => {
      const dto = new ApplyCouponDto();
      dto.couponCode = "A".repeat(21);

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should reject empty codes", async () => {
      const dto = new ApplyCouponDto();
      dto.couponCode = "";

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it("should reject codes with invalid characters", async () => {
      const invalidCodes = [
        "DISCOUNT@",
        "SAVE#10",
        "TEST$CODE",
        "COUPON%",
        "CODE!",
        "SAVE&MORE",
        "DISCOUNT*",
        "CODE+PLUS",
        "SAVE=MORE",
        "CODE[1]",
        "SAVE{10}",
        "CODE|PIPE",
        "SAVE\\TEST",
        "CODE/SLASH",
        "DISCOUNT<>",
        'CODE"QUOTE',
        "SAVE'QUOTE",
        "CODE;SEMI",
        "SAVE:COLON",
        "CODE?QUESTION",
        "SAVE 10",
        "CODE\tTAB",
        "SAVE\nNEW",
      ];

      for (const couponCode of invalidCodes) {
        const dto = new ApplyCouponDto();
        dto.couponCode = couponCode;

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints?.matches).toBeDefined();
      }
    });
    it("should accept codes with allowed characters", async () => {
      const validCodes = [
        "SAVE10",
        "DISCOUNT",
        "SUMMER2024",
        "CODE123",
        "SAVEMORE",
        "TEST",
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "1234567890",
        "MIX3DC0D3T3ST",
      ];

      for (const couponCode of validCodes) {
        const dto = new ApplyCouponDto();
        dto.couponCode = couponCode;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it("should be required", async () => {
      const dto = new ApplyCouponDto();

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });
  });
});
