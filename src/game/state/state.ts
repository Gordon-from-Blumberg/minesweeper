export interface State {
  name: string;

  stateChanged: (newState: string) => void;

  init(): void;
  update(dt: number): void;
  setVisible(visible: boolean): void;
}
