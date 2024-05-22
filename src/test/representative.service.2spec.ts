import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../modules/users/user';
import { Repository } from 'typeorm';
import { LicenseeService } from '../licensee.service';
import { NotFoundException } from '@nestjs/common';
import { RepresentativeService } from '../representative.service';
import { Representative } from '../../dal/entities/representative.entity';
import { RepresentativeRepository } from '../../dal/repositories/representative.repository';

const mockUser ={
  userId: 'F409E6C5-743D-ED11-ABB5-0A41E979A500',
  username: 'testUser@test.com',
  password: 'somePassword',
  roles: ['Icasa'],
  hasAdminRights: true
}as User;

const mockRepresentative ={
  "id": 1,
  "licenseeId": 1,
  "title": "testing",
  "name": "testing",
  "position": "testing",
  "telephone": "0842569918",
  "mobile": "0842569918",
  "email": "test@test.com",
  "isInternalEmployee": true
};

const parentItem ={
  id: 1,
  userId: "0BD1D0BB-713D-ED11-BBCE-00155DF5215A",
  companyName: "testing",
  // more Parent fields
};

describe('RepresentativeService',()=>{
    let service: RepresentativeService;
    let repository: MockType<Repository<Representative>>;

    const mockLicenseeService = ()=>({
      checkParentItem: jest.spyOn(LicenseeService.prototype as any, 'checkIfItemExists'),
    });
    
    beforeEach(async()=>{
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RepresentativeService,
                { provide: RepresentativeRepository, 
                  useFactory: repositoryMockFactory},
                { provide: LicenseeService, 
                  useFactory: mockLicenseeService},
            ]
        }).compile();

        service = module.get<RepresentativeService>(RepresentativeService);
        repository = module.get(RepresentativeRepository); 
    });

    afterEach(()=>{
      jest.clearAllMocks();
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('findAll', ()=>{
      it('should get all representatives', async ()=>{
        jest.spyOn(repository,'createQueryBuilder').mockImplementationOnce(()=>({
          where: ()=>({
            getMany: jest.fn().mockResolvedValue([mockRepresentative]),
            where: jest.fn(),
          }),
          getMany: jest.fn().mockResolvedValue([mockRepresentative]),
        }));
        const result = await service.findAll(mockUser);
        expect(result).toEqual([mockRepresentative]);
       });
    });

    describe('create', ()=>{
      const newRepresentative ={
        "licenseeId": 1,
        "title": "testing",
        "name": "testing",
        "position": "testing",
        "telephone": "testing",
        "mobile": "testing",
        "email": "testing",
        "isInternalEmployee": true
      };
      const checkParentItemSpy =jest.spyOn(LicenseeService.prototype as any, 'checkIfItemExists');

      it('should create a new license and return its created id', async ()=>{
        const saveSpy = jest.spyOn(repository, 'save').mockImplementationOnce(()=> Promise.resolve(mockRepresentative));
        checkParentItemSpy.mockImplementationOnce(()=> Promise.resolve(parentItem));
        expect(saveSpy).not.toHaveBeenCalled();
        expect(checkParentItemSpy).not.toHaveBeenCalled();
        const result = await service.create(newRepresentative as any, mockUser);
        expect(saveSpy).toHaveBeenCalled();
        expect(checkParentItemSpy).toHaveBeenCalled();
        expect(result).toEqual(mockRepresentative.id);
      });

      it('should throw a Not Found exception if the licensee id does not exist', async ()=>{
        const newItemWithNonExistingParent={...newRepresentative, licenseeId:0 };
        checkParentItemSpy.mockImplementationOnce(() => { throw new NotFoundException(`No parent item found.`)});
        await expect(service.create(newItemWithNonExistingParent as any, mockUser)).rejects.toThrow(NotFoundException);
      });
    });

    describe('findById', ()=>{ 
      const findLicenseSpy = jest.spyOn(RepresentativeService.prototype as any, 'findRepresentative');
      it('should call findLincense private method', async ()=>{
        findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(mockRepresentative));
        expect(findLicenseSpy).not.toHaveBeenCalled();
        await service.findById(1, mockUser);
        expect(findLicenseSpy).toHaveBeenCalled();
      });

      it('should throw a Not Found Exception', async ()=>{
        findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(null));
        await expect(service.findById(0, mockUser)).rejects.toThrow(NotFoundException);
      });

      it('should get a license by id', async ()=>{
        findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(mockRepresentative));
        const result = await service.findById(1, mockUser);
        expect(result).toEqual(mockRepresentative);
      });
    });

    describe('update', ()=>{
      const findLicenseSpy = jest.spyOn(RepresentativeService.prototype as any, 'findRepresentative');
      const updateRepresentative ={
        "licenseeId": 1,
        "title": "testing",
        "name": "testing",
        "position": "testing",
        "telephone": "testing",
        "mobile": "testing",
        "email": "testing",
        "isInternalEmployee": true
      };

      it('should call findRepresentative private method', async ()=>{
        findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(mockRepresentative));
        expect(findLicenseSpy).not.toHaveBeenCalled();
        await service.update(1, updateRepresentative as any, mockUser);
        expect(findLicenseSpy).toHaveBeenCalled();
      });

      it('should throw a Not Found Exception if the representative id does not exist', async ()=>{
        findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(null));
        await expect(service.update(0, updateRepresentative as any, mockUser)).rejects.toThrow(NotFoundException);
      });
    });

    describe('delete', ()=>{
      const findLicenseSpy = jest.spyOn(RepresentativeService.prototype as any, 'findRepresentative');
      it('should call findLincense private method', async ()=>{
        findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(mockRepresentative));
        expect(findLicenseSpy).not.toHaveBeenCalled();
        await service.delete(1, mockUser);
        expect(findLicenseSpy).toHaveBeenCalled();
      });

      it('should throw a Not Found Exception', async ()=>{
        findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(null));
        await expect(service.delete(0, mockUser)).rejects.toThrow(NotFoundException);

      });

      it('should delete an existing representative', async ()=>{
        const representativesList = [mockRepresentative];
        findLicenseSpy.mockImplementationOnce(()=> Promise.resolve(mockRepresentative));
        jest.spyOn(repository,'remove').mockImplementationOnce(()=> Promise.resolve(representativesList.splice(0, 1)));
        expect(representativesList.length).toBe(1);
        await service.delete(1, mockUser);
        expect(representativesList.length).not.toBe(1);
        expect(representativesList.length).toBe(0);
      });

    });

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
  