import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddProductToCartDto } from './dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  // @Post()
  // create(@Body() addProductToCartDto: AddProductToCartDto) {
  //   return this.cartService.create(addProductToCartDto);
  // }

  @Post('/add/:user_id')
  addProduct(@Param('user_id') user_id: string, @Body() addProductToCartDto: AddProductToCartDto) {
    return this.cartService.addProductToCart(user_id, addProductToCartDto)
  }

  @Get()
  findAll() {
    return ''
  }

  @Get(':user_id')
  findOne(@Param('user_id') user_id: string) {
    return this.cartService.findOne(user_id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
  //   return this.cartService.update(id, updateCartDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
