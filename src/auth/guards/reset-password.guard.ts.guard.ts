import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../token.service';

@Injectable()
export class ResetPasswordGuardTsGuard implements CanActivate {

  constructor( @Inject(TokenService) private readonly tokenService: TokenService ) { }

  async canActivate( ctx: ExecutionContext  ): Promise<boolean>  {

    const { query } = ctx.switchToHttp().getRequest();
    const token = await this.tokenService.findOne({ token: query?.token, user_id: query.user_id });

    if( !token ) return false;

    if( !await this.tokenService.verifyTokenExpiration(query.token, token.expiration_date) ) throw new ForbiddenException('El token de acceso ha expirado');

    return true;
  }
}
