import { Repository } from 'typeorm';
import { CustomRepository } from '../../typeorm/typeorm-ex.decorator';
import { Category } from '../entities/category.entity';

@CustomRepository(Category)
export class CategoryRepository extends Repository<Category> {
  
}