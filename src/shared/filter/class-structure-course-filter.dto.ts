import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";
import { BaseFilterDTO } from "./base-filter.dto";

export class ClassStructureCourseFilterDTO extends BaseFilterDTO
{
  // @IsOptional()
  // @IsBoolean()
  // @Transform(({ value} ) => value === 'true')
  // includeRelatedItem?: boolean; // Set default value to false

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
  classStructureId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
  courseId?: number;

//   @IsOptional()
//   @IsNumber()
//   @ApiProperty()
//   @Type(() => Number)
//   page?: number = 1;
}