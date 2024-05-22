import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user';
import * as bcrypt from 'bcrypt';
import * as randToken from 'rand-token';
import { AddHoursToDate } from '../../shared/helper/add-hours-to-date.helper';
import { get } from 'env-var';
import { config } from 'dotenv';

@Injectable()
export class AuthService {
  
  private tokenDuration: number;

  //@IntentCanAdd()
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { 
    config();
    this.tokenDuration = get('REFRESH_TOKEN_DURATION').asFloatPositive();
  }

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  
  async login(user: User): Promise<{ access_token: string}> {
    const payload = { ...user };
    
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  private async authenticate(user: User, pass: string): Promise<User>{
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}