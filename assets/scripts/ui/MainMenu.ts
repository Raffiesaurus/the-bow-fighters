import { _decorator, Button, Component, EditBox, Node } from 'cc';
import { GAME_STATE } from '../util/Enums';
import { customEvent, playerName, setPlayerName } from '../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {

    @property(Node) private inputBlocker: Node = null;
    @property(Button) private startButton: Button = null;
    @property(EditBox) private editBox: EditBox = null;

    init() {
        this.node.active = true;
        customEvent.emit('gameStateChange', GAME_STATE.MAIN_MENU)
        this.editBox.string = playerName;
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
    }
}

