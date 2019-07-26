export interface State {
  isInitialized: boolean;

  stateChanged: (newState: string) => void;

  update(dt: number): void;
}
