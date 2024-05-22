import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer";
import { IsInt } from "class-validator"
import { parseInteger } from "../../shared/helper/parseInteger.helper";

export class ReceiptCreateDto {
    @ApiProperty({ type: Number, required: true })
    @Transform(parseInteger)
    @IsInt()
    expenseId: number;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: Express.Multer.File;
}