import { IsDate, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Expense } from '../../dal/entities/expense.entity';

export class ExpenseDTO {
  @ApiProperty()
  id: number;

  @IsString()
  @ApiProperty()
  name: string;

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

  static fromExpense(entity: Expense) {
    if (entity == null) {
      return null;
    }
    const dto = new ExpenseDTO();
    dto.id = entity.id;
    dto.amount = entity.amount;
    dto.amountCurrency = entity.amountCurrency;
    dto.categoryId = entity.categoryId;
    dto.expenseDate = entity.expenseDate;
        
    return dto;
  }

  static requiredRelations: string[] = [];
}