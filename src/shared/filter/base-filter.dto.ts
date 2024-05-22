import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class BaseFilterDTO {
    @IsOptional()
    @IsBoolean()
    @Transform(({ value} ) => value === 'true')
    includeRelatedItem?: boolean; // Set default value to false

    // @IsOptional()
    // @IsNumber()
    // @ApiProperty()
    // @Type(() => Number)
    // page?: number = 1;
}