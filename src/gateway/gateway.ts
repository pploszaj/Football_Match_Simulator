import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { MatchScores } from "src/types/matches";

@WebSocketGateway()
export class Gateway {

    @WebSocketServer()
    server: Server;

    sendScoreUpdates(matchScores: MatchScores) {
        this.server.emit('matchScores', matchScores);
    }



}