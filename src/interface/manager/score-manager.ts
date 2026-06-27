import { AssetType } from "../assets";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants"

export class ScoreManager {
  scoreText: Phaser.GameObjects.Text;
  line1Text: Phaser.GameObjects.Text;
  line2Text: Phaser.GameObjects.Text;
  lives: Phaser.Physics.Arcade.Group;

  get noMoreLives() {
    return this.lives.countActive(true) === 0;
  }

  highScore = 0;
  score = 0;

  constructor(private _scene: Phaser.Scene) {
    this._init();
    this.print();
  }

  private _init() {
    const { width: SIZE_X, height: SIZE_Y } = this._scene.game.canvas;
    const textConfig = {
      fontFamily: `'Pixelify Sans', sans-serif`,
      fill: "#ffffff",
    };
    const normalTextConfig = {
      ...textConfig,
      fontSize: "16px",
    };

    const bigTextConfig = {
      ...textConfig,
      fontSize: "36px",
    };

    this._scene.add.text(16, 16, `SCORE:`, normalTextConfig);
    this.scoreText = this._scene.add.text(75, 16, "", normalTextConfig);
    this.line1Text = this._scene.add
      .text(SIZE_X / 2, 320, "", bigTextConfig)
      .setOrigin(0.5);

    this.line2Text = this._scene.add
      .text(SIZE_X / 2, 400, "", bigTextConfig)
      .setOrigin(0.5);

    this._setLivesText();
  }

 private _setLivesText() {
    this.lives = this._scene.physics.add.group({
        maxSize: 3,
        runChildUpdate: true,
    });

    this.resetLives();
}

  resetLives() {
    this.lives.clear(true, true);

    const startX = 60;
    const y = GAME_HEIGHT - 20;

    for (let i = 0; i < 3; i++) {
        const ship = this.lives.create(
            startX + 45 * i,
            y,
            AssetType.Ship
        ) as Phaser.GameObjects.Sprite;

        ship.setOrigin(0.5, 0.5);

        // If your ship image already faces upward, use 0.
        ship.setAngle(0);

        ship.setAlpha(1.0);
        ship.setScale(1.0);
    }
}

  setWinText() {
    this._setBigText("YOU WON!", "PRESS SPACE FOR NEW GAME");
  }

  setGameOverText() {
    this._setBigText("GAME OVER", "PRESS SPACE FOR NEW GAME");
  }

  hideText() {
    this._setBigText("", "")
  }

  private _setBigText(line1: string, line2: string) {
    this.line1Text.setText(line1);
    this.line2Text.setText(line2);
  }

  setHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
    this.score = 0;
    this.print();
  }

  print() {
    this.scoreText.setText(`${this.padding(this.score)}`);
  }

  increaseScore(step = 10) {
    this.score += step;
    this.print();
  }

  padding(num: number) {
    return `${num}`.padStart(4, "0");
  }
}
