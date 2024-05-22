import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Expense } from './expense.entity';
import { bufferToBoolean } from '../../core/transformers/bufferToBolean.transform';

@Entity('receipt')
export class Receipt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  expenseId: number;

  @Column('varchar', { nullable: true, length: 150 })
  fileName: string;

  @Column('varchar', { nullable: true, length: 150 })
  mimeType: string;

  @Column('varchar', { nullable: true})
  filePath?: string;

  @Column('int', { nullable: true})
  size?: number;
  
  @ManyToOne(() => Expense, expense => expense.receipts)
  expense: Expense;

  @Column({
    type: 'tinyint',
    width: 1,
    transformer: bufferToBoolean, 
    nullable: true
  })
  isDeleted?: boolean;
  
  @Column('varchar', { nullable: true })
  createdBy?: string;
  
  @Column('datetime', { nullable: true })
  createdDate?: Date;

  @Column('varchar', { nullable: true })
  lastModifiedBy?: string;

  @Column('datetime', { nullable: true })
  lastModifiedDate?: Date;
}