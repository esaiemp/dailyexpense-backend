import { Module, Logger, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModules } from './modules/users/users.modules';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './core/exceptions/all-exceptions.filter';
import { TimingMiddleware } from './core/middlewares/timing.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './orm.config';
import { TypeOrmExModule } from './typeorm/typeorm-ex.module';
import { CategoryService } from './service/category.sercice';
import { ExpenseService } from './service/expense.service';
import { ExpenseController } from './web/expense.controller';
import { CategoryController } from './web/category.controller';
import { UserService } from './service/user.service';
import { CategoryRepository } from './dal/repository/category.repository';
import { ExpenseRepository } from './dal/repository/expense.repository';
import { ReceiptRepository } from './dal/repository/receipt.repository';
import { UserRepository } from './dal/repository/user.repository';
import { AuthenticationController } from './web/authentication.controller';
import { AuthenticationService } from './service/authentication.service';
import { ReceiptController } from './web/receipt.controller';
import { ReceiptService } from './service/receipt.service';
import { UserController } from './web/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmExModule.forCustomRepository([
      CategoryRepository, 
     ExpenseRepository,
     ReceiptRepository,
     UserRepository
    ]),
    UsersModules,
  ],
  controllers: [
   AuthenticationController,
   CategoryController,
   ExpenseController,
   ReceiptController,
   UserController
  ],
  providers: [
    CategoryService,
    ExpenseService,
    AuthenticationService,
    ReceiptService,
    UserService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ]
})
export class AppModule { 
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimingMiddleware).forRoutes('*');
  }
}