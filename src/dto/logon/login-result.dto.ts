import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginResultDTO
{
  @IsString()
  @ApiProperty()
  access_token: string;
}