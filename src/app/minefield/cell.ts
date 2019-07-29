import { Sprite, Text } from 'pixi.js-legacy';

import { Resources } from '../util/resources';

export class Cell {
  private static readonly HL_SUFFIX = '-hl';

  private mineExploded: () => void;
  private cellOpened: (cell: Cell) => void;

  x: number;
  y: number;
  hasMine = false;
  siblingsWithMine = 0;
  marked = false;
  opened = false;
  sprite: Sprite;
  currentTexture: string;
  numberSprite?: Text;

  constructor(x: number, y: number, 
              sprite: Sprite, currentTexture: string,
              mineExploded: () => void,
              cellOpened: (cell: Cell) => void) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.currentTexture = currentTexture;
    this.mineExploded = mineExploded;
    this.cellOpened = cellOpened;

    this.setListeners();
  }

  setTexture(name: string) {
    this.currentTexture = name;
    this.sprite.texture = Resources.get(name);
  }

  open() {
    this.opened = true;
    this.setTexture('cell-opened');
    //show number is it exists
    if (this.numberSprite) {
      this.numberSprite.visible = true;
    } else {
      //trigger opening of siblings only if this is empty
      this.cellOpened(this);
    }
  }

  private setListeners() {
    const sprite = this.sprite;

    sprite.on('mouseover', () => sprite.texture = Resources.get(this.currentTexture + Cell.HL_SUFFIX));
    sprite.on('mouseout', () => sprite.texture = Resources.get(this.currentTexture));

    sprite.on('click', () => {
      if (this.hasMine) {
        this.setTexture('mine');

        this.mineExploded();

      } else {

        this.open();
      }
    });
  }
}
