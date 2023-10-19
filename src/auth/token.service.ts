import { BadRequestException, HttpException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Token } from './schemas';

import { CreateTokenDto } from './dto';
import { CommonService } from 'src/common/common.service';
import { FindTokenBy } from './interfaces/find-token-by.interface';

@Injectable()
export class TokenService {

    constructor(@InjectModel(Token.name) private readonly tokenModel: Model<Token>, @Inject(CommonService) private readonly commonService: CommonService) { }

    generateToken() {
        return Token.generateToken();
    }

    async create({ user_id }: CreateTokenDto) {
        try {
            const token = await this.findOne({ user_id });
            if (token) await this.delete(token.token);
            return await this.tokenModel.create({ user_id, token: this.generateToken(), expiration_date: this.commonService.addMinutesToDate(5) });
        } catch (error) {
            this.handleError(error);
        }
    }

    async verifyTokenExpiration(user_id: string, token: string) {
        try {
            const existToken = await this.findOne({ user_id, token });
            if ( !existToken || existToken.token !== token ) throw new BadRequestException('Token is not valid');
            if( !this.commonService.verifyExpirationDate(existToken.expiration_date) ) throw new UnauthorizedException('Token has expired');
            await this.delete(token);
        } catch (error) {
            this.handleError(error)
        }
    }

    async findOne(findTokenBy: FindTokenBy) {
        try {
            return await this.tokenModel.findOne(findTokenBy);
        } catch (error) {
            this.handleError(error);
        }
    }

    async delete(token: string) {
        try {
            await this.tokenModel.deleteOne({ token })
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        console.log(error)
        if (error instanceof HttpException) throw error;
        throw new InternalServerErrorException('Error please check server logs');
    }

}