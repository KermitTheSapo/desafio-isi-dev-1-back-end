import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CreateProductDto } from "../../../src/products/dto/create-product.dto";

describe("CreateProductDto", () => {
  describe("validation", () => {
    it("should pass validation with valid data", async () => {
      const dto = plainToClass(CreateProductDto, {
        name: "Test Product",
        description: "Test description",
        price: 100.0,
        stock: 10,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should fail validation when name is too short", async () => {
      const dto = plainToClass(CreateProductDto, {
        name: "AB",
        description: "Test description",
        price: 100.0,
        stock: 10,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("name");
    });

    it("should fail validation when name is too long", async () => {
      const dto = plainToClass(CreateProductDto, {
        name: "A".repeat(101),
        description: "Test description",
        price: 100.0,
        stock: 10,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("name");
    });

    it("should fail validation when name contains invalid characters", async () => {
      const dto = plainToClass(CreateProductDto, {
        name: "Test Product <script>",
        description: "Test description",
        price: 100.0,
        stock: 10,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("name");
    });

    it("should fail validation when name is empty", async () => {
      const dto = plainToClass(CreateProductDto, {
        name: "",
        description: "Test description",
        price: 100.0,
        stock: 10,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("name");
    });

    it("should fail validation when description is too long", async () => {
      const dto = plainToClass(CreateProductDto, {
        name: "Test Product",
        description: "A".repeat(301),
        price: 100.0,
        stock: 10,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("description");
    });

    it("should pass validation when description is undefined", async () => {
      const dto = plainToClass(CreateProductDto, {
        name: "Test Product",
        price: 100.0,
        stock: 10,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should fail validation when price is too low", async () => {
      const dto = plainToClass(CreateProductDto, {
        name: "Test Product",
        description: "Test description",
        price: 0.005,
        stock: 10,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("price");
    });

    it("should fail validation when price is too high", async () => {
      const dto = plainToClass(CreateProductDto, {
        name: "Test Product",
        description: "Test description",
        price: 1000001,
        stock: 10,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("price");
    });

    it("should fail validation when stock is negative", async () => {
      const dto = plainToClass(CreateProductDto, {
        name: "Test Product",
        description: "Test description",
        price: 100.0,
        stock: -1,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("stock");
    });

    it("should fail validation when stock is too high", async () => {
      const dto = plainToClass(CreateProductDto, {
        name: "Test Product",
        description: "Test description",
        price: 100.0,
        stock: 1000000,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("stock");
    });

    it("should fail validation when stock is not an integer", async () => {
      const dto = plainToClass(CreateProductDto, {
        name: "Test Product",
        description: "Test description",
        price: 100.0,
        stock: 10.5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("stock");
    });
  });

  describe("transformation", () => {
    it("should normalize name by trimming and reducing spaces", async () => {
      const dto = plainToClass(CreateProductDto, {
        name: "  Test   Product  ",
        description: "Test description",
        price: 100.0,
        stock: 10,
      });

      expect(dto.name).toBe("Test Product");
    });

    it("should transform Brazilian price format", async () => {
      const dto = plainToClass(CreateProductDto, {
        name: "Test Product",
        description: "Test description",
        price: "1.234,56",
        stock: 10,
      });

      expect(dto.price).toBe(1234.56);
    });

    it("should handle international price format", async () => {
      const dto = plainToClass(CreateProductDto, {
        name: "Test Product",
        description: "Test description",
        price: 1234.56,
        stock: 10,
      });

      expect(dto.price).toBe(1234.56);
    });
  });
});
