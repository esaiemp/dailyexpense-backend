import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { bufferToBoolean } from '../../core/transformers/bufferToBolean.transform';
import { Expense } from './expense.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 125, unique: true })
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @OneToMany(() => Expense, expense => expense.category)
  expenses?: Expense[];

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