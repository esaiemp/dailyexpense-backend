import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../modules/users/user';
import { Repository } from 'typeorm';
import { LicenseeService } from '../licensee.service';
import { Licensee } from '../../dal/entities/licensee.entity';
import { UsersService } from '../../services/users.service';
import { LicenseeRepository } from '../../dal/repositories/licensee.repository';
import { NotFoundException } from '@nestjs/common';

const mockUser ={
  userId: 'F409E6C5-743D-ED11-ABB5-0A41E979A500',
  username: 'testUser@test.com',
  password: 'somePassword',
  roles: ['Icasa'],
  hasAdminRights: true
}as User;

const mockLicensee ={
  id: 1,
  companyName: "testing",
  companyRegistrationNumber: "2002/089060/22",
  licensed: true,
  financeRef: "testing",
  businessAddressLine1: "testing",
  businessAddressLine2: "testing",
  businessSuburb: "testing",
  businessCity: "testing",
  businessPostalCode: "testing",
  businessFax: "testing",
  businessTelephone: "0710322111",
  businessEmail: "testing@test.com",
  licenseeStatus: "1",
  website: "www.test.nestjs.con",
  postalBox: "85",
  postalSurburb: "85",
  postalCode: "85",
  lastAuditDate: "2022-09-28T11:35:11.305Z",
  comments: "testing",
  additionalInfo: "testing"
};

