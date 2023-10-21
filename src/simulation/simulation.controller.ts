import { BadRequestException, Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationNameDto } from './dto/simulationName.dto';

@Controller('simulation')
export class SimulationController {
    constructor(private readonly simulationService: SimulationService){}

    @Post('start')
    startSimulation(@Body(new ValidationPipe) name: SimulationNameDto){
        try {
            return this.simulationService.startSimulation();
        } catch(err) {
            throw new BadRequestException('You can only start a new simulation once every 5 minutes.')
        }
    }

    @Get('finish')
    finishSimulation(){
        return this.simulationService.finishSimulation();
    }

    @Get('restart')
    restartSimulation(){
        try {
            return this.simulationService.restartSimulation();
        } catch(err) {
            throw new BadRequestException('You cannot restart a simulation that has not finished or is not currently running.')
        }
    }

}
