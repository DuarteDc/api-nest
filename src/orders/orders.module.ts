import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [ OrdersController ],
  providers: [ OrdersService ],
  imports: [ 
    ProductsModule,
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      }
    ])
  ]
})
export class OrdersModule {}
