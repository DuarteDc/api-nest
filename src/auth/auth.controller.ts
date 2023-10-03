import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';

import { LoginUserDto, RegisterUserDto, ChangePasswordUserDto } from './dto';

import { User } from './schemas/user.schema';

import { User as GetUser} from './decorators/user.decorator';

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

  @Get('check-auth')
  @UseGuards(AuthGuard())
  checkAuthentication(@GetUser() user: User) {
    return this.authService.checkAuthentication(user)
  }

  @Get('change-password')
  @UseGuards(AuthGuard())
  changePassword( @Body() changePassowrdUserDto: ChangePasswordUserDto, @GetUser() user: User ) {
    return this.authService.createNewPassword( changePassowrdUserDto, user )
  }

}
