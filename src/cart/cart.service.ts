import { BadRequestException, HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cart } from './schemas/cart.schema';
import { User } from 'src/auth/schemas';

import { ProductsService } from 'src/products/products.service';
import { AddProductToCartDto, CreateCartDto } from './dto';

@Injectable()
export class CartService {

  constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>, @Inject(ProductsService) private readonly productService: ProductsService) { }

  async create(createCartDto: CreateCartDto) {
    try {
      await this.cartModel.create(createCartDto);
      return {
        message: 'Producto agregado con exito',
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  async findOne(user_id: string) {
    try {
      return await this.cartModel.findOne({ user_id });
    } catch (error) {
      this.handleError(error);
    }
  }

  async clearCart(userId: string) {
    try {
      const cart = await this.findOne(userId);
      if ( !cart ) throw new BadRequestException('El carrito esta vacio');
      await this.cartModel.updateOne({ _id: cart._id }, [ { $unset: ['products'] } ]);
      return { message : 'El carrito se ha vaciado completamente '}
    } catch (error) {
      this.handleError(error)
    }
  }

  async addProductToCart (userId: string, addProductToCartDto: AddProductToCartDto) {
    try {
      const cart = await this.findOne(userId);
      if ( !cart ) return await this.create({ user_id: userId, products: [ addProductToCartDto ] });

      await this.validateNewProduct(cart, addProductToCartDto);
      return {
        message: 'Producto agregado con exito',
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  private async validateNewProduct(cart: Cart, addProductToCartDto: AddProductToCartDto) {
    const product = await this.productService.findOne(addProductToCartDto.product_id);
    const existProductInCart = cart.products.find( p => p.product_id.toString() === product._id.toString() );

    if (existProductInCart) {
      const newQuantity = existProductInCart.quantity + addProductToCartDto.quantity;
      if ( newQuantity > product.stock ) throw new BadRequestException('El producto no cuenta con el stock suficiente'); 
      return await this.updateProduct(cart._id, { quantity: newQuantity, product_id: addProductToCartDto.product_id })
    } 
    if ( addProductToCartDto.quantity > product.stock ) throw new BadRequestException('El producto no cuenta con el stock suficiente'); 
    return  await this.addProduct(cart._id, addProductToCartDto)
  }

  private async addProduct(id: string, addProductToCartDto: AddProductToCartDto) {
    try {
      return await this.cartModel.updateOne({ _id: id }, { $push: { products: addProductToCartDto }});
    } catch (error) {
      this.handleError(error)
    }
  }

  private async updateProduct(id: string, addProductToCartDto: AddProductToCartDto) {
    try {
      return await this.cartModel.updateOne({ _id: id }, { $set: { 'products.$[product].quantity': addProductToCartDto.quantity } }, { arrayFilters: [{ 'product.product_id': { $eq: addProductToCartDto.product_id } }]} );
    } catch (error) {
      this.handleError(error)
    }
  }

  async remove(productId: string, user: User) {
    try{
      const cart = await this.findOne(user._id);
      await this.cartModel.updateOne({ _id: cart._id }, { $pull: {  products: { product_id: productId  } }})
      return {
        message: 'El producto se ha eliminado correctamente'
      }
    }catch(error){
      this.handleError(error)
    }
  }

  private handleError(error: any) {
    console.log(error)
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException('Error please check server logs');
  }
}
