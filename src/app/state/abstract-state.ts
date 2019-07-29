import { State } from './state';
import { Container, resources } from 'pixi.js-legacy';

export abstract class AbstractState implements State {
  /**
   * PIXI container that represents this state
   */
  protected readonly scene: Container;

  readonly name: string;

  /**
   * This handler should be called when current state is changed
   * @param newState the name of the next state
   */
  stateChanged: (newState: string) => void;

  constructor(name: string, scene: Container) {
    this.name = name;
    this.scene = scene;
  }

  setVisible(visible: boolean) {
    this.scene.visible = visible;
  }

  abstract init(): void;
  abstract update(dtime: number, dms: number): void;
}
