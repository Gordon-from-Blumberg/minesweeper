import * as PIXI from 'pixi.js-legacy';

import { StateManager } from './state/state-manager';
import { MainMenuState } from './state/main-menu/main-menu-state';
import { GameState } from './state/game/game-state';
import { PauseState } from './state/pause/pause-state';
import { ConfigService } from './config/config-service';
import { Resources } from './util/resources';
import { EndState } from './state/end/end-state';

export class App {
  static init(): void {
    const config = ConfigService.getInstance().getConfig();

    const app = new PIXI.Application({
      width: config.screenWidth,
      height: config.screenHeight
    });

    //disable context menu
    app.view.addEventListener('contextmenu', (e) => e.preventDefault());
  
    document.getElementById('container').appendChild(app.view);

    app.loader.baseUrl = 'assets/images/';
    app.loader
      .add('main-menu-background', 'main-menu-background.png')
      .add('game-background', 'game-background.png')
      .add('pause-background', 'pause-background.png')
      .add('cell', 'cell.png')
      .add('cell-hl', 'cell-hl.png')
      .add('cell-opened', 'cell-opened.png')
      .add('cell-opened-hl', 'cell-opened-hl.png')
      .add('flag', 'flag.png')
      .add('flag-hl', 'flag-hl.png')
      .add('mine', 'mine.png')
      .add('mine-hl', 'mine-hl.png')
      .add('mine-marked', 'mine-marked.png')
      .add('mine-marked-hl', 'mine-marked-hl.png')
      .add('mine-explosion', 'mine-explosion.png')
      .add('mine-explosion-hl', 'mine-explosion-hl.png')
      .add('minefield', 'minefield.png')
      .add('barbed-wire', 'barbed-wire.png')
      .add('play-icon', 'play-icon.png')
      .add('pause-icon', 'pause-icon.png')

      .load((loader, resources) => {
        Resources.setResources(resources);

        const stateManager = new StateManager();
        
        //create container for each state
        //then create state instance and add it to StateManager
        //first state in the array will be set as current
        [ MainMenuState, GameState, PauseState, EndState ].forEach(stateConstructor => {
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