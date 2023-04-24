import { _decorator, Component, randomRangeInt } from 'cc';
import { PlayerAiming } from '../game/PlayerAiming';
import { GAME_STATE } from '../util/Enums';
import { customEvent } from '../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(PlayerAiming) private playerChar: PlayerAiming = null;

    public static isInGame: boolean = false;

    public static isPlayerTurn: boolean = false;
    public static isGameOver: boolean = false;

    private static instance: GameManager = null;

    onLoad() {
        GameManager.instance = this;
        customEvent.on('gameStateChange', this.onStateChange, this);
        customEvent.on('turnChange', this.onTurnChange, this);
    }

    start() {
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Shape;
    }

    onTurnChange(delay: boolean = true) {
        let timeDelay = 0;
        if (delay) {
            timeDelay = 1;
        }
        this.scheduleOnce(() => {
            GameManager.isPlayerTurn = !GameManager.isPlayerTurn;
            if (!GameManager.isGameOver)
                customEvent.emit('newTurn');
                customEvent.emit('zoomIn', GameManager.isPlayerTurn);
        }, timeDelay)
    }

    static GetPlayerCharacter() {
        return this.instance.playerChar;
    }

    onStateChange(state: GAME_STATE) {
        switch (state) {
            case GAME_STATE.MAIN_MENU:
                GameManager.isInGame = false;
                break;
            case GAME_STATE.IN_GAME:
                GameManager.isPlayerTurn = randomRangeInt(0, 2) == 0;
                GameManager.isInGame = true;
                GameManager.isGameOver = false;
                customEvent.emit('newTurn');
                customEvent.emit('zoomIn', GameManager.isPlayerTurn);
                break;
            case GAME_STATE.DEFEAT:
            case GAME_STATE.WIN:
                GameManager.isGameOver = true;
                break;
        }
    }
}

