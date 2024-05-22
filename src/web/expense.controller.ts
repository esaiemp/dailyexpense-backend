import { Controller, Logger, Req, Request, Get, Param, UseGuards, Body, Post, Put, Delete, Query} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JsonResponse } from '../shared/helper/json-response.helper';
import { BaseFilterDTO } from '../shared/filter/base-filter.dto';
import { ExpenseService } from '../service/expense.service';
import { ExpenseCreateDTO } from '../dto/expense/expense-create.dto';
import { ExpenseDTO } from '../dto/expense/expense.dto';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { GetUser } from '../shared/decorator/get-user.decorator';
import { User } from '../modules/users/user';
import { ExpenseUpdateDTO } from '../dto/expense/expense-update.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/expense')
export class ExpenseController {
  logger = new Logger('CategoryController');

  constructor(private readonly expenseService: ExpenseService) {}

  @Post("")
  async create(@Req() req: Request, @Body() dto: ExpenseCreateDTO,
    @GetUser() user: User
  ): Promise<JsonResponse<number>> {
    const result = await this.expenseService.create(dto, user);
    return new JsonResponse<number>(result);
  }

  @Get(":id")
  async findById(@Req() req: Request, @Param('id') id: number,
    @GetUser() user: User): Promise<ExpenseDTO> {
    var result = await this.expenseService.findById(id, user);
    return result;
  }

  @ApiQuery({
    name: "includeRelatedItem",
    type: Boolean,
    description: "Include related item in the result set?",
    required: false
  })
  @Get("")
  async findAll(@Req() req: Request,
    @GetUser() user: User,
    @Query() fitlerDTO?: BaseFilterDTO
  ): Promise<ExpenseDTO[]> {
    var result = await this.expenseService.findAll(user, fitlerDTO);
    return result;
  }
  
  @Put(":id")
  async update(@Req() req: Request, @Param('id') id: number, @Body() dto: ExpenseUpdateDTO,
    @GetUser() user: User): Promise<void> {
    return await this.expenseService.update(id, dto, user);
  }
  
  @Delete(":id")
  async delete(@Req() req: Request, @Param('id') id: number,
    @GetUser() user: User): Promise<void> {
    return await this.expenseService.delete(id, user);
  }
}