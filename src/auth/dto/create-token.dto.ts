import { IsDate, IsMongoId, IsString, MinLength } from 'class-validator';

export class CreateTokenDto {

    @IsString()
    @MinLength(10)    
    token?: string;

    @IsDate()
    expiration_date?: Date;

    @IsString()
    @IsMongoId()
    user_id: string;

}