import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
  w;
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
