import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Coupon } from "./entities/coupon.entity";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>
  ) {}
  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const reservedCodes = [
      "ADMIN",
      "AUTH",
      "NULL",
      "UNDEFINED",
      "TEST",
      "SYSTEM",
    ];
    if (reservedCodes.includes(createCouponDto.code.toUpperCase())) {
      throw new BadRequestException(
        "This coupon code is reserved and cannot be used"
      );
    }

    const validFrom = new Date(createCouponDto.valid_from);
    const validUntil = new Date(createCouponDto.valid_until);

    if (validUntil <= validFrom) {
      throw new BadRequestException("valid_until must be after valid_from");
    }

    const fiveYearsFromValidFrom = new Date(validFrom);
    fiveYearsFromValidFrom.setFullYear(
      fiveYearsFromValidFrom.getFullYear() + 5
    );

    if (validUntil > fiveYearsFromValidFrom) {
      throw new BadRequestException(
        "Coupon validity cannot exceed 5 years from valid_from date"
      );
    }

    const existingCoupon = await this.couponRepository.findOne({
      where: { code: createCouponDto.code },
      withDeleted: true,
    });

    if (existingCoupon) {
      throw new ConflictException("Coupon code already exists");
    }

    const coupon = this.couponRepository.create({
      ...createCouponDto,
      valid_from: validFrom,
      valid_until: validUntil,
    });

    return this.couponRepository.save(coupon);
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponRepository.find({
      relations: ["applications", "applications.product"],
      order: { created_at: "DESC" },
    });
  }

  async findOne(id: number): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { id },
      relations: ["applications", "applications.product"],
    });

    if (!coupon) {
      throw new NotFoundException("Coupon not found");
    }

    return coupon;
  }

  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { code: code.toUpperCase() },
      relations: ["applications", "applications.product"],
    });

    if (!coupon) {
      throw new NotFoundException("Coupon not found");
    }

    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.findOne(id);
    if (updateCouponDto.valid_from || updateCouponDto.valid_until) {
      const validFrom = updateCouponDto.valid_from
        ? new Date(updateCouponDto.valid_from)
        : coupon.valid_from;
      const validUntil = updateCouponDto.valid_until
        ? new Date(updateCouponDto.valid_until)
        : coupon.valid_until;

      if (validUntil <= validFrom) {
        throw new BadRequestException("valid_until must be after valid_from");
      }

      const fiveYearsFromValidFrom = new Date(validFrom);
      fiveYearsFromValidFrom.setFullYear(
        fiveYearsFromValidFrom.getFullYear() + 5
      );

      if (validUntil > fiveYearsFromValidFrom) {
        throw new BadRequestException(
          "Coupon validity cannot exceed 5 years from valid_from date"
        );
      }

      if (updateCouponDto.valid_from) {
        updateCouponDto.valid_from = validFrom.toISOString();
      }
      if (updateCouponDto.valid_until) {
        updateCouponDto.valid_until = validUntil.toISOString();
      }
    }

    await this.couponRepository.update(id, updateCouponDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const coupon = await this.findOne(id);

    const activeApplications = coupon.applications?.filter(
      (app) => app.removed_at === null
    );

    if (activeApplications && activeApplications.length > 0) {
      throw new ConflictException(
        "Cannot delete coupon that is currently applied to products"
      );
    }

    await this.couponRepository.softDelete(id);
  }

  async restore(id: number): Promise<Coupon> {
    await this.couponRepository.restore(id);
    return this.findOne(id);
  }

  async getStats(id: number) {
    const coupon = await this.findOne(id);

    const activeApplications =
      coupon.applications?.filter((app) => app.removed_at === null) || [];

    const totalApplications = coupon.applications?.length || 0;

    return {
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        isValid: coupon.isValid,
        canBeUsed: coupon.canBeUsed,
      },
      stats: {
        uses_count: coupon.uses_count,
        max_uses: coupon.max_uses,
        remaining_uses:
          coupon.max_uses > 0 ? coupon.max_uses - coupon.uses_count : null,
        active_applications: activeApplications.length,
        total_applications: totalApplications,
        products_with_active_discount: activeApplications.map((app) => ({
          id: app.product.id,
          name: app.product.name,
          original_price: app.product.price,
          applied_at: app.applied_at,
        })),
      },
    };
  }
}
