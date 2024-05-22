import { IsString, IsBoolean, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CategoryCreateDTO
{
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  description: string;
}