import { Request } from 'express';

import { Controller, Post, Body, Get, UseGuards, Req, HttpCode, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User as GetUser} from './decorators/user.decorator';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';

import { AuthService } from './auth.service';

import { LoginUserDto, RegisterUserDto, ChangePasswordUserDto, ResetPasswordUserDto, CreateNewPasswordDto,  QueriesResetPasswordDto } from './dto';

import { User } from './schemas/user.schema';
import { ResetPasswordGuardTsGuard } from './guards/reset-password.guard.ts.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.singUp(registerUserDto);
  }

  @Post('login')
  @HttpCode(200)
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
  
  @Post('forgot-password')
  @HttpCode(200)
  forgotPassword( @Body() resetPasswordUserDto: ResetPasswordUserDto) {
    return this.authService.resetPassword(resetPasswordUserDto)
  }

  @Post('create-new-password')
  @HttpCode(200)
  @UseGuards(ResetPasswordGuardTsGuard)
  createNewPassword( @Body() createNewPasswordDto: CreateNewPasswordDto, @Query() queriesResetPasswordDto: QueriesResetPasswordDto ) {
    return this.authService.changePassword(createNewPasswordDto,  queriesResetPasswordDto)
  }
}
