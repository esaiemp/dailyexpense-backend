import {  Repository } from 'typeorm';
import { CustomRepository } from '../../typeorm/typeorm-ex.decorator';
import { Expense } from '../entities/expense.entity';

@CustomRepository(Expense)
export class ExpenseRepository extends Repository<Expense> {
}