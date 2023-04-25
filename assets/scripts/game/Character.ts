import { _decorator, CCBoolean, CCInteger, Component, v3, Vec3 } from 'cc';
import { AudioManager } from '../managers/AudioManager';
import { GAME_STATE, SFX } from '../util/Enums';
import { customEvent } from '../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('Character')
export class Character extends Component {

    @property(CCInteger) private maxHealth: number = 100;
    private health: number = 100;

    @property(CCBoolean) isPlayer: boolean = true;

    @property(Vec3) private spawnPointVector: Vec3 = v3()

    private isDead: boolean = false;

    onLoad() {
        customEvent.on('gameStateChange', this.onStateChange, this);
    }

    onStateChange(state: GAME_STATE) {
        switch (state) {
            case GAME_STATE.MAIN_MENU:
                this.health = 100;
                this.node.setPosition(this.spawnPointVector);
                break;
        }
    }


    protected start(): void {
        if (this.isPlayer) {
            customEvent.emit("playerHealthUpdate", this.health / this.maxHealth)
        } else {
            customEvent.emit("oppHealthUpdate", this.health / this.maxHealth)
        }
    }

    getHit(dmg: number) {
        this.health -= dmg;

        if (this.isPlayer) {
            customEvent.emit("playerHealthUpdate", this.health / this.maxHealth)
            console.log('[Player] Health: ', this.health)
        } else {
            customEvent.emit("oppHealthUpdate", this.health / this.maxHealth)
            console.log('[Opp] Health: ', this.health)
        }

        if (this.health <= 0) {
            this.die();
        }


    }

    die() {
        AudioManager.PlaySFX(SFX.SCREAM);
        this.isDead = true;
        if (this.isPlayer) {
            customEvent.emit("playerDeath")
            customEvent.emit('gameStateChange', GAME_STATE.DEFEAT);
        } else {
            customEvent.emit("oppDeath")
            customEvent.emit('gameStateChange', GAME_STATE.WIN);
        }
    }

    protected update(dt: number): void {
        if (this.isDead) return;

        if (this.node.position.y < -250) {
            this.die();
        }
    }
}

