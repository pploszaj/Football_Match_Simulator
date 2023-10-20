import { Body, Controller, Post } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationNameDto } from './dto/simulationName.dto';

@Controller('simulation')
export class SimulationController {
    constructor(private readonly service: SimulationService){}

    @Post('start')
    startSimulation(@Body() name: SimulationNameDto){}

    @Post('finish')
    finishSimulation(){}

    @Post('restart')
    restartSimulation(){}

}
