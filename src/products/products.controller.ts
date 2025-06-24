import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import { ApplyCouponDto } from "./dto/apply-coupon.dto";
import { ApplyPercentDiscountDto } from "./dto/apply-percent-discount.dto";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Post(":id/restore")
  restore(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.restore(id);
  }
  @Post(":id/discount/percent")
  applyPercentDiscount(
    @Param("id", ParseIntPipe) id: number,
    @Body() applyPercentDiscountDto: ApplyPercentDiscountDto
  ) {
    return this.productsService.applyPercentDiscount(id, applyPercentDiscountDto.percentage);
  }

  @Post(":id/discount/coupon")
  applyCoupon(
    @Param("id", ParseIntPipe) id: number,
    @Body() applyCouponDto: ApplyCouponDto
  ) {
    return this.productsService.applyCoupon(id, applyCouponDto.couponCode);
  }

  @Delete(":id/discount")
  @HttpCode(HttpStatus.NO_CONTENT)
  removeDiscount(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.removeDiscount(id);
  }
}
