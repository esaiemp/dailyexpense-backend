import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginCredentialsDTO
{
  @IsNotEmpty()
  @IsString()
  @ApiProperty({description: "Email Address"})
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}