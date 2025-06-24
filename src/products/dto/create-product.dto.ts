import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
  Length,
  Matches,
  IsNotEmpty,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @Matches(/^[a-zA-Z0-9\s\-_,.]+$/, {
    message:
      "name must contain only letters, numbers, spaces, hyphens, underscores, commas and dots",
  })
  @Transform(({ value }) => value?.trim().replace(/\s+/g, " "))
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(1000000)
  @Transform(({ value }) => {
    if (typeof value === "string") {
      const normalized = value.replace(/\./g, "").replace(",", ".");
      return parseFloat(normalized);
    }
    return value;
  })
  price: number;

  @IsInt()
  @Min(0)
  @Max(999999)
  stock: number;
}
