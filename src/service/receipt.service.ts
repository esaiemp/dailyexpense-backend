import { Injectable, Logger, HttpException, HttpStatus, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CheckRecord } from '../shared/helper/check-record.helper';
import { BaseFilterDTO } from '../shared/filter/base-filter.dto';
import { User } from '../modules/users/user';
import { ReceiptRepository } from '../dal/repository/receipt.repository';
import { Receipt } from '../dal/entities/receipt.entity';
import { ReceiptCreateDto } from '../dto/receipt/receipt-create.dto';
import { ExpenseService } from './expense.service';
import { ReceiptUpdateDTO } from '../dto/receipt/receipt-update.dto';
import { ReceiptDTO } from '../dto/receipt/receipt.dto';
import * as fs from 'fs';
import { extname } from 'path';
import { Response } from 'express';

@Injectable()
export class ReceiptService {

  private readonly logger = new Logger(ReceiptService.name);
  private readonly tableName: string = 'receipt';
  constructor(
    private repository: ReceiptRepository,
    private expenseService: ExpenseService,
  ) {}
 
  async create(dto: ReceiptCreateDto, user: User): Promise<number> {
    const parentExpense = await this.expenseService.checkIfItemExists('id', dto.expenseId, true, 'Expense');
    const { mimetype: mimeType, size} = dto.file; 
    
    const { filePath, fileName }  = this.uploadFile(dto.file);

    const item = {
      expenseId: parentExpense.id,
      fileName,
      mimeType,
      filePath,
      size
    } as Receipt;

    try {
      const result = await this.repository.save(this.setAuditingFields(item, user, true));
      return result.id;
    } catch (err) {
      this.logger.error(`${err.stack}`);
      throw new HttpException({
        message: err.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: number, user: User): Promise<ReceiptDTO> {
    const result = CheckRecord(await this.findReceipt('id', id));
    return ReceiptDTO.fromReceipt(result);
  }

  async downloadFile(receiptId: number, user: User, res: Response): Promise<void> {
    const result = await this.findById(receiptId, user);
    if (!result) {
      throw new NotFoundException('File not found');
    }
    res.setHeader('Content-Type', result.mimeType);
    res.download(result.filePath, result.fileName);
  }

  async findAll(user: User, filterDTO?: BaseFilterDTO): Promise<ReceiptDTO[]> {
    const query = this.repository.createQueryBuilder(this.tableName);
    query.where({ isDeleted: false });
    try {
      const results = await query.getMany();
      return results.map(x => ReceiptDTO.fromReceipt(x));
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
    ): Promise<ReceiptDTO> {
    const item = CheckRecord(await this.findReceipt(filterByField, filterValue), isParentItem, entityName);
    return ReceiptDTO.fromReceipt(item);
  }

  async update(id: number, dto: ReceiptUpdateDTO, user: User): Promise<void> {
    const itemExists = await this.checkIfItemExists('id', id, false);
    let expenseId: number = itemExists.expenseId;

    if (dto?.expenseId && dto.expenseId != expenseId) {
      const parentExpense = await this.expenseService.checkIfItemExists('id', dto.expenseId, true, 'Expense');
      expenseId = parentExpense.id;
    }

    const existingItem: Receipt = {
        id: itemExists.id,
        expenseId
    } as Receipt;

    if(dto?.file){
      const { filePath, fileName }  = this.uploadFile(dto.file);
      existingItem.fileName = fileName;
      existingItem.mimeType = dto.file.mimetype;
      existingItem.size = dto.file.size;
      existingItem.filePath = filePath;
    }
    await this.saveUpdatedChanges(existingItem, user);
  }

  async delete(id: number, user: User): Promise<void> {
    const existingItem = CheckRecord(await this.findReceipt('id', id));
    existingItem.isDeleted = true;
    this.saveUpdatedChanges(existingItem, user);
  }

  private async findReceipt(filterByField: string, filterValue: number | string,
    exclusionId?: number
  ): Promise<Receipt> {
    let item: Receipt;
    const query = this.repository.createQueryBuilder(this.tableName);
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

  private async saveUpdatedChanges(item: Receipt, user: User) {
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

  private setAuditingFields(item: Receipt, user:User, isItemBeingCreated: boolean = false): Receipt{
    if(isItemBeingCreated){
      item.createdBy = user.userId;
      item.createdDate = new Date();
    }else{
      item.lastModifiedBy = user.userId;
      item.lastModifiedDate = new Date();
    }
    return item;
  }

  private uploadFile(file: Express.Multer.File): {filePath: string, fileName: string} {
    const { originalname, mimetype: mimeType, size, buffer} = file; 
    
    if (!originalname || !mimeType || !size) {
      throw new BadRequestException('Invalid file');
    }

    const fileNameWithoutExt = originalname.split('.').slice(0, -1).join('.');
    const extension = extname(originalname);
    const randomName = Array(32)
      .fill(null)
      .map(() => (Math.round(Math.random() * 16)).toString(16))
      .join('');

    const fileName = `${fileNameWithoutExt}-${randomName}${extension}`;

    const uploadDir = './uploads';
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = `${uploadDir}/${fileName}`;
    
    const fileStream = fs.createWriteStream(filePath);
    fileStream.write(buffer);
    fileStream.end();

    return { filePath, fileName};
  }
}