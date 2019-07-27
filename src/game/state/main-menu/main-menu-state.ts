import { AbstractState } from '../abstract-state';
import { Container } from 'pixi.js-legacy';

export class MainMenuState extends AbstractState {
  
  constructor(container: Container) {
    super('mainMenu', container);
  }

  init() {

  }
  
  update(dt: number) {

  }
}
