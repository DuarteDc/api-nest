import { IsJWT, IsString } from 'class-validator';

export class LoginGoogleUserDto {
    @IsString()
    googleToken: string;
}