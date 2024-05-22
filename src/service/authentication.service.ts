import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { config } from 'dotenv';
import { get } from 'env-var';
import { AuthService } from '../modules/auth/auth.service';
import { UserCreateDTO } from '../dto/user/user-create.dto';
import { LoginResultDTO } from '../dto/logon/login-result.dto';
import { User } from '../modules/users/user';
import { UserService } from './user.service';
import { SignupCredentialsDTO } from '../dto/logon/signup-credentials.dto';
import { LoginCredentialsDTO } from '../dto/logon/login-credentials.dto';

@Injectable()
export class AuthenticationService {
  
  private readonly logger = new Logger(AuthenticationService.name); 
  
  private adminRoles:string[];

  //@IntentCanAdd()
  constructor( private authService:AuthService, private userService:UserService ) {
    //config();
    //this.adminRoles = get('ROLES_WITH_FULL_QUERY_RIGHTS').asString()?.split(',');
  }

 
  async signup(dto: SignupCredentialsDTO): Promise<void> {
    const newUser = {
      username: dto.username,
      password: dto.password,
      displayName: dto.displayName
    } as UserCreateDTO;
    const result = await this.userService.create(newUser);
  }
 
  async login(dto: LoginCredentialsDTO): Promise<LoginResultDTO> {
    const user = await this.authService.validateUser(dto.username, dto.password);
    return this.signInValidatedUser(user);
  }
 
   
  private async signInValidatedUser(user: User): Promise<LoginResultDTO> {
    if(user ==null){
      throw new UnauthorizedException("Please check your login credentials");
    }
    const  { ...userFiltered } = user;
    const result = await this.authService.login(userFiltered);
    try{
      //Update LastLoginDate in DB
      await this.userService.updateLastLoginDate(user);
    }catch(err){
      this.logger.error(`${err?.stack}`);
    }
    return result;
  }
}
