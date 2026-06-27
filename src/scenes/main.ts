import { AssetType, SoundType } from "../interface/assets";
import { Bullet } from "../interface/bullet";
import { AssetManager } from "../interface/manager/asset-manager";
import { AlienManager } from "../interface/manager/alien-manager";
import {Alien} from "../interface/alien"
import { Ship } from "../interface/ship";
import { Kaboom } from "../interface/kaboom";
import { EnemyBullet } from "../interface/enemy-bullet";
import { ScoreManager } from "../interface/manager/score-manager";
import { GameState } from "../interface/game-state";
import { Barrier } from "../interface/barrier";
import { BottomLine } from "../interface/bottom-line";
import { Mystery } from "../interface/mystery"; 
import { MysteryManager } from "../interface/manager/mystery-manager"; 
import { RandomSoundManager } from "../interface/manager/random-sound-manager";

import { GAME_WIDTH, GAME_HEIGHT } from "../interface/constants";

export class MainScene extends Phaser.Scene {
    state: GameState;
    assetManager: AssetManager;
    scoreManager: ScoreManager;
    bulletTime = 0;
    firingTimer = 0;
    starfield: Phaser.GameObjects.TileSprite;
    player: Phaser.Physics.Arcade.Sprite;
    alienManager: AlienManager;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    fireKey: Phaser.Input.Keyboard.Key;
    barriers: Phaser.Physics.Arcade.Group;
    bottomLine: BottomLine;
    mysteryManager: MysteryManager;
    randomSoundManager: RandomSoundManager;

    constructor() {
        super({
            key: "MainScene",
        });
    }

    preload() {
        this.load.setBaseURL("assets");
        this.load.image(AssetType.Starfield, "images/starfield.png");
        this.load.image(AssetType.Bullet, "images/bullet.png");
        this.load.spritesheet(AssetType.EnemyBullet, "images/enemy-bullet.png", {
            frameWidth: 12,
            frameHeight: 17,
        });
        this.load.spritesheet(AssetType.Barrier, "images/barrier.png", {
            frameWidth: 44,
            frameHeight: 32,
        });
        
        this.load.image(AssetType.Ufo1, "images/ufo1.png");
        this.load.image(AssetType.Ufo2, "images/ufo2.png");
        this.load.image(AssetType.Ufo3, "images/ufo3.png");
        this.load.image(AssetType.Ufo4, "images/ufo4.png");
        this.load.image(AssetType.Ufo5, "images/ufo5.png");
        this.load.image(AssetType.Ufo6, "images/ufo6.png");
        this.load.image(AssetType.Ufo7, "images/ufo7.png");
        this.load.image(AssetType.Ufo8, "images/ufo8.png");
        this.load.image(AssetType.Ufo9, "images/ufo9.png");

        this.load.image(AssetType.MysteryShip, "images/potato.png")



        this.load.image(AssetType.Ship, "images/player.png");
        this.load.image(AssetType.Kaboom, "images/explode.png");

        this.load.image(AssetType.PlayerDeath, "images/player_death.png");

        this.sound.volume = 0.5;
        this.load.audio(SoundType.Shoot, "audio/shoot.wav");
        this.load.audio(SoundType.Kaboom, "audio/player_explosion.wav");
        this.load.audio(SoundType.InvaderKilled, "audio/invaderkilled.wav");
        this.load.audio(SoundType.Bass1, "audio/bass4.wav");
        this.load.audio(SoundType.Bass2, "audio/bass1.wav");
        this.load.audio(SoundType.Bass3, "audio/bass2.wav");
        this.load.audio(SoundType.Bass4, "audio/bass3.wav");
        this.load.audio(SoundType.Gofast, "audio/Gofast.m4a");
        this.load.audio(SoundType.Gimbal, "audio/Gimbal.m4a");
        this.load.audio(SoundType.UfoHighPitch, "audio/ufo_highpitch.wav");
    }

