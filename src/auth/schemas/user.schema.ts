import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Schema as SchemaModel, HydratedDocument } from 'mongoose';


export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
    
    readonly _id: string;

    @Prop({
        type: String,
        required: true,
    })
    name: string;

    @Prop({
        type: String,
        required: true,
    })
    lastName: string;

    @Prop({
        type: String,
        unique: true,
        required: true,
    })
    email: string;

    @Prop({
        type: String,
    })
    password: string;

    @Prop({
        type: [{ type: SchemaModel.Types.ObjectId, ref: 'Tags' }],
        default: []
    })
    tags: Array<String>

    @Prop({    
        type: Boolean,
        default: true,
    })
    status: boolean;
}


export const UserSchema = SchemaFactory.createForClass(User);
