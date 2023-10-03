import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';


export const User = createParamDecorator(
    ( __: unknown, ctx: ExecutionContext ) => {
        const { user } = ctx.switchToHttp().getRequest();
        if (!user) throw new InternalServerErrorException('User not found in request object');
        return user;
    }
)