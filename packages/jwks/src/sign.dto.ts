import {IsEmail, IsNotEmpty} from 'class-validator';

export class SignDto {
  @IsNotEmpty()
  id!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
