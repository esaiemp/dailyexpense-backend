import { Injectable, Logger, HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import { CategoryCreateDTO } from '../dto/category/category-create.dto';
import { CategoryDTO } from '../dto/category/category.dto';
import { CategoryUpdateDTO } from '../dto/category/category-update.dto';
import { CheckRecord } from '../shared/helper/check-record.helper';
import { BaseFilterDTO } from '../shared/filter/base-filter.dto';
import { CategoryRepository } from '../dal/repository/category.repository';
import { Category } from '../dal/entities/category.entity';
import { User } from '../modules/users/user';

@Injectable()
export class CategoryService {

  private readonly logger = new Logger(CategoryService.name);

  constructor(
    private repository: CategoryRepository,
  ) {}

  async create(dto: CategoryCreateDTO, user: User): Promise<number> {
    const itemExists = await this.findCategory('name', dto.name);
    if (itemExists) {
      throw new ConflictException(`Category "${dto.name}" already exists.`);
    }

    const item = dto as Category;
    item.createdDate = new Date();
    item.isDeleted = false;
    item.createdBy = user.userId;

    try {
      const result = await this.repository.save(item);
      return result.id;
    } catch (err) {
      this.logger.error(`${err.stack}`);
      throw new HttpException({
        message: err.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, dto: CategoryUpdateDTO, user: User): Promise<void> {
    const itemExists = await this.checkIfItemExists('id', id, false);
    const checkName = await this.findCategory('name', dto.name, id);
    if (checkName) {
      throw new ConflictException(`Category "${dto.name}" already exists.`);
    }

    const item = dto as Category;
    item.id = itemExists.id;
    item.isDeleted = false;

    await this.saveUpdatedChanges(item, user);
  }

  async findById(id: number, user: User): Promise<CategoryDTO> {
    const dto = await this.checkIfItemExists('id', id, false);
    return dto;
  }

  async findAll( user: User, filterDTO?: BaseFilterDTO): Promise<CategoryDTO[]> {
    const query = this.repository.createQueryBuilder('category');
    query.where({ isDeleted: false });
    try {
      query.orderBy('name');
      const results = await query.getMany();
      return results.map(x => CategoryDTO.fromCategory(x));
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
    ): Promise<CategoryDTO> {
    const item = CheckRecord(await this.findCategory(filterByField, filterValue), isParentItem, entityName);
    return CategoryDTO.fromCategory(item);
  }

  async delete(id: number, user: User): Promise<void> {
    const existingItem = CheckRecord(await this.findCategory('id', id));
    existingItem.isDeleted = true;
    this.saveUpdatedChanges(existingItem, user);
  }

  private async findCategory(filterByField: string, filterValue: number | string,
    exclusionId?: number
  ): Promise<Category> {
    let item: Category;
    const query = this.repository.createQueryBuilder('category');
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

  private async saveUpdatedChanges(item: Category, user: User) {
    item.lastModifiedDate = new Date();
    item.lastModifiedBy = user.userId;
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
}