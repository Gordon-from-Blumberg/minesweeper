import * as PIXI from 'pixi.js-legacy';

import { AbstractState } from '../abstract-state';
import { ConfigService } from '../../config/config-service';
import { Resources } from '../../util/resources';
import { InfoBlock } from '../../components/info-block';

export class EndState extends AbstractState {
  private victory = false;

  private victoryContainer: PIXI.Container;
  private loseContainer: PIXI.Container;

  private config;
  
  constructor(scene: PIXI.Container) {
    super('end', scene);
  }

  init() {
    this.config = ConfigService.getInstance().getConfig();
    const backgroundSprite = new PIXI.TilingSprite(
      Resources.get(this.config.end.background),
      this.config.screenWidth,
      this.config.screenHeight
    );
    this.scene.addChild(backgroundSprite);

    this.victoryContainer = this.createVictoryContainer();
    this.loseContainer = this.createLoseContainer();

  }

  update() {

  }

  activate(victory: boolean) {
    this.victory = victory;
    if (victory) {
      this.victoryContainer.visible = true;
    } else {
      this.loseContainer.visible = true;
    }
  }

  private createVictoryContainer(): PIXI.Container {
    const cfg = this.config.end.victory;
    const container = new PIXI.Container();
    container.visible = false;
    this.scene.addChild(container);

    return container;
  }

  private createLoseContainer(): PIXI.Container {
    const cfg = this.config.end.lose;
    const container = new PIXI.Container();
    container.visible = false;
    this.scene.addChild(container);

    const text = new PIXI.Text('YOU LOSE...', cfg.textStyle);
    container.addChild(text);

    const tryAgainButton = new InfoBlock()
        .background( new PIXI.Graphics()
            .beginFill(+cfg.button.bgColorHexString)
            .drawRoundedRect(0, 0, 250, 76, 32)
            .lineStyle(5, +cfg.button.borderColorHexString)
            .endFill() )
        .setPadding(cfg.button.padding)
        .setButtonMode(true)
        .addText('TRY AGAIN', {}, cfg.button.textStyle)
        .finishBuild();
    container.addChild(tryAgainButton);

    const containerWidth = container.width;
    console.log(`lose container width = ${ containerWidth }`)
    text.position.set( (container.width - text.width) / 2, 0 );
    tryAgainButton.position.set(
      (container.width - tryAgainButton.width) / 2,
      text.height + cfg.button.marginY
    );

    tryAgainButton.on('click', () => this.stateChanged('game', true));

    container.position.set(
      (this.config.screenWidth - container.width) / 2,
      (this.config.screenHeight - container.height) / 2
    );

    return container;
  }
}