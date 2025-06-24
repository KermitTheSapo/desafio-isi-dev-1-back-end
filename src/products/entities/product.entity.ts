import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductCouponApplication } from './product-coupon-application.entity';
import { DiscountInfo } from '../../common/interfaces/common.interfaces';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'integer', default: 0 })
  stock!: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deleted_at?: Date;

  @OneToMany(() => ProductCouponApplication, application => application.product)
  couponApplications!: ProductCouponApplication[];

  get is_out_of_stock(): boolean {
    return this.stock === 0;
  }

  get finalPrice(): number {
    const activeApplication = this.couponApplications?.find(
      app => app.removed_at === null
    );

    if (!activeApplication) {
      return Number(this.price);
    }

    const coupon = activeApplication.coupon;
    if (coupon.type === 'percent') {
      return Number(this.price) * (1 - coupon.value / 100);
    } else {
      return Math.max(0.01, Number(this.price) - coupon.value);
    }
  }

  get discount(): DiscountInfo | null {
    const activeApplication = this.couponApplications?.find(
      app => app.removed_at === null
    );

    if (!activeApplication) {
      return null;
    }

    return {
      type: activeApplication.coupon.type,
      value: activeApplication.coupon.value,
      applied_at: activeApplication.applied_at,
    };
  }

  get hasCouponApplied(): boolean {
    return (
      this.couponApplications?.some(app => app.removed_at === null) || false
    );
  }
}
