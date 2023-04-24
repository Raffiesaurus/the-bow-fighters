import { _decorator, Component, easing, Label, ProgressBar, tween } from 'cc';
import { customEvent, playerName } from '../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('PlayerUI')
export class PlayerUI extends Component {

    @property(ProgressBar) private healthBar: ProgressBar = null;

    @property(Label) private nameLabel: Label = null;

    onLoad() {
        customEvent.on("playerHealthUpdate", this.updateHealth, this);
    }

    init() {
        this.node.active = true;
        this.nameLabel.string = playerName;
        this.healthBar.progress = 0;
        tween(this.healthBar)
            .to(0.5, { progress: 1 }, { easing: easing.smooth })
            .start();
    }

    updateHealth(percentage: number) {
        tween(this.healthBar)
            .to(0.36, { progress: percentage }, { easing: easing.smooth })
            .start();
    }

}

