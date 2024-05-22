import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class RoleFilterDTO
{
  @IsOptional()
  @IsInt()
  @ApiProperty()
  @Type(() => Number)
  roleId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  @Type(() => String)
  roleName?: string;
}