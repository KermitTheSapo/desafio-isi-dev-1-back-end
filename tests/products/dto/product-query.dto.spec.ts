import { validate } from "class-validator";
import { ProductQueryDto } from "../../../src/products/dto/product-query.dto";

describe("ProductQueryDto", () => {
  describe("page", () => {
    it("should accept valid page numbers", async () => {
      const validPages = [1, 2, 10, 100];

      for (const page of validPages) {
        const dto = new ProductQueryDto();
        dto.page = page;

        const errors = await validate(dto);
        const pageErrors = errors.filter((error) => error.property === "page");
        expect(pageErrors).toHaveLength(0);
      }
    });

    it("should reject zero page number", async () => {
      const dto = new ProductQueryDto();
      dto.page = 0;

      const errors = await validate(dto);
      const pageErrors = errors.filter((error) => error.property === "page");
      expect(pageErrors.length).toBeGreaterThan(0);
      expect(pageErrors[0].constraints?.min).toBeDefined();
    });

    it("should reject negative page numbers", async () => {
      const dto = new ProductQueryDto();
      dto.page = -1;

      const errors = await validate(dto);
      const pageErrors = errors.filter((error) => error.property === "page");
      expect(pageErrors.length).toBeGreaterThan(0);
      expect(pageErrors[0].constraints?.min).toBeDefined();
    });

    it("should reject non-integer page numbers", async () => {
      const dto = new ProductQueryDto();
      dto.page = 1.5;

      const errors = await validate(dto);
      const pageErrors = errors.filter((error) => error.property === "page");
      expect(pageErrors.length).toBeGreaterThan(0);
      expect(pageErrors[0].constraints?.isInt).toBeDefined();
    });

    it("should be optional and default to 1", async () => {
      const dto = new ProductQueryDto();

      const errors = await validate(dto);
      const pageErrors = errors.filter((error) => error.property === "page");
      expect(pageErrors).toHaveLength(0);
      expect(dto.page).toBe(1);
    });
  });

  describe("limit", () => {
    it("should accept valid limit values", async () => {
      const validLimits = [1, 10, 25, 50];

      for (const limit of validLimits) {
        const dto = new ProductQueryDto();
        dto.limit = limit;

        const errors = await validate(dto);
        const limitErrors = errors.filter(
          (error) => error.property === "limit"
        );
        expect(limitErrors).toHaveLength(0);
      }
    });

    it("should reject zero limit", async () => {
      const dto = new ProductQueryDto();
      dto.limit = 0;

      const errors = await validate(dto);
      const limitErrors = errors.filter((error) => error.property === "limit");
      expect(limitErrors.length).toBeGreaterThan(0);
      expect(limitErrors[0].constraints?.min).toBeDefined();
    });

    it("should reject negative limits", async () => {
      const dto = new ProductQueryDto();
      dto.limit = -1;

      const errors = await validate(dto);
      const limitErrors = errors.filter((error) => error.property === "limit");
      expect(limitErrors.length).toBeGreaterThan(0);
      expect(limitErrors[0].constraints?.min).toBeDefined();
    });
    it("should reject limits above maximum", async () => {
      const dto = new ProductQueryDto();
      dto.limit = 51;

      const errors = await validate(dto);
      const limitErrors = errors.filter((error) => error.property === "limit");
      expect(limitErrors.length).toBeGreaterThan(0);
      expect(limitErrors[0].constraints?.max).toBeDefined();
    });

    it("should reject non-integer limits", async () => {
      const dto = new ProductQueryDto();
      dto.limit = 1.5;

      const errors = await validate(dto);
      const limitErrors = errors.filter((error) => error.property === "limit");
      expect(limitErrors.length).toBeGreaterThan(0);
      expect(limitErrors[0].constraints?.isInt).toBeDefined();
    });

    it("should be optional and default to 10", async () => {
      const dto = new ProductQueryDto();

      const errors = await validate(dto);
      const limitErrors = errors.filter((error) => error.property === "limit");
      expect(limitErrors).toHaveLength(0);
      expect(dto.limit).toBe(10);
    });
  });

  describe("search", () => {
    it("should accept valid search terms", async () => {
      const validSearches = [
        "produto",
        "test product",
        "item-123",
        "produto_especial",
        "A".repeat(50),
      ];

      for (const search of validSearches) {
        const dto = new ProductQueryDto();
        dto.search = search;

        const errors = await validate(dto);
        const searchErrors = errors.filter(
          (error) => error.property === "search"
        );
        expect(searchErrors).toHaveLength(0);
      }
    });

    it("should be optional", async () => {
      const dto = new ProductQueryDto();

      const errors = await validate(dto);
      const searchErrors = errors.filter(
        (error) => error.property === "search"
      );
      expect(searchErrors).toHaveLength(0);
    });
  });

  describe("sortBy", () => {
    it("should accept valid sort fields", async () => {
      const validSortFields = ["name", "price", "stock", "created_at"];

      for (const sortBy of validSortFields) {
        const dto = new ProductQueryDto();
        dto.sortBy = sortBy;

        const errors = await validate(dto);
        const sortErrors = errors.filter(
          (error) => error.property === "sortBy"
        );
        expect(sortErrors).toHaveLength(0);
      }
    });

    it("should reject invalid sort fields", async () => {
      const dto = new ProductQueryDto();
      dto.sortBy = "invalid_field";

      const errors = await validate(dto);
      const sortErrors = errors.filter((error) => error.property === "sortBy");
      expect(sortErrors.length).toBeGreaterThan(0);
      expect(sortErrors[0].constraints?.isIn).toBeDefined();
    });

    it("should be optional and default to created_at", async () => {
      const dto = new ProductQueryDto();

      const errors = await validate(dto);
      const sortErrors = errors.filter((error) => error.property === "sortBy");
      expect(sortErrors).toHaveLength(0);
      expect(dto.sortBy).toBe("created_at");
    });
  });

  describe("sortOrder", () => {
    it("should accept valid sort orders", async () => {
      const validSortOrders = ["asc", "desc"];

      for (const sortOrder of validSortOrders) {
        const dto = new ProductQueryDto();
        dto.sortOrder = sortOrder;

        const errors = await validate(dto);
        const sortOrderErrors = errors.filter(
          (error) => error.property === "sortOrder"
        );
        expect(sortOrderErrors).toHaveLength(0);
      }
    });

    it("should reject invalid sort orders", async () => {
      const dto = new ProductQueryDto();
      dto.sortOrder = "INVALID";

      const errors = await validate(dto);
      const sortOrderErrors = errors.filter(
        (error) => error.property === "sortOrder"
      );
      expect(sortOrderErrors.length).toBeGreaterThan(0);
      expect(sortOrderErrors[0].constraints?.isIn).toBeDefined();
    });

    it("should reject uppercase sort orders", async () => {
      const invalidCases = ["ASC", "DESC", "Asc", "Desc"];

      for (const sortOrder of invalidCases) {
        const dto = new ProductQueryDto();
        dto.sortOrder = sortOrder;

        const errors = await validate(dto);
        const sortOrderErrors = errors.filter(
          (error) => error.property === "sortOrder"
        );
        expect(sortOrderErrors.length).toBeGreaterThan(0);
      }
    });

    it("should be optional and default to desc", async () => {
      const dto = new ProductQueryDto();

      const errors = await validate(dto);
      const sortOrderErrors = errors.filter(
        (error) => error.property === "sortOrder"
      );
      expect(sortOrderErrors).toHaveLength(0);
      expect(dto.sortOrder).toBe("desc");
    });
  });

  describe("hasDiscount", () => {
    it("should accept valid boolean values", async () => {
      const validValues = [true, false];

      for (const hasDiscount of validValues) {
        const dto = new ProductQueryDto();
        dto.hasDiscount = hasDiscount;

        const errors = await validate(dto);
        const discountErrors = errors.filter(
          (error) => error.property === "hasDiscount"
        );
        expect(discountErrors).toHaveLength(0);
      }
    });

    it("should be optional", async () => {
      const dto = new ProductQueryDto();

      const errors = await validate(dto);
      const discountErrors = errors.filter(
        (error) => error.property === "hasDiscount"
      );
      expect(discountErrors).toHaveLength(0);
    });
  });

  describe("includeDeleted", () => {
    it("should accept valid boolean values", async () => {
      const validValues = [true, false];

      for (const includeDeleted of validValues) {
        const dto = new ProductQueryDto();
        dto.includeDeleted = includeDeleted;

        const errors = await validate(dto);
        const deletedErrors = errors.filter(
          (error) => error.property === "includeDeleted"
        );
        expect(deletedErrors).toHaveLength(0);
      }
    });

    it("should be optional and default to false", async () => {
      const dto = new ProductQueryDto();

      const errors = await validate(dto);
      const deletedErrors = errors.filter(
        (error) => error.property === "includeDeleted"
      );
      expect(deletedErrors).toHaveLength(0);
      expect(dto.includeDeleted).toBe(false);
    });
  });

  describe("onlyOutOfStock", () => {
    it("should accept valid boolean values", async () => {
      const validValues = [true, false];

      for (const onlyOutOfStock of validValues) {
        const dto = new ProductQueryDto();
        dto.onlyOutOfStock = onlyOutOfStock;

        const errors = await validate(dto);
        const stockErrors = errors.filter(
          (error) => error.property === "onlyOutOfStock"
        );
        expect(stockErrors).toHaveLength(0);
      }
    });

    it("should be optional and default to false", async () => {
      const dto = new ProductQueryDto();

      const errors = await validate(dto);
      const stockErrors = errors.filter(
        (error) => error.property === "onlyOutOfStock"
      );
      expect(stockErrors).toHaveLength(0);
      expect(dto.onlyOutOfStock).toBe(false);
    });
  });

  describe("withCouponApplied", () => {
    it("should accept valid boolean values", async () => {
      const validValues = [true, false];

      for (const withCouponApplied of validValues) {
        const dto = new ProductQueryDto();
        dto.withCouponApplied = withCouponApplied;

        const errors = await validate(dto);
        const couponErrors = errors.filter(
          (error) => error.property === "withCouponApplied"
        );
        expect(couponErrors).toHaveLength(0);
      }
    });

    it("should be optional and default to false", async () => {
      const dto = new ProductQueryDto();

      const errors = await validate(dto);
      const couponErrors = errors.filter(
        (error) => error.property === "withCouponApplied"
      );
      expect(couponErrors).toHaveLength(0);
      expect(dto.withCouponApplied).toBe(false);
    });
  });

  describe("minPrice", () => {
    it("should accept valid minimum prices", async () => {
      const validPrices = [0, 0.01, 1, 10, 100, 1000];

      for (const minPrice of validPrices) {
        const dto = new ProductQueryDto();
        dto.minPrice = minPrice;

        const errors = await validate(dto);
        const priceErrors = errors.filter(
          (error) => error.property === "minPrice"
        );
        expect(priceErrors).toHaveLength(0);
      }
    });

    it("should reject negative minimum prices", async () => {
      const dto = new ProductQueryDto();
      dto.minPrice = -1;

      const errors = await validate(dto);
      const priceErrors = errors.filter(
        (error) => error.property === "minPrice"
      );
      expect(priceErrors.length).toBeGreaterThan(0);
      expect(priceErrors[0].constraints?.min).toBeDefined();
    });

    it("should be optional", async () => {
      const dto = new ProductQueryDto();

      const errors = await validate(dto);
      const priceErrors = errors.filter(
        (error) => error.property === "minPrice"
      );
      expect(priceErrors).toHaveLength(0);
    });
  });

  describe("maxPrice", () => {
    it("should accept valid maximum prices", async () => {
      const validPrices = [0, 0.01, 1, 10, 100, 1000];

      for (const maxPrice of validPrices) {
        const dto = new ProductQueryDto();
        dto.maxPrice = maxPrice;

        const errors = await validate(dto);
        const priceErrors = errors.filter(
          (error) => error.property === "maxPrice"
        );
        expect(priceErrors).toHaveLength(0);
      }
    });

    it("should reject negative maximum prices", async () => {
      const dto = new ProductQueryDto();
      dto.maxPrice = -1;

      const errors = await validate(dto);
      const priceErrors = errors.filter(
        (error) => error.property === "maxPrice"
      );
      expect(priceErrors.length).toBeGreaterThan(0);
      expect(priceErrors[0].constraints?.min).toBeDefined();
    });

    it("should be optional", async () => {
      const dto = new ProductQueryDto();

      const errors = await validate(dto);
      const priceErrors = errors.filter(
        (error) => error.property === "maxPrice"
      );
      expect(priceErrors).toHaveLength(0);
    });
  });
});
