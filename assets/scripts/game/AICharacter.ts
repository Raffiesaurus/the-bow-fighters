import { _decorator, easing, instantiate, math, Node, randomRange, randomRangeInt, toDegree, tween, v2, v3, Vec3 } from 'cc';
import { GameManager } from '../managers/GameManager';
import { SpawnManager } from '../managers/SpawnManager';
import { customEvent } from '../util/Utils';
import { AIAnims } from './AIAnims';
import { Arrow } from './Arrow';
import { Character } from './Character';
const { ccclass, property } = _decorator;

@ccclass('AICharacter')
export class AICharacter extends Character {

    private isActive: boolean = false;

    private isHit: boolean = false;

    private aiAnims: AIAnims = null;

    @property(Node) private spawnPoint: Node = null;

    @property(Node) private bow: Node = null;

    private moveSpeed: number = 5;
    private power: number = 0;

    onLoad() {
        super.onLoad();
        this.isPlayer = false;
        this.aiAnims = this.node.getComponent(AIAnims);
        customEvent.on('newTurn', this.onNewTurn, this);
    }

    start() {

    }

    onNewTurn() {
        this.isActive = !GameManager.isPlayerTurn
        console.log('[AI Character] New Turn: ', this.isActive)
        if (this.isActive) {
            this.doSomething();
        } else {
            this.doNothing();
        }
    }

    doSomething() {
        this.scheduleOnce(this.move, randomRange(0.25, 0.75));
    }

    doNothing() {

    }

    setTurn() {

    }

    move() {
        if (this.isHit) {
            if (randomRangeInt(0, 101) > 5) {
                this.aiAnims.onWalk(true)
                if (randomRangeInt(0, 2)) {
                    // let moveCount = 10
                    let moveCount = randomRange(15, 40);
                    tween(this.node).to(1, { position: v3(this.node.position.x + moveCount, this.node.position.y, this.node.position.z) }, { easing: easing.smooth }).start();
                } else {
                    let moveCount = randomRange(-40, -15);
                    tween(this.node).to(1, { position: v3(this.node.position.x + moveCount, this.node.position.y, this.node.position.z) }, { easing: easing.smooth }).start();
                }
            } else {
                this.stopMovement();
            }
        } else {
            if (randomRangeInt(0, 101) > 25) {
                this.aiAnims.onWalk(true)
                if (randomRangeInt(0, 2)) {
                    let moveCount = randomRange(15, 40);
                    tween(this.node).to(1, { position: v3(this.node.position.x + moveCount, this.node.position.y, this.node.position.z) }, { easing: easing.smooth }).start();
                } else {
                    let moveCount = randomRange(-40, -15);
                    tween(this.node).to(1, { position: v3(this.node.position.x + moveCount, this.node.position.y, this.node.position.z) }, { easing: easing.smooth }).start();
                }
            } else {
                this.stopMovement();
            }
        }
        this.scheduleOnce(this.aim, randomRange(0.85, 1.75));
    }

    stopMovement() {
        this.aiAnims.onWalk(false)
    }

    aim() {
        this.stopMovement();
        let playerPos = GameManager.GetPlayerCharacter().node.getWorldPosition().clone();
        playerPos.y += randomRange(0, 100);

        let aimVec: Vec3 = v3();
        aimVec = Vec3.subtract(aimVec, playerPos, this.node.worldPosition);
        // aimVec = Vec3.normalize(aimVec, aimVec);

        this.power = aimVec.length() / randomRange(12, 14);

        tween(this)
            .to(0.5, { power: this.power }, {
                onUpdate: () => {
                    let powerLevel = math.clamp((Math.floor(this.power)), 0, 2);
                    this.aiAnims.onAim(powerLevel);
                }
            })
            .start()

        let angle = Vec3.angle(aimVec, v3(-1, 0, 0));
        angle = toDegree(angle) - 180
        if (aimVec.y < 0) {
            angle += (-angle * 2)
        }
        angle = math.clamp(angle, -50, 50);

        tween(this.bow).to(0.5, { eulerAngles: v3(0, 0, angle) }, { easing: easing.smooth }).start();

        this.scheduleOnce(this.fire, 1);

    }

    fire() {
        let arrow = instantiate(SpawnManager.ArrowPrefab);
        arrow.setParent(SpawnManager.ProjectileParent);
        arrow.setWorldPosition(this.spawnPoint.worldPosition);
        let direction = this.bow.right.clone()
        arrow.getComponent(Arrow).fire(v2(-direction.x, -direction.y), this.power)
        tween(this.bow).to(0.5, { eulerAngles: v3(0, 0, 0) }, { easing: easing.smooth }).start();
        this.aiAnims.onAim(0);
    }

}

