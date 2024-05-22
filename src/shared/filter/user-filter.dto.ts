import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UserFilterDTO
{
  @IsOptional()
  @IsString()
  @ApiProperty()
  @Type(() => String)
  name?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
  page?: number = 1;
}