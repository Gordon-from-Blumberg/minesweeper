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

    const buttonContainer = new PIXI.Container();
    const cfg = config.pause; 
    const resumeButton = new InfoBlock()
        .background( config.buttonTexture )
        .setPadding(cfg.resumeButton.padding)
        .setButtonMode(true)
        .addIcon(cfg.resumeButton.icon)
        .addText('RESUME', { x: cfg.resumeButton.textMargin }, cfg.resumeButton.textStyle)
        .finishBuild();    
    
    buttonContainer.addChild(resumeButton);

    const mainMenuButton = new InfoBlock()
      .background( config.buttonTexture )
      .setPadding(cfg.mainMenuButton.padding)
      .setButtonMode(true)
      .addText('MAIN MENU', {}, cfg.mainMenuButton.textStyle)
      .finishBuild();

    buttonContainer.addChild(mainMenuButton);

    resumeButton.position.set(
      (buttonContainer.width - resumeButton.width) / 2,
      0
    );
    mainMenuButton.position.set(
      (buttonContainer.width - mainMenuButton.width) / 2,
      resumeButton.height + cfg.mainMenuButton.marginY
    );

    buttonContainer.position.set(
      (config.screenWidth - buttonContainer.width) / 2,
      (config.screenHeight - buttonContainer.height) / 2
    );
    this.scene.addChild(buttonContainer);

    resumeButton.on('click', () => this.stateChanged('game'));
    mainMenuButton.on('click', () => this.stateChanged('mainMenu'));
  }

  update(dtime: number, dms: number) {
  }
}