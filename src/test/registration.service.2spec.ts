import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../modules/users/user';
import { Repository } from 'typeorm';
import { LicenseeService } from '../licensee.service';
import { Licensee } from '../../dal/entities/licensee.entity';
import { UsersService } from '../../services/users.service';
import { LicenseeRepository } from '../../dal/repositories/licensee.repository';
import { NotFoundException } from '@nestjs/common';
import { RegistrationService } from '../staff.service';
import { Registration } from '../../dal/entities/staff.entity';
import { RegistrationRepository } from '../../dal/repositories/staff.repository';

const mockUser ={
  userId: 'F409E6C5-743D-ED11-ABB5-0A41E979A500',
  username: 'testUser@test.com',
  password: 'somePassword',
  roles: ['Icasa'],
  hasAdminRights: true
}as User;

const mockRegistration ={
  id: 1,
  licenseNumber: "testing",
  licenseeCompanyName: "testing",
  licenseeTelNo: "testing",
  contactTitle: "testing",
  contactPersonName: "testing",
  contactTelNo: "testing",
  contactCellNo: "testing",
  contactEmail: "testing",
  contactIsInternalEmployee: true,
  contactCompanyName: "testing",
  companyStreetAddress1: "testing",
  companyStreetAddress2: "testing",
  companySuburb: "testing",
  companyCity: "testing",
  companyPostalCode: "testing"
};

