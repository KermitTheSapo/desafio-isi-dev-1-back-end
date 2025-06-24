<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Desafio ISI Dev - Backend API

This is a NestJS backend API for a product management system with discount coupons.

## Project Structure

- **Products Module**: Handles CRUD operations for products with advanced filtering and pagination
- **Coupons Module**: Manages promotional coupons with validation rules
- **Discount System**: Applies percentage or fixed-value discounts to products

## Key Features

- Product management with soft delete
- Coupon system with expiration dates and usage limits
- Discount application with business rule validation
- Advanced query filtering and pagination
- SQLite in-memory database with TypeORM
- Comprehensive input validation with class-validator

## Business Rules

- Product names must be unique (normalized)
- Only one discount per product at a time
- Coupons have validity periods and usage limits
- Final price cannot be below R$ 0.01
- Soft delete for products and coupons

## API Endpoints

### Products

- GET /api/v1/products - List products with filtering and pagination
- POST /api/v1/products - Create new product
- GET /api/v1/products/:id - Get product by ID
- PATCH /api/v1/products/:id - Update product
- DELETE /api/v1/products/:id - Soft delete product
- POST /api/v1/products/:id/restore - Restore deleted product
- POST /api/v1/products/:id/discount/coupon - Apply coupon to product
- DELETE /api/v1/products/:id/discount - Remove discount from product

### Coupons

- GET /api/v1/coupons - List all coupons
- POST /api/v1/coupons - Create new coupon
- GET /api/v1/coupons/:id - Get coupon by ID
- GET /api/v1/coupons/code/:code - Get coupon by code
- PATCH /api/v1/coupons/:id - Update coupon
- DELETE /api/v1/coupons/:id - Soft delete coupon
- GET /api/v1/coupons/:id/stats - Get coupon usage statistics

## Development Guidelines

- Follow NestJS best practices and conventions
- Use proper HTTP status codes and error handling
- Implement comprehensive input validation
- Write clean, maintainable code with proper TypeScript types
- Use meaningful variable and function names
- Add proper error messages for better API usability
