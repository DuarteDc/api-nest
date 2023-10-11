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
  ],
})



export class AppModule {}
