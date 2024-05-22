import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Receipt } from './receipt.entity';
import { bufferToBoolean } from '../../core/transformers/bufferToBolean.transform';
import { User } from './user.entity';

@Entity('expense')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  categoryId: number;

  @Column('varchar', { length: 125, nullable: false })
  name: string;

  @Column('varchar', { length: 250, nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column('varchar', { length: 50})
  amountCurrency: string;

  @Column({ type: 'datetime', nullable: false })
  expenseDate: Date;

  @Column('varchar')
  userId: string;

  @ManyToOne(() => Category, category => category.expenses)
  category: Category;

  @OneToMany(() => Receipt, receipt => receipt.expense)
  receipts?: Receipt[];

  @ManyToOne(() => User, user => user.expenses)
  user: User;

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
