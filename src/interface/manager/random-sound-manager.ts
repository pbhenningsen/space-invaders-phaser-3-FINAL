import { SoundType } from "../assets";

export class RandomSoundManager {
    private _timer?: Phaser.Time.TimerEvent;
    private _currentSound?: Phaser.Sound.BaseSound;
    private _stopped = false;

    private readonly MIN_DELAY = 8000;
    private readonly MAX_DELAY = 18000;

    private readonly RANDOM_SOUNDS = [
        SoundType.Gofast,
        SoundType.Gimbal,
    ];

    constructor(private _scene: Phaser.Scene) {
        this.start();
    }

    start() {
        this._stopped = false;
        this._scheduleNextSound();
    }

    stop() {
        this._stopped = true;

        this._timer?.remove(false);
        this._timer = undefined;

        if (this._currentSound && this._currentSound.isPlaying) {
            this._currentSound.stop();
        }

        this._currentSound = undefined;
    }

    reset() {
        this.stop();
        this.start();
    }

    private _scheduleNextSound() {
        if (this._stopped) {
            return;
        }

        const delay = Phaser.Math.Between(
            this.MIN_DELAY,
            this.MAX_DELAY
        );

        this._timer = this._scene.time.delayedCall(delay, () => {
            this._playRandomSound();
        });
    }

    private _playRandomSound() {
        if (this._stopped) {
            return;
        }

        // Safety check: do not overlap.
        if (this._currentSound && this._currentSound.isPlaying) {
            return;
        }

        const soundKey = Phaser.Utils.Array.GetRandom(this.RANDOM_SOUNDS);

        const sound = this._scene.sound.add(soundKey, {
            volume: 0.95
        });

        this._currentSound = sound;

        sound.once("complete", () => {
            sound.destroy();

            if (this._currentSound === sound) {
                this._currentSound = undefined;
            }

            this._scheduleNextSound();
        });

        sound.play();
    }
}