import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Strategy, ExtractJwt } from 'passport-jwt';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { PassportStrategy } from '@nestjs/passport';

import { User } from '../schemas/user.schema';

import { JWTPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JWTStrategy extends PassportStrategy( Strategy ) {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>, configService: ConfigService) {
        super({
            secretOrKey: configService.get('JWT_SECRET_KEY'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
     }

     async validate( { id }: JWTPayload): Promise<User> {
        
        const user = await this.userModel.findById(id);
        
        if( !user || !user.status ) throw new UnauthorizedException('Token is not valid');
        return user;
     }

}