import { Test, TestingModule } from '@nestjs/testing';
import { SimulationService } from './simulation.service';
import { Gateway } from '../gateway/gateway';

describe('SimulationService', () => {
  let service: SimulationService;

  const mockGatewayService = {
    sendScoreUpdates: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulationService, Gateway],
    })
      .overrideProvider(Gateway)
      .useValue(mockGatewayService)
      .compile();

    service = module.get<SimulationService>(SimulationService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('canStartNewSimulation', () => {
    it('should return true if no simulation has been started or if the last simulation was started more than 5 minutes ago', () => {
      expect(service.canStartNewSimulation()).toBeTruthy();
    });

    it('should return false if simulation was started less than 5 minutes ago', () => {
      jest
        .spyOn(Date, 'now')
        .mockReturnValue(new Date('2023-10-20T10:00:00Z').getTime());
      service['timeOfLastSimulation'] = new Date(Date.now());
      jest
        .spyOn(Date, 'now')
        .mockReturnValue(new Date('2023-10-20T10:04:00Z').getTime());
      expect(service.canStartNewSimulation()).toBeFalsy();
    });
  });

  describe('startSimulation', () => {
    jest.useFakeTimers();
    it('should throw error if a simulation was started less than 5 minutes ago', () => {
      jest
        .spyOn(Date, 'now')
        .mockReturnValue(new Date('2023-10-20T10:00:00Z').getTime());
      service.startSimulation();
      jest
        .spyOn(Date, 'now')
        .mockReturnValue(new Date('2023-10-20T10:04:00Z').getTime());
      expect(() => service.startSimulation()).toThrowError(
        'Can only start a simulation once every 5 minutes',
      );
    });

    it('should start simulation if last simulation was started more than 5 min ago', () => {
      jest
        .spyOn(Date, 'now')
        .mockReturnValue(new Date('2023-10-20T10:00:00Z').getTime());
      service.startSimulation();
      jest
        .spyOn(Date, 'now')
        .mockReturnValue(new Date('2023-10-20T10:05:00Z').getTime());
      expect(service.startSimulation()).toBe('Simulation successfully started');
    });

    it('simulation should finish after 90 seconds of running', () => {
      service.startSimulation();
      expect(service['isFinished']).toBe(false);
      jest.advanceTimersByTime(90000);
      expect(service['isFinished']).toBe(true);
    });
  });

  describe('finishSimulation', () => {
    it('should throw an error if trying to stop a simulation that has not been started', () => {
      expect(() => service.finishSimulation()).toThrowError(
        'No simulation has been started',
      );
    });

    it('should successfully finish a simulation', () => {
      service.startSimulation();
      expect(service.finishSimulation()).toBe(
        'Simulation successfully finished',
      );
    });
  });

  describe('restartSimulation', () => {
    it('should throw an error if trying to restart a simulation that has not been stopped', () => {
      service.startSimulation();
      expect(() => service.restartSimulation()).toThrowError(
        'Cannot restart a simulation that has not finished or is not running.',
      );
    });

    it('should successfuly restart a simulation that has been stopped', () => {
      service.startSimulation();
      service.finishSimulation();
      expect(service.restartSimulation()).toBe(
        'Simulation successfully restarted',
      );
    });
  });
});
