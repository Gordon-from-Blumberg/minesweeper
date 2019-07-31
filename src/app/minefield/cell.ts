import { Sprite, Text, interaction } from 'pixi.js-legacy';

import { Resources } from '../util/resources';

export class Cell {
  private static readonly HL_SUFFIX = '-hl';

  //events
  private mineExploded: (cell: Cell) => void;
  private cellOpened: (cell: Cell) => void;
  private cellMarked: (cell: Cell) => void;

  private hovered = false;

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
              mineExploded: (cell: Cell) => void,
              cellOpened: (cell: Cell) => void,
              cellMarked: (cell: Cell) => void) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.currentTexture = currentTexture;
    this.mineExploded = mineExploded;
    this.cellOpened = cellOpened;
    this.cellMarked = cellMarked;

    this.setListeners();
  }

  setTexture(name: string) {
    this.currentTexture = name;
    this.sprite.texture = Resources.get(this.hovered
        ? name + Cell.HL_SUFFIX
        : name
    );
  }

  open() {
    this.opened = true;
    this.setTexture( this.hasMine && this.marked 
        ? 'mine-marked' 
        : this.hasMine
            ? 'mine'
            : 'cell-opened'
    );

    //show number if it exists
    if (this.numberSprite) {
      this.numberSprite.visible = true;
    } 

    this.cellOpened(this);      //trigger event
  }

  private setListeners() {
    const sprite = this.sprite;

    //hightlight cell when cursor above
    sprite.on('mouseover', () => {
      this.hovered = true;
      sprite.texture = Resources.get(this.currentTexture + Cell.HL_SUFFIX);
    });
    sprite.on('mouseout', () => {
      this.hovered = false;
      sprite.texture = Resources.get(this.currentTexture);
    });

    sprite.on('click', () => {
      if (!this.marked) {
        this.open();        

        if (this.hasMine) {
          this.mineExploded(this);  // trigger event
        }
      }  
    });

    sprite.on('rightclick', (e: interaction.InteractionEvent) => {
      if (!this.opened) {
        this.marked = !this.marked;
        this.setTexture(this.marked ? 'flag' : 'cell');
        this.cellMarked(this); // trigger event
      }
      e.data.originalEvent.preventDefault();
    });
  }
}
