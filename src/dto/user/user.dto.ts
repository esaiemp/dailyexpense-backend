import { IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Exclude } from 'class-transformer';
import { User } from '../../dal/entities/user.entity';

export class UserDTO
{
  @ApiProperty()
  id: string;

  @IsString()
  @MaxLength(100)
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  displayName?: string;

  @IsString()
  @MaxLength(100)
  @ApiProperty()
  @Exclude({ toPlainOnly: true})
  password: string;

  static fromUser(entity: User) {
    if (entity == null) {
        return null;
    }
    const dto = new UserDTO();
    dto.id = entity.id;
    dto.username = entity.username;
    dto.displayName = entity.displayName;
    dto.password = entity.password;
    return dto;
  }

  static requiredRelations: string[] = [];
}