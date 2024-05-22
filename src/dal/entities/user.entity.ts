import { Entity, ObjectIdColumn, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { bufferToBoolean } from '../../core/transformers/bufferToBolean.transform';
import { Expense } from './expense.entity';

@Entity('user')
export class User {
  
  @ObjectIdColumn()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column('varchar', { length: 100 , unique: true})
  username: string;
  
  @Column('varchar', { nullable: true, length: 200 })
  displayName?: string;

  @Column('varchar', { length: 100 })
  password: string;
    
  @Column('datetime', { nullable: true })
  lastLoginDate?: Date;
  
  @OneToMany(() => Expense, expense => expense.user)
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