describe('LicenseeService',()=>{
    let service: LicenseeService;
    let repository: MockType<Repository<Licensee>>;
        
    const mockUsersService = ()=>({
      findById: jest.spyOn(UsersService.prototype as any, 'findById'),
    });

    beforeEach(async()=>{
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LicenseeService,
                { provide: LicenseeRepository, 
                  useFactory: repositoryMockFactory},
                { provide: UsersService, 
                  useFactory: mockUsersService},
            ]
        }).compile();

        service = module.get<LicenseeService>(LicenseeService);
        repository = module.get(LicenseeRepository); 
    });

    afterEach(()=>{
      jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
      });

    describe('findAll', ()=>{
      it('should get all licensees', async ()=>{
        jest.spyOn(repository,'createQueryBuilder').mockImplementationOnce(()=>({
          where: ()=>({
            getMany: jest.fn().mockResolvedValue([mockLicensee]),
            where: jest.fn()
          })
        }));
         const result = await service.findAll(mockUser);
         expect(result).toEqual([mockLicensee]);
       });
    });

    describe('create', ()=>{
      const newLicensee ={
        userId: "84C84BFB-463F-ED11-BBCF-00155D727339",
        companyName: "testing",
        companyRegistrationNumber: "2000/089060/20",
        licensed: true,
        financeRef: "testing",
        businessAddressLine1: "testing",
        businessAddressLine2: "testing",
        businessSuburb: "testing",
        businessCity: "testing",
        businessPostalCode: "testing",
        businessFax: "testing",
        businessTelephone: "0710322111",
        businessEmail: "testing@test.com",
        licenseeStatus: "1",
        website: "www.test.nestjs.con",
        postalBox: "85",
        postalSurburb: "85",
        postalCode: "85",
        lastAuditDate: "2022-09-28T11:35:11.305Z",
        comments: "testing",
        additionalInfo: "testing"
      };

      it('should create a new licensee and return its created id', async ()=>{
        jest.spyOn(repository, 'save').mockImplementationOnce(()=> Promise.resolve(mockLicensee));
        const result = await service.create(newLicensee as any, mockUser);
        expect(result).toEqual(mockLicensee.id);
      });
    });

    describe('findById', ()=>{ 
      const findLicenseeSpy = jest.spyOn(LicenseeService.prototype as any, 'findLicensee');
      it('should call findLincensee private method', async ()=>{
        findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(mockLicensee));
        expect(findLicenseeSpy).not.toHaveBeenCalled();
        await service.findById(1, mockUser);
        expect(findLicenseeSpy).toHaveBeenCalled();
      });

      it('should throw a Not Found Exception', async ()=>{
        findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(null));
        await expect(service.findById(0, mockUser)).rejects.toThrow(NotFoundException);

      });

      it('should get a licensee by id', async ()=>{
        findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(mockLicensee));
        const result = await service.findById(1, mockUser);
        expect(result).toEqual(mockLicensee);
      });
    });

    describe('update', ()=>{
      const findLicenseeSpy = jest.spyOn(LicenseeService.prototype as any, 'findLicensee');
      const saveUpdatedChangesSpy = jest.spyOn(LicenseeService.prototype as any, 'saveUpdatedChanges');
      const updateLicensee ={
        userId: "84C84BFB-463F-ED11-BBCF-00155D727339",
        companyName: "testing",
        companyRegistrationNumber: "2000/089060/20",
        licensed: true,
        financeRef: "testing",
        businessAddressLine1: "testing",
        businessAddressLine2: "testing",
        businessSuburb: "testing",
        businessCity: "testing",
        businessPostalCode: "testing",
        businessFax: "testing",
        businessTelephone: "0710322111",
        businessEmail: "testing@test.com",
        licenseeStatus: "1",
        website: "www.test.nestjs.con",
        postalBox: "85",
        postalSurburb: "85",
        postalCode: "85",
        lastAuditDate: "2022-09-28T11:35:11.305Z",
        comments: "testing",
        additionalInfo: "testing"
      };

      it('should call findLincensee private method', async ()=>{
        findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(mockLicensee));
        expect(findLicenseeSpy).not.toHaveBeenCalled();
        await service.update(1, updateLicensee as any, mockUser);
        expect(findLicenseeSpy).toHaveBeenCalled();
      });

      it('should call saveUpdatedChanges private method', async ()=>{
        findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(mockLicensee));
        expect(saveUpdatedChangesSpy).not.toHaveBeenCalled();
        await service.update(1, updateLicensee as any, mockUser);
        expect(saveUpdatedChangesSpy).toHaveBeenCalled();
      });

      it('should throw a Not Found Exception', async ()=>{
        findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(null));
        await expect(service.update(0, updateLicensee as any, mockUser)).rejects.toThrow(NotFoundException);
      });
    });

    describe('delete', ()=>{
      const findLicenseeSpy = jest.spyOn(LicenseeService.prototype as any, 'findLicensee');
      const saveUpdatedChangesSpy = jest.spyOn(LicenseeService.prototype as any, 'saveUpdatedChanges');
      let deleteLicensee = {...mockLicensee, isDeleted : true};
      const deletedLicensee = {...mockLicensee, isDeleted : false};
      it('should call findLincensee private method', async ()=>{
        findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(mockLicensee));
        expect(findLicenseeSpy).not.toHaveBeenCalled();
        await service.delete(1, mockUser);
        expect(findLicenseeSpy).toHaveBeenCalled();
      });

      it('should call saveUpdatedChanges private method', async ()=>{
        findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(mockLicensee));
        expect(saveUpdatedChangesSpy).not.toHaveBeenCalled();
        await service.delete(1, mockUser);
        expect(saveUpdatedChangesSpy).toHaveBeenCalled();
      });

      it('should throw a Not Found Exception', async ()=>{
        findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(null));
        await expect(service.delete(0, mockUser)).rejects.toThrow(NotFoundException);

      });

      it('should delete an existing licensee', async ()=>{
        findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(deleteLicensee));
        saveUpdatedChangesSpy.mockImplementationOnce(()=> Promise.resolve(deletedLicensee));
        expect(deleteLicensee.isDeleted).toEqual(true);
        await service.delete(1, mockUser);
        expect(deleteLicensee.isDeleted).toEqual(deletedLicensee.isDeleted);
        expect(deleteLicensee.isDeleted).toEqual(false);
      });

    });

    describe('checkParentItem', ()=>{
      const findLicenseeSpy = jest.spyOn(LicenseeService.prototype as any, 'findLicensee');
      it('should call findLincensee private method', async ()=>{
        findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(mockLicensee));
        expect(findLicenseeSpy).not.toHaveBeenCalled();
        await service.checkIfItemExists(1, mockUser);
        expect(findLicenseeSpy).toHaveBeenCalled();
      });

      it('should throw a NotFoundException', async ()=>{
        findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(null));
        await expect(service.checkIfItemExists(0, mockUser)).rejects.toThrow(NotFoundException);
      });
    });

});

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    createQueryBuilder: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
}))
export type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
};
  