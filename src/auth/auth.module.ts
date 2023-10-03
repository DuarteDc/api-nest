import { ConfigModule, ConfigService } from '@nestjs/config';
import { InternalServerErrorException, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { User, UserSchema } from './schemas/user.schema';
import { JWTStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [ AuthController ],
  providers: [ AuthService, JWTStrategy ],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),

    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (configService: ConfigService) => {
        const JWT_SECRET_KEY = configService.get('JWT_SECRET_KEY');
        if( !JWT_SECRET_KEY ) throw new InternalServerErrorException('Please configure .env file');
        return {
          secret: JWT_SECRET_KEY,
          signOptions: {
            expiresIn: '2h'
          }      
        }
      }
    })

  ],

  exports: [ MongooseModule, JWTStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}
