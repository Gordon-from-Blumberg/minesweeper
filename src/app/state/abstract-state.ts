import { State } from './state';
import { Container, resources } from 'pixi.js-legacy';

export abstract class AbstractState implements State {
  /**
   * PIXI container that represents this state
   */
  protected readonly scene: Container;

  /**
   * Loaded resources
   */
  protected resources;

  readonly name: string;

  /**
   * This handler should be called when current state is changed
   * @param newState the name of the next state
   */
  stateChanged: (newState: string) => void;

  constructor(name: string, scene: Container, resources) {
    this.name = name;
    this.scene = scene;
    this.resources = resources;
  }

  setVisible(visible: boolean) {
    this.scene.visible = visible;
  }

  abstract init(): void;
  abstract update(dtime: number, dms: number): void;
}
