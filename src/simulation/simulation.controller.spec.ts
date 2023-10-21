import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SimulationController } from './simulation.controller';
import { SimulationService } from './simulation.service';

describe('SimulationController', () => {
  let controller: SimulationController;

  const mockSimulationService = {
    startSimulation: jest.fn(),
    finishSimulation: jest.fn(),
    restartSimulation: jest.fn()
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulationController],
      providers: [SimulationService]
    }).overrideProvider(SimulationService).useValue(mockSimulationService).compile();

    controller = module.get<SimulationController>(SimulationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('startSimulation', () => {
    it('should successfully start a simulation', () => {
      mockSimulationService.startSimulation.mockReturnValue('Simulation successfully started')
      expect(controller.startSimulation({name: "Katar 2023"})).toBe(`Simulation successfully started`);
      expect(mockSimulationService.startSimulation).toHaveBeenCalled();
    });

    it('should throw a BadRequestException if the service throws an error', () => {
      mockSimulationService.startSimulation.mockImplementation(() => {
        throw new BadRequestException('You can only start a new simulation once every 5 minutes.');
      })

      expect(() => controller.startSimulation({name: "Katar 2023"})).toThrow(BadRequestException);
      expect(() => controller.startSimulation({name: "Katar 2023"})).toThrow('You can only start a new simulation once every 5 minutes.');
    })

    
  })
});
