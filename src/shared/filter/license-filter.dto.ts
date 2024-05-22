import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class LicenseFilterDTO
{
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
  page?: number = 1;
}