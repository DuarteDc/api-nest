import { IsEmail, MinLength } from 'class-validator';

export class ResetPasswordUserDto {
    @IsEmail()
    @MinLength(8)
    email: string;
}