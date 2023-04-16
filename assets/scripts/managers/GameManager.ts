import { _decorator, Component, EPhysics2DDrawFlags, PhysicsSystem2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    start() {
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Shape;
    }
}

