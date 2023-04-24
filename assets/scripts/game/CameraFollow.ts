import { _decorator, Camera, Component, easing, tween, v3 } from 'cc';
import { GAME_STATE } from '../util/Enums';
import { customEvent } from '../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {

    private mainCam: Camera = null;
    @property(Camera) private gameCam: Camera = null;

    onLoad() {
        this.mainCam = this.node.getComponent(Camera);
        this.mainCam.orthoHeight = 405;
        this.gameCam.orthoHeight = 405;
        customEvent.on('gameStateChange', this.onStateChange, this);
        customEvent.on('zoomOut', this.zoomOutToFull, this);
        customEvent.on('zoomIn', this.zoomToPlayer, this);
    }

    onStateChange(state: GAME_STATE) {
        switch (state) {
        }
    }

    zoomToPlayer(isPlayer: boolean) {
        if (isPlayer) {
            tween(this.gameCam.node).to(1, { position: v3(-300, -50, 1000) }, { easing: easing.smooth }).start();
            tween(this.gameCam).to(1, { orthoHeight: 200 }, { easing: easing.smooth }).start();
        } else {
            tween(this.gameCam.node).to(1, { position: v3(300, -50, 1000) }, { easing: easing.smooth }).start();
            tween(this.gameCam).to(1, { orthoHeight: 200 }, { easing: easing.smooth }).start();
        }
    }

    zoomOutToFull() {
        tween(this.gameCam.node).to(1, { position: v3(0, 0, 1000) }, { easing: easing.smooth }).start();
        tween(this.gameCam).to(1, { orthoHeight: 405 }, { easing: easing.smooth }).start();
    }



}

