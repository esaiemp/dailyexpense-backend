import { Controller, Logger, UseGuards, Post, Req, Request, Body, Get, Param, Put, Delete, Query, Patch, ParseArrayPipe } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { GetUser } from '../shared/decorator/get-user.decorator';
import { UserCreateDTO } from '../dto/user/user-create.dto';
import { User } from '../modules/users/user';
import { JsonResponse } from '../shared/helper/json-response.helper';
import { UserDTO } from '../dto/user/user.dto';
import { Pagination } from '../shared/interfaces/pagination';
import { UserFilterDTO } from '../shared/filter/user-filter.dto';
import { UserUpdateDTO } from '../dto/user/user-update.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/user')
export class UserController {
  logger = new Logger('UserController');

  constructor(private readonly userService: UserService) {}

  @Post("")
  async create(@Req() req: Request, @Body() dto: UserCreateDTO,
    @GetUser() user: User
  ): Promise<JsonResponse<string>> {
    const result = await this.userService.create(dto, user);
    return new JsonResponse<string>(result);
  }
   
  @Get(":id")
  async findById(@Req() req: Request, @Param('id') id: string,
    @GetUser() user: User
  ): Promise<UserDTO> {
    const result = await this.userService.findById(id, user);
    return result;
  }

  @ApiQuery({
    name: "name",
    type: String,
    description: "An optional fiter parameter. Use it to get user(s) filterd by username or contactPersonName. (username/contactPersonName like ParamValue)",
    required: false
  })
  @ApiQuery({
    name: "page",
    type: Number,
    description: "An optional fiter parameter. Use it to paginate the query results.",
    required: false
  })
  @Get("")
  async findAll(@Req() req: Request, @GetUser() user: User,
    @Query() filterDto?: UserFilterDTO
  ): Promise<Pagination<UserDTO>> {
    const result = await this.userService.findAll(user, filterDto);
    return result;
  }

  @Put(":id")
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UserUpdateDTO,
    @GetUser() user: User
  ): Promise<void> {
    return await this.userService.update(id, dto, user);
  }

  @Delete(":id")
  async delete(@Req() req: Request, @Param('id') id: string,
    @GetUser() user: User
  ): Promise<void> {
    return await this.userService.delete(id, user);
  }
} 