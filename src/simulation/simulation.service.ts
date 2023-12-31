import { Injectable } from '@nestjs/common';
import { Gateway } from '../gateway/gateway';
import { MatchScores } from '../types/matches';

@Injectable()
export class SimulationService {
  constructor(private readonly gateway: Gateway) {}

  private timeOfLastSimulation: Date | null = null;
  private isFinished: boolean = false;
  private timeoutFunction: ReturnType<typeof setTimeout>;
  private interval: ReturnType<typeof setInterval>;
  private matchScores: MatchScores = {
    'Germany vs Poland': { home: 0, away: 0 },
    'Brazil vs Mexico': { home: 0, away: 0 },
    'Argentina vs Uruguay': { home: 0, away: 0 },
  };

  //check if user can start a new simulation (last simulation had to have happened at least 5min ago)
  canStartNewSimulation() {
    if (!this.timeOfLastSimulation || this.isFinished) {
      this.isFinished = false;
      return true;
    } else {
      let currentTime: Date = new Date(Date.now());
      let differenceInMinutes =
        Math.abs(this.timeOfLastSimulation.getTime() - currentTime.getTime()) /
        1000 /
        60;
      return differenceInMinutes >= 5;
    }
  }

  startSimulation(): string {
    if (!this.canStartNewSimulation()) {
      throw new Error('Can only start a simulation once every 5 minutes');
    }

    this.timeOfLastSimulation = new Date(Date.now());

    //every 10 seconds a team scores

    const interval = setInterval(() => {
      const matchNames = Object.keys(this.matchScores);

      const randomIndex = Math.floor(Math.random() * matchNames.length);
      const scoringMatch = matchNames[randomIndex];

      const scoringTeam: string = Math.random() > 0.5 ? 'home' : 'away';
      this.matchScores[scoringMatch][scoringTeam] += 1;

      //send goal update to frontend
      this.gateway.sendScoreUpdates(this.matchScores);
    }, 10000);

    this.interval = interval;

    //simulation takes 90 seconds
    this.timeoutFunction = setTimeout(() => {
      this.finishSimulation();
    }, 90000);

    return 'Simulation successfully started';
  }

  finishSimulation(): string {
    //if simulation wasn't started, it cannot be finished
    if (!this.timeoutFunction)
      throw new Error('No simulation has been started');

    //clear 90 second timeout
    clearTimeout(this.timeoutFunction);

    //clear intervals
    clearInterval(this.interval);

    this.isFinished = true;

    return 'Simulation successfully finished';
  }

  restartSimulation(): string {
    //check to make sure that a simulation has finished
    if(!this.isFinished){
      throw new Error('Cannot restart a simulation that has not finished or is not running.');
    }
    //reset match scores
    this.matchScores = {
      'Germany vs Poland': { home: 0, away: 0 },
      'Brazil vs Mexico': { home: 0, away: 0 },
      'Argentina vs Uruguay': { home: 0, away: 0 },
    };

    //start simulation
    this.startSimulation();
    return 'Simulation successfully restarted';
  }
}
