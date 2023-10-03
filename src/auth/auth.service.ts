import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';

import { User } from './schemas/user.schema';

import { RegisterUserDto, LoginUserDto, ChangePasswordUserDto } from './dto/';

import { JWTPayload } from './interfaces/jwt-payload.interface';
import { UpdatePassword } from './interfaces/update-password.interface';

@Injectable()
export class AuthService {

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private readonly jwtService: JwtService) { }


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
      this.handleError(error);
    }
  }

  async singIn(loginUserDto: LoginUserDto) {
    try {
      const user = await this.findOne(loginUserDto.email);
      if (!user || !this.verifyPassword(loginUserDto.password, user.password)) throw new BadRequestException('email or password are not valid');
      return {
        user,
        token: this.generateJWT({ id: user.id })
      }
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

    if (! this.verifyPassword(currentPassword, password) ) throw new BadRequestException('Invalid password - Verify your current password');

    if( this.verifyPassword(newPassword, password) ) throw new BadRequestException('Please choose a different password');

    return await this.updateOne<String, UpdatePassword>(_id, { password: this.getHashPassword(newPassword) });
  }

  private async findOne(email: string) {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      this.handleError(error)
    }
  }

  private async updateOne<String, T>(_id: String, updated: T) {
    try{
      return await this.userModel.findOneAndUpdate({ _id }, updated, { new: true });
    }catch(error) {
      this.handleError(error);
    }
  }

  private generateJWT(payload: JWTPayload) {
    return this.jwtService.sign(payload)
  }

  private handleError(error: any) {
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
