import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../../typeorm/typeorm-ex.module';
import { UsersService } from './users.service';
import { UserRepository } from '../../dal/repository/user.repository';


@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModules { }