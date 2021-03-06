import * as PIXI from 'pixi.js-legacy';

import { AbstractState } from '../abstract-state';
import { ConfigService } from '../../config/config-service';
import { Resources } from '../../util/resources';
import { InfoBlock } from '../../components/info-block';
import { Messages } from '../../message/messages';

export class MainMenuState extends AbstractState {

  private config;

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

    const barbedWire = new PIXI.TilingSprite(
      Resources.get(mainMenuCfg.barbedWire.texture),
      mainMenuCfg.barbedWire.width,
      mainMenuCfg.barbedWire.height
    );
    barbedWire.position.set(mainMenuCfg.barbedWire.x, mainMenuCfg.barbedWire.y);
    this.scene.addChild(barbedWire);

    const labelCaution = new PIXI.Sprite(Resources.get(mainMenuCfg.labelCaution.texture));
    labelCaution.position.set(this.scene.width - labelCaution.width, this.scene.height - labelCaution.height);
    this.scene.addChild(labelCaution);

    const text1 = new PIXI.Text(Messages.get('mines'), mainMenuCfg.labelCaution.textStyle);
    text1.position.set(mainMenuCfg.labelCaution.text1.x, mainMenuCfg.labelCaution.text1.y);
    this.scene.addChild(text1);

    const text2 = new PIXI.Text(Messages.get('danger'), mainMenuCfg.labelCaution.textStyle);
    text2.position.set(mainMenuCfg.labelCaution.text2.x, mainMenuCfg.labelCaution.text2.y);
    this.scene.addChild(text2);

    const playButtonCfg = mainMenuCfg.playButton;
    this.playButton = new InfoBlock()
        .background( this.config.buttonTexture )
        .setPadding(playButtonCfg.padding)
        .setButtonMode(true)
        .addIcon(playButtonCfg.icon)
        .addText(Messages.get('play'), { x: playButtonCfg.textMargin }, playButtonCfg.textStyle)
        .finishBuild();
    this.playButton.position.set(playButtonCfg.x, playButtonCfg.y);
    this.playButton.rotation = playButtonCfg.rotation;
    this.scene.addChild(this.playButton);

    this.playButton.on('click', () => this.stateChanged('game', true));
  }
  
  update(dtime: number, dms: number) {
  }
}
