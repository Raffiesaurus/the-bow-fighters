import { _decorator, Component } from 'cc';
import { MainMenu } from '../ui/MainMenu';
import { GAME_STATE } from '../util/Enums';
import { checkLocalStorage, customEvent } from '../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    @property(MainMenu) private mainMenu: MainMenu = null;

    onLoad() {
        checkLocalStorage();
        this.mainMenu.init();
        customEvent.on('gameStateChange', this.onStateChange, this);
    }

    onStateChange(state: GAME_STATE) {
        switch (state) {
            case GAME_STATE.MAIN_MENU:
                this.mainMenu.node.active = true;
                break;
            case GAME_STATE.IN_GAME:
                this.mainMenu.node.active = false;
                break;
        }
    }


}

