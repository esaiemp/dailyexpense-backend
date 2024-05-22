import { Controller, Logger, Req, Request, Get, Param, UseGuards, Body, Post, Put, Delete, Query, UseInterceptors, UploadedFile, Res} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { JsonResponse } from '../shared/helper/json-response.helper';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { GetUser } from '../shared/decorator/get-user.decorator';
import { User } from '../modules/users/user';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptService } from '../service/receipt.service';
import { ReceiptCreateDto } from '../dto/receipt/receipt-create.dto';
import { ReceiptUpdateDTO } from '../dto/receipt/receipt-update.dto';
import { ReceiptDTO } from '../dto/receipt/receipt.dto';
import { BaseFilterDTO } from '../shared/filter/base-filter.dto';
import { Response } from 'express';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/receipt')
export class ReceiptController {
  logger = new Logger('ReceiptController');

  constructor(
    private readonly receiptService: ReceiptService
    ) {}

  @Post('')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() dto: ReceiptCreateDto, @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User): Promise<JsonResponse<number>> {
      const result = await this.receiptService.create({...dto, file}, user);
      return new JsonResponse<number>(result);    
  }

  @Get('download/:receiptId')
  async getFile(@Req() req: Request, @Param('receiptId') receiptId: number, @GetUser() user: User, 
    @Res() res: Response) {
    await this.receiptService.downloadFile(receiptId, user, res);
  }

  @Get(":id")
  async findById(@Req() req: Request, @Param('id') id: number,
    @GetUser() user: User): Promise<ReceiptDTO> {
    var result = await this.receiptService.findById(id, user);
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
  ): Promise<ReceiptDTO[]> {
    var result = await this.receiptService.findAll(user, fitlerDTO);
    return result;
  }

  @Put(":id")
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: number, @Body() dto: ReceiptUpdateDTO, @UploadedFile() file: Express.Multer.File  
    , @GetUser() user: User
    ): Promise<void> {
      return await this.receiptService.update(id, {... dto, file}, user);
  }

  @Delete(":id")
  async delete(@Req() req: Request, @Param('id') id: number, @GetUser() user: User): Promise<void> {
    return await this.receiptService.delete(id, user);
  }
}