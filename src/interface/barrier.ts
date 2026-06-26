import { AssetType } from "./assets";

export class Barrier extends Phaser.Physics.Arcade.Sprite {
    private damage = 0;
    private readonly maxDamageFrame = 3;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, AssetType.Barrier, 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setFrame(0);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setImmovable(true);
        body.setAllowGravity(false);
    }

    takeDamage() {
        if (!this.active) {
            return;
        }

        this.damage++;

        if (this.damage > this.maxDamageFrame) {
            this.disableBody(true, true);
            return;
        }

        this.setFrame(this.damage);
    }
}