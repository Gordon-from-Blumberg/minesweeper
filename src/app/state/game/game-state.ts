import * as PIXI from 'pixi.js-legacy';

import { AbstractState } from '../abstract-state';
import { ConfigService } from '../../config/config-service';

export class GameState extends AbstractState {
  private readonly MS_PER_SECOND = 1000;

  private config;

  private gameInfo: PIXI.Container;
  private pauseButton;

  private timeInfo: PIXI.Text;
  private time = 0;

  private minesInfo: PIXI.Text;
  private minesCount;
  private markedMinesCount = 0;

  constructor(scene: PIXI.Container, resources) {
    super('game', scene, resources);
  }

  init() {
    this.config = ConfigService.getInstance().getConfig();
    const gameCfg = this.config.game;

    this.minesCount = gameCfg.minesCount;

    const background = new PIXI.TilingSprite(
      this.resources[gameCfg.background].texture,
      this.config.screenWidth,
      this.config.screenHeight
    );
    this.scene.addChild(background);

    this.gameInfo = new PIXI.Container();
    this.scene.addChild(this.gameInfo);

    let blockPositionX = gameCfg.buttons.x;

    this.pauseButton = this.createBlock(
      gameCfg.buttons.pauseWidth,
      new PIXI.Text('PAUSE', gameCfg.textStyle),
      gameCfg.buttons.pauseIcon
    );

    this.pauseButton.position.set(blockPositionX, gameCfg.buttons.y);
    this.pauseButton.interactive = true;
    this.pauseButton.buttonMode = true;
    this.gameInfo.addChild(this.pauseButton);
    blockPositionX += this.pauseButton.width + gameCfg.buttons.marginX;

    this.pauseButton.on('click', () => this.stateChanged('mainMenu'));
    console.log(`pauseButton global position x = ${this.pauseButton.getGlobalPosition().x}`);

    this.timeInfo = new PIXI.Text(`Time: ${this.time}`, gameCfg.textStyle);
    const timeInfoBlock = this.createBlock(gameCfg.buttons.timeInfoWidth, this.timeInfo);
    timeInfoBlock.position.set(blockPositionX, gameCfg.buttons.y);
    this.gameInfo.addChild(timeInfoBlock);
    blockPositionX += timeInfoBlock.width + gameCfg.buttons.marginX;
    
    console.log(`timeInfoBlock global position x = ${timeInfoBlock.getGlobalPosition().x}`);
    
    this.minesInfo = new PIXI.Text(`Mines left: ${this.minesCount - this.markedMinesCount}`, gameCfg.textStyle);
    const minesInfoBlock = this.createBlock(gameCfg.buttons.minesInfoWidth, this.minesInfo);
    minesInfoBlock.position.set(blockPositionX, gameCfg.buttons.y);
    this.gameInfo.addChild(minesInfoBlock);

    window.addEventListener('keydown', this.keyDownHandler.bind(this), false);
  }

  update(dtime: number, dms: number) {
    this.time += dms;

    this.timeInfo.text = `Time: ${this.time / this.MS_PER_SECOND ^ 0}`;

    this.minesInfo.text = `Mines left: ${this.minesCount - this.markedMinesCount}`;
  }

  private createBlock(width: number, text: PIXI.Text, icon?: string): PIXI.Graphics {
    const buttonsCfg = this.config.game.buttons;
    const block: PIXI.Graphics = new PIXI.Graphics();
    let textPositionX = buttonsCfg.padding.x;

    if (icon) {
      const iconSprite = new PIXI.Sprite(this.resources[icon].texture);
      iconSprite.position.set(buttonsCfg.padding.x, buttonsCfg.padding.y);
      block.addChild(iconSprite);
      textPositionX += iconSprite.width + buttonsCfg.iconTextSpace;
    }

    text.position.set(textPositionX, buttonsCfg.padding.y);
    block.addChild(text);

    return block
      .beginFill(0x77bbee)
      .lineStyle(1, 0x888888)
      .drawRoundedRect(0, 0, width, buttonsCfg.height, 4)
      .endFill();
  }

  private keyDownHandler(event: KeyboardEvent) {
    if (event.code === "Space") {
      this.stateChanged('mainMenu');
      event.preventDefault();
    }
  }
}