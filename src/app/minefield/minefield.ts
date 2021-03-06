import * as PIXI from 'pixi.js-legacy';

import { Cell } from './cell';
import { ConfigService } from '../config/config-service';
import { Resources } from '../util/resources';
import { randInt } from '../functions/functions';

export class Minefield {
  private readonly cellGrid: Cell[][] = [];
  private config;

  private explodedMine: Cell;

  private mineExploded: () => void;
  //use bound function to prevent errors
  private onCellOpened = this.openSiblingsOf.bind(this);
  private onCellMarked = this.adjustMarked.bind(this);
  private onMineExploded = ((cell: Cell) => {
    this.explodedMine = cell;
    this.openMines();
    this.mineExploded();
  }).bind(this);
  private onVictory: () => void;

  scene: PIXI.Container;

  private minesCount: number;
  private markedCellCount = 0;
  private openedCellCount = 0;
  private cellCount = 0;

  get minesLeft(): string {
    return String(this.minesCount - this.markedCellCount);
  }

  constructor(scene: PIXI.Container, onVictory: () => void, onLose: () => void) {
    this.scene = scene;
    this.mineExploded = onLose;
    this.onVictory = onVictory;

    this.config = ConfigService.getInstance().getConfig().game.minefield;

    this.generateCells();

    this.generateMines();

    this.drawNumber();
  }

  private generateCells() {
    this.cellCount = this.config.columns * this.config.rows;
    const cellTexture = Resources.get('cell');
    //distance between right top corners of the adjacent cells
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
          this.onMineExploded, 
          this.onCellOpened,
          this.onCellMarked
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
      }
    }
  }

  private drawNumber() {
    //y position delta of number is the same for each cell
    const dy = (this.config.cellSize - this.config.numberStyle.fontSize) / 2;

    this.forEachCell(cell => {
      if (!cell.hasMine && cell.siblingsWithMine > 0) {
        cell.numberSprite = new PIXI.Text(
          String(cell.siblingsWithMine),
          {
            fontSize: this.config.numberStyle.fontSize,
            fontWeight: this.config.numberStyle.fontWeight,
            fill: this.config.numberStyle.colors[cell.siblingsWithMine - 1]
          }
        );
        cell.numberSprite.visible = false;

        //x position delta of number may depend on the digit width
        const dx = (this.config.cellSize - cell.numberSprite.width) / 2;          
        cell.numberSprite.position.set(
          cell.sprite.position.x + dx,
          cell.sprite.position.y + dy
        );
        this.scene.addChild(cell.numberSprite);
      }
    });
  }

  //invoke the passed handler for each cell
  private forEachCell(handler: (cell: Cell) => void) {
    for (const column of this.cellGrid) {
      for (const cell of column) {
        handler(cell);
      }
    }
  }

  //invoke the passed handler for each sibling of the passed cell
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
    this.openedCellCount++;

    //do not open siblings if among them there is a mine
    if (cell.siblingsWithMine === 0 && !cell.hasMine) {
      this.forEachSiblingOf(cell, sibling => {
        if (!sibling.opened && !sibling.hasMine && !sibling.marked) {
          sibling.open();
        }
      });
    }

    this.checkForVictory();
  }

  private adjustMarked(cell: Cell) {
    if (cell.marked) {
      this.markedCellCount++;
    } else {
      this.markedCellCount--;
    }

    this.checkForVictory();
  }

  private checkForVictory() {
    if ( (this.markedCellCount === this.minesCount)
        && (this.markedCellCount + this.openedCellCount === this.cellCount) ) {
      
      this.openMines();
      this.onVictory();
    }
  }

  private openMines() {
    this.forEachCell(cell => {
      if (!cell.opened && cell.hasMine) {
        cell.open();
      }
    });
  }
}
