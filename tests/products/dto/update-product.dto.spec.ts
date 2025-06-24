import { validate } from "class-validator";
import { UpdateProductDto } from "../../../src/products/dto/update-product.dto";

describe("UpdateProductDto", () => {
  describe("name", () => {
    it("should accept valid product names", async () => {
      const validNames = [
        "Produto Teste",
        "Produto123",
        "Item-Premium",
        "Produto_Especial",
        "Item 1, 2, 3",
        "Produto-123_Test",
        "ABC",
        "A".repeat(100),
      ];

      for (const name of validNames) {
        const dto = new UpdateProductDto();
        dto.name = name;

        const errors = await validate(dto);
        const nameErrors = errors.filter((error) => error.property === "name");
        expect(nameErrors).toHaveLength(0);
      }
    });

    it("should reject names with invalid characters", async () => {
      const invalidNames = [
        "Produto@Test",
        "Item#Special",
        "Produto$Premium",
        "Test%Product",
        "Product!",
        "Item&Co",
        "Produto*Star",
        "Test+Plus",
        "Product=Equal",
        "Test[bracket]",
        "Product{brace}",
        "Test|pipe",
        "Product\\backslash",
        "Test/slash",
        "Product<>",
        'Test"quote"',
        "Product'apostrophe",
        "Test;semicolon",
        "Product:colon",
        "Test?question",
      ];

      for (const name of invalidNames) {
        const dto = new UpdateProductDto();
        dto.name = name;

        const errors = await validate(dto);
        const nameErrors = errors.filter((error) => error.property === "name");
        expect(nameErrors.length).toBeGreaterThan(0);
        expect(nameErrors[0].constraints?.matches).toBeDefined();
      }
    });
    it("should reject names that are too short", async () => {
      const dto = new UpdateProductDto();
      dto.name = "AB";

      const errors = await validate(dto);
      const nameErrors = errors.filter((error) => error.property === "name");
      expect(nameErrors.length).toBeGreaterThan(0);
      expect(nameErrors[0].constraints?.isLength).toBeDefined();
    });

    it("should reject names that are too long", async () => {
      const dto = new UpdateProductDto();
      dto.name = "A".repeat(101);

      const errors = await validate(dto);
      const nameErrors = errors.filter((error) => error.property === "name");
      expect(nameErrors.length).toBeGreaterThan(0);
      expect(nameErrors[0].constraints?.isLength).toBeDefined();
    });

    it("should be optional", async () => {
      const dto = new UpdateProductDto();

      const errors = await validate(dto);
      const nameErrors = errors.filter((error) => error.property === "name");
      expect(nameErrors).toHaveLength(0);
    });
  });

  describe("description", () => {
    it("should accept valid descriptions", async () => {
      const validDescriptions = [
        "Descrição do produto",
        "A".repeat(300),
        "Descrição com números 123",
        "Descrição com caracteres especiais: @#$%",
      ];

      for (const description of validDescriptions) {
        const dto = new UpdateProductDto();
        dto.description = description;

        const errors = await validate(dto);
        const descriptionErrors = errors.filter(
          (error) => error.property === "description"
        );
        expect(descriptionErrors).toHaveLength(0);
      }
    });

    it("should reject descriptions that are too long", async () => {
      const dto = new UpdateProductDto();
      dto.description = "A".repeat(301);

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(
        (error) => error.property === "description"
      );
      expect(descriptionErrors.length).toBeGreaterThan(0);
      expect(descriptionErrors[0].constraints?.isLength).toBeDefined();
    });

    it("should be optional", async () => {
      const dto = new UpdateProductDto();

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(
        (error) => error.property === "description"
      );
      expect(descriptionErrors).toHaveLength(0);
    });
  });

  describe("price", () => {
    it("should accept valid prices", async () => {
      const validPrices = [0.01, 1, 10.99, 999.99, 9999.99];

      for (const price of validPrices) {
        const dto = new UpdateProductDto();
        dto.price = price;

        const errors = await validate(dto);
        const priceErrors = errors.filter(
          (error) => error.property === "price"
        );
        expect(priceErrors).toHaveLength(0);
      }
    });

    it("should reject negative prices", async () => {
      const dto = new UpdateProductDto();
      dto.price = -1;

      const errors = await validate(dto);
      const priceErrors = errors.filter((error) => error.property === "price");
      expect(priceErrors.length).toBeGreaterThan(0);
      expect(priceErrors[0].constraints?.min).toBeDefined();
    });

    it("should reject zero price", async () => {
      const dto = new UpdateProductDto();
      dto.price = 0;

      const errors = await validate(dto);
      const priceErrors = errors.filter((error) => error.property === "price");
      expect(priceErrors.length).toBeGreaterThan(0);
      expect(priceErrors[0].constraints?.min).toBeDefined();
    });
    it("should reject prices with more than 2 decimal places", async () => {
      const dto = new UpdateProductDto();
      dto.price = 10.999;

      const errors = await validate(dto);
      const priceErrors = errors.filter((error) => error.property === "price");
      expect(priceErrors.length).toBeGreaterThan(0);

      expect(priceErrors[0].constraints).toBeDefined();
      const hasValidationError = Object.keys(priceErrors[0].constraints || {}).some(
        (key) =>
          key.includes("maxDecimalPlaces") ||
          key.includes("isNumber") ||
          key.includes("isDecimal")
      );
      expect(hasValidationError).toBeTruthy();
    });

    it("should be optional", async () => {
      const dto = new UpdateProductDto();

      const errors = await validate(dto);
      const priceErrors = errors.filter((error) => error.property === "price");
      expect(priceErrors).toHaveLength(0);
    });
  });
  describe("stock", () => {
    it("should accept valid stock quantities", async () => {
      const validStocks = [0, 1, 10, 100, 1000];

      for (const stock of validStocks) {
        const dto = new UpdateProductDto();
        dto.stock = stock;

        const errors = await validate(dto);
        const stockErrors = errors.filter(
          (error) => error.property === "stock"
        );
        expect(stockErrors).toHaveLength(0);
      }
    });

    it("should reject negative stock quantities", async () => {
      const dto = new UpdateProductDto();
      dto.stock = -1;

      const errors = await validate(dto);
      const stockErrors = errors.filter((error) => error.property === "stock");
      expect(stockErrors.length).toBeGreaterThan(0);
      expect(stockErrors[0].constraints?.min).toBeDefined();
    });

    it("should reject non-integer stock quantities", async () => {
      const dto = new UpdateProductDto();
      dto.stock = 1.5;

      const errors = await validate(dto);
      const stockErrors = errors.filter((error) => error.property === "stock");
      expect(stockErrors.length).toBeGreaterThan(0);
      expect(stockErrors[0].constraints?.isInt).toBeDefined();
    });

    it("should be optional", async () => {
      const dto = new UpdateProductDto();

      const errors = await validate(dto);
      const stockErrors = errors.filter((error) => error.property === "stock");
      expect(stockErrors).toHaveLength(0);
    });
  });
});
