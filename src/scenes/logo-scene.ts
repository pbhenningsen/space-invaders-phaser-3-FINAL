import { AssetType } from "../interface/assets";
import { GAME_WIDTH, GAME_HEIGHT } from "../interface/constants";

export class LogoScene extends Phaser.Scene {
    constructor() {
        super({
            key: "LogoScene"
        });
    }

    preload() {
        this.load.setBaseURL("assets/");

        this.load.image(AssetType.WoeLogo, "images/WoeLogo.png")
    }

    create() {
        const logo = this.add
            .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, AssetType.WoeLogo)
            .setOrigin(0.5)
            .setAlpha(0)

        logo.setScale(0.3);

        this.tweens.add({
            targets:logo,
            alpha: 1,
            duration: 800,
            ease: "Linear",
            yoyo: true,
            hold: 1200,
            onComplete: () => {
                this.scene.start("MenuScene");
            }
        });
    }

}


