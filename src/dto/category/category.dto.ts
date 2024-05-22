import { IsNumber, IsString, MaxLength, IsBoolean, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../dal/entities/category.entity';

export class CategoryDTO
{
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsString()
  @MaxLength(125)
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;

  static fromCategory(entity: Category) {
    if (entity == null) {
        return null;
    }
    const dto = new CategoryDTO();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.name;
    
    return dto;
  }

  static requiredRelations: string[] = [];
}