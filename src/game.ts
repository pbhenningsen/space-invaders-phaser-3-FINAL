import 'phaser';
import { LogoScene } from "./scenes/logo-scene";
import { MenuScene } from "./scenes/menu-scene"; 
import { MainScene } from './scenes/main';
import { GAME_WIDTH, GAME_HEIGHT } from './interface/constants';

const config: Phaser.Types.Core.GameConfig = {
    title: "Space Invaders",
    type: Phaser.AUTO,
    backgroundColor: 'black',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scene: [LogoScene, MenuScene, MainScene],
    physics: {
        default: "arcade"
    },
    parent: "SpaceInvaders"
};

class SpaceInvadersGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

const startGame = () => {
    new SpaceInvadersGame(config);
};

const fontDocument = document as Document & {
    fonts?: {
        load: (font: string) => Promise<unknown[]>;
        ready?: Promise<unknown>;
    };
};

if (fontDocument.fonts) {
    Promise.all([
        fontDocument.fonts.load("16px 'Pixelify Sans'"),
        fontDocument.fonts.load("36px 'Pixelify Sans'")
    ]).then(() => {
        startGame();
    });
} else {
    startGame();
}