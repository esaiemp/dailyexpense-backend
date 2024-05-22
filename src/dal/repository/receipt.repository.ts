import {  Repository } from 'typeorm';
import { CustomRepository } from '../../typeorm/typeorm-ex.decorator';
import { Receipt } from '../entities/receipt.entity';

@CustomRepository(Receipt)
export class ReceiptRepository extends Repository<Receipt> {
}