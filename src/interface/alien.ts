import { AssetType, SoundType } from "./assets";
import { Kaboom } from "./kaboom";

export class Alien extends Phaser.Physics.Arcade.Sprite {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string = AssetType.Ufo1
    ) {
        super(scene, x, y, texture);
    }

    kill(explosion?: Kaboom) {
        if (explosion) {
            explosion.show(this.x, this.y);
        }

        this.scene.sound.play(SoundType.InvaderKilled);
        this.destroy();
    }
}