import { _decorator, Component, easing, ProgressBar, tween } from 'cc';
import { customEvent } from '../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('OpponentUI')
export class OpponentUI extends Component {

    @property(ProgressBar) private healthBar: ProgressBar = null;

    onLoad() {
        customEvent.on("oppHealthUpdate", this.updateHealth, this);
    }

    init() {
        this.node.active = true;
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

