import { IsNumber, Min, Max } from "class-validator";

export class ApplyPercentDiscountDto {
  @IsNumber()
  @Min(1, { message: "Percentage must be at least 1%" })
  @Max(80, { message: "Percentage cannot exceed 80%" })
  percentage!: number;
}
