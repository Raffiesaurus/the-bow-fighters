import { _decorator, EventMouse, Input, input, instantiate, math, Node, toDegree, v2, v3, Vec2 } from 'cc';
import { GameManager } from '../managers/GameManager';
import { SpawnManager } from '../managers/SpawnManager';
import { customEvent } from '../util/Utils';
import { Arrow } from './Arrow';
import { Character } from './Character';
import { PlayerAnims } from './PlayerAnims';
import { PlayerMovement } from './PlayerMovement';
const { ccclass, property } = _decorator;

@ccclass('PlayerAiming')
export class PlayerAiming extends Character {

    private playerAnim: PlayerAnims = null;
    private playerMovement: PlayerMovement = null;

    private mousePos: Vec2 = v2();
    private bowPos: Vec2 = v2();
    private diffVec: Vec2 = v2();

    private isCharging: boolean = false;
    private dragStartVec: Vec2 = v2();
    private dragEndVec: Vec2 = v2();

    private power: number = 0;

    private minPower: number = 15;
    private maxPower: number = 100;

    @property(Node) private bow: Node = null;

    @property(Node) private spawnPoint: Node = null;

    onLoad() {
        super.onLoad();
        this.playerAnim = this.node.getComponent(PlayerAnims);
        this.playerMovement = this.node.getComponent(PlayerMovement);
        customEvent.on('newTurn', this.onNewTurn, this);
    }

    onNewTurn() {
        console.log('[Player Aim] New Turn: ', GameManager.isPlayerTurn)
        if (GameManager.isPlayerTurn) {
            this.turnOnInput();
        } else {
            this.turnOffInput();
        }
    }

    turnOnInput() {
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseClick, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseRelease, this);
        this.playerMovement.turnOnInput();
    }

    turnOffInput() {
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseClick, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseRelease, this);
        this.playerMovement.turnOffInput();
        this.bow.eulerAngles = v3(0, 0, 0)
    }

    onMouseMove(event: EventMouse) {
        this.mousePos = event.getLocation();
        this.diffVec = Vec2.subtract(this.diffVec, v2(this.bow.getWorldPosition().x, this.bow.getWorldPosition().y), this.mousePos);
        this.diffVec = this.diffVec.normalize()
        let angle = Vec2.angle(this.diffVec, v2(1, 0));
        angle = toDegree(angle) - 180
        if (this.diffVec.y < 0) {
            angle += (-angle * 2)
        }
        angle = math.clamp(angle, -50, 50);
        this.bow.eulerAngles = v3(0, 0, angle)

        if (this.isCharging) {

            this.dragEndVec = event.getLocation();
            let dist = Vec2.distance(this.dragStartVec, this.dragEndVec);

            let powerLevel = math.clamp((Math.floor(dist / 100)), 0, 2);

            this.power = math.clamp(dist / 4, this.minPower, this.maxPower);

            this.playerAnim.onAim(powerLevel);

        }


    }

    getHit(dmg: number) {
        super.getHit(dmg);
        this.playerAnim.onGetHit();
    }

    onMouseClick(event: EventMouse) {
        this.isCharging = true;
        this.dragStartVec = event.getLocation();
    }

    onMouseRelease(event: EventMouse) {
        this.isCharging = false;
        this.playerAnim.onAim(0);
        this.fire();
    }

    fire() {
        this.isCharging = false;
        if (this.power < this.minPower) {
            return;
        }


        if (GameManager.isPlayerTurn) {
            let arrow = instantiate(SpawnManager.ArrowPrefab);
            arrow.setParent(SpawnManager.ProjectileParent);
            arrow.setWorldPosition(this.spawnPoint.worldPosition);
            let direction = this.bow.right.clone()
            arrow.getComponent(Arrow).fire(v2(direction.x, direction.y), this.power)
        }

        this.turnOffInput();
        this.power = 0;
    }
}

