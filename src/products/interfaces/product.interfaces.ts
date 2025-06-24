export interface ProductCouponApplicationData {
  id: number;
  product_id: number;
  coupon_id: number;
  applied_at: Date;
  removed_at: Date | null;
  coupon: {
    id: number;
    code: string;
    type: 'percent' | 'fixed';
    value: number;
  };
}
