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

  init() {
    for (const state of this.states.values()) {
      //todo: think about to make async init of each state
      state.init();
    }

    //set first state as current
    this.setCurrentState(this.states.keys().next().value);
  }

  update(dt: number) {
    this.currentState.update(dt);
  }

  private setCurrentState(newState: string) {
    console.log(`setCurrentState: ${newState}`);
    if (this.currentState) {
      this.currentState.setVisible(false);
    }

    const state = this.states.get(newState);

    this.currentState = state;
    this.currentState.setVisible(true);
    console.dir(this.currentState);
  }
}
