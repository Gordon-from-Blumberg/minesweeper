import * as PIXI from 'pixi.js-legacy';

import { AbstractState } from '../abstract-state';
import { ConfigService } from '../../config/config-service';
import { Resources } from '../../util/resources';
import { InfoBlock } from '../../components/info-block';

export class PauseState extends AbstractState {

  constructor(scene: PIXI.Container) {
    super('pause', scene);
  }

  init() {
    const config = ConfigService.getInstance().getConfig();

    const backgroundSprite = new PIXI.TilingSprite(
      Resources.get(config.pause.background), 
      config.screenWidth, 
      config.screenHeight
    );
    this.scene.addChild(backgroundSprite);

    const buttonCfg = config.mainMenu.playButton; // todo: use pause config
    const resumeButton = new InfoBlock()
        .background( this.createButtonBackground(buttonCfg) )
        .setPadding(buttonCfg.padding)
        .setButtonMode(true)
        .addIcon('playIcon')
        .addText('RESUME', { x: buttonCfg.textMargin }, buttonCfg.textStyle)
        .finishBuild();
    
    resumeButton.position.set(
      (config.screenWidth - resumeButton.width) / 2,
      (config.screenHeight - resumeButton.height) / 2
    );
    this.scene.addChild(resumeButton);

    resumeButton.on('click', () => this.stateChanged('game'));
  }

  update(dtime: number, dms: number) {
  }

  private createButtonBackground(cfg): PIXI.Graphics {
    return new PIXI.Graphics()
      .beginFill(0x80aaff)
      .lineStyle(5, 0xa58830)
      .drawRoundedRect(0, 0, cfg.width, cfg.height, 20)
      .endFill();
  }
}