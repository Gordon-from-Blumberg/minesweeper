import * as PIXI from 'pixi.js-legacy';

export class Game {
  static init(): void {
    const app = PIXI.autoDetectRenderer({
      width: 800,
      height: 600
    });
  
    document.getElementById('container').appendChild(app.view);
  }
}