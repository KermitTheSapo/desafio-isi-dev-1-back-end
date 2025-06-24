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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { ApplyPercentDiscountDto } from './dto/apply-percent-discount.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
  })
  @ApiResponse({
    status: 409,
    description: 'Product name already exists',
  })
  @ApiBody({ type: CreateProductDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product found',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, updateProductDto);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 204,
    description: 'Product deleted successfully',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a soft deleted product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product restored successfully',
  })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.restore(id);
  }

  @Post(':id/discount/percent')
  @ApiOperation({ summary: 'Apply percentage discount to product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: ApplyPercentDiscountDto })
  @ApiResponse({
    status: 200,
    description: 'Percentage discount applied successfully',
  })
  applyPercentDiscount(
    @Param('id', ParseIntPipe) id: number,
    @Body() applyPercentDiscountDto: ApplyPercentDiscountDto
  ) {
    return this.productsService.applyPercentDiscount(
      id,
      applyPercentDiscountDto.percentage
    );
  }

  @Post(':id/discount/coupon')
  @ApiOperation({ summary: 'Apply coupon discount to product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: ApplyCouponDto })
  @ApiResponse({
    status: 200,
    description: 'Coupon applied successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Product or coupon not found',
  })
  applyCoupon(
    @Param('id', ParseIntPipe) id: number,
    @Body() applyCouponDto: ApplyCouponDto
  ) {
    return this.productsService.applyCoupon(id, applyCouponDto.couponCode);
  }

  @Delete(':id/discount')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove discount from product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 204,
    description: 'Discount removed successfully',
  })
  removeDiscount(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.removeDiscount(id);
  }
}
