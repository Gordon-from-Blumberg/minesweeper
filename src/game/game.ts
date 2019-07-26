import { providePIXI } from '../provide-pixi';

export class Game {
  static init(): void {
    const PIXI = providePIXI();

    const app = new PIXI.Application({
      width: 800,
      height: 600
    });
  
    document.getElementById('container').appendChild(app.view);
  }
}