import { _decorator, AudioClip, AudioSource, Component } from 'cc';
import { SFX } from '../util/Enums';
import { audioMute, setAudioMute } from '../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {

    @property(AudioSource) private musicSource: AudioSource = null;
    @property(AudioSource) private sfxSource: AudioSource = null;

    @property(AudioClip) private bgm: AudioClip = null;

    @property(AudioClip) private sfx: AudioClip[] = [];

    private static instance: AudioManager = null;

    onLoad() {
        AudioManager.instance = this;
    }

    start() {
        this.playBGM();
    }

    playBGM() {
        this.musicSource.clip = this.bgm;
        this.musicSource.volume = audioMute ? 0 : 0.5;
        this.musicSource.play();
    }

    toggleMute() {
        setAudioMute(!audioMute)
        this.musicSource.volume = audioMute ? 0 : 0.5
        this.sfxSource.volume = audioMute ? 0 : 1
    }

    playSFX(sfx: SFX) {
        this.sfxSource.playOneShot(this.sfx[sfx], audioMute ? 0 : 1)
    }

    playWalk() {
        this.sfxSource.clip = this.sfx[SFX.WALK];
        this.sfxSource.volume = audioMute ? 0 : 1
        this.sfxSource.play();
    }

    stopWalk() {
        this.sfxSource.stop();
    }

    static PlaySFX(sfx: SFX) {
        this.instance.playSFX(sfx)
    }

    static PlayWalk() {
        this.instance.playWalk()
    }

    static StopWalk() {
        this.instance.stopWalk()
    }

    static ToggleMute() {
        this.instance.toggleMute();
    }

}

