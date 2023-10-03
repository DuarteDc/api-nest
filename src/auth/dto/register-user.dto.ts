import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterUserDto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @MinLength(1)
    last_name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

}
