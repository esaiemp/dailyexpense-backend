import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { User as UserEntity } from '../dal/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../dal/repository/user.repository';
import { UserCreateDTO } from '../dto/user/user-create.dto';
import { User } from '../modules/users/user';
import { CheckRecord } from '../shared/helper/check-record.helper';
import { UserDTO } from '../dto/user/user.dto';
import { UserFilterDTO } from '../shared/filter/user-filter.dto';
import { UserUpdateDTO } from '../dto/user/user-update.dto';
import { CheckIfIsValidUUID } from '../shared/helper/check-if-is-valid-uuid.helper';
import { PaginateResponse } from '../shared/helper/paginate-response.helper';
import { Pagination } from '../shared/interfaces/pagination';
import { ResetCredentialsDTO } from '../dto/logon/reset-credential.dto';

@Injectable()
export class UserService {
  
  private readonly logger = new Logger(UserService.name); 
  
  private readonly tableName: string = 'user';

  //@IntentCanAdd()
  constructor(private userRepository: UserRepository   
    ) {}
  
  async create(dto: UserCreateDTO, user?: User): Promise<string> {
    let dbId: string;
    const newUser = {
      username: dto.username,
      password: dto.password,
      displayName: dto.displayName,
      createdDate: new Date(),
      isDeleted: false,
    } as UserEntity;

    if(user){
      newUser.createdBy = user.userId;
    }
    newUser.password= await this.hashPassword(dto.password);
    
    try {
      const result = await this.userRepository.save(newUser);
      dbId = result.id;
    } catch (err) {
        //duplicates users found
        if(err.errno === 1062){
            throw new ConflictException(`Username already exists. Username: ${dto.username}`);
        }else{
            this.logger.error(`${err.stack}`);
            throw new InternalServerErrorException();
        }
    }
    return dbId;
  }

  async findById(id: string, user?: User): Promise<UserDTO> {
    const dbUser = CheckRecord(await this.findUser('id', id, user, true, undefined));
    return UserDTO.fromUser(dbUser);
  }

  async findAll(user: User, userFilterDTO?: UserFilterDTO): Promise<Pagination<UserDTO>> {
    return this.findAllByCondition({isDeleted: false}, user, userFilterDTO);
  }

  async update(id: string, dto: UserUpdateDTO, user: User): Promise<void> {
    const existingUser = CheckRecord(await this.findUser('id', id, user));

    if(dto.password && dto.password?.trim() !==''){
      existingUser.password= await this.hashPassword(dto.password);
    }
    existingUser.username = dto.username ? dto.username : existingUser.username;  
    existingUser.displayName = dto.displayName? dto.displayName : existingUser.displayName;

    await this.saveUpdatedChanges(existingUser, user);
  }

  async delete(id: string, user: User): Promise<void> {
    const existingUser = CheckRecord(await this.findUser('id', id, user));
    existingUser.isDeleted = false;
    await this.saveUpdatedChanges(existingUser, user);
  }

  private async findUser(filterByField: string, filterValue: string, user: User
      , checkQueryOwnerShip: boolean = true, includeChildren: boolean = false
      ): Promise<UserEntity>{
    
    let dbUser: UserEntity;
    const query = this.userRepository.createQueryBuilder('user');

    if(filterByField =='id'){
      filterValue = CheckIfIsValidUUID(filterValue);
    }

    try{
      query.where({ [filterByField] : filterValue,
                                   isDeleted : false
                           });
      
      if(!checkQueryOwnerShip){
        query.andWhere({'id': user.userId });
      }

      dbUser = await query.getOne();
    }
    catch (err) {
      this.logger.error(`${err.stack}`);
    }
    return dbUser;
  }

  private async findAllByCondition(condition: any, user: User, filterDto?: UserFilterDTO,
      throwException: boolean = false, paginate: boolean = false
    ): Promise<Pagination<UserDTO>> {
    const limit:number = 25;
    const query = this.userRepository.createQueryBuilder('user')
                       .where(condition);
    if(filterDto){
      query.take(limit)
           .skip(limit * (filterDto.page - 1)); 
    }             

    if(filterDto && filterDto?.name){
      query.andWhere("username like :name OR displayName like :name", { name:`%${filterDto.name.trim()}%`});
    }
    
    try{
      const users = await query.getMany();

      if(throwException && users?.length==0){
        throw new NotFoundException(`No item found.`);
      }
      const results = users.map(x => UserDTO.fromUser(x))
      const data = {
        results,
        total: await query.getCount()
      };
      
      return PaginateResponse<UserDTO>(data, limit, filterDto?.page);
    }catch(err){
      this.logger.error(`${err.stack}`);
    }
  }

  async resetPassword(dto: ResetCredentialsDTO, user: User): Promise<string> {
    const dbUser = await this.findUser('id', user.userId, user, false);
    if(!dbUser){
        throw new NotFoundException(`User not found.`);
    }
    dbUser.password = await this.hashPassword(dto.newPassword);
    await this.saveUpdatedChanges(dbUser, user);

    return "Success";
  }

  async updateLastLoginDate(user: User): Promise<void> {
    const existingUser = CheckRecord(await this.findUser('id', user?.userId, user));
    existingUser.lastLoginDate = user?.lastLoginDate;
    await this.saveUpdatedChanges(existingUser, user);    
  }

  private async saveUpdatedChanges(existingUser: UserEntity, user: User): Promise<void>{
    existingUser.lastModifiedBy = user?.userId;
    existingUser.lastModifiedDate = new Date();
    try{
      await this.userRepository.save(existingUser);
    }catch(err){
      this.logger.error(`${err.stack}`);
      if(err.errno === 1062){
        throw new ConflictException(`Username already exists. Username: ${existingUser.username}`);
      }else{
        throw new InternalServerErrorException();
      }
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
