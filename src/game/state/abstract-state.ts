import { State } from './state';

export abstract class AbstractState implements State {
  isInitialized = false;

  stateChanged: (newState: string) => void;

  abstract update(dt: number): void;
}
