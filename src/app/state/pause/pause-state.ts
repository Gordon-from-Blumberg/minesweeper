import * as PIXI from 'pixi.js-legacy';

import { AbstractState } from '../abstract-state';
import { ConfigService } from '../../config/config-service';
import { Resources } from '../../util/resources';

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
  }

  update(dtime: number, dms: number) {

  }
}