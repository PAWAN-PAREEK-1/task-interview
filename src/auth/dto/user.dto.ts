import { IsNotEmpty, IsString } from 'class-validator';

export class userDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
