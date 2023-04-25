import { _decorator, Button, Component, easing, EditBox, Node, tween, v3 } from 'cc';
import { AudioManager } from '../managers/AudioManager';
import { GAME_STATE, SFX } from '../util/Enums';
import { customEvent, playerName, setPlayerName } from '../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {

    @property(Node) private inputBlocker: Node = null;
    @property(Node) private titleNode: Node = null;
    @property(Button) private startButton: Button = null;
    @property(EditBox) private editBox: EditBox = null;

    init() {
        this.startButton.node.active = false;
        this.startButton.node.setScale(v3())
        this.titleNode.setPosition(v3(-1190, 100, 0))
        this.node.active = true;
        customEvent.emit('gameStateChange', GAME_STATE.MAIN_MENU)
        this.editBox.string = playerName;

        tween(this.titleNode)
            .to(1, { position: v3(0, 100, 0) }, { easing: easing.elasticOut })
            .call(() => {
                this.startButton.node.active = true;
                tween(this.startButton.node)
                    .repeatForever(
                        tween(this.startButton.node)
                            .to(1, { scale: v3(1.7, 1.7, 1.7) }, { easing: easing.smooth })
                            .to(0.75, { scale: v3(1.5, 1.5, 1.5) }, { easing: easing.smooth })
                    )
                    .start();
            })
            .start();
    }

    onEditBoxChange() {
        if (this.editBox.string != '') {
            setPlayerName(this.editBox.string);
        } else {
            setPlayerName('PLAYER NAME');
        }
    }

    onEditBoxEnd() {
        if (this.editBox.string != '') {
            setPlayerName(this.editBox.string);
        } else {
            setPlayerName('PLAYER NAME');
        }
    }

    onStartButton() {
        customEvent.emit('gameStateChange', GAME_STATE.IN_GAME)
        AudioManager.PlaySFX(SFX.CLICK);
    }
}

