import { ConfigModule, ConfigService } from '@nestjs/config';
import { InternalServerErrorException, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JWTStrategy } from './strategies/jwt.strategy';

import { User, UserSchema, Token, TokenSchema } from './schemas/';
import { TokenService } from './token.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [ AuthController ],
  providers: [ AuthService, JWTStrategy, TokenService ],
  imports: [
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name: Token.name,
        schema: TokenSchema
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
