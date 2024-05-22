import { Test, TestingModule } from '@nestjs/testing';
import { RoleRepository } from '../dal/repository/role.repository';
import { CaseManagerService } from '../../services/case-manager.service';
import { RolesService } from '../../services/roles.service';
import { User } from '../modules/users/user';
import { Repository } from 'typeorm';
import { Role } from '../dal/entities/role.entity';

describe('RolesService',()=>{
    let rolesService: RolesService;
    let roleRepository: MockType<Repository<Role>>;
    let caseManagerService: CaseManagerService;

    const mockUser ={
      userId: 'F409E6C5-743D-ED11-ABB5-0A41E979A500',
      username: 'testUser@test.com',
      password: 'somePassword',
      roles: ['Admin'],
      hasAdminRights: true
    }as User;

    const mockRoleRepository = () => ({
        find: jest.fn(),
        map: jest.fn()
    });

    const mockCaseManagerService = ()=>({
        emitRoleCreated: jest.fn(),
        emitRoleDisabled: jest.fn(),
    });

    beforeEach(async()=>{
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RolesService,
                { provide: RoleRepository, 
                  useFactory: repositoryMockFactory},
                { provide: CaseManagerService, 
                    useFactory: mockCaseManagerService},
            ]
        }).compile();

        rolesService = module.get<RolesService>(RolesService);
        roleRepository = module.get(RoleRepository); 
       // caseManagerService = module.get<CaseManagerService>(CaseManagerService);   
    });

    it('should be defined', () => {
        expect(rolesService).toBeDefined();
      });
      
      it('should be defined', () => {
        expect(roleRepository).toBeDefined();
      });
    
      

    describe('findAll', ()=>{
        it('calls RolesRepository.find and returns the result', async()=>{
            var result = await rolesService.findAll(mockUser);
             expect(roleRepository.find).toHaveBeenCalled();   
            //expect(roleRepository.find).toHaveBeenCalled;   
                
        });
    });

});

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    find: jest.fn(),
    save: jest.fn(),
  
  }))
  export type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
  };
  