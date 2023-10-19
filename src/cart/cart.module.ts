import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from 'src/user/user.module';
import { Cart, CartSchema } from './schemas/cart.schema';
import { User, UserSchema } from 'src/auth/schemas';

@Module({
  controllers: [ CartController ],
  providers: [ CartService ],
  imports: [
    UserModule,
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
