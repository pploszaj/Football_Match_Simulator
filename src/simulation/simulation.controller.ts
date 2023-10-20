import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationNameDto } from './dto/simulationName.dto';

@Controller('simulation')
export class SimulationController {
    constructor(private readonly service: SimulationService){}

    @Post('start')
    startSimulation(@Body(new ValidationPipe) name: SimulationNameDto){
        return 
    }

    @Post('finish')
    finishSimulation(){}

    @Post('restart')
    restartSimulation(){}

}
