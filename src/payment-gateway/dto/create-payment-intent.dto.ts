import { IsMongoId, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePaymentIntentDto {

    @IsMongoId()
    order_id: string;

    @IsNumber()
    @IsPositive()
    amount: number;

}