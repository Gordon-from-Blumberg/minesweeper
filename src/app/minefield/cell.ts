import { Sprite } from 'pixi.js-legacy';

export interface Cell {
  x: number;
  y: number;
  hasMine: boolean;
  siblingsWithMine: number;
  marked: boolean;
  opened: boolean;
  sprite: Sprite
}
