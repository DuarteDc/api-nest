import { BadRequestException, HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cart } from './schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UserService } from 'src/user/user.service';
import { ProductCart } from './interfaces/product-cart.interface';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CartService {

  constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>, @Inject(UserService) private readonly userService: UserService, @Inject(ProductsService) private readonly productService: ProductsService) { }

  async create(createCartDto: CreateCartDto) {
    try {
      await this.userService.findOne(createCartDto.user_id);
      const cart = await this.findOne(createCartDto.user_id);
      await this.verifyProductStock(createCartDto.products);

      return cart ? await this.update(cart._id.toString(), { products: createCartDto.products }) :  await this.cartModel.create(createCartDto);
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

  async update(id: string, { products }: UpdateCartDto) {
    return await this.cartModel.updateOne({ _id: id }, products)
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }

  private async verifyProductStock(products: Array<ProductCart>) {
    try {
      await Promise.all(products.map(async ({ product_id, quantity }, index) => {
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
