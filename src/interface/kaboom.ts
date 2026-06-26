import { AssetType } from "./assets";

export class Kaboom extends Phaser.GameObjects.Sprite {
    private _timer?: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, AssetType.Kaboom);

        scene.add.existing(this);

        this.setOrigin(0.5, 0.5);
        this.setActive(false);
        this.setVisible(false);
    }

    show(x: number, y: number) {
        this._timer?.remove(false);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        this._timer = this.scene.time.delayedCall(150, () => {
            this.kill();
        });
    }

    kill() {
        this.setActive(false);
        this.setVisible(false);
    }
}