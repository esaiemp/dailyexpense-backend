import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetCredentialsDTO
{
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  newPassword: string;
}