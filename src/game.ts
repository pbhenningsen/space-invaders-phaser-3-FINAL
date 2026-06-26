import 'phaser';
import { MainScene } from './scenes/main';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';

const config: Phaser.Types.Core.GameConfig = {
    title: "Space Invaders",
    type: Phaser.AUTO,
    backgroundColor: 'black',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scene: MainScene,
    physics: {
        default: "arcade"
    },
    parent: "SpaceInvaders"
};

class SpaceInvadersGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config)
    }
}

const game = new SpaceInvadersGame(config);
