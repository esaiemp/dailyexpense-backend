import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupCredentialsDTO
{
  @IsNotEmpty()
  @IsString()
  @ApiProperty({description: "Email Address"})
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({description: "Display Name"})
  displayName: string;

}