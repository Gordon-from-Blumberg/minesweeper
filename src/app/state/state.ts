export interface State {
  name: string;

  stateChanged: (newState: string) => void;

  init(): void;
  update(dtime: number, dms: number): void;
  setVisible(visible: boolean): void;
}
