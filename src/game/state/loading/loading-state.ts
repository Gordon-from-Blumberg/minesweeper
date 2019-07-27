import { State } from '../state';
import { AbstractState } from '../abstract-state';

/**
 * This state is used to show loading screen 
 * during current state is being initialized
 */
export class LoadingState extends AbstractState {

  private nextState: State;

  constructor() {
    super('loading');
  }

  update(dt: number): void {
    //todo: update loading screen
  }

  setNextState(state: State): LoadingState {
    this.nextState = state;
    state.stateInitialized = this.triggerStateChanged;
    return this;
  }

  private triggerStateChanged() {
    this.stateChanged(this.nextState.name);
  }
}
