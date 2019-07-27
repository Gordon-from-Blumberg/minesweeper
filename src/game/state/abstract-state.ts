import { State } from './state';
import { Container } from 'pixi.js-legacy';

export abstract class AbstractState implements State {
  /** 
   * name of state in lowerCamelCase
   * used as key in states map in StateManager
   */
  readonly name: string;

  private readonly container: Container;

  stateChanged: (newState: string) => void;

  constructor(name: string, container: Container) {
    this.name = name;
    this.container = container;
  }

  abstract init(): void;
  abstract update(dt: number): void;
}
