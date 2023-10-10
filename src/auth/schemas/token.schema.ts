import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaModel } from 'mongoose';

import  { randomBytes, createHash} from 'crypto'

export type TokenSchema = HydratedDocument<Token>

@Schema({ timestamps: true, versionKey: false })
export class Token {
    @Prop({
        type: String,
        required: true
    })
    token: string;

    @Prop({
        type: Date,
        required: true,
    })
    expiration_date: Date;

    @Prop({
        type: SchemaModel.Types.ObjectId,
        ref: 'user',
        unique: true,
    })
    user_id: string;

    static generateToken() {
        const resetPassword = randomBytes(20).toString('hex');
        const token = createHash('sha256').update(resetPassword).digest('hex');
        return token;
    }

}

export const TokenSchema = SchemaFactory.createForClass(Token);