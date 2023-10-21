import { Module } from '@nestjs/common';
import { SimulationController } from './simulation.controller';
import { SimulationService } from './simulation.service';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  controllers: [SimulationController],
  providers: [SimulationService],
  imports: [GatewayModule]
})
export class SimulationModule {}
