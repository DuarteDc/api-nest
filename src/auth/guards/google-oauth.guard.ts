import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
@Injectable()
export class GoogleOAuthGuard implements CanActivate {

  private readonly client: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new OAuth2Client()
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { headers } = ctx.switchToHttp().getRequest();

    if (!headers['authorization-google-token']) throw new UnauthorizedException('Google token is not valid');

    try {
      const ticket = await this.client.verifyIdToken({
        idToken: headers['authorization-google-token'],
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      })

      const payload = ticket.getPayload();

      if (!payload) return false;

      headers.userGoogle = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Google token is not valid')
    }

  }


}
