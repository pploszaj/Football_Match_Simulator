import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { MatchScores } from "../types/matches";

@WebSocketGateway()
export class Gateway {

    @WebSocketServer()
    server: Server;

    sendScoreUpdates(matchScores: MatchScores) {
        console.log('sending match scores: ', matchScores)
        this.server.emit('matchScores', matchScores);
    }
}