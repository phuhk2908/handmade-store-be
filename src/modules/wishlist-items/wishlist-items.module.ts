import { Module } from '@nestjs/common';
import { WishlistItemsService } from './wishlist-items.service';
import { WishlistItemsController } from './wishlist-items.controller';

@Module({
  controllers: [WishlistItemsController],
  providers: [WishlistItemsService],
})
export class WishlistItemsModule {}
