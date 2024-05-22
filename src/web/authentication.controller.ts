import { Controller, Logger, Post, Req, Request, Body, Get, Query, } from '@nestjs/common';
import { AuthenticationService } from '../service/authentication.service';
import { LoginResultDTO } from '../dto/logon/login-result.dto';
import { SignupCredentialsDTO } from '../dto/logon/signup-credentials.dto';
import { LoginCredentialsDTO } from '../dto/logon/login-credentials.dto';

@Controller('api/auth')
export class AuthenticationController {
  logger = new Logger('AuthenticationController');

  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post("signup")
  async signup(@Req() req: Request, @Body() dto: SignupCredentialsDTO): Promise<void> {
    return await this.authenticationService.signup(dto);
  }

  @Post("login")
  async login(@Req() req: Request, @Body() dto: LoginCredentialsDTO): Promise<LoginResultDTO> {
    const result = await this.authenticationService.login(dto);
    return result;
  }
}