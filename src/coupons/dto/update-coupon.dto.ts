import { PartialType, OmitType } from "@nestjs/mapped-types";
import { CreateCouponDto } from "./create-coupon.dto";

export class UpdateCouponDto extends PartialType(
  OmitType(CreateCouponDto, ["code"] as const)
) {}
