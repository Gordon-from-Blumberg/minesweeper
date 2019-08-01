import * as PIXI from 'pixi.js-legacy';

import { StateManager } from './state/state-manager';
import { MainMenuState } from './state/main-menu/main-menu-state';
import { GameState } from './state/game/game-state';
import { PauseState } from './state/pause/pause-state';
import { ConfigService } from './config/config-service';
import { Resources } from './util/resources';
import { EndState } from './state/end/end-state';
import { Messages } from './message/messages';

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
      .add('spritesheet.json')

      .load((loader, resources) => {
        Resources.setResources(resources);
        Messages.loadMessages('EN');

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