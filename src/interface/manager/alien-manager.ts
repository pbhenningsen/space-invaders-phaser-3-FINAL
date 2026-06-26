import { Alien } from "../alien";
import { AlienTextures } from "../assets";

export class AlienManager{
    aliens: Phaser.Physics.Arcade.Group;

    private _moveTimer?: Phaser.Time.TimerEvent;

    private _direction: 1 | -1 = 1;

    private readonly COLS = 10;
    private readonly ROWS = 5;

    private readonly ORIGIN_X = 100;
    private readonly ORIGIN_Y = 64;

    private readonly SPACING_X = 48;
    private readonly SPACING_Y = 50;

    private readonly STEP_X = 6;
    private readonly DROP_Y = 24;

    private readonly LEFT_BOUND = 24;
    private readonly RIGHT_BOUND = 653;

    private readonly START_DELAY = 650;
    private readonly MIN_DELAY = 70;

    private _startingAlienCount = this.COLS * this.ROWS;

    get hasAliveAliens(): boolean {
        return this.aliens.countActive(true) > 0;
    }

    constructor(private _scene: Phaser.Scene) {
        this.aliens = this._scene.physics.add.group({
            maxSize: this.COLS * this.ROWS,
            classType: Alien,
            runChildUpdate: true
        });

        this._sortAliens();
        this._startMovement();
    }

    getRandomAliveEnemy(): Alien | null {
        const aliveAliens = this.aliens
            .getChildren()
            .filter(a => a.active) as Alien[];

        if (aliveAliens.length === 0) {
            return null;
        }

        const randomIndex = Phaser.Math.Between(0, aliveAliens.length-1);
        return aliveAliens[randomIndex];
    }

    reset() {
        this._moveTimer?.remove(false);
        this._direction = 1;
        this._sortAliens();
        this._startMovement();
    }

    private _sortAliens() {
        this.aliens.clear(true, true);

        for (let y = 0; y < this.ROWS; y++) {
            for (let x = 0; x < this.COLS; x++) {
                const randomTexture = Phaser.Utils.Array.GetRandom(AlienTextures);

                const alien = this.aliens.create(
                    this.ORIGIN_X + x * this.SPACING_X,
                    this.ORIGIN_Y + y * this.SPACING_Y,
                    randomTexture
                ) as Alien;

                alien.setOrigin(0.5, 0.5);
                alien.setImmovable(false);

                // Optional but recommended if your images are different sizes.
                // This forces every alien to occupy the same visual grid space.
                alien.setDisplaySize(32, 32);

                // Store its original grid position.
                alien.setData("col", x);
                alien.setData("row", y);
            }
        }
    }
    private _startMovement() {
        this._scheduleNextStep();
    }

    private _scheduleNextStep() {
        if (!this.hasAliveAliens) {
            return;
        }

        this._moveTimer = this._scene.time.delayedCall(
            this._getCurrentMoveDelay(),
            this._stepAliens,
            [],
            this
        );
    }

    private _stepAliens() {
        const aliveAliens = this.aliens
            .getChildren()
            .filter(a => a.active) as Alien[];

            if (aliveAliens.length === 0 ) {
                return;
            }

            const shouldDrop = this._formationWouldHitEdge(aliveAliens);

            if (shouldDrop) {
                this._direction *= -1;

                aliveAliens.forEach(alien => {
                    alien.y += this.DROP_Y;
                });
            }  else {
                aliveAliens.forEach(alien => {
                    alien.x += this.STEP_X * this._direction;
                });
            }

            this._scheduleNextStep();
    }

    private _formationWouldHitEdge(aliveAliens: Alien[]): boolean {
        return aliveAliens.some(alien => {
            const nextX = alien.x + this.STEP_X * this._direction;

            const halfWidth = alien.displayWidth/2;

            return (
                nextX - halfWidth <= this.LEFT_BOUND ||
                nextX + halfWidth >= this.RIGHT_BOUND
            );
        });
    }

    private _getCurrentMoveDelay(): number {
        const aliveCount = this.aliens.countActive(true);

        const killed = this._startingAlienCount - aliveCount;
        const progress = killed / this._startingAlienCount;

        //As more aliens die, the movement delay drops. 
        //This recreates the classic "they get faster" behavior.
        const delay = Phaser.Math.Linear(
            this.START_DELAY,
            this.MIN_DELAY,
            progress
        );

        return delay;
    }

    getRandomFrontAlien(): Alien | null {
        const aliveAliens = this.aliens
            .getChildren()
            .filter(a => a.active) as Alien[];

        if (aliveAliens.length === 0) {
            return null;
        }

    const frontAliensByColumn = new Map<number, Alien>();

    aliveAliens.forEach(alien => {
        const col = alien.getData("col");

        const currentFrontAlien = frontAliensByColumn.get(col);

        // Bigger y means lower on the screen.
        // Lower on the screen means closer to the player.
        if (!currentFrontAlien || alien.y > currentFrontAlien.y) {
            frontAliensByColumn.set(col, alien);
        }
    });

    const frontAliens = Array.from(frontAliensByColumn.values());

    const randomIndex = Phaser.Math.Between(0, frontAliens.length - 1);

    return frontAliens[randomIndex];
}


} 