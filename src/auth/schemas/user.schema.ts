import { NextFunction } from 'express';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import Stripe from 'stripe';

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
    last_name: string;

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
    tags: Array<String>

    @Prop({    
        type: Boolean,
        default: true,
    })
    status: boolean;

    @Prop({
        type: String,
        
    })
    payment_id: string;

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function(next: NextFunction) {

    const { id } = await new Stripe('', {
        apiVersion: '2023-10-16'
    }).customers.create({
        name: this.name + this.last_name,
        email: this.email,
    })
    this.payment_id = id;
    next();

})