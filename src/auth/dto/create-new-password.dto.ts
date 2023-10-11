import { IsString, MinLength } from 'class-validator';

export class CreateNewPasswordDto {

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @MinLength(8)
    confirm_passowrd: string;

}