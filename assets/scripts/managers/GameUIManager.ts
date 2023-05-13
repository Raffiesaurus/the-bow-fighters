import { _decorator, Component, easing, Sprite, SpriteFrame, Tween, tween } from 'cc';
import { GameOver } from '../game-ui/GameOver';
import { OpponentUI } from '../game-ui/OpponentUI';
import { PlayerUI } from '../game-ui/PlayerUI';
import { GAME_STATE } from '../util/Enums';
import { audioMute, customEvent } from '../util/Utils';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GameUIManager')
export class GameUIManager extends Component {

    @property(PlayerUI) private playerUI: PlayerUI = null;

    @property(OpponentUI) private oppUI: OpponentUI = null;

    @property(GameOver) private gameOverPanel: GameOver = null;

    @property(Sprite) private timerCircle: Sprite = null;

    @property(Sprite) private audioButton: Sprite = null;
    @property(SpriteFrame) private audioMuteSpriteFrame: SpriteFrame = null;
    @property(SpriteFrame) private audioUnMuteSpriteFrame: SpriteFrame = null;

    private timerTween: Tween<Sprite> = new Tween<Sprite>;

    private static instance: GameUIManager = null

    onLoad() {
        GameUIManager.instance = this;
        customEvent.on('gameStateChange', this.onStateChange, this);
        customEvent.on('newTurn', this.startTimer, this);
        this.timerCircle.fillRange = 1;
        this.swapAudioSprites();
        this.timerTween = tween(this.timerCircle)
            .to(0.25, { fillRange: 1 }, { easing: easing.smooth })
            .to(5, { fillRange: 0 }, { easing: easing.smooth })
            .call(() => {
                customEvent.emit('killArrow', false);
                customEvent.emit('turnChange')
            })
    }

    onStateChange(state: GAME_STATE) {
        switch (state) {
            case GAME_STATE.MAIN_MENU:
                this.playerUI.node.active = false;
                this.oppUI.node.active = false;
                this.timerCircle.node.active = false;
                this.gameOverPanel.node.active = false;
                break;
            case GAME_STATE.IN_GAME:
                this.playerUI.init();
                this.oppUI.init();
                break;
            case GAME_STATE.DEFEAT:
                this.pauseTimer();
                this.scheduleOnce(() => {
                    this.gameOverPanel.init(false);
                }, 1)
                break;
            case GAME_STATE.WIN:
                this.pauseTimer();
                this.scheduleOnce(() => {
                    this.gameOverPanel.init(true);
                }, 1)
                break;
        }
    }

    startTimer() {
        this.timerCircle.node.active = true;
        this.timerTween.start();
    }

    pauseTimer() {
        this.timerTween.stop();
    }

    onAudioButton() {
        AudioManager.ToggleMute();
        this.swapAudioSprites();
    }

    swapAudioSprites() {
        if (audioMute) {
            this.audioButton.spriteFrame = this.audioMuteSpriteFrame;
        } else {
            this.audioButton.spriteFrame = this.audioUnMuteSpriteFrame;
        }
    }

    static StartTimer() {
        this.instance.startTimer();
    }

    static PauseTimer() {
        this.instance.timerTween.stop();
    }

}

