import { _decorator, BoxCollider2D, Component, Contact2DType, IPhysics2DContact, misc, ParticleSystem2D, RigidBody2D, v2, v3, Vec2 } from 'cc';
import { AudioManager } from '../managers/AudioManager';
import { GameUIManager } from '../managers/GameUIManager';
import { COLLIDER_GROUPS, SFX } from '../util/Enums';
import { customEvent } from '../util/Utils';
import { Character } from './Character';
import { GameManager } from '../managers/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Arrow')
export class Arrow extends Component {

    @property(BoxCollider2D) private collider: BoxCollider2D = null;

    @property(RigidBody2D) private rb: RigidBody2D = null;

    @property(ParticleSystem2D) private particles: ParticleSystem2D = null;

    private directionVector: Vec2 = v2()

    private useForce: boolean = false;

    fire(direction: Vec2, force: number) {
        customEvent.on('killArrow', this.killNode, this);
        AudioManager.PlaySFX(SFX.FIRE_BOW)
        customEvent.emit('zoomOut');
        this.node.eulerAngles = v3(0, 0, 0);
        this.directionVector = direction.clone();
        this.rb.applyForceToCenter(this.directionVector.multiplyScalar(force), true);
        GameManager.isArrowMidFlight = true;
        this.scheduleOnce(() => {
            this.useForce = true;
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }, 0.01)
        this.scheduleOnce(this.killNode, 3);
        GameUIManager.PauseTimer();

        if (this.directionVector.x > 0) {
            this.particles.gravity.x = -1680
        } else {
            this.particles.gravity.x = 1680
        }
    }

    onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        if (otherCollider.group == COLLIDER_GROUPS.HEAD) {
            console.log('Head shot');
            otherCollider.node.getComponent(Character).getHit(20);
            AudioManager.PlaySFX(SFX.ARROW_BODY)
            this.killNode();
        } else if (otherCollider.group == COLLIDER_GROUPS.BODY) {
            console.log('Body shot');
            otherCollider.node.getComponent(Character).getHit(10);
            AudioManager.PlaySFX(SFX.ARROW_BODY)
            this.killNode();
        } else if (otherCollider.group == COLLIDER_GROUPS.LAND || otherCollider.group == COLLIDER_GROUPS.STEP) {
            console.log('Missed shot');
            AudioManager.PlaySFX(SFX.ARROW_GROUND)
            this.killNode();
        }
    }

    killNode(emitTurn: boolean = true) {
        customEvent.off('killArrow', this.killNode, this);
        this.unschedule(this.killNode);
        this.useForce = false;
        this.rb.linearVelocity.set(v2())
        GameManager.isArrowMidFlight = false;
        if (emitTurn)
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

