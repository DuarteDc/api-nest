import { BadRequestException, HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { PaginateModel } from 'mongoose';

import { CreateOrderDto, OrderProduct } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import { Order } from './schemas/order.schema';
import { ProductsService } from 'src/products/products.service';
import { PaymentGatewayService } from 'src/payment-gateway/payment-gateway.service';
import { User } from 'src/auth/schemas';

@Injectable()
export class OrdersService {

  constructor( @InjectModel(Order.name) private readonly orderModel: PaginateModel<Order>, @Inject( ProductsService ) private readonly productService: ProductsService, @Inject(PaymentGatewayService) private readonly paymentGatewayService: PaymentGatewayService ) { }

  async create({ products, ...order }: CreateOrderDto, user: User) {
    try {
      const successProducts = await this.validateProductsAndCalculateTotals(products);
      const pendingOrder =  await this.orderModel.create({ products: successProducts, ...order });
      return await this.paymentGatewayService.createPayment({ amount: 1000, order_id: pendingOrder._id.toString() }, user)
    }catch(error) {
      this.handleError(error);
    }
  }

  async findAll() {
    const orders = await this.orderModel.paginate({});
    return orders;

  }

  private async validateProductsAndCalculateTotals( products: Array<OrderProduct> ) {
    let successProducts = [], totals = { };
    try {
      await Promise.all(products.map(async ({ _id, name, quantity }) => {
        const product = await this.productService.findOne(_id);
        if ( !product || !product.status ) throw new BadRequestException(`El producto ${name} no esta disponible`);
        if ( quantity > product.stock ) throw new BadRequestException(`El producto ${ name } no tiene suficiente stock`);
        successProducts.push({ quantity, ...product });
      }));
      return successProducts;
    } catch (error) {
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

  private validateProducts(product: OrderProduct, discount = 0) {
    if (!product) return;
    let subtotal =+ product.price * product.quantity;
    const cashDiscount = (subtotal * discount) / 100;
      return {
        subtotal,
        total: subtotal - cashDiscount,
      }
  }

  private handleError(error: any) {
    console.log(error);
    if (error instanceof HttpException) throw error;

    throw new InternalServerErrorException('Internal server error');
  }

}
