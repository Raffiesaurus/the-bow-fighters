import { _decorator, Component, Label } from 'cc';
import { GAME_STATE } from '../util/Enums';
import { customEvent } from '../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends Component {

    @property(Label) private resultLabel: Label = null;

    init(playerWin: boolean) {
        console.log('playerWin: ', playerWin);
        this.node.active = true;
        if (playerWin) {
            this.resultLabel.string = 'VICTORY';
        } else {
            this.resultLabel.string = 'DEFEAT';
        }
    }

    onExitButton() {
        customEvent.emit('gameStateChange', GAME_STATE.MAIN_MENU);
    }

}

