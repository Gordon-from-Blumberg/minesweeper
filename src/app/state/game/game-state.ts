import { AbstractState } from '../abstract-state';
import * as PIXI from 'pixi.js-legacy';

export class GameState extends AbstractState {
  private readonly FRAME_DURATION = 1 / 60;

  private gameInfo: PIXI.Container;
  private pauseButton;

  private timeInfo: PIXI.Text;
  private time = 0;

  private minesInfo: PIXI.Text;
  private minesCount = 50; //todo
  private markedMinesCount = 0;

  constructor(scene: PIXI.Container, resources) {
    super('game', scene, resources);
  }

  init() {
    const background = new PIXI.TilingSprite(
      this.resources.backgroundColorGrass.texture,
      800,
      600
    );
    this.scene.addChild(background);

    this.gameInfo = new PIXI.Container();
    this.scene.addChild(this.gameInfo);

    this.pauseButton = this.drawButton(16, 128);
    this.pauseButton.interactive = true;
    this.pauseButton.buttonMode = true;
    this.scene.addChild(this.pauseButton);

    const pauseIcon = new PIXI.Sprite(this.resources.pauseIcon.texture);
    pauseIcon.position.set(24, 8);
    this.pauseButton.addChild(pauseIcon);

    const pauseText = new PIXI.Text('PAUSE', {
      fill: ['#888', '#444'],
      fontSize: 24
    });
    pauseText.position.set(56, 8);
    this.pauseButton.addChild(pauseText);

    this.pauseButton.on('click', () => this.stateChanged('mainMenu'));

    const timeInfoBlock = this.drawButton(150, 120);
    this.timeInfo = new PIXI.Text(`Time: ${this.time}`, {
      fill: ['#888', '#444'],
      fontSize: 24
    });
    this.timeInfo.position.set(156, 8);
    timeInfoBlock.addChild(this.timeInfo);
    this.gameInfo.addChild(timeInfoBlock);

    const minesInfoBlock = this.drawButton(280, 160);
    this.minesInfo = new PIXI.Text(`Mines left: ${this.minesCount - this.markedMinesCount}`, {
      fill: ['#888', '#444'],
      fontSize: 24
    });
    this.minesInfo.position.set(286, 8);
    minesInfoBlock.addChild(this.minesInfo);
    this.gameInfo.addChild(minesInfoBlock);
  }

  update(dt: number) {
    this.time += dt * this.FRAME_DURATION;
    this.timeInfo.text = `Time: ${this.time ^ 0}`;

    this.minesInfo.text = `Mines left: ${this.minesCount - this.markedMinesCount}`;
  }

  private drawButton(x: number, width: number) {
    return new PIXI.Graphics()
      .beginFill(0x77bbee)
      .lineStyle(1, 0x888888)
      .drawRoundedRect(x, 4, width, 32, 4)
      .endFill();
  }
}