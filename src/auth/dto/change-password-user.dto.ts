import { IsString, MinLength } from "class-validator";

export class ChangePasswordUserDto {

    @IsString()
    @MinLength(8)
    currentPassword: string;

    @IsString()
    @MinLength(8)
    newPassword: string;

}