describe('RegistrationService',()=>{
    let service: RegistrationService;
    let repository: MockType<Repository<Registration>>;

    beforeEach(async()=>{
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RegistrationService,
                { provide: RegistrationRepository, 
                  useFactory: repositoryMockFactory},
            ]
        }).compile();

        service = module.get<RegistrationService>(RegistrationService);
        repository = module.get(RegistrationRepository); 
    });

    afterEach(()=>{
      jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', ()=>{
      it('should get all registrations', async ()=>{
        jest.spyOn(repository,'createQueryBuilder').mockImplementationOnce(()=>({
          where: ()=>({
            getMany: jest.fn().mockResolvedValue([mockRegistration]),
            where: jest.fn()
          }),
          getMany: jest.fn().mockResolvedValue([mockRegistration]),
        }));
         const result = await service.findAll(mockUser);
         expect(result).toEqual([mockRegistration]);
       });
    });

    // describe('create', ()=>{
    //   const newRegistration ={
    //     licenseNumber: "testing",
    //     licenseeCompanyName: "testing",
    //     licenseeTelNo: "testing",
    //     contactTitle: "testing",
    //     contactPersonName: "testing",
    //     contactTelNo: "testing",
    //     contactCellNo: "testing",
    //     contactEmail: "testing",
    //     contactIsInternalEmployee: true,
    //     contactCompanyName: "testing",
    //     companyStreetAddress1: "testing",
    //     companyStreetAddress2: "testing",
    //     companySuburb: "testing",
    //     companyCity: "testing",
    //     companyPostalCode: "testing"
    //   };

    //   it('should create a new registration and return its created id', async ()=>{
    //     const saveSpy = jest.spyOn(repository, 'save').mockImplementationOnce(()=> Promise.resolve(mockRegistration));
    //     expect(saveSpy).not.toHaveBeenCalled();
    //     const result = await service.create(newRegistration as any, mockUser);
    //     expect(saveSpy).toHaveBeenCalled();
    //     expect(result).toEqual(mockRegistration.id);
    //   });
    // });

    // describe('findById', ()=>{ 
    //   const findLicenseeSpy = jest.spyOn(LicenseeService.prototype as any, 'findLicensee');
    //   it('should call findLincensee private method', async ()=>{
    //     findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(mockLicensee));
    //     expect(findLicenseeSpy).not.toHaveBeenCalled();
    //     await service.findById(1, mockUser);
    //     expect(findLicenseeSpy).toHaveBeenCalled();
    //   });

    //   it('should throw a Not Found Exception', async ()=>{
    //     findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(null));
    //     await expect(service.findById(0, mockUser)).rejects.toThrow(NotFoundException);

    //   });

    //   it('should get a licensee by id', async ()=>{
    //     findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(mockLicensee));
    //     const result = await service.findById(1, mockUser);
    //     expect(result).toEqual(mockLicensee);
    //   });
    // });

    // describe('update', ()=>{
    //   const findLicenseeSpy = jest.spyOn(LicenseeService.prototype as any, 'findLicensee');
    //   const saveUpdatedChangesSpy = jest.spyOn(LicenseeService.prototype as any, 'saveUpdatedChanges');
    //   const updateLicensee ={
    //     userId: "84C84BFB-463F-ED11-BBCF-00155D727339",
    //     companyName: "testing",
    //     companyRegistrationNumber: "2000/089060/20",
    //     licensed: true,
    //     financeRef: "testing",
    //     businessAddressLine1: "testing",
    //     businessAddressLine2: "testing",
    //     businessSuburb: "testing",
    //     businessCity: "testing",
    //     businessPostalCode: "testing",
    //     businessFax: "testing",
    //     businessTelephone: "0710322111",
    //     businessEmail: "testing@test.com",
    //     licenseeStatus: "1",
    //     website: "www.test.nestjs.con",
    //     postalBox: "85",
    //     postalSurburb: "85",
    //     postalCode: "85",
    //     lastAuditDate: "2022-09-28T11:35:11.305Z",
    //     comments: "testing",
    //     additionalInfo: "testing"
    //   };

    //   it('should call findLincensee private method', async ()=>{
    //     findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(mockLicensee));
    //     expect(findLicenseeSpy).not.toHaveBeenCalled();
    //     await service.update(1, updateLicensee as any, mockUser);
    //     expect(findLicenseeSpy).toHaveBeenCalled();
    //   });

    //   it('should call saveUpdatedChanges private method', async ()=>{
    //     findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(mockLicensee));
    //     expect(saveUpdatedChangesSpy).not.toHaveBeenCalled();
    //     await service.update(1, updateLicensee as any, mockUser);
    //     expect(saveUpdatedChangesSpy).toHaveBeenCalled();
    //   });

    //   it('should throw a Not Found Exception', async ()=>{
    //     findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(null));
    //     await expect(service.update(0, updateLicensee as any, mockUser)).rejects.toThrow(NotFoundException);
    //   });
    // });

    // describe('delete', ()=>{
    //   const findLicenseeSpy = jest.spyOn(LicenseeService.prototype as any, 'findLicensee');
    //   const saveUpdatedChangesSpy = jest.spyOn(LicenseeService.prototype as any, 'saveUpdatedChanges');
    //   let deleteLicensee = {...mockLicensee, isDeleted : true};
    //   const deletedLicensee = {...mockLicensee, isDeleted : false};
    //   it('should call findLincensee private method', async ()=>{
    //     findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(mockLicensee));
    //     expect(findLicenseeSpy).not.toHaveBeenCalled();
    //     await service.delete(1, mockUser);
    //     expect(findLicenseeSpy).toHaveBeenCalled();
    //   });

    //   it('should call saveUpdatedChanges private method', async ()=>{
    //     findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(mockLicensee));
    //     expect(saveUpdatedChangesSpy).not.toHaveBeenCalled();
    //     await service.delete(1, mockUser);
    //     expect(saveUpdatedChangesSpy).toHaveBeenCalled();
    //   });

    //   it('should throw a Not Found Exception', async ()=>{
    //     findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(null));
    //     await expect(service.delete(0, mockUser)).rejects.toThrow(NotFoundException);

    //   });

    //   it('should delete an existing licensee', async ()=>{
    //     findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(deleteLicensee));
    //     saveUpdatedChangesSpy.mockImplementationOnce(()=> Promise.resolve(deletedLicensee));
    //     expect(deleteLicensee.isDeleted).toEqual(true);
    //     await service.delete(1, mockUser);
    //     expect(deleteLicensee.isDeleted).toEqual(deletedLicensee.isDeleted);
    //     expect(deleteLicensee.isDeleted).toEqual(false);
    //   });

    // });

    // describe('checkParentItem', ()=>{
    //   const findLicenseeSpy = jest.spyOn(LicenseeService.prototype as any, 'findLicensee');
    //   it('should call findLincensee private method', async ()=>{
    //     findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(mockLicensee));
    //     expect(findLicenseeSpy).not.toHaveBeenCalled();
    //     await service.checkParentItem(1, mockUser);
    //     expect(findLicenseeSpy).toHaveBeenCalled();
    //   });

    //   it('should throw a NotFoundException', async ()=>{
    //     findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(null));
    //     await expect(service.checkParentItem(0, mockUser)).rejects.toThrow(NotFoundException);
    //   });
    // });

    // describe('linkLicenseeToUser', ()=>{
    //     const linkToUser = {
    //       userId: '84C84BFB-463F-ED11-BBCF-00155D727339',
    //       username: 'aUser@test.com',
    //       password: 'somePassword',
    //       roles: ['Applicant'],
    //       hasAdminRights: false
    //     }as User;
    //     const findLicenseeSpy = jest.spyOn(LicenseeService.prototype as any, 'findLicensee');
    //     const findByIdSpy =jest.spyOn(UsersService.prototype as any, 'findById');
    //     const saveUpdatedChangesSpy = jest.spyOn(LicenseeService.prototype as any, 'saveUpdatedChanges');

    //     it('should throw a NotFoundException', async ()=>{
    //       findLicenseeSpy.mockImplementationOnce(()=> Promise.resolve(null));
    //       await expect(service.linkLicenseeToUser(0,'wrognId',mockUser)).rejects.toThrow(NotFoundException);
    //     });
    //     it('should not update the userId of an existing licensee if the userId is not found', async ()=>{
    //       findLicenseeSpy.mockResolvedValueOnce(mockLicensee);
    //       findByIdSpy.mockImplementationOnce(()=> Promise.resolve(null));
    //       const userIdBeforeCall = mockLicensee.userId;
    //       expect(saveUpdatedChangesSpy).not.toHaveBeenCalled();
    //       await service.linkLicenseeToUser(1, linkToUser.userId, linkToUser);
    //       expect(mockLicensee.userId).toBe(userIdBeforeCall);
    //       expect(mockLicensee.userId).not.toBe(linkToUser.userId);
    //       expect(saveUpdatedChangesSpy).not.toHaveBeenCalled();
    //     });

    //     it('should update the userId of an existing licensee if the userId is found', async ()=>{
    //       findLicenseeSpy.mockResolvedValueOnce(mockLicensee);
    //       findByIdSpy.mockImplementationOnce(()=> Promise.resolve(linkToUser));
    //       const userIdBeforeCall = mockLicensee.userId;
    //       expect(saveUpdatedChangesSpy).not.toHaveBeenCalled();
    //       await service.linkLicenseeToUser(1, linkToUser.userId, linkToUser);
    //       expect(mockLicensee.userId).not.toBe(userIdBeforeCall);
    //       expect(mockLicensee.userId).toBe(linkToUser.userId);
    //       expect(saveUpdatedChangesSpy).toHaveBeenCalled();
    //     });

    // });

});

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    createQueryBuilder: jest.fn(),
    save: jest.fn(),
    // findOne: jest.fn(),
}))
export type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
};
  