import { Injectable } from '@nestjs/common';
import { Gateway } from 'src/gateway/gateway';
import { MatchScores } from 'src/types/matches';

@Injectable()
export class SimulationService {
  constructor(private readonly gateway: Gateway) {}

  private timeOfLastSimulation: Date | null = null;
  private isFinished: boolean;
  private timeoutFunction: ReturnType<typeof setTimeout>;
  private intervals: ReturnType<typeof setInterval>[] = [];
  private matchScores: MatchScores = {
    'Germany vs Poland': { home: 0, away: 0 },
    'Brazil vs Mexico': { home: 0, away: 0 },
    'Argentina vs Uruguay': { home: 0, away: 0 },
  };

  //check if user can start a new simulation (last simulation had to have happened at least 5min ago)
  canStartNewSimulation() {
    if (!this.timeOfLastSimulation) {
      return true;
    } else {
      let currentTime: Date = new Date();
      let differenceInMinutes =
        Math.abs(this.timeOfLastSimulation.getTime() - currentTime.getTime()) /
        1000 /
        60;
      return differenceInMinutes >= 5;
    }
  }

  startSimulation() {
    if (!this.canStartNewSimulation())
      throw new Error('Can only start a simulation once every 5 minutes');
    this.timeOfLastSimulation = new Date();

    //every 10 seconds a team scores
    for (let match in this.matchScores) {
      const interval = setInterval(() => {
        const scoringTeam: string = Math.random() > 0.5 ? 'home' : 'away';
        this.matchScores[match][scoringTeam] += 1;
        //send goal update to frontend
        this.gateway.sendScoreUpdates(this.matchScores);
      }, 10000);

      this.intervals.push(interval);
    }

    //simulation takes 90 seconds
    this.timeoutFunction = setTimeout(() => {
      this.finishSimulation();
    }, 90000);
  }

  finishSimulation() {
    //if simulation wasn't started, it cannot be finished
    if (!this.timeoutFunction)
      throw new Error('No simulation has been started');

    //clear 90 second timeout
    clearTimeout(this.timeoutFunction);

    //clear intervals
    this.intervals.map((interval) => clearInterval(interval));
  }

  restartSimulation() {
    //reset match scores
    this.matchScores = {
      'Germany vs Poland': { home: 0, away: 0 },
      'Brazil vs Mexico': { home: 0, away: 0 },
      'Argentina vs Uruguay': { home: 0, away: 0 },
    };

    //start simulation
    this.startSimulation();
  }
}
