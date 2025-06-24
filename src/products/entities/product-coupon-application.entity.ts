import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';

@Entity('product_coupon_applications')
export class ProductCouponApplication {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  product_id!: number;

  @Column()
  coupon_id!: number;

  @CreateDateColumn({ type: 'datetime' })
  applied_at!: Date;

  @Column({ type: 'datetime', nullable: true })
  removed_at?: Date;

  @ManyToOne(() => Product, product => product.couponApplications)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @ManyToOne(() => Coupon, coupon => coupon.applications)
  @JoinColumn({ name: 'coupon_id' })
  coupon!: Coupon;
}
