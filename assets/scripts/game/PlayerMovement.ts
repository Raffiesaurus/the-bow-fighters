import { _decorator, BoxCollider2D, Component, Contact2DType, EventKeyboard, Input, input, IPhysics2DContact, KeyCode, RigidBody2D, v2, v3 } from 'cc';
import { AudioManager } from '../managers/AudioManager';
import { COLLIDER_GROUPS, SFX } from '../util/Enums';
import { PlayerAnims } from './PlayerAnims';
const { ccclass, property } = _decorator;

@ccclass('PlayerMovement')
export class PlayerMovement extends Component {

    private moveSpeed: number = 1.5;
    private maxSpeed: number = 10;

    private jumpSideForce: number = 100;
    private jumpForce: number = 2000;

    private rb: RigidBody2D = null;

    private moveLeft: boolean = false;
    private moveRight: boolean = false;
    private moveUp: boolean = false;
    private moveDown: boolean = false;

    private isGrounded: boolean = true;

    private playerAnim: PlayerAnims = null;

    private bodyCollider: BoxCollider2D = null

    onLoad() {
        this.rb = this.node.getComponent(RigidBody2D);
        this.bodyCollider = this.node.getComponents(BoxCollider2D).filter(x => x.group == COLLIDER_GROUPS.BODY)[0]
        this.bodyCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        this.playerAnim = this.node.getComponent(PlayerAnims);
    }

    turnOnInput() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_PRESSING, this.onKeyPressed, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    turnOffInput() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_PRESSING, this.onKeyPressed, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        this.stopMovement();
    }

    onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.group == COLLIDER_GROUPS.LAND || otherCollider.group == COLLIDER_GROUPS.STEP) {
            this.isGrounded = true;
        }
    }

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode == KeyCode.KEY_A || event.keyCode == KeyCode.ARROW_LEFT) {
            this.moveLeft = true;
            this.playerAnim.onWalk(true)
            AudioManager.PlayWalk();
        }

        if (event.keyCode == KeyCode.KEY_S || event.keyCode == KeyCode.ARROW_DOWN) {
            this.moveDown = true;
            this.rb.gravityScale = 2.5;
            this.rb.applyForceToCenter(v2(0, -this.jumpForce), true);
        }

        if (event.keyCode == KeyCode.KEY_D || event.keyCode == KeyCode.ARROW_RIGHT) {
            this.moveRight = true;
            this.playerAnim.onWalk(true)
            AudioManager.PlayWalk();
        }

        if (event.keyCode == KeyCode.KEY_W || event.keyCode == KeyCode.ARROW_UP) {
            if (this.isGrounded) {
                this.moveUp = true;
                this.rb.gravityScale = 1;
                this.isGrounded = false;
                AudioManager.PlaySFX(SFX.JUMP)
                if (this.moveLeft) {
                    this.rb.applyForceToCenter(v2(-this.jumpSideForce, this.jumpForce), true);
                } else if (this.moveRight) {
                    this.rb.applyForceToCenter(v2(this.jumpSideForce, this.jumpForce), true);
                } else {
                    this.rb.applyForceToCenter(v2(0, this.jumpForce), true);
                }
            }
        }
    }

    onKeyPressed(event: EventKeyboard) {

    }

    onKeyUp(event: EventKeyboard) {
        if (event.keyCode == KeyCode.KEY_A || event.keyCode == KeyCode.ARROW_LEFT) {
            this.moveLeft = false;
            this.stopMovement();
        }

        if (event.keyCode == KeyCode.KEY_S || event.keyCode == KeyCode.ARROW_DOWN) {
            this.moveDown = false;
            this.stopMovement();
        }

        if (event.keyCode == KeyCode.KEY_D || event.keyCode == KeyCode.ARROW_RIGHT) {
            this.moveRight = false;
            this.stopMovement();
        }

        // if (event.keyCode == KeyCode.KEY_W || event.keyCode == KeyCode.ARROW_UP) {
        //     this.moveUp = false;
        //     this.stopMovement();
        // }
    }

    protected lateUpdate(dt: number): void {
        if (this.moveLeft) {
            // this.rb.applyForceToCenter(v2(-this.moveSpeed, 0), true)
            this.node.translate(v3(-this.moveSpeed, 0, 0))
        }

        if (this.moveRight) {
            // this.rb.applyForceToCenter(v2(this.moveSpeed, 0), true)
            this.node.translate(v3(this.moveSpeed, 0, 0))
        }

    }



    stopMovement() {
        this.moveLeft = false;
        this.moveDown = false;
        this.moveRight = false;
        this.moveUp = false;
        // this.rb.linearVelocity = v2(0, 0)
        this.playerAnim.onWalk(false)
        AudioManager.StopWalk();
    }
}

