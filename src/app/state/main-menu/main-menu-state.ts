import * as PIXI from 'pixi.js-legacy';

import { AbstractState } from '../abstract-state';
import { ConfigService } from '../../config/config-service';
import { Resources } from '../../util/resources';
import { InfoBlock } from '../../components/info-block';

export class MainMenuState extends AbstractState {
  private readonly BUTTON_BORDER_COLOR = 0xa58830;
  private readonly BUTTON_BORDER_HOVERED_COLOR = 0xc5a850;

  private config;

  private playButtonHovered = false;
  private playButton: PIXI.Container;

  constructor(scene: PIXI.Container) {
    super('mainMenu', scene);
  }

  init() {
    this.config = ConfigService.getInstance().getConfig();
    const mainMenuCfg = this.config.mainMenu;

    const background = new PIXI.TilingSprite(
      Resources.get(mainMenuCfg.background),
      this.config.screenWidth,
      this.config.screenHeight
    );
    this.scene.addChild(background);

    const icon = new PIXI.Sprite(Resources.get('minefield2'));
    icon.position.set(this.scene.width - icon.width, this.scene.height - icon.height);
    this.scene.addChild(icon);

    const playButtonCfg = mainMenuCfg.playButton;
    this.playButton = new InfoBlock()
        .background( this.createPlayButtonBackground() )
        .setPadding(playButtonCfg.padding)
        .setButtonMode(true)
        .addIcon(playButtonCfg.icon)
        .addText('PLAY', { x: playButtonCfg.textMargin }, playButtonCfg.textStyle)
        .finishBuild();
    this.playButton.position.set(playButtonCfg.x, playButtonCfg.y);
    this.scene.addChild(this.playButton);

    //todo: hightlight on hover does not work
    //this.playButton.on('mouseover', () => this.playButtonHovered = true);
    //this.playButton.on('mouseout', () => this.playButtonHovered = false);

    this.playButton.on('click', () => this.stateChanged('game'));
  }
  
  update(dtime: number, dms: number) {
    // const lineColor = this.playButton.line.color;
    // if (this.playButtonHovered && lineColor < this.BUTTON_BORDER_HOVERED_COLOR) {
    //   this.drawPlayButton(lineColor + 0x010101);

    // } else if (!this.playButtonHovered && lineColor > this.BUTTON_BORDER_COLOR) {
    //   this.drawPlayButton(lineColor - 0x010101);
    // }
  }

  private createPlayButtonBackground(): PIXI.Graphics {
    const cfg = this.config.mainMenu.playButton;
    return new PIXI.Graphics()
      .beginFill(0x80aaff)
      .lineStyle(5, 0xa58830)
      .drawRoundedRect(0, 0, cfg.width, cfg.height, 20)
      .endFill();
  }
}
