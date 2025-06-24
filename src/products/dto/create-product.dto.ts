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
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name (must be unique)',
    example: 'Samsung Galaxy S21',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @Matches(/^[a-zA-Z0-9\s\-_,.]+$/, {
    message:
      'name must contain only letters, numbers, spaces, hyphens, underscores, commas and dots',
  })
  @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
  name!: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest Samsung smartphone with amazing features',
    required: false,
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @Length(0, 300)
  description?: string;

  @ApiProperty({
    description: 'Product price in BRL',
    example: 999.99,
    minimum: 0.01,
    maximum: 1000000,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(1000000)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const normalized = value.replace(/\./g, '').replace(',', '.');
      return parseFloat(normalized);
    }
    return value;
  })
  price!: number;

  @ApiProperty({
    description: 'Product stock quantity',
    example: 50,
    minimum: 0,
    maximum: 999999,
  })
  @IsInt()
  @Min(0)
  @Max(999999)
  stock!: number;
}
