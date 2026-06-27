import { AssetType, SoundType } from "./assets";

export class Bullet extends Phaser.Physics.Arcade.Sprite {
    private readonly STEP_Y = 6;
    private readonly STEP_DELAY = 16;

    private _moveAccumulator = 0;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, AssetType.Bullet);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 0.5);
        this.disableBody(true, true);
    }

    shoot(x: number, y: number) {
        this.scene.sound.play(SoundType.Shoot);

        this._moveAccumulator = 0;

        this.enableBody(true, x, y, true, true);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.reset(x, y);
        body.setVelocity(0, 0);
        body.setAllowGravity(false);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (!this.active) {
            return;
        }

        this._moveAccumulator += delta;

        while (this._moveAccumulator >= this.STEP_DELAY) {
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.reset(this.x, this.y - this.STEP_Y);

            this._moveAccumulator -= this.STEP_DELAY;
        }

        if (this.y < -this.displayHeight) {
            this.kill();
        }
    }

    kill() {
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0, 0);

        this.disableBody(true, true);
        this.setPosition(-100, -100);
    }
}