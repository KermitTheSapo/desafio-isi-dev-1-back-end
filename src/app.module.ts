import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsModule } from "./products/products.module";
import { CouponsModule } from "./coupons/coupons.module";
import { Product } from "./products/entities/product.entity";
import { Coupon } from "./coupons/entities/coupon.entity";
import { ProductCouponApplication } from "./products/entities/product-coupon-application.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: ":memory:",
      entities: [Product, Coupon, ProductCouponApplication],
      synchronize: true,
      logging: process.env.NODE_ENV === "development",
    }),
    ProductsModule,
    CouponsModule,
  ],
})
export class AppModule {}
