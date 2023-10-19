import { HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cart } from './schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CartService {

  constructor( @InjectModel( Cart.name ) private readonly cartModel: Model<Cart>, @Inject(UserService) private readonly userService: UserService ) { }

  async create({ user_id, products }: CreateCartDto) {
    try {

       await this.userService.findOne(user_id);

      return await this.cartModel.create({ user_id, products });
      
    } catch (error) {
      this.handleError(error)
    }
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(user_id: string) {
    return this.cartModel.findOne({ user_id });
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }

  private handleError(error: any) {
    console.log(error)
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException('Error please check server logs');
  }
}
