import { IsNumber, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Receipt } from '../../dal/entities/receipt.entity';

export class ReceiptDTO
{
  @IsNumber()
  @IsInt()
  @ApiProperty()
  id: number;
  
  @IsString()
  @ApiProperty()
  fileName: string;

  @IsString()
  @ApiProperty()
  mimeType: string;

  @IsString()
  @ApiProperty()
  filePath: string;
  
  @IsNumber()
  @IsInt()
  @ApiProperty()
  size?: number;

  @IsNumber()
  @IsInt()
  @ApiProperty()
  expenseId?: number;

  static fromReceipt(entity: Receipt) {
    if (entity == null) {
        return null;
    }
    const dto = new ReceiptDTO();
    dto.id = entity.id;
    dto.fileName = entity.fileName;
    dto.mimeType = entity.mimeType;
    dto.expenseId = entity.expenseId;
    dto.filePath = entity.filePath;
    dto.size = entity.size;
    
    return dto;
  }

  static requiredRelations: string[] = [];
}
