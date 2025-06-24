import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { CouponsService } from "./coupons.service";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";

@Controller("coupons")
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto);
  }

  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.couponsService.findOne(id);
  }

  @Get("code/:code")
  findByCode(@Param("code") code: string) {
    return this.couponsService.findByCode(code);
  }

  @Get(":id/stats")
  getStats(@Param("id", ParseIntPipe) id: number) {
    return this.couponsService.getStats(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCouponDto: UpdateCouponDto
  ) {
    return this.couponsService.update(id, updateCouponDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.couponsService.remove(id);
  }

  @Post(":id/restore")
  restore(@Param("id", ParseIntPipe) id: number) {
    return this.couponsService.restore(id);
  }
}
