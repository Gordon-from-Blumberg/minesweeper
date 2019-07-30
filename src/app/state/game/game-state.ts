import * as PIXI from 'pixi.js-legacy';

import { AbstractState } from '../abstract-state';
import { ConfigService } from '../../config/config-service';
import { Minefield } from '../../minefield/minefield';
import { Resources } from '../../util/resources';

export class GameState extends AbstractState {
  private readonly MS_PER_SECOND = 1000;

  private config;

  private gameInfo: PIXI.Container;
  private pauseButton;

  private timeInfo: PIXI.Text;
  private time = 0;

  private minesInfo: PIXI.Text;

  private minefield: Minefield;

  constructor(scene: PIXI.Container) {
    super('game', scene);
  }

  init() {
    this.config = ConfigService.getInstance().getConfig();
    const gameCfg = this.config.game;

    const background = new PIXI.TilingSprite(
      Resources.get(gameCfg.background),
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

    this.timeInfo = new PIXI.Text('Time: 0000', gameCfg.textStyle);
    const timeInfoBlock = this.createBlock(gameCfg.buttons.timeInfoWidth, this.timeInfo);
    timeInfoBlock.position.set(blockPositionX, gameCfg.buttons.y);
    this.gameInfo.addChild(timeInfoBlock);
    
    blockPositionX += timeInfoBlock.width + gameCfg.buttons.marginX;
    
    this.minesInfo = new PIXI.Text('Mines left: 0000', gameCfg.textStyle);
    const minesInfoBlock = this.createBlock(gameCfg.buttons.minesInfoWidth, this.minesInfo);
    minesInfoBlock.position.set(blockPositionX, gameCfg.buttons.y);
    this.gameInfo.addChild(minesInfoBlock);

    const minefieldScene = new PIXI.Container();
    this.minefield = new Minefield(minefieldScene, () => void 0);
    minefieldScene.position.set(
      (this.config.screenWidth - minefieldScene.width) / 2,
      (this.config.screenHeight + this.gameInfo.height - minefieldScene.height) / 2
    );
    this.scene.addChild(minefieldScene);

    this.pauseButton.on('click', () => this.stateChanged('pause'));
    window.addEventListener('keydown', this.keyDownHandler.bind(this), false);
  }

  update(dtime: number, dms: number) {
    this.time += dms;

    // operation ^ 0 removes digits right to point
    this.timeInfo.text = `Time: ${this.time / this.MS_PER_SECOND ^ 0}`;

    this.minesInfo.text = `Mines left: ${this.minefield.minesLeft}`;
  }

  private createBlock(width: number, text: PIXI.Text, icon?: string): PIXI.Graphics {
    const buttonsCfg = this.config.game.buttons;
    const block: PIXI.Graphics = new PIXI.Graphics();
    let textPositionX = buttonsCfg.padding.x;

    if (icon) {
      const iconSprite = new PIXI.Sprite(Resources.get(icon));
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
      this.stateChanged('pause');
      event.preventDefault();
    }
  }
}