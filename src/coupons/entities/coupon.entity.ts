import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductCouponApplication } from '../../products/entities/product-coupon-application.entity';

export enum CouponType {
  PERCENT = 'percent',
  FIXED = 'fixed',
}

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  code!: string;

  @Column({
    type: 'varchar',
    length: 10,
  })
  type!: CouponType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value!: number;

  @Column({ type: 'boolean', default: false })
  one_shot!: boolean;

  @Column({ type: 'int', default: 0 })
  max_uses!: number;

  @Column({ type: 'int', default: 0 })
  uses_count!: number;

  @Column({ type: 'datetime' })
  valid_from!: Date;

  @Column({ type: 'datetime' })
  valid_until!: Date;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deleted_at?: Date;

  @OneToMany(() => ProductCouponApplication, application => application.coupon)
  applications!: ProductCouponApplication[];

  get isValid(): boolean {
    const now = new Date();
    return now >= this.valid_from && now <= this.valid_until;
  }

  get canBeUsed(): boolean {
    if (!this.isValid) return false;
    if (this.max_uses === 0) return true;
    return this.uses_count < this.max_uses;
  }
}
