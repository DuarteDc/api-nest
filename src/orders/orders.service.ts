import { BadRequestException, HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { PaginateModel } from 'mongoose';

import { CreateOrderDto, OrderProduct } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import { Order } from './schemas/order.schema';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {

  constructor(@InjectModel( Order.name ) private readonly orderModel: PaginateModel<Order>, @Inject( ProductsService ) private readonly productService: ProductsService) { }

  async create({ products, ...order }: CreateOrderDto) {
    try {
      const successProducts = await this.validateProducts(products);
      if ( !successProducts ) throw new BadRequestException('xd')
      return await this.orderModel.create({ products: successProducts, ...order });
    }catch(error) {
      this.handleError(error);
    }
  }

  async findAll() {
    const orders = await this.orderModel.paginate({});
    return orders;

  }


  private async validateProducts(products: Array<OrderProduct>) {
    let successProducts: Array<any>;
    try {
      await Promise.all(products.map(async ({ _id, name, quantity }) => {
        const product = await this.productService.findOne(_id);
        if ( !product || !product.status ) throw new BadRequestException(`El producto ${name} no esta disponible`);
        if ( quantity > product.stock ) throw new BadRequestException(`El producto ${ name } no tiene suficiente stock`);

        await this.productService.update(_id, { stock: product.stock - quantity });
        successProducts.push({ _id, quantity, stock: product.stock, ...product  });
      }));
      return successProducts;
    } catch (error) {
      await Promise.all(successProducts.map(async ({ _id, quantity, stock }) => {
        await this.productService.update(_id, { stock: stock + quantity })
      }))
      this.handleError( error )
    }
  }


  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }


  private handleError(error: any) {
    console.log(error);
    if (error instanceof HttpException) throw error;

    throw new InternalServerErrorException('Internal server error');
  }

}
