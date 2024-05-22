import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { User } from './user';
import { User as dbUser } from '../../dal/entities/user.entity';
import { UserRepository } from '../../dal/repository/user.repository';

@Injectable()

export class UsersService {
  private readonly users: User[];
  private readonly logger = new Logger(UsersService.name);

  constructor(private userRepository:UserRepository) { }

  async findOne(username: string): Promise<User | undefined> {
    let userFromDb :dbUser;
    userFromDb = await this.userRepository.findOneBy({ username });

    if(userFromDb){
      const userInfo: User = {
        userId: userFromDb.id,
        username: userFromDb.username,
        displayname: userFromDb.displayName,
        password: userFromDb.password,
        lastLoginDate: new Date(),
      };
      return userInfo;
    }
    else
      return null;    
  }

  
  // async saveOrUpdateRefreshToken(userId: string, refreshToken:string, refreshTokenExpires:Date)
  // :  Promise<void>
  // {
  //   var existingUser = await this.userRepository.findOneBy({
  //     id: userId
  //   });
  //   existingUser.lastModifiedDate = new Date();
  //   existingUser.lastModifiedBy = userId;

  //   await this.userRepository.save(existingUser);
  // }
}
