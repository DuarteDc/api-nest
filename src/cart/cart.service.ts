import { BadRequestException, HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cart } from './schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { UserService } from 'src/user/user.service';
import { ProductCart } from './interfaces/product-cart.interface';
import { ProductsService } from 'src/products/products.service';

import { AddProductToCartDto } from './dto';

@Injectable()
export class CartService {

  constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>, @Inject(UserService) private readonly userService: UserService, @Inject(ProductsService) private readonly productService: ProductsService) { }

  async create(userId: string, createCartDto: CreateCartDto) {
    try {
      await this.userService.findOne(userId);
      await this.cartModel.create(createCartDto);
      return {
        message: 'Producto agregado con exito',
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  findOne(user_id: string) {
    try {
      return this.cartModel.findOne({ user_id });
    } catch (error) {
      this.handleError(error);
    }
  }

  async addProductToCart (userId: string, addProductToCartDto: AddProductToCartDto) {
    try {
      const cart = await this.findOne(userId);
      if ( !cart ) return await this.create(userId, { user_id: userId, products: [ addProductToCartDto ] });

      const product = await this.validateNewProduct(cart, addProductToCartDto);
      await this.update(cart._id.toString(), product);
      return {
        message: 'Producto agregado con exito',
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, addProductToCartDto: AddProductToCartDto) {
    try {
      return await this.cartModel.updateOne({ _id: id }, { $set: { 'products.$[product].quantity': addProductToCartDto.quantity } }, { arrayFilters: [{ 'product.product_id': { $eq: addProductToCartDto.product_id } }]} );
    } catch (error) {
      this.handleError(error)
    }
  }

  private async validateNewProduct(cart: Cart, addProductToCartDto: AddProductToCartDto) {

    const product = await this.productService.findOne(addProductToCartDto.product_id);
    const existProductInCart = cart.products.find( p => p.product_id.toString() === product._id.toString() );

    if (existProductInCart) {
      const newQuantity = existProductInCart.quantity + addProductToCartDto.quantity;
      if ( newQuantity > product.stock ) throw new BadRequestException('El producto no cuenta con el stock suficiente'); 
      return {
        quantity: newQuantity,
        product_id: product._id,
      }
    } 
    if ( addProductToCartDto.quantity > product.stock ) throw new BadRequestException('El producto no cuenta con el stock suficiente'); 
    return  addProductToCartDto;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }

  private async verifyProductStock(products: Array<ProductCart>) {
    try {
      await Promise.all(products.map(async ({ product_id, quantity }) => {
        const product = await this.productService.findOne(product_id);
        if ( product.stock < quantity ) throw new BadRequestException(`El producto ${ product.name } no tiene stock suficiente`);
      }));
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error: any) {
    console.log(error)
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException('Error please check server logs');
  }
}
