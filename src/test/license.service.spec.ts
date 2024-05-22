import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../modules/users/user';
import { Repository } from 'typeorm';
import { LicenseeService } from '../licensee.service';
import { NotFoundException } from '@nestjs/common';
import { LicenseService } from '../license.service';
import { License } from '../../dal/entities/license.entity';
import { LicenseRepository } from '../../dal/repositories/license.repository';

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

describe('LicenseService',()=>{
    let service: LicenseService;
    let repository: MockType<Repository<License>>;

    const mockLicenseeService = ()=>({
      checkIfItemExists: jest.spyOn(LicenseeService.prototype as any, 'checkIfItemExists'),
    });
    
    beforeEach(async()=>{
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LicenseService,
                { provide: LicenseRepository, 
                  useFactory: repositoryMockFactory},
                { provide: LicenseeService, 
                  useFactory: mockLicenseeService},
            ]
        }).compile();

        service = module.get<LicenseService>(LicenseService);
        repository = module.get(LicenseRepository); 
    });

    afterEach(()=>{
      jest.clearAllMocks();
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    // describe('findAll', ()=>{
    //   it('should get all licenses', async ()=>{
    //     jest.spyOn(repository,'createQueryBuilder').mockImplementationOnce(()=>({
    //       where: ()=>({
    //         getMany: jest.fn().mockResolvedValue([mockLicense]),
    //         where: jest.fn()
    //       }),
    //       getMany: jest.fn().mockResolvedValue([mockLicense]),
    //     }));
    //      const result = await service.findAll(mockUser);
    //      expect(result).toEqual([mockLicense]);
    //    });
    // });

    describe('create', ()=>{
      const newLicense ={
        "licenseeId": 1,
        "licenseNumber": "54878000",
        "licenseType": "Internal",
        "issueDate": "2022-10-03T12:47:49.336Z",
        "isValid": true
      };
      const checkIfItemExists =jest.spyOn(LicenseeService.prototype as any, 'checkIfItemExists');

      it('should create a new license and return its created id', async ()=>{
        const saveSpy = jest.spyOn(repository, 'save').mockImplementationOnce(()=> Promise.resolve(mockLicense));
        checkIfItemExists.mockImplementationOnce(()=> Promise.resolve(parentItem));
        expect(saveSpy).not.toHaveBeenCalled();
        expect(checkIfItemExists).not.toHaveBeenCalled();
        const result = await service.create(newLicense as any, mockUser);
        expect(saveSpy).toHaveBeenCalled();
        expect(checkIfItemExists).toHaveBeenCalled();
        expect(result).toEqual(mockLicense.id);
      });

    //   it('should throw a Not Found exception if the licensee id does not exist', async ()=>{
    //     const newLicenseWithNonExistingParent={...newLicense, licenseeId:0 };
    //     checkParentItemSpy.mockImplementationOnce(() => { throw new NotFoundException(`No parent item found.`)});
    //     await expect(service.create(newLicenseWithNonExistingParent as any, mockUser)).rejects.toThrow(NotFoundException);
    //   });
     });

    // describe('findById', ()=>{ 
    //   const findLicenseSpy = jest.spyOn(LicenseService.prototype as any, 'findLicense');
    //   it('should call findLincense private method', async ()=>{
    //     findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(mockLicense));
    //     expect(findLicenseSpy).not.toHaveBeenCalled();
    //     await service.findById(1, mockUser);
    //     expect(findLicenseSpy).toHaveBeenCalled();
    //   });

    //   it('should throw a Not Found Exception', async ()=>{
    //     findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(null));
    //     await expect(service.findById(0, mockUser)).rejects.toThrow(NotFoundException);
    //   });

    //   it('should get a license by id', async ()=>{
    //     findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(mockLicense));
    //     const result = await service.findById(1, mockUser);
    //     expect(result).toEqual(mockLicense);
    //   });
    // });

    // describe('update', ()=>{
    //   const findLicenseSpy = jest.spyOn(LicenseService.prototype as any, 'findLicense');
    //   const updateLicense ={
    //     "licenseeId": 1,
    //     "licenseNumber": "Testing",
    //     "licenseType": "Testing",
    //     "issueDate": "2022-10-03T12:47:49.336Z",
    //     "isValid": true
    //   };

    //   it('should call findLincensee private method', async ()=>{
    //     findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(mockLicense));
    //     expect(findLicenseSpy).not.toHaveBeenCalled();
    //     await service.update(1, updateLicense as any, mockUser);
    //     expect(findLicenseSpy).toHaveBeenCalled();
    //   });

    //   it('should throw a Not Found Exception if the license id does not exist', async ()=>{
    //     findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(null));
    //     await expect(service.update(0, updateLicense as any, mockUser)).rejects.toThrow(NotFoundException);
    //   });
    // });

    // describe('delete', ()=>{
    //   const findLicenseSpy = jest.spyOn(LicenseService.prototype as any, 'findLicense');
    //   it('should call findLincense private method', async ()=>{
    //     findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(mockLicense));
    //     expect(findLicenseSpy).not.toHaveBeenCalled();
    //     await service.delete(1, mockUser);
    //     expect(findLicenseSpy).toHaveBeenCalled();
    //   });

    //   it('should throw a Not Found Exception', async ()=>{
    //     findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(null));
    //     await expect(service.delete(0, mockUser)).rejects.toThrow(NotFoundException);

    //   });

      // it('should delete an existing license', async ()=>{
      //   const licensesList = [mockLicense];
      //   findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(mockLicense));
      //   jest.spyOn(repository,'remove').mockImplementationOnce(()=> Promise.resolve(licensesList.splice(0, 1)));
      //   expect(licensesList.length).toBe(1);
      //   await service.delete(1, mockUser);
      //   console.log(licensesList[0]);
      //   expect(licensesList.length).not.toBe(1);
      //   expect(licensesList.length).toBe(0);
      // });

    //});

});

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    createQueryBuilder: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
}))
export type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
};
  