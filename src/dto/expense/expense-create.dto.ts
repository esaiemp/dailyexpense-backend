import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ExpenseCreateDTO {
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsNumber()
  @ApiProperty()
  amount: number;

  @IsString()
  @ApiProperty()
  amountCurrency: string;

  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  expenseDate: Date;

  @IsNumber()
  @ApiProperty()
  categoryId: number;
}