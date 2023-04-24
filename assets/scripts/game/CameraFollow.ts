import { _decorator, Camera, Component, easing, tween, v3 } from 'cc';
import { GameManager } from '../managers/GameManager';
import { GAME_STATE } from '../util/Enums';
import { customEvent } from '../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {

    private mainCam: Camera = null;
    @property(Camera) private gameCam: Camera = null;

    onLoad() {
        this.mainCam = this.node.getComponent(Camera);
        customEvent.on('gameStateChange', this.onStateChange, this);
    }

    onStateChange(state: GAME_STATE) {
        switch (state) {
            case GAME_STATE.MAIN_MENU:
                this.mainCam.node.active = true;
                this.gameCam.node.active = true;
                break;
            case GAME_STATE.IN_GAME:
                this.mainCam.node.active = true;
                this.gameCam.node.active = true;
                this.zoomToPlayer(true)
                break;
            case GAME_STATE.DEFEAT:
            case GAME_STATE.WIN:

                break;
        }
    }

    zoomToPlayer(isPlayer: boolean) {
        let playerPos = GameManager.GetPlayerCharacter().node.getWorldPosition();
        tween(this.mainCam.node).to(1, { position: v3(-280, -50, 1000) }, { easing: easing.smooth }).start();
        tween(this.mainCam).to(1, { orthoHeight: 200 }, { easing: easing.smooth }).start();
    }

    zoomOutToFull() {

    }



}

