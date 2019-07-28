import * as PIXI from 'pixi.js-legacy';
import { StateManager } from './state/state-manager';
import { MainMenuState } from './state/main-menu/main-menu-state';
import { GameState } from './state/game/game-state';

export class App {
  static init(): void {
    const app = new PIXI.Application({
      width: 800,
      height: 600
    });
  
    document.getElementById('container').appendChild(app.view);

    app.loader.baseUrl = 'assets/images/';
    app.loader
      .add('background', 'background.png')
      .add('backgroundColorGrass', 'backgroundColorGrass.png')
      .add('cell', 'cell.svg')
      .add('cellHightlight', 'cell-hightlight.svg')
      .add('flag', 'flag.svg')
      .add('mine', 'mine.svg')
      .add('mineExplosion', 'mine-explosion.svg')
      .add('minefield1', 'minefield1.png')
      .add('minefield2', 'minefield2.png')
      .add('barbedWire', 'barbed-wire.png')
      .add('playIcon', 'play-icon.png')

      .load((loader, resources) => {
        const stateManager = new StateManager();
        
        //create container for each state
        //then create state instance and add it to StateManager
        //first state in the array will be set as current
        [ MainMenuState, GameState ].forEach(stateConstructor => {
          const scene = new PIXI.Container();
          scene.visible = false;
          app.stage.addChild(scene);
          stateManager.addState(new stateConstructor(scene, resources));
        });

        stateManager.init();

        app.ticker.add(stateManager.update.bind(stateManager));
      })
  }
}