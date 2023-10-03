import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { EnvConfiguration } from './config/env.config';
import { userPreSave, userGetWithOutPassword } from './auth/hooks/';
import { ProductsModule } from './products/products.module';
import { createProductSlug } from './products/hooks/create-product-slug.hook';
import { updateProductSlug } from './products/hooks/update-product-slug.hook';

@Module({
  imports: [ 

    ConfigModule.forRoot({
      load: [ EnvConfiguration ]
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeatureAsync([
      userPreSave(),
      userGetWithOutPassword(),
      createProductSlug(),
      updateProductSlug(),
    ]),

    AuthModule,
    ProductsModule
  ],
})

export class AppModule {}
