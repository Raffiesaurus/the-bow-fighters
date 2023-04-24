import { _decorator, BoxCollider2D, Component, Contact2DType, IPhysics2DContact, misc, RigidBody2D, v2, v3, Vec2 } from 'cc';
import { GameUIManager } from '../managers/GameUIManager';
import { COLLIDER_GROUPS } from '../util/Enums';
import { customEvent } from '../util/Utils';
import { Character } from './Character';
const { ccclass, property } = _decorator;

@ccclass('Arrow')
export class Arrow extends Component {

    @property(BoxCollider2D) private collider: BoxCollider2D = null;

    @property(RigidBody2D) private rb: RigidBody2D = null;

    private directionVector: Vec2 = v2()

    private useForce: boolean = false;

    fire(direction: Vec2, force: number) {
        customEvent.emit('zoomOut');
        this.node.eulerAngles = v3(0, 0, 0);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        this.directionVector = direction.clone();
        this.rb.applyForceToCenter(this.directionVector.multiplyScalar(force), true);
        this.scheduleOnce(() => {
            this.useForce = true;
        }, 0.01)
        this.scheduleOnce(this.killNode, 4);
        GameUIManager.PauseTimer();
    }

    onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        if (otherCollider.group == COLLIDER_GROUPS.HEAD) {
            console.log('Head shot');
            otherCollider.node.getComponent(Character).getHit(20);
            this.killNode();
        } else if (otherCollider.group == COLLIDER_GROUPS.BODY) {
            console.log('Body shot');
            otherCollider.node.getComponent(Character).getHit(10);
            this.killNode();
        } else if (otherCollider.group == COLLIDER_GROUPS.LAND || otherCollider.group == COLLIDER_GROUPS.STEP) {
            console.log('Missed shot');
            this.killNode();
        }
    }

    killNode() {
        this.unschedule(this.killNode);
        this.useForce = false;
        this.rb.linearVelocity.set(v2())
        customEvent.emit('turnChange')
        this.node.destroy()
    }

    protected update(dt: number): void {
        if (this.useForce) {
            let angle = misc.radiansToDegrees(Math.atan2(this.rb.linearVelocity.y, this.rb.linearVelocity.x));
            this.node.eulerAngles = v3(0, 0, angle);
        } else {
            let angle = misc.radiansToDegrees(Math.atan2(this.directionVector.y, this.directionVector.x));
            this.node.eulerAngles = v3(0, 0, angle);
        }
    }

}

