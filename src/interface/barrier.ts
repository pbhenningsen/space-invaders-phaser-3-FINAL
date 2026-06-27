import { AssetType } from "./assets";

type HitZone = "left" | "center" | "right";

export class Barrier extends Phaser.Physics.Arcade.Sprite {
    private leftHits = 0;
    private centerHits = 0;
    private rightHits = 0;

    private readonly MAX_TOTAL_HITS = 4;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, AssetType.Barrier, 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setFrame(0);
        this.setScale(1.5);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setImmovable(true);
        body.setAllowGravity(false);
    }

    takeDamage(hitX: number) {
        if (!this.active) {
            return;
        }

        const hitZone = this._getHitZone(hitX);

        switch (hitZone) {
            case "left":
                this.leftHits++;
                break;

            case "center":
                this.centerHits++;
                break;

            case "right":
                this.rightHits++;
                break;
        }

        const totalHits = this.leftHits + this.centerHits + this.rightHits;

        if (totalHits >= this.MAX_TOTAL_HITS) {
            this.disableBody(true, true);
            return;
        }

        this.setFrame(this._getDamageFrame());
    }

    private _getHitZone(hitX: number): HitZone {
        const localX = hitX - this.x;

        // Since origin is 0.5, localX is centered around 0.
        // Divide the barrier into left / center / right thirds.
        const thirdWidth = this.displayWidth / 3;

        if (localX < -thirdWidth / 2) {
            return "left";
        }

        if (localX > thirdWidth / 2) {
            return "right";
        }

        return "center";
    }

    private _getDamageFrame(): number {
        // Frame meanings:
        // 0: no damage
        // 1: slight damage left
        // 2: slight damage center
        // 3: slight damage right
        // 4: slight damage left and right
        // 5: major damage right
        // 6: major damage left

        if (this.leftHits >= 2) {
            return 6;
        }

        if (this.rightHits >= 2) {
            return 5;
        }

        // NEW:
        // If center was already damaged, then a later left/right hit
        // should look severe instead of "healing" the center.
        if (this.centerHits >= 1 && this.leftHits >= 1) {
            return 6;
        }

        if (this.centerHits >= 1 && this.rightHits >= 1) {
            return 5;
        }

        if (this.leftHits >= 1 && this.rightHits >= 1) {
            return 4;
        }

        if (this.leftHits >= 1) {
            return 1;
        }

        if (this.rightHits >= 1) {
            return 3;
        }

        if (this.centerHits >= 1) {
            return 2;
        }

        return 0;
    }
}