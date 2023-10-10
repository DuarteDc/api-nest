import { Request } from 'express';
import { BadRequestException, HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { type TokenPayload } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';

import { User } from './schemas/';

import { RegisterUserDto, LoginUserDto, ChangePasswordUserDto, ResetPasswordUserDto } from './dto/';

import { JWTPayload } from './interfaces/jwt-payload.interface';
import { UpdatePassword } from './interfaces/update-password.interface';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>, @Inject(TokenService) private readonly tokenService: TokenService, private readonly jwtService: JwtService) { }


  async singUp(registerUserDto: RegisterUserDto) {
    try {
      const existUser = await this.findOne(registerUserDto.email);

      if (existUser) throw new BadRequestException('Email is not valid');

      const { password, ...rest } = registerUserDto;
      const user = await this.userModel.create({ password: this.getHashPassword(password), ...rest });

      return {
        user,
        token: this.generateJWT({ id: user.id })
      }

    } catch (error) {
      console.log(error)
      this.handleError(error);
    }
  }

  async singIn(loginUserDto: LoginUserDto) {
    try {
      const user = await this.findOne(loginUserDto.email);
      if (!user || !this.verifyPassword(loginUserDto.password, user.password)) throw new BadRequestException('Email or password are not valid');
      return {
        user,
        token: this.generateJWT({ id: user.id })
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async singInByGoogle({ headers }: Request) {
    const { given_name, family_name, email, } = JSON.parse(JSON.stringify(headers.userGoogle)) as TokenPayload;

    try {
      let user = await this.findOne(email);
      if (user) return { user, token: this.generateJWT({ id: user.id }) }

      user = await this.userModel.create({ name: given_name, lastName: family_name, email });
      return { user, token: this.generateJWT({ id: user.id }) }
    } catch (error) {
      this.handleError(error);
    }

  }

  async checkAuthentication(user: User) {
    return {
      user,
      token: this.generateJWT({ id: user.email }),
    }
  }

  async createNewPassword(changePassowrdUserDto: ChangePasswordUserDto, { _id, password }: User) {
    const { currentPassword, newPassword } = changePassowrdUserDto;

    if (!this.verifyPassword(currentPassword, password)) throw new BadRequestException('Invalid password - Verify your current password');

    if (this.verifyPassword(newPassword, password)) throw new BadRequestException('Please choose a different password');

    return await this.updateOne<String, UpdatePassword>(_id, { password: this.getHashPassword(newPassword) });
  }

  async resetPassword({ email }: ResetPasswordUserDto) {
    try {
      const user = await this.findOne(email);
      if (!user) throw new BadRequestException('User not valid');
      return await this.tokenService.create({ user_id: user._id })
      
    } catch (error) {
      this.handleError(error)
    }
  }

  private async findOne(email: String) {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      this.handleError(error)
    }
  }

  private async updateOne<String, T>(_id: String, updated: T) {
    try {
      return await this.userModel.findOneAndUpdate({ _id }, updated, { new: true });
    } catch (error) {
      this.handleError(error);
    }
  }

  private generateJWT(payload: JWTPayload) {
    return this.jwtService.sign(payload)
  }

  private handleError(error: any) {
    console.log(error)
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException('Error please check server logs');
  }

  private getHashPassword(password: string) {
    return hashSync(password, 10);
  }

  private verifyPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }


}
