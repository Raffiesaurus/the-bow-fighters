import { _decorator, BoxCollider2D, Component, RigidBody2D, Sprite, toDegree, v2, v3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Arrow')
export class Arrow extends Component {

    @property(BoxCollider2D) private collider: BoxCollider2D = null;

    @property(RigidBody2D) private rb: RigidBody2D = null;

    @property(Sprite) private arrowSprite: Sprite = null;

    fire(direction: Vec2, force: number) {
        console.log('force: ', force);
        console.log('direction: ', direction);
        this.rb.applyForceToCenter(direction.multiplyScalar(force), true);
    }

    protected update(dt: number): void {
        let angle = Vec2.angle(this.rb.linearVelocity, v2(1, 0));
        angle = toDegree(angle);
        // this.node.eulerAngles = v3(0, 0, angle)
    }

}

