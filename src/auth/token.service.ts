import { HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './schemas';
import { Model } from 'mongoose';
import { CreateTokenDto } from './dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class TokenService {

    constructor(@InjectModel(Token.name) private readonly tokenModel: Model<Token>, @Inject(CommonService) private readonly commonService: CommonService) { }

    generateToken() {
        return Token.generateToken()
    }

    async create({ user_id }: CreateTokenDto) {
        try {
            const token = await this.findOne(user_id);
            if (token) await this.delete(token.token);
            return await this.tokenModel.create({ user_id, token: this.generateToken(), expiration_date: this.commonService.addMinutesToDate(5) });
        } catch (error) {
            this.handleError(error)
        }
    }

    async findOne(user_id?: string) {
        try {
            return await this.tokenModel.findOne({ user_id });
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