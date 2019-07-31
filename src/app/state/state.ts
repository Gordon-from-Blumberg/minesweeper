export interface State {
  name: string;

  stateChanged: (newState: string, data?: any) => void;

  init(): void;
  update(dtime: number, dms: number): void;
  setVisible(visible: boolean): void;
  activate(data?: any);
}
