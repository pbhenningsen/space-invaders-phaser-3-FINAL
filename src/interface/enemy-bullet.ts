import { AssetType } from "./assets";

export class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
    private readonly FRAME_DELAY = 120;

    private _frameTimer = 0;
    private _currentFrame = 0;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, AssetType.EnemyBullet);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 0.5);
        this.disableBody(true, true);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (!this.active) {
            return;
        }

        this._frameTimer += delta;

        if (this._frameTimer >= this.FRAME_DELAY) {
            this._frameTimer = 0;

            this._currentFrame = this._currentFrame === 0 ? 1 : 0;
            this.setFrame(this._currentFrame);
        }

        if (this.y > this.scene.scale.height + this.displayHeight) {
            this.kill();
        }
    }

    shoot(x: number, y: number) {
        this._frameTimer = 0;
        this._currentFrame = 0;

        this.enableBody(true, x, y, true, true);

        this.setFrame(0);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.reset(x, y);
        body.setVelocity(0, 120);
        body.setAllowGravity(false);
    }

    kill() {
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0, 0);

        this.disableBody(true, true);
        this.setPosition(-100, -100);
    }
}