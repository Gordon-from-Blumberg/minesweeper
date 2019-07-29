import * as PIXI from 'pixi.js-legacy';

import { Cell } from './cell';
import { ConfigService } from '../config/config-service';
import { Resources } from '../util/resources';
import { randInt } from '../functions/functions';

export class Minefield {
  private readonly cellGrid: Cell[][] = [];
  private config;

  private mineExploded: () => void;
  private cellOpened = this.openSiblingsOf.bind(this);

  scene: PIXI.Container;

  minesCount: number;
  markedMinesCount = 0;

  get minesLeft() {
    return this.minesCount - this.markedMinesCount;
  }

  constructor(scene: PIXI.Container, mineExploded: () => void) {
    this.scene = scene;
    this.mineExploded = mineExploded;

    this.config = ConfigService.getInstance().getConfig().game.minefield;

    this.generateCells();

    this.generateMines();

    this.drawNumber();
  }

  private generateCells() {
    const cellTexture = Resources.get('cell');
    const cellStep = this.config.cellSize + this.config.cellMargin;

    for (let i = 0; i < this.config.columns; i++) {
      if (!this.cellGrid[i]) this.cellGrid[i] = [];

      for (let j = 0; j < this.config.rows; j++) {
        const sprite = new PIXI.Sprite(cellTexture);
        sprite.width = this.config.cellSize;
        sprite.height = this.config.cellSize;
        sprite.interactive = true;
        sprite.position.set(i * cellStep, j * cellStep);
        this.scene.addChild(sprite);

        const cell = new Cell(i, j, 
          sprite, 'cell', 
          this.mineExploded, 
          this.cellOpened
        );
        this.cellGrid[i][j] = cell;
      }
    }
  }

  private generateMines() {
    this.minesCount = 0;

    while(this.minesCount < this.config.minesCount) {
      //select random cell
      const x = randInt(0, this.config.columns - 1);
      const y = randInt(0, this.config.rows - 1);      
      const cell = this.cellGrid[x][y];

      //random cell may already have mine so check
      if (!cell.hasMine) {
        cell.hasMine = true;
        this.minesCount++;

        //increment siblingsWithMine for all the siblings of this cell
        this.forEachSiblingOf(cell, sibling => sibling.siblingsWithMine++);
        cell.setTexture('mine');
      }
    }
  }

  private drawNumber() {
    //y position delta of number is the same for each cell
    const dy = (this.config.cellSize - this.config.numberStyle.fontSize) / 2;

    for (const column of this.cellGrid) {
      for (const cell of column) {
        if (!cell.hasMine && cell.siblingsWithMine > 0) {
          cell.numberSprite = new PIXI.Text(
            String(cell.siblingsWithMine),
            this.config.numberStyle
          );
          cell.numberSprite.visible = false;

          //x position delta of number depends on the digit width
          const dx = (this.config.cellSize - cell.numberSprite.width) / 2;
          console.log(`dx = ${ dx }, dy = ${dy}`);
          cell.numberSprite.position.set(
            cell.sprite.position.x + dx,
            cell.sprite.position.y + dy
          );
          this.scene.addChild(cell.numberSprite);
        }
      }
    }
  }

  private forEachSiblingOf(cell: Cell, handler: (cell: Cell) => void) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue; //do not process this cell itself

        if (this.cellGrid[cell.x + dx]
            && this.cellGrid[cell.x + dx][cell.y + dy]) {
          
          handler(this.cellGrid[cell.x + dx][cell.y + dy]);
        }
      }
    }
  }

  private openSiblingsOf(cell: Cell) {
    this.forEachSiblingOf(cell, sibling => {
      if (!sibling.opened && !sibling.hasMine) {
        sibling.open();
      }
    });
  }
}
