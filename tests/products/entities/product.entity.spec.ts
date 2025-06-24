import { Product } from "../../../src/products/entities/product.entity";

describe("Product Entity", () => {
  let product: Product;

  beforeEach(() => {
    product = new Product();
    product.id = 1;
    product.name = "test product";
    product.description = "Test description";
    product.price = 100;
    product.stock = 10;
    product.created_at = new Date();
    product.updated_at = new Date();
    product.couponApplications = [];
  });

  describe("is_out_of_stock getter", () => {
    it("should return true when stock is 0", () => {
      product.stock = 0;
      expect(product.is_out_of_stock).toBe(true);
    });

    it("should return false when stock is greater than 0", () => {
      product.stock = 5;
      expect(product.is_out_of_stock).toBe(false);
    });
  });

  describe("finalPrice getter", () => {
    it("should return original price when no discount is applied", () => {
      product.couponApplications = [];
      expect(product.finalPrice).toBe(100);
    });

    it("should return discounted price for percent coupon", () => {
      product.couponApplications = [
        {
          removed_at: null,
          coupon: {
            type: "percent",
            value: 10,
          },
        } as any,
      ];

      expect(product.finalPrice).toBe(90);
    });

    it("should return discounted price for fixed coupon", () => {
      product.couponApplications = [
        {
          removed_at: null,
          coupon: {
            type: "fixed",
            value: 20,
          },
        } as any,
      ];

      expect(product.finalPrice).toBe(80);
    });

    it("should return minimum price of 0.01 for fixed coupon", () => {
      product.price = 5;
      product.couponApplications = [
        {
          removed_at: null,
          coupon: {
            type: "fixed",
            value: 10,
          },
        } as any,
      ];

      expect(product.finalPrice).toBe(0.01);
    });

    it("should ignore removed discounts", () => {
      product.couponApplications = [
        {
          removed_at: new Date(),
          coupon: {
            type: "percent",
            value: 10,
          },
        } as any,
      ];

      expect(product.finalPrice).toBe(100);
    });
  });

  describe("discount getter", () => {
    it("should return null when no discount is applied", () => {
      product.couponApplications = [];
      expect(product.discount).toBeNull();
    });

    it("should return discount details when discount is applied", () => {
      const appliedAt = new Date();
      product.couponApplications = [
        {
          removed_at: null,
          applied_at: appliedAt,
          coupon: {
            type: "percent",
            value: 10,
          },
        } as any,
      ];

      expect(product.discount).toEqual({
        type: "percent",
        value: 10,
        applied_at: appliedAt,
      });
    });

    it("should return null when discount is removed", () => {
      product.couponApplications = [
        {
          removed_at: new Date(),
          coupon: {
            type: "percent",
            value: 10,
          },
        } as any,
      ];

      expect(product.discount).toBeNull();
    });
  });

  describe("hasCouponApplied getter", () => {
    it("should return false when no coupon is applied", () => {
      product.couponApplications = [];
      expect(product.hasCouponApplied).toBe(false);
    });

    it("should return true when active coupon is applied", () => {
      product.couponApplications = [
        {
          removed_at: null,
        } as any,
      ];

      expect(product.hasCouponApplied).toBe(true);
    });

    it("should return false when coupon is removed", () => {
      product.couponApplications = [
        {
          removed_at: new Date(),
        } as any,
      ];

      expect(product.hasCouponApplied).toBe(false);
    });

    it("should handle undefined couponApplications", () => {
      product.couponApplications = undefined as any;
      expect(product.hasCouponApplied).toBe(false);
    });
  });
});
