import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePaymentIntentDto {

    @IsString()
    order_id: string;

    @IsNumber()
    @IsPositive()
    amount: number;

}