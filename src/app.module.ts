import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { EnvConfiguration } from './config/env.config';
import { userPreSave, userGetWithOutPassword } from './auth/hooks/';

@Module({
  imports: [ 

    ConfigModule.forRoot({
      load: [ EnvConfiguration ]
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeatureAsync([
      userPreSave(),
      userGetWithOutPassword()
    ]),

    AuthModule
  ],
})

export class AppModule {}
