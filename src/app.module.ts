import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SimulationModule } from './simulation/simulation.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [SimulationModule, GatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
