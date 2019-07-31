import * as PIXI from 'pixi.js-legacy';

import { AbstractState } from '../abstract-state';
import { ConfigService } from '../../config/config-service';
import { Minefield } from '../../minefield/minefield';
import { Resources } from '../../util/resources';
import { InfoBlock } from '../../components/info-block';

export class GameState extends AbstractState {
  private readonly MS_PER_SECOND = 1000;

  private config;

  private gameInfo: PIXI.Container;
  private pauseButton: InfoBlock;

  private timeInfo: InfoBlock;
  private time = 0;

  private minesInfo: InfoBlock;

  private minefieldScene: PIXI.Container;
  private minefield: Minefield;

  private gameEnded = false;

  constructor(scene: PIXI.Container) {
    super('game', scene);
  }

  init() {
    this.config = ConfigService.getInstance().getConfig();
    const buttonsCfg = this.config.game.buttons;

    const background = new PIXI.TilingSprite(
      Resources.get(this.config.game.background),
      this.config.screenWidth,
      this.config.screenHeight
    );
    this.scene.addChild(background);

    this.gameInfo = new PIXI.Container();

    // create pause button
    let positionX = 0;
    this.pauseButton = this.createInfoBlock(
      'PAUSE', 
      true, 
      buttonsCfg.pauseIcon, 
      buttonsCfg.textMargin
    );
    this.gameInfo.addChild(this.pauseButton);

    // create info block with timer
    positionX += this.pauseButton.width + buttonsCfg.marginX;
    this.timeInfo = this.createInfoBlock('Time: 0000', false);
    this.timeInfo.position.x = positionX;
    this.gameInfo.addChild(this.timeInfo);
    
    // create info block with mine count
    positionX += this.timeInfo.width + buttonsCfg.marginX;    
    this.minesInfo = this.createInfoBlock('Mines left: 0000', false);
    this.minesInfo.position.x = positionX;
    this.gameInfo.addChild(this.minesInfo);

    this.minefieldScene = new PIXI.Container();
    this.minefieldScene.position.set(
      (this.config.screenWidth - this.minefieldScene.width) / 2,
      (this.config.screenHeight + this.gameInfo.height - this.minefieldScene.height) / 2
    );
    this.scene.addChild(this.minefieldScene);

    this.gameInfo.position.set(
      (this.config.screenWidth - this.gameInfo.width) / 2,
      buttonsCfg.y
    );
    this.scene.addChild(this.gameInfo);

    this.pauseButton.on('click', () => this.stateChanged('pause'));
    window.addEventListener('keydown', this.keyDownHandler.bind(this), false);
  }

  update(dtime: number, dms: number) {
    if (!this.gameEnded) {
      this.time += dms;

      // operation ^ 0 removes digits right to point
      this.timeInfo.setText(`Time: ${this.time / this.MS_PER_SECOND ^ 0}`);

      this.minesInfo.setText(`Mines left: ${this.minefield.minesLeft}`);
    }
  }

  activate(newGame: boolean) {
    if (newGame) {
      this.gameEnded = false;
      this.minefieldScene.removeChildren();
      this.minefield = new Minefield(this.minefieldScene, () => {
        this.gameEnded = true;
        setTimeout(() => this.stateChanged('end', false), 1000);
      });
      this.minefieldScene.position.set(
        (this.config.screenWidth - this.minefieldScene.width) / 2,
        (this.config.screenHeight + this.gameInfo.height - this.minefieldScene.height) / 2
      );
      this.time = 0;
    }    
  }

  private createInfoBlock(text: string, buttonMode: boolean, icon?: string, textMargin?): InfoBlock {
    const buttonsCfg = this.config.game.buttons;
    const bgGraphics: PIXI.Graphics = this.createInfoBlockBackground();
    const infoBlock = new InfoBlock()
      .background(bgGraphics)
      .setPadding(buttonsCfg.padding)
      .setButtonMode(buttonMode);    

    if (icon) {
      infoBlock.addIcon(icon);
    }

    return infoBlock
      .addText(text, buttonsCfg.textMargin, buttonsCfg.textStyle)
      .finishBuild();
  }

  private createInfoBlockBackground(): PIXI.Graphics {
    return new PIXI.Graphics()
      .beginFill(0x77bbee)
      .lineStyle(1, 0x888888)
      .drawRoundedRect(0, 0, this.config.game.buttons.bgWidth, this.config.game.buttons.bgHeight, 4)
      .endFill();
  }

  private keyDownHandler(event: KeyboardEvent) {
    if (event.code === "Space") {
      this.stateChanged('pause');
      event.preventDefault();
    }
  }
}