import { State } from './state';

/**
 * This class keeps all game states and manages them
 */
export class StateManager {
  //all game states
  private states: Map<string, State> = new Map<string, State>();
  private currentState: State;

  addState(state: State): void {
    state.stateChanged = this.setCurrentState;

    this.states.set(state.name, state);
  }

  init(stateName: string) {
    for (const state of this.states.values()) {
      //todo: think about to make async init of each state
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

    this.currentState = state;
  }
}