    create() {
       this.state = GameState.Playing;

        this.starfield = this.add
            .tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, AssetType.Starfield)
            .setOrigin(0, 0);

        this.bottomLine = new BottomLine(this, GAME_HEIGHT - 40);

        this._createBarriers();
        this.assetManager = new AssetManager(this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.fireKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.player = Ship.create(this);
        this.alienManager = new AlienManager(this);
        this.scoreManager = new ScoreManager(this);
        this.mysteryManager = new MysteryManager(this);
        this.randomSoundManager = new RandomSoundManager(this);

        this.fireKey.on("down", () => {
            switch (this.state) {
                case GameState.Win:
                case GameState.GameOver:
                    this.scene.start("MenuScene");
                    break;
            }
        })
    }

    private _createBarriers() {
        this.barriers = this.physics.add.group();

        const y = 600;
        const xs = [135, 270, 405, 540];

        xs.forEach((x) => {
            const barrier = new Barrier(this, x, y);
            this.barriers.add(barrier);
        });
    }

    private playerIsHit = false;

    private _playPlayerHitEffect(onComplete: () => void) {
    let flashes = 0;
    const maxFlashes = 8;

    this.player.setVelocity(0, 0);

    const flashTimer = this.time.addEvent({
        delay: 80,
        repeat: maxFlashes - 1,
        callback: () => {
            const useDeathTexture = flashes % 2 === 0;

            this.player.setTexture(
                useDeathTexture ? AssetType.PlayerDeath : AssetType.Ship
            );

            flashes++;

            if (flashes >= maxFlashes) {
                this.player.setTexture(AssetType.Ship);
                onComplete();
            }
        }
    });
}

    update() {
        this.starfield.tilePositionY -= 1;
        this._shipKeyboardHandler();

        if (this.time.now > this.firingTimer) {
            this._enemyFires();
        }

        this.physics.overlap(
            this.assetManager.bullets,
            this.alienManager.aliens,
            this._bulletHitAliens,
            null,
            this
        );

        this.physics.overlap(
            this.player,
            this.assetManager.enemyBullets,
            this._enemyBulletHitPlayer,
            null,
            this
        );

        this.physics.overlap(
            this.assetManager.bullets,
            this.barriers,
            this._bulletHitBarrier,
            null,
            this
        );

        this.physics.overlap(
            this.assetManager.enemyBullets,
            this.barriers,
            this._enemyBulletHitBarrier,
            null,
            this
        );

        this.physics.overlap(
            this.mysteryManager.mystery,
            this.assetManager.bullets,
            this._bulletHitMystery,
            null,
            this
        );

    this._checkEnemyBulletsHitBottomLine();
}

    private _bulletHitBarrier(bullet: Bullet, barrier: Barrier) {
        if (!bullet.active || !barrier.active) {
            return;
        }

        const hitX = bullet.x;

        bullet.kill();
        barrier.takeDamage(hitX);
}

    private _enemyBulletHitBarrier(enemyBullet: EnemyBullet, barrier: Barrier) {
        if (!enemyBullet.active || !barrier.active) {
            return;
        }

        const hitX = enemyBullet.x;

        enemyBullet.kill();
        barrier.takeDamage(hitX);
}
    

