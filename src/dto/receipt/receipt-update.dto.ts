import { IsInt, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { parseInteger } from '../../shared/helper/parseInteger.helper';

export class ReceiptUpdateDTO {
  @ApiProperty({ type: Number, required: false })
  @Transform(parseInteger)
  @ValidateIf((object, value) => value !== null && value !== undefined && value !== '')
  @IsInt()
  expenseId?: number;
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file?: Express.Multer.File;
}