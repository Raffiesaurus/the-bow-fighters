import { _decorator, Animation, Component, Sprite, SpriteFrame } from 'cc';
import { BODY_ANIMS, GAME_STATE } from '../util/Enums';
import { customEvent } from '../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('PlayerAnims')
export class PlayerAnims extends Component {

    @property(Sprite) private leftArm: Sprite = null;
    private leftArmAnim: Animation = null;

    @property(Sprite) private rightArm: Sprite = null;
    private rightArmAnim: Animation = null;

    @property(Sprite) private body: Sprite = null;
    private bodyAnim: Animation = null;

    @property(Sprite) private bow: Sprite = null;
    private bowAnim: Animation = null;

    private isWalking: boolean = false;

    @property(SpriteFrame) private tPoseSprite: SpriteFrame = null;
    @property(SpriteFrame) private leftArmPowerSpriteFrame: SpriteFrame[] = []
    @property(SpriteFrame) private rightArmPowerSpriteFrame: SpriteFrame[] = []
    @property(SpriteFrame) private bowPowerSpriteFrame: SpriteFrame[] = []

    onLoad() {
        this.leftArmAnim = this.leftArm.node.getComponent(Animation);
        this.rightArmAnim = this.rightArm.node.getComponent(Animation);
        this.bodyAnim = this.body.node.getComponent(Animation);
        this.bowAnim = this.bow.getComponent(Animation);
        customEvent.on('playerDeath', this.onDie, this);
        customEvent.on('oppDeath', this.onVictory, this);
        customEvent.on('gameStateChange', this.onStateChange, this);
    }

    onStateChange(state: GAME_STATE) {
        switch (state) {
            case GAME_STATE.MAIN_MENU:
                this.onAim(0);
                break;
        }
    }

    start() {
        // this.scheduleOnce(this.onAim, 1)
    }

    onWalk(toWalk) {
        if (toWalk && !this.isWalking) {
            this.isWalking = true;
            this.bodyAnim.play(BODY_ANIMS.WALK);
            this.leftArm.node.active = false;
            this.rightArm.node.active = false;
            this.bow.node.active = false;
        } else if (!toWalk) {
            this.isWalking = false;
            this.bodyAnim.stop();
            this.onAim(0);
        }
    }

    onAim(powerLevel: number) {
        let bodyNum: number = 0;
        let leftArmNum: number = 0;
        let rightArmNum: number = 0;
        let bowNum: number = 0;
        switch (powerLevel) {
            case 0:
                bodyNum = 0;
                leftArmNum = 0;
                rightArmNum = 0;
                bowNum = 0;
                break;

            case 1:
                bodyNum = 0;
                leftArmNum = 1;
                rightArmNum = 1;
                bowNum = 1;
                break;

            case 2:
                bodyNum = 0;
                leftArmNum = 2;
                rightArmNum = 2;
                bowNum = 2;
                break;

        }

        this.leftArm.node.active = true;
        this.rightArm.node.active = true;
        this.bow.node.active = true;
        this.leftArm.spriteFrame = this.leftArmPowerSpriteFrame[leftArmNum];
        this.rightArm.spriteFrame = this.rightArmPowerSpriteFrame[leftArmNum];
        this.body.spriteFrame = this.tPoseSprite;
        this.bow.spriteFrame = this.bowPowerSpriteFrame[leftArmNum];
    }

    onVictory() {

    }

    onDie() {
        this.rightArm.node.active = false;
        this.leftArm.node.active = false;
        this.bodyAnim.play(BODY_ANIMS.DIE);
    }

}

