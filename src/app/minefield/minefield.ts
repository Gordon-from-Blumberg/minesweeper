import * as PIXI from 'pixi.js-legacy';

import { Cell } from './cell';
import { ConfigService } from '../config/config-service';
import { Resources } from '../resources';

export class Minefield {
  private readonly cellGrid: Cell[][] = [];
  private config;

  scene: PIXI.Container;

  minesCount: number;
  markedMinesCount = 0;

  get minesLeft() {
    return this.minesCount - this.markedMinesCount;
  }

  constructor(scene: PIXI.Container) {
    this.scene = scene;
    this.config = ConfigService.getInstance().getConfig().game.minefield;

    this.minesCount = this.config.minesCount;

    const texture = Resources.get('cell');
    const cellStep = this.config.cellSize + this.config.cellMargin;

    for (let i = 0; i < this.config.columns; i++) {
      if (!this.cellGrid[i]) this.cellGrid[i] = [];

      for (let j = 0; j < this.config.rows; j++) {
        const sprite = new PIXI.Sprite(texture);
        sprite.width = this.config.cellSize;
        sprite.height = this.config.cellSize;
        sprite.interactive = true;

        sprite.position.set(i * cellStep, j * cellStep);
        scene.addChild(sprite);

        this.cellGrid[i][j] = {
          x: i,
          y: j,
          hasMine: false,
          siblingsWithMine: 0,
          marked: false,
          opened: false,
          sprite: sprite
        };

        sprite.on('mouseover', () => sprite.texture = Resources.get('cellHightlight'));
        sprite.on('mouseout', () => sprite.texture = texture);
      }
    }
  }
}
