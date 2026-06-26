import { EnemyBullet } from "../enemy-bullet";
import { Bullet } from "../bullet";
import { Kaboom } from "../kaboom";

export class AssetManager {
    bullets: Phaser.Physics.Arcade.Group;
    enemyBullets: Phaser.Physics.Arcade.Group;
    explosions: Phaser.GameObjects.Group;

    constructor(private _scene: Phaser.Scene) {
        this.bullets = this._createBullets();
        this.enemyBullets = this._createEnemyBullets();
        this.explosions = this._createExplosions();
    }

    gameOver() {
        this.enemyBullets.clear(true, true);
        this.bullets.clear(true, true);
    }

    reset() {
        this.enemyBullets.clear(true, true);
        this.bullets.clear(true, true);
        this.explosions.clear(true, true);
    }

    private _createEnemyBullets(): Phaser.Physics.Arcade.Group {
        return this._scene.physics.add.group({
            maxSize: 5,
            classType: EnemyBullet,
            runChildUpdate: true
        });
    }

    private _createBullets(): Phaser.Physics.Arcade.Group {
        return this._scene.physics.add.group({
            maxSize: 1,
            classType: Bullet,
            runChildUpdate: true
        });
    }

    private _createExplosions(): Phaser.GameObjects.Group {
        return this._scene.add.group({
            maxSize: 20,
            classType: Kaboom,
            runChildUpdate: true
        });
    }
}