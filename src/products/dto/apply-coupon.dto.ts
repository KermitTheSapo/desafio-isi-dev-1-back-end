import { IsString, IsNotEmpty, Matches } from "class-validator";
import { Transform } from "class-transformer";

export class ApplyCouponDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim().toUpperCase())
  @Matches(/^[A-Z0-9]+$/, {
    message: "coupon code must contain only uppercase letters and numbers",
  })
  couponCode: string;
}
