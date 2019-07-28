import * as PIXI from 'pixi.js-legacy';

import { Cell } from './cell';

export class Minefield {
  private readonly cellGrid: Cell[][] = [];

  pixiContainer;

  constructor() {
    this.pixiContainer = new PIXI.Container();
  }
}
