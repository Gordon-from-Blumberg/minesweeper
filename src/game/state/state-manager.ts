import { State } from './state';
import { LoadingState } from './loading/loading-state';

/**
 * This class keeps all game states and manages them
 */
export class StateManager {
  //all game states
  private states: Map<string, State> = new Map<string, State>();
  private currentState: State;
  //this state is shown when current state have not yet been initialized
  private loadingState: LoadingState; //todo: use interface as type

  addState(state: State): StateManager {
    state.stateChanged = this.setCurrentState;

    this.states.set(state.name, state);
    return this;
  }

  init(stateName: string) {
    for (const state of this.states.values()) {
      state.init();
    }

    this.setCurrentState(stateName);

    //todo: add 'update' method to ticker
  }

  update(dt: number) {
    this.currentState.update(dt);
  }

  private setCurrentState(newState: string) {
    const state = this.states.get(newState);

    this.currentState = state.isInitialized
      ? state
      : this.loadingState.setNextState(state);
  }
}
