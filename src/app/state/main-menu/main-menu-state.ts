import * as PIXI from 'pixi.js-legacy';

import { AbstractState } from '../abstract-state';
import { ConfigService } from '../../config/config-service';
import { Resources } from '../../util/resources';
import { InfoBlock } from '../../components/info-block';

export class MainMenuState extends AbstractState {

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

    const icon = new PIXI.Sprite(Resources.get(mainMenuCfg.labelCaution.texture));
    icon.position.set(this.scene.width - icon.width, this.scene.height - icon.height);
    this.scene.addChild(icon);

    const text1 = new PIXI.Text('MINES!', mainMenuCfg.labelCaution.textStyle);
    text1.position.set(mainMenuCfg.labelCaution.text1.x, mainMenuCfg.labelCaution.text1.y);
    this.scene.addChild(text1);

    const text2 = new PIXI.Text('DANGER!', mainMenuCfg.labelCaution.textStyle);
    text2.position.set(mainMenuCfg.labelCaution.text2.x, mainMenuCfg.labelCaution.text2.y);
    this.scene.addChild(text2);

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

    this.playButton.on('click', () => this.stateChanged('game', true));
  }
  
  update(dtime: number, dms: number) {
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
