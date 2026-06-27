import { Mystery } from "../mystery";

export class MysteryManager {
    mystery: Mystery;

    private _spawnTimer?: Phaser.Time.TimerEvent;

    private readonly UFO_Y = 50;
    private readonly UFO_SPEED = 120;

    private readonly MIN_SPAWN_DELAY = 12000;
    private readonly MAX_SPAWN_DELAY = 24000;

    constructor(private _scene: Phaser.Scene) {
        this.mystery = new Mystery(this._scene);
        this._scheduleNextSpawn();
    }

    reset() {
        this._spawnTimer?.remove(false);
        this.mystery.kill();
        this._scheduleNextSpawn();
    }

    gameOver() {
        this._spawnTimer?.remove(false);
        this.mystery.kill();
    }

    private _scheduleNextSpawn() {
        const delay = Phaser.Math.Between(
            this.MIN_SPAWN_DELAY,
            this.MAX_SPAWN_DELAY
        );

        this._spawnTimer = this._scene.time.delayedCall(delay, () => {
            this._spawnUfo();
            this._scheduleNextSpawn();
        });
    }

    private _spawnUfo() {
        if (this.mystery.active) {
            return;
        }

        const direction: 1 | -1 = Phaser.Math.Between(0, 1) === 0 ? 1 : -1;

        this.mystery.spawn(direction, this.UFO_Y, this.UFO_SPEED);
    }
}