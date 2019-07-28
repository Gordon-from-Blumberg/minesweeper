import { AbstractState } from '../abstract-state';
import * as PIXI from 'pixi.js-legacy';

export class GameState extends AbstractState {

  private pauseButton;

  constructor(scene: PIXI.Container, resources) {
    super('game', scene, resources);
  }

  init() {
    this.pauseButton = new PIXI.Graphics()
      .beginFill(0x80aaff)
      .lineStyle(5, 0x0000ff)
      .drawRoundedRect(200, 430, 280, 80, 20)
      .endFill();
    this.pauseButton.interactive = true;
    this.pauseButton.buttonMode = true;
    this.scene.addChild(this.pauseButton);

    this.pauseButton.on('click', () => this.stateChanged('mainMenu'));
  }

  update(dt: number) {

  }
}