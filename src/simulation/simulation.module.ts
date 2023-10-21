import { Module } from '@nestjs/common';
import { SimulationController } from './simulation.controller';
import { SimulationService } from './simulation.service';
import { GatewayModule } from '../gateway/gateway.module';
import { Gateway } from 'src/gateway/gateway';

@Module({
  controllers: [SimulationController],
  providers: [SimulationService, Gateway],
  imports: [GatewayModule]
})
export class SimulationModule {}
