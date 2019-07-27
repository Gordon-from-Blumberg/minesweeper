import * as PIXI from 'pixi.js-legacy';
import { StateManager } from './state/state-manager';
import { MainMenuState } from './state/main-menu/main-menu-state';

export class Game {
  static init(): void {
    const app = new PIXI.Application({
      width: 800,
      height: 600
    });
  
    document.getElementById('container').appendChild(app.view);

    app.loader.baseUrl = 'assets/images/';
    app.loader
      .add('background', 'background.png')
      .add('cell', 'cell.svg')
      .add('cell-hightlight', 'cell-hightlight.svg')
      .add('flag', 'flag.svg')
      .add('mine', 'mine.svg')
      .add('mine-explosion', 'mine-explosion.svg')
      .add('minefield1', 'minefield1.svg')
      .add('minefield2', 'minefield2.svg')

      .load((loader, resources) => {
        const stateManager = new StateManager();

        //create container for each state
        //then create state instance and add it to StateManager
        [MainMenuState].forEach(stateConstructor => {
          const scene = new PIXI.Container();
          app.stage.addChild(scene);
          stateManager.addState(new stateConstructor(scene));
        });
      })
  }
}