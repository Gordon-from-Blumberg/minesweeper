import { State } from './state';

export class StateManager {
  private states: Map<string, State> = new Map<string, State>();
  private currentState: State;

  update(dt: number) {
    this.currentState.update(dt);
  }

  changeState(newState: string) {
    const state = this.states.get(newState);

    if (!state.isInitialized) {
      this.currentState = 
    }
  }
}
