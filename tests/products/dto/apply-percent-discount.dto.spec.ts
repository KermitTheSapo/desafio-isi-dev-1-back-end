import { validate } from "class-validator";
import { ApplyPercentDiscountDto } from "../../../src/products/dto/apply-percent-discount.dto";

describe("ApplyPercentDiscountDto", () => {
  describe("percentage", () => {
    it("should accept valid percentages", async () => {
      const validPercents = [1, 5, 10, 25, 50, 75, 80];

      for (const percentage of validPercents) {
        const dto = new ApplyPercentDiscountDto();
        dto.percentage = percentage;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it("should reject percentages below minimum", async () => {
      const dto = new ApplyPercentDiscountDto();
      dto.percentage = 0;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.min).toBeDefined();
    });

    it("should reject negative percentages", async () => {
      const dto = new ApplyPercentDiscountDto();
      dto.percentage = -1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.min).toBeDefined();
    });

    it("should reject percentages above maximum", async () => {
      const dto = new ApplyPercentDiscountDto();
      dto.percentage = 81;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.max).toBeDefined();
    });

    it("should accept percentages with decimal places", async () => {
      const dto = new ApplyPercentDiscountDto();
      dto.percentage = 10.5;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should accept percentages with 2 decimal places", async () => {
      const dto = new ApplyPercentDiscountDto();
      dto.percentage = 10.25;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should be required", async () => {
      const dto = new ApplyPercentDiscountDto();

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isNumber).toBeDefined();
    });
  });
});
