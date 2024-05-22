import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { HealthCheckService } from '../../services/health-check.service';

describe('HealthCheckService',()=>{
    let service: HealthCheckService;
    
    beforeEach(async()=>{
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HealthCheckService,
            ]
        }).compile();

        service = module.get<HealthCheckService>(HealthCheckService);
    });

    afterEach(()=>{
      jest.clearAllMocks();
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('isLive', ()=>{
      it('should return success', async ()=>{
        const result = await service.isLive();
        expect(result).toEqual('Success');
       });
    });
});

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    //createQueryBuilder: jest.fn(),
    
}))
export type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
};
  