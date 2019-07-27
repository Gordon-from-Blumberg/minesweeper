import { State } from './state';

export abstract class AbstractState implements State {
  readonly name: string;
  isInitialized = false;

  stateInitialized: () => void;
  stateChanged: (newState: string) => void;

  constructor(name: string) {
    this.name = name;
  }

  init() {}

  abstract update(dt: number): void;
}
