import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, AuthService, JwtService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule { }
