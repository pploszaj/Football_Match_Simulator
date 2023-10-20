import { Injectable } from '@nestjs/common';

@Injectable()
export class SimulationService {

    private timeOfLastSimulation: Date | null = null;

    //check if user can start a new simulation (last simulation had to have happened at least 5min ago)
    canStartNewSimulation(){
        if(!this.timeOfLastSimulation) {
            return true;
        } else {
            let currentTime: Date = new Date();
            let differenceInMinutes = ((Math.abs(this.timeOfLastSimulation.getTime() - currentTime.getTime())) / 1000) / 60;
            return differenceInMinutes >= 5;
        }
    }

    startSimulation(){
        if(!this.canStartNewSimulation()) throw Error;
        this.timeOfLastSimulation = new Date();

    }
}
