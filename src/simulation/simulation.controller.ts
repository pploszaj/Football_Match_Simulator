import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationNameDto } from './dto/simulationName.dto';

@Controller('simulation')
export class SimulationController {
    constructor(private readonly simulationService: SimulationService){}

    @Post('start')
    startSimulation(@Body(new ValidationPipe) name: SimulationNameDto){
        return this.simulationService.startSimulation();
    }

    @Post('finish')
    finishSimulation(){
        return this.simulationService.finishSimulation();
    }

    @Post('restart')
    restartSimulation(){
        return this.simulationService.restartSimulation();
    }

}
