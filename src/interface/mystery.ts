import { AssetType, SoundType } from "./assets";
import { GAME_WIDTH } from "./constants";
import { Kaboom } from "./kaboom";

export class Mystery extends Phaser.Physics.Arcade.Sprite {
    private _ufoSound?: Phaser.Sound.BaseSound;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, AssetType.MysteryShip);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 0.5);
        this.setDepth(10);
        this.setScale(0.3);

        this.disableBody(true, true);
    }

    spawn(direction: 1 | -1, y: number, speed: number) {
        const startX = direction === 1
            ? -this.displayWidth
            : GAME_WIDTH + this.displayWidth;

        this.enableBody(true, startX, y, true, true);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.reset(startX, y);
        body.setAllowGravity(false);
        body.setVelocityX(speed * direction);

        this.setFlipX(direction === -1);

        this._playUfoSound();
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (!this.active) {
            return;
        }

        const offLeft = this.x < -this.displayWidth * 2;
        const offRight = this.x > GAME_WIDTH + this.displayWidth * 2;

        if (offLeft || offRight) {
            this.kill();
        }
    }

    shootDown(explosion?: Kaboom) {
        if (explosion) {
            explosion.show(this.x, this.y);
        }

        this.kill();
    }

    kill() {
        this._stopUfoSound();

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0, 0);

        this.disableBody(true, true);
        this.setPosition(-100, -100);
    }

    private _playUfoSound() {
        this._stopUfoSound();

        this._ufoSound = this.scene.sound.add(SoundType.UfoHighPitch, {
            volume: 0.3,
            loop: true
        });

        this._ufoSound.play();
    }

    private _stopUfoSound() {
        if (this._ufoSound) {
            this._ufoSound.stop();
            this._ufoSound.destroy();
            this._ufoSound = undefined;
        }
    }
}