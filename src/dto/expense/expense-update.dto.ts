import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ExpenseUpdateDTO {
  @IsString()
  @ApiProperty()
  @IsOptional()
  name?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  description?: string;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  amount?: number;

  @IsString()
  @ApiProperty()
  @IsOptional()
  amountCurrency?: string;

  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  @IsOptional()
  expenseDate?: Date;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  categoryId?: number;
}