import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, VerifyCallback } from 'passport-google-oauth20';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor(configService: ConfigService) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_ID'),
            scope: ['email', 'profile']
        })
    }

    async validate(accessToken: String, refreshToken: String, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile
        const user = {
          email: emails[0].value,
          firstName: name.givenName,
          lastName: name.familyName,
          picture: photos[0].value,
          accessToken
        }
        done(null, user);
    }

}