import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CartService } from './cart.service';

import { User as GetUser } from 'src/auth/decorators/user.decorator';

import { AddProductToCartDto } from './dto';
import { User } from 'src/auth/schemas';

@Controller('cart')
@UseGuards(AuthGuard())
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post('/add/')
  addProduct(@GetUser() user: User, @Body() addProductToCartDto: AddProductToCartDto) {
    return this.cartService.addProductToCart(user._id, addProductToCartDto)
  }

  @Get()
  findOne(@GetUser() user: User) {
    return this.cartService.findOne(user._id);
  }

  @Delete('/clear')
  removeProductsInCart(@GetUser() user: User ) {
    return this.cartService.clearCart(user._id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User ) {
    return this.cartService.remove(id, user);
  }
}
