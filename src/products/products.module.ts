import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { Product } from "./entities/product.entity";
import { Coupon } from "../coupons/entities/coupon.entity";
import { ProductCouponApplication } from "./entities/product-coupon-application.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Coupon, ProductCouponApplication]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
