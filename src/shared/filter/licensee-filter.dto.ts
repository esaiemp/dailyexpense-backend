import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class LicenseeFilterDTO
{
  
  @IsOptional()
  @IsString()
  @ApiProperty()
  @Type(() => String)
  companyName?: string;

  
  @IsOptional()
  @IsString()
  @ApiProperty()
  @Type(() => String)
  runAsAdminCode?: string;

  
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
  page?: number = 1;

}