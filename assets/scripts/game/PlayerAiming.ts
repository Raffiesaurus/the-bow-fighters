import { _decorator, Component, EventMouse, Input, input, math, Node, toDegree, v2, v3, Vec2 } from 'cc';
import { SpawnManager } from '../managers/SpawnManager';
import { Arrow } from './Arrow';
const { ccclass, property } = _decorator;

@ccclass('PlayerAiming')
export class PlayerAiming extends Component {

    private mousePos: Vec2 = v2();
    private bowPos: Vec2 = v2();
    private diffVec: Vec2 = v2();

    private toCharge: boolean = false;

    private power: number = 0;

    private minPower: number = 15;
    private maxPower: number = 80;

    @property(Node) private bow: Node = null;

    @property(Node) private spawnPoint: Node = null;

    onLoad() {
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseClick, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseRelease, this);
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
        angle = math.clamp(angle, -80, 80);
        this.bow.eulerAngles = v3(0, 0, angle)
    }

    onMouseClick() {
        this.charge();
    }

    onMouseRelease() {
        this.fire();
    }

    charge() {
        this.toCharge = true;
    }

    fire() {
        this.toCharge = false;
        if (this.power < this.minPower) {
            return;
        }
        // Fire arrow
        let arrow = SpawnManager.GetArrow();
        arrow.setParent(SpawnManager.ProjectileParent);
        arrow.setWorldPosition(this.spawnPoint.worldPosition);
        arrow.getComponent(Arrow).fire(v2(this.bow.right.x, this.bow.right.y), this.power)

        this.power = 0;
    }

    protected update(dt: number): void {
        if (this.toCharge) {
            this.power += 1;
            console.log('this.power: ', this.power);
            if (this.power >= this.maxPower) {
                this.toCharge = false;
                this.power = this.maxPower;
            }
        }
    }
}

