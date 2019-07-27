export interface State {
  name: string;
  isInitialized: boolean;

  stateInitialized: () => void;
  stateChanged: (newState: string) => void;

  init(): void;
  update(dt: number): void;
}
