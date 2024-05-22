import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.sercice';
import { ExpenseCreateDTO } from '../dto/expense/expense-create.dto';
import { ExpenseUpdateDTO } from '../dto/expense/expense-update.dto';
import { ExpenseDTO } from '../dto/expense/expense.dto';
import { CheckRecord } from '../shared/helper/check-record.helper';
import { BaseFilterDTO } from '../shared/filter/base-filter.dto';
import { User } from '../modules/users/user';
import { ExpenseRepository } from '../dal/repository/expense.repository';
import { Expense } from '../dal/entities/expense.entity';

@Injectable()
export class ExpenseService {

  private readonly logger = new Logger(ExpenseService.name);

  constructor(
    private repository: ExpenseRepository,
    private categoryService: CategoryService,
  ) {}

  async create(dto: ExpenseCreateDTO, user: User): Promise<number> {
    const parentCategory = await this.categoryService.checkIfItemExists('id', dto.categoryId, true, 'Category');

    const newItem = dto as Expense;
    newItem.categoryId = parentCategory.id;
    newItem.userId = user.userId;
    this.setAuditingFields(newItem, user, true);

    try {
      const result = await this.repository.save(newItem);
      return result.id;
    } catch (err) {
      this.logger.error(`${err.stack}`);
      throw new HttpException({
        message: err.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, dto: ExpenseUpdateDTO, user: User): Promise<void> {
    const itemExists = await this.checkIfItemExists('id', id, false);
    let categoryId: number = itemExists.categoryId;

    if (dto?.categoryId) {
      const parentCategory = await this.categoryService.checkIfItemExists('id', dto.categoryId, true, 'Category');
      categoryId = parentCategory.id;
    }

    const existingItem: Expense = {
        id: itemExists.id,
        categoryId: categoryId,
        isDeleted: false,
        name: dto?.name || itemExists.name,
        description: dto?.description || itemExists.description,
        amount: dto?.amount || itemExists.amount,
        amountCurrency: dto?.amountCurrency || itemExists.amountCurrency,
        expenseDate: dto?.expenseDate || itemExists.expenseDate
    } as Expense;

    await this.saveUpdatedChanges(existingItem, user);
  }

  async findById(id: number, user: User): Promise<ExpenseDTO> {
    const result = await this.checkIfItemExists('id', id, false);
    return result;
  }

  async findAll(user: User, filterDTO?: BaseFilterDTO): Promise<ExpenseDTO[]> {
    const query = this.repository.createQueryBuilder('expense');
    query.where({ isDeleted: false });
    try {
      const results = await query.getMany();
      return results.map(x => ExpenseDTO.fromExpense(x));
    } catch (err) {
      this.logger.error(`${err.stack}`);
      throw new HttpException({
        message: err.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkIfItemExists(filterByField: string,
    filterValue: number,
    isParentItem: boolean = true,
    entityName: string = null
    ): Promise<ExpenseDTO> {
    const item = CheckRecord(await this.findExpense(filterByField, filterValue), isParentItem, entityName);
    return ExpenseDTO.fromExpense(item);
  }

  async delete(id: number, user: User): Promise<void> {
    const existingItem = CheckRecord(await this.findExpense('id', id));
    existingItem.isDeleted = true;
    this.saveUpdatedChanges(existingItem, user);
  }

  private async findExpense(filterByField: string, filterValue: number | string,
    exclusionId?: number
  ): Promise<Expense> {
    let item: Expense;
    const query = this.repository.createQueryBuilder('expense');
    const condition = { [filterByField]: filterValue, isDeleted: false };
    try {
      query.where(condition);

      if (exclusionId) {
        query.andWhere('id != :id', { id: exclusionId });
      }

      item = await query.getOne();
    }
    catch (err) {
      this.logger.error(`${err.stack}`);
      throw new HttpException({
        message: err.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return item;
  }

  private async saveUpdatedChanges(item: Expense, user: User) {
    item = this.setAuditingFields(item, user);
    try {
      await this.repository.save(item);
    }
    catch (err) {
      this.logger.error(`${err.stack}`);
      throw new HttpException({
        message: err.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private setAuditingFields(item: Expense, user:User, isItemBeingCreated: boolean = false): Expense{
    if(isItemBeingCreated){
      item.createdBy = user.userId;
      item.createdDate = new Date();
    }else{
      item.lastModifiedBy = user.userId;
      item.lastModifiedDate = new Date();
    }
    return item;
  }
}