    private _shipKeyboardHandler() {
        if (this.playerIsHit) {
            return;
        }

        let playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        playerBody.setVelocity(0, 0);

        if (this.cursors.left.isDown) {
            playerBody.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            playerBody.setVelocityX(200);
        }

        if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
            this._fireBullet();
        }
    }

    private _bulletHitAliens(bullet: Bullet, alien: Alien) {
        if (!bullet.active || !alien.active) {
            return;
        }

        const explosion = this.assetManager.explosions.get() as Kaboom;

        bullet.kill();

        if (explosion) {
            alien.kill(explosion);
        } else {
            alien.kill();
        }

        this.scoreManager.increaseScore();

        if (!this.alienManager.hasAliveAliens) {
            this.scoreManager.increaseScore(1000);
            this.scoreManager.setWinText();
            this.state = GameState.Win;
        }
    }

    
   private _bulletHitMystery(
        mystery: Mystery,
        bullet: Bullet,
    ) {
        if (!bullet.active || !mystery.active) {
            return;
        }

        const explosion = this.assetManager.explosions.get() as Kaboom;

        bullet.kill();
        mystery.shootDown(explosion);

        this.scoreManager.increaseScore(300);
    }

    private _showBonusScore(points: number, x: number, y: number) {
        const text = this.add
            .text(x, y, `${points}`, {
                fontFamily: "'Pixelify Sans', sans-serif",
                fontSize: "18px",
                fill: "#ffffff"
            })
            .setOrigin(0.5)
            .setDepth(20);

        this.time.delayedCall(700, () => {
            text.destroy();
        });
}
    
    private _enemyBulletHitPlayer(
        ship: Phaser.Physics.Arcade.Sprite,
        enemyBullet: EnemyBullet
    ) {
        if (this.playerIsHit) {
            return;
        }

        if (!enemyBullet.active || !ship.active) {
            return;
        }

        this.playerIsHit = true;

        const explosion = this.assetManager.explosions.get() as Kaboom;

        enemyBullet.kill();

        const live = this.scoreManager.lives.getFirstAlive() as Phaser.GameObjects.Sprite;

        if (live) {
            live.setActive(false).setVisible(false);
        }

        if (explosion) {
            explosion.show(this.player.x, this.player.y);
        }

        this.sound.play(SoundType.Kaboom);

        this._playPlayerHitEffect(() => {
            this.playerIsHit = false;

            if (this.scoreManager.noMoreLives) {
                this.scoreManager.setGameOverText();
                this.assetManager.gameOver();
                this.state = GameState.GameOver;
                this.randomSoundManager.stop();
                this.player.disableBody(true, true);
                return;
            }

            this.player.setTexture(AssetType.Ship);
        });
    }

    

   private _enemyFires() {
        if (!this.player.active) {
            return;
        }

        let enemyBullet: EnemyBullet = this.assetManager.enemyBullets.get();
        let randomEnemy = this.alienManager.getRandomFrontAlien();

        if (enemyBullet && randomEnemy) {
            enemyBullet.shoot(randomEnemy.x, randomEnemy.y + 12);

            this.firingTimer = this.time.now + 2000;
            }
        }

    private _fireBullet() {
        if (!this.player.active) {
            return;
        }

        // Original Space Invaders rule:
        // only one player bullet can be on screen.
        if (this.assetManager.bullets.countActive(true) > 0) {
            return;
        }

        const bullet = this.assetManager.bullets.get() as Bullet;

        if (bullet) {
            bullet.shoot(this.player.x, this.player.y - 18);
        }
}
        
    restart() {
        this.state = GameState.Playing;
        this.player.enableBody(true, this.player.x, this.player.y, true, true);
        this.scoreManager.resetLives();
        this.scoreManager.hideText();
        this.alienManager.reset();
        this.assetManager.reset();
        this.playerIsHit = false;
        this.player.setTexture(AssetType.Ship);
        this.randomSoundManager.reset();

        this.bottomLine.reset();
        this.mysteryManager.reset();

        this.barriers.clear(true, true);
        this._createBarriers();
    }

    private _checkEnemyBulletsHitBottomLine() {
        const lineY = GAME_HEIGHT - 40;

        this.assetManager.enemyBullets.children.iterate((child) => {
            const enemyBullet = child as EnemyBullet;

            if (!enemyBullet.active) {
                return;
            }

            if (enemyBullet.y >= lineY) {
                if (this.bottomLine.isSolidAt(enemyBullet.x)) {
                    this.bottomLine.hitAt(enemyBullet.x);
                }

                enemyBullet.kill();
            }
        });
    }

}
