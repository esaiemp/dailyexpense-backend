import { IsOptional, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDTO
{
  @IsString()
  @IsOptional()
  @ApiProperty()
  username?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  displayName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  password?: string;
}