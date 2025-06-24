import {
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsInt,
  Min,
  Max,
  Length,
  Matches,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CouponType } from '../entities/coupon.entity';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  @Matches(/^[A-Z0-9]+$/, {
    message: 'code must contain only uppercase letters and numbers',
  })
  @Transform(({ value }) => value?.trim().toUpperCase())
  code!: string;

  @IsEnum(CouponType)
  type!: CouponType;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @ValidateIf(obj => obj.type === CouponType.PERCENT)
  @Min(1, { message: 'percentage value must be at least 1%' })
  @Max(80, { message: 'percentage value cannot exceed 80%' })
  @ValidateIf(obj => obj.type === CouponType.FIXED)
  @Max(1000000, { message: 'fixed value cannot exceed 1,000,000' })
  value!: number;

  @IsOptional()
  @IsBoolean()
  one_shot?: boolean = false;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(999999)
  max_uses?: number = 0;
  @IsDateString()
  valid_from!: string;

  @IsDateString()
  valid_until!: string;
}
