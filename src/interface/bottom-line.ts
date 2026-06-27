import { GAME_WIDTH } from "./constants";

type Gap = {
    start: number;
    end: number;
};

export class BottomLine extends Phaser.GameObjects.Graphics {
    private readonly LINE_COLOR = 0x00ff00;
    private readonly LINE_THICKNESS = 2;
    private readonly GAP_WIDTH = 18;

    private gaps: Gap[] = [];

    constructor(
        scene: Phaser.Scene,
        private lineY: number
    ) {
        super(scene);

        scene.add.existing(this);

        this.redraw();
    }

    hitAt(x: number) {
        const halfGap = this.GAP_WIDTH / 2;

        this.gaps.push({
            start: x - halfGap,
            end: x + halfGap
        });

        this._mergeGaps();
        this.redraw();
    }

    isSolidAt(x: number): boolean {
        return !this.gaps.some(gap => {
            return x >= gap.start && x <= gap.end;
        });
    }

    private redraw() {
        this.clear();

        this.lineStyle(this.LINE_THICKNESS, this.LINE_COLOR, 1);

        let currentX = 0;

        const sortedGaps = [...this.gaps].sort((a, b) => a.start - b.start);

        sortedGaps.forEach(gap => {
            const gapStart = Phaser.Math.Clamp(gap.start, 0, GAME_WIDTH);
            const gapEnd = Phaser.Math.Clamp(gap.end, 0, GAME_WIDTH);

            if (gapStart > currentX) {
                this.lineBetween(currentX, this.lineY, gapStart, this.lineY);
            }

            currentX = Math.max(currentX, gapEnd);
        });

        if (currentX < GAME_WIDTH) {
            this.lineBetween(currentX, this.lineY, GAME_WIDTH, this.lineY);
        }
    }

    private _mergeGaps() {
        if (this.gaps.length <= 1) {
            return;
        }

        this.gaps.sort((a, b) => a.start - b.start);

        const merged: Gap[] = [this.gaps[0]];

        for (let i = 1; i < this.gaps.length; i++) {
            const last = merged[merged.length - 1];
            const current = this.gaps[i];

            if (current.start <= last.end) {
                last.end = Math.max(last.end, current.end);
            } else {
                merged.push(current);
            }
        }

        this.gaps = merged;
    }

    reset() {
        this.gaps = [];
        this.redraw();
    }
}