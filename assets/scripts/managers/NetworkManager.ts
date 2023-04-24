import { _decorator, CCBoolean, CCInteger, CCString, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import Colyseus from 'db://colyseus-sdk/colyseus.js';

@ccclass('NetworkManager')
export class NetworkManager extends Component {

    @property(CCString) private serverURL: string = "localhost";

    @property(CCInteger) private port: string = "2567";

    private client: Colyseus.Client | null = null;
    private room: Colyseus.Room | null = null;

    start() {
        // Instantiate Colyseus Client
        // connects into (ws|wss)://hostname[:port]
        let endpoint: string = `ws://${this.serverURL}:${this.port}`;
        this.client = new Colyseus.Client(endpoint);

        // Connect into the room
        this.connect();
    }

    async connect() {
        try {
            this.room = await this.client.joinOrCreate("battle");

            let numPlayers = 0;
            this.room.state.players.onAdd = () => {
                numPlayers++;

                if (numPlayers === 2) {
                    this.onJoin();
                }
            }


            // console.log("joined successfully!");
            // console.log("user's sessionId:", this.room.sessionId);

            // this.room.onStateChange((state) => {
            //     console.log("onStateChange: ", state);
            // });

            // this.room.onLeave((code) => {
            //     console.log("onLeave:", code);
            // });

        } catch (e) {
            console.error(e);
        }
    }

    onJoin() {
        console.log("Joined game!");
    }

}
