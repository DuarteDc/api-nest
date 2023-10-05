import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';

import { LoginUserDto, RegisterUserDto, ChangePasswordUserDto, LoginGoogleUserDto } from './dto';

import { User } from './schemas/user.schema';

import { User as GetUser} from './decorators/user.decorator';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.singUp(registerUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.singIn(loginUserDto);
  }

  @Post('login-google')
  @UseGuards(GoogleOAuthGuard)
  loginGoogle(@Req() request: Request) {
    return this.authService.singInByGoogle(request);
  }

  @Get('check-auth')
  @UseGuards(AuthGuard())
  checkAuthentication(@GetUser() user: User) {
    return this.authService.checkAuthentication(user)
  }

  @Post('change-password')
  @UseGuards(AuthGuard())
  changePassword( @Body() changePassowrdUserDto: ChangePasswordUserDto, @GetUser() user: User ) {
    return this.authService.createNewPassword( changePassowrdUserDto, user )
  }

}
