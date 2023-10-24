import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AsyncModelFactory, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { EnvConfiguration } from './config/env.config';

import { getMongoHooks } from './common/hooks/common.hook'
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CommonModule } from './common/common.module';
import { MailingModule } from './mailing/mailing.module';
import { CartModule } from './cart/cart.module';
import { UserModule } from './user/user.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentGatewayModule } from './payment-gateway/payment-gateway.module';

@Module({

  imports: [ 

    ConfigModule.forRoot({
      load: [ EnvConfiguration ]
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeatureAsync(getMongoHooks()),  

    
    AuthModule,
    CategoriesModule,
    CommonModule,
    ProductsModule,
    MailingModule,
    CartModule,
    UserModule,
    OrdersModule,
    PaymentGatewayModule,
  ],
})



export class AppModule {}
