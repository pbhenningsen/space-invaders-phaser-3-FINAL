import { AssetType } from "../interface/assets";
import { GAME_WIDTH, GAME_HEIGHT } from "../interface/constants";

export class MenuScene extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key;

    constructor() {
        super({
            key: "MenuScene"
        });
    }

    preload() {
        this.load.setBaseURL("assets/");

        this.load.image(AssetType.GameLogo, "images/GameLogo.png")
    }

    create() {
      const gameLogo = this.add
            .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, AssetType.GameLogo)
            .setOrigin(0.5)
            .setAlpha(1)

        gameLogo.setScale(0.2);

        const pressStartText = this.add
            .text(GAME_WIDTH / 2, 600, "PRESS SPACE TO START", {
                fontFamily: "'Pixelify Sans', sans-serif",
                fontSize: "28px",
                fill: "#ffffff"
            })
            .setOrigin(0.5);

        this.tweens.add({
            targets: pressStartText,
            alpha: 0,
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.startKey)) {
            this.scene.start("MainScene");
        }
    }
}