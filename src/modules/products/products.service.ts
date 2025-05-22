import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { materialIds, tagIds, images, ...productData } = createProductDto;

    return this.prisma.product.create({
      data: {
        ...productData,
        materials:
          materialIds?.length > 0
            ? { connect: materialIds.map((id) => ({ id })) }
            : undefined,
        tags:
          tagIds?.length > 0
            ? { connect: tagIds.map((id) => ({ id })) }
            : undefined,
        images: images?.length > 0 ? { create: images } : undefined,
      },
      include: {
        category: true,
        materials: true,
        tags: true,
        images: true,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          category: true,
          materials: true,
          tags: true,
          images: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page: skip / take + 1,
        pageSize: take,
        pageCount: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        materials: true,
        tags: true,
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            images: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { materialIds, tagIds, images, ...productData } = updateProductDto;

    // Check if product exists
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        materials: materialIds
          ? { set: materialIds.map((id) => ({ id })) }
          : undefined,
        tags: tagIds ? { set: tagIds.map((id) => ({ id })) } : undefined,
        images: images
          ? {
              deleteMany: {},
              create: images,
            }
          : undefined,
      },
      include: {
        category: true,
        materials: true,
        tags: true,
        images: true,
      },
    });
  }

  async remove(id: string) {
    // Check if product exists
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
