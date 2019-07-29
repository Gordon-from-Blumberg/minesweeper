import * as PIXI from 'pixi.js-legacy';

import { AbstractState } from '../abstract-state';
import { ConfigService } from '../../config/config-service';
import { Resources } from '../../util/resources';

export class MainMenuState extends AbstractState {
  private readonly BUTTON_BORDER_COLOR = 0xa58830;
  private readonly BUTTON_BORDER_HOVERED_COLOR = 0xc5a850;

  private config;

  private playButtonHovered = false;
  private playButton: PIXI.Graphics;

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

    this.playButton = new PIXI.Graphics();
    this.playButton.interactive = true;
    this.playButton.buttonMode = true;
    this.scene.addChild(this.playButton);
    this.drawPlayButton(this.BUTTON_BORDER_COLOR);

    const playButtonCfg = mainMenuCfg.playButton;
    const playIcon = new PIXI.Sprite(Resources.get(playButtonCfg.icon));
    playIcon.position.set(
      playButtonCfg.x + playButtonCfg.padding.x, 
      playButtonCfg.y + playButtonCfg.padding.y
    );
    this.playButton.addChild(playIcon);

    const playText = new PIXI.Text('PLAY', {
      fill: playButtonCfg.textStyle.fill,
      fontSize: playButtonCfg.textStyle.fontSize
    });
    playText.position.set(
      playIcon.getGlobalPosition().x + playIcon.width + playButtonCfg.iconTextSpace, 
      playButtonCfg.y + playButtonCfg.padding.y
    );
    this.playButton.addChild(playText);

    //todo: hightlight on hover does not work
    //this.playButton.on('mouseover', () => this.playButtonHovered = true);
    //this.playButton.on('mouseout', () => this.playButtonHovered = false);

    this.playButton.on('click', () => this.stateChanged('game'));
  }
  
  update(dtime: number, dms: number) {
    const lineColor = this.playButton.line.color;
    if (this.playButtonHovered && lineColor < this.BUTTON_BORDER_HOVERED_COLOR) {
      this.drawPlayButton(lineColor + 0x010101);

    } else if (!this.playButtonHovered && lineColor > this.BUTTON_BORDER_COLOR) {
      this.drawPlayButton(lineColor - 0x010101);
    }
  }

  private drawPlayButton(lineColor: number) {
    const cfg = this.config.mainMenu.playButton;
    this.playButton
      .clear()
      .beginFill(0x80aaff)
      .lineStyle(5, lineColor)
      .drawRoundedRect(cfg.x, cfg.y, cfg.width, cfg.height, 20)
      .endFill();

    this.scene.addChild(this.playButton);
  }
}
