import { Controller, Logger, Req, Request, Get, Param, UseGuards, Body, Post, Put, Delete, Query} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CategoryCreateDTO } from '../dto/category/category-create.dto';
import { CategoryService } from '../service/category.sercice';
import { CategoryDTO } from '../dto/category/category.dto';
import { CategoryUpdateDTO } from '../dto/category/category-update.dto';
import { JsonResponse } from '../shared/helper/json-response.helper';
import { BaseFilterDTO } from '../shared/filter/base-filter.dto';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { GetUser } from '../shared/decorator/get-user.decorator';
import { User } from '../modules/users/user';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/category')
export class CategoryController {
  logger = new Logger('CategoryController');

  constructor(private readonly categoryService: CategoryService) {}

  @Post("")
  async create(@Req() req: Request, @Body() dto: CategoryCreateDTO,
    @GetUser() user: User
  ): Promise<JsonResponse<number>> {
    const result = await this.categoryService.create(dto, user);
    return new JsonResponse<number>(result);
  }

  @Get(":id")
  async findById(@Req() req: Request, @Param('id') id: number,
    @GetUser() user: User): Promise<CategoryDTO> {
    var result = await this.categoryService.findById(id, user);
    return result;
  }

  @ApiQuery({
    name: "includeRelatedItem",
    type: Boolean,
    description: "Include related item in the result set?",
    required: false
  })

  @Get("")
  async findAll(@Req() req: Request, @GetUser() user: User,
  @Query() fitlerDTO?: BaseFilterDTO
  ): Promise<CategoryDTO[]> {
    var result = await this.categoryService.findAll(user, fitlerDTO);
    return result;
  }
  
  //@Roles(Role.Admin, Role.Management)
  @Put(":id")
  async update(@Req() req: Request, @Param('id') id: number, @Body() dto: CategoryUpdateDTO
    ,@GetUser() user: User): Promise<void> {
    return await this.categoryService.update(id, dto, user);
  }
  
  @Delete(":id")
  async delete(@Req() req: Request, @Param('id') id: number, @GetUser() user: User): Promise<void> {
    return await this.categoryService.delete(id, user);
  }
}