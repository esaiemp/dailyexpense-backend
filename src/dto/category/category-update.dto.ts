import { IsNumber, IsString, IsBoolean, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryUpdateDTO
{
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  description: string;
}