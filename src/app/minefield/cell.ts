export interface Cell {
  x: number;
  y: number;
  hasMine: boolean;
  siblingsWithMine: number;
  marked: boolean;
  opened: boolean;
}
