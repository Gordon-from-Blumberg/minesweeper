import * as PIXI from 'pixi.js-legacy';

import { AbstractState } from '../abstract-state';
import { ConfigService } from '../../config/config-service';
import { Minefield } from '../../minefield/minefield';
import { Resources } from '../../util/resources';
import { InfoBlock } from '../../components/info-block';
import { Messages } from '../../message/messages';

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

    // create info block with timer
    let positionX = 0;
    this.timeInfo = this.createInfoBlock(Messages.get('time', '0000'), false);
    this.timeInfo.position.x = positionX;
    this.gameInfo.addChild(this.timeInfo);
    
    // create info block with mine count
    positionX += this.timeInfo.width + buttonsCfg.marginX;    
    this.minesInfo = this.createInfoBlock(Messages.get('minesLeft', '0000'), false);
    this.minesInfo.position.x = positionX;
    this.gameInfo.addChild(this.minesInfo);

    // create pause button
    this.pauseButton = new InfoBlock()
        .background(this.config.buttonTexture)
        .setButtonMode(true)
        .setPadding(this.config.game.pauseButton.padding)
        .addIcon(this.config.game.pauseButton.icon)
        .addText(Messages.get('pause'), this.config.game.pauseButton.textMargin, this.config.game.pauseButton.textStyle)
        .finishBuild();

    this.scene.addChild(this.pauseButton);
    this.pauseButton.position.set(
      (this.config.screenWidth - this.pauseButton.width) / 2,
      this.config.screenHeight - this.pauseButton.height - buttonsCfg.y
    );

    // create cotainer for minefield scene
    this.minefieldScene = new PIXI.Container();
    this.scene.addChild(this.minefieldScene);

    this.gameInfo.position.set(
      (this.config.screenWidth - this.gameInfo.width) / 2,
      buttonsCfg.y
    );
    this.scene.addChild(this.gameInfo);

    this.pauseButton.on('click', () => this.stateChanged('pause'));
    // todo: set pause on space press
  }

  update(dtime: number, dms: number) {
    if (!this.gameEnded) {
      this.time += dms;

      // operation ^ 0 removes digits right to point
      this.timeInfo.setText(Messages.get('time', this.getSeconds()));

      this.minesInfo.setText(Messages.get('minesLeft', this.minefield.minesLeft));
    }
  }

  activate(newGame: boolean) {
    if (newGame) {
      this.gameEnded = false;
      this.minefieldScene.removeChildren();
      this.minefield = new Minefield(
        this.minefieldScene, 
        () => {
          this.gameEnded = true;
          setTimeout(() => this.stateChanged('end', { victory: true, time: this.getSeconds() }), this.config.game.victoryDelay);
        },
        () => {
          this.gameEnded = true;
          setTimeout(() => this.stateChanged('end', {victory: false }), this.config.game.loseDelay);
        }
      );
      this.minefieldScene.position.set(
        (this.config.screenWidth - this.minefieldScene.width) / 2,
        (this.config.screenHeight + this.gameInfo.height - this.minefieldScene.height - this.pauseButton.height) / 2
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
      .drawRoundedRect(0, 0, this.config.game.buttons.bgWidth, this.config.game.buttons.bgHeight, 8)
      .endFill();
  }

  private getSeconds(): string {
    return String(this.time / this.MS_PER_SECOND ^ 0);
  }
}
