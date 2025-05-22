import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsObject,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  altText?: string;

  @IsBoolean()
  @IsOptional()
  isMain?: boolean;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  inventory: number;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsArray()
  @IsOptional()
  materialIds?: string[];

  @IsArray()
  @IsOptional()
  tagIds?: string[];

  @IsArray()
  @Type(() => ProductImageDto)
  @IsOptional()
  images?: ProductImageDto[];

  @IsBoolean()
  @IsOptional()
  isCustomizable?: boolean;

  @IsObject()
  @IsOptional()
  customizationOptions?: any;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsObject()
  @IsOptional()
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
