import { IsNotEmpty, IsEmail, MinLength, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  fname: string;

  @IsString()
  @IsNotEmpty()
  lname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class TokenDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
