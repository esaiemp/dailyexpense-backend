import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDTO
{
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  displayName: string;

  @IsString()
  @ApiProperty()
  password: string;

}