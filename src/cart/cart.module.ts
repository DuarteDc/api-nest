import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { Cart, CartSchema } from './schemas/cart.schema';
import { User, UserSchema } from 'src/auth/schemas';

import { UserModule } from 'src/user/user.module';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ CartController ],
  providers: [ CartService ],
  imports: [
    UserModule,
    ProductsModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Cart.name,
        schema: CartSchema
      },
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
  ]
})
export class CartModule {}
