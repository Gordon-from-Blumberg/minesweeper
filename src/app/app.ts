import * as PIXI from 'pixi.js-legacy';

import { StateManager } from './state/state-manager';
import { MainMenuState } from './state/main-menu/main-menu-state';
import { GameState } from './state/game/game-state';
import { ConfigService } from './config/config-service';
import { Resources } from './util/resources';

export class App {
  static init(): void {
    const config = ConfigService.getInstance().getConfig();

    const app = new PIXI.Application({
      width: config.screenWidth,
      height: config.screenHeight
    });
  
    document.getElementById('container').appendChild(app.view);

    app.loader.baseUrl = 'assets/images/';
    app.loader
      .add('background', 'background.png')
      .add('background-overlay', 'background-overlay.png')
      .add('cell', 'cell.png')
      .add('cell-hl', 'cell-hl.png')
      .add('cell-opened', 'cell-opened.png')
      .add('cell-opened-hl', 'cell-opened-hl.png')
      .add('flag', 'flag.png')
      .add('flag-hl', 'flag-hl.png')
      .add('mine', 'mine.png')
      .add('mine-hl', 'mine-hl.png')
      .add('mine-explosion', 'mine-explosion.png')
      .add('mine-explosion-hl', 'mine-explosion-hl.png')
      .add('minefield1', 'minefield1.png')
      .add('minefield2', 'minefield2.png')
      .add('barbedWire', 'barbed-wire.png')
      .add('playIcon', 'play-icon.png')
      .add('pauseIcon', 'pause-icon.png')

      .load((loader, resources) => {
        Resources.setResources(resources);

        const stateManager = new StateManager();
        
        //create container for each state
        //then create state instance and add it to StateManager
        //first state in the array will be set as current
        [ MainMenuState, GameState ].forEach(stateConstructor => {
          const scene = new PIXI.Container();
          scene.visible = false;
          app.stage.addChild(scene);
          stateManager.addState(new stateConstructor(scene));
        });

        stateManager.init();

        //on game state we have timer so we need deltaMS for its correct work
        app.ticker.add(dt => stateManager.update(dt, app.ticker.deltaMS));
      })
  }
}