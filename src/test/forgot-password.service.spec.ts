import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../modules/users/user';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { AuthService } from '../modules/auth/auth.service';
import { UsersService } from '../../services/users.service';

const mockUser ={
  userId: 'F409E6C5-743D-ED11-ABB5-0A41E979A500',
  username: 'testUser@test.com',
  password: 'somePassword',
  roles: ['Icasa'],
  hasAdminRights: true
}as User;

const mockLicense ={
  "id": 1,
  "licenseeId": 1,
  "licenseNumber": "54878000",
  "licenseType": "Internal",
  "issueDate": "2022-10-03T12:47:49.336Z",
  "isValid": true
};

const parentItem ={
  id: 1,
  companyName: "testing",
  // more Parent fields
};

describe('ForgotPasswordService',()=>{
    let service: ForgotPasswordService;
    
    const mockAuthService = ()=>({
    });

    const mockUsersService = ()=>({
    });
    
    beforeEach(async()=>{
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ForgotPasswordService,
                { provide: AuthService, 
                  useFactory: mockAuthService},
                { provide: UsersService, 
                  useFactory: mockUsersService},
            ]
        }).compile();

        service = module.get<ForgotPasswordService>(ForgotPasswordService);
    });

    afterEach(()=>{
      jest.clearAllMocks();
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

});

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    //createQueryBuilder: jest.fn()
}));

export type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
};