import { _decorator, Button, Component, easing, Label, tween, v3 } from 'cc';
import { AudioManager } from '../managers/AudioManager';
import { GAME_STATE, SFX } from '../util/Enums';
import { customEvent } from '../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends Component {

    @property(Label) private resultLabel: Label = null;

    @property(Button) private exitButton: Button = null;

    init(playerWin: boolean) {
        console.log('playerWin: ', playerWin);
        if (playerWin) {
            this.resultLabel.string = 'VICTORY';
        } else {
            this.resultLabel.string = 'DEFEAT';
        }
        this.resultLabel.node.setPosition(v3(0, 1190, 0))
        this.exitButton.node.active = false;
        this.exitButton.node.setScale(v3())
        this.node.active = true;
        tween(this.resultLabel.node)
            .to(1, { position: v3(0, 100, 0) }, { easing: easing.elasticOut })
            .call(() => {
                this.exitButton.node.active = true;
                tween(this.exitButton.node)
                    .repeatForever(
                        tween(this.exitButton.node)
                            .to(1, { scale: v3(1.2, 1.2, 1.2) }, { easing: easing.smooth })
                            .to(0.75, { scale: v3(1.0, 1.0, 1.0) }, { easing: easing.smooth })
                    )
                    .start();
            })
            .start();

        this.scheduleOnce(() => {
            if (playerWin) {
                AudioManager.PlaySFX(SFX.VICTORY)
            } else {
                AudioManager.PlaySFX(SFX.LOSS)
            }
        }, 0.5)
    }

    onExitButton() {
        customEvent.emit('gameStateChange', GAME_STATE.MAIN_MENU);
        AudioManager.PlaySFX(SFX.CLICK);
    }

}

