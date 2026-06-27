import { AssetType } from "./assets";
import { GAME_WIDTH, GAME_HEIGHT } from "./constants";

const PLAYER_OFFSET = 100;

export class Ship {
    static create(scene: Phaser.Scene): Phaser.Physics.Arcade.Sprite {
        let ship = scene.physics.add.sprite(GAME_WIDTH/2, GAME_HEIGHT-PLAYER_OFFSET, AssetType.Ship);
        ship.setCollideWorldBounds(true);
        return ship;
    }
}