import * as PIXI from 'pixi.js-legacy';

import { AbstractState } from '../abstract-state';
import { ConfigService } from '../../config/config-service';
import { Resources } from '../../util/resources';
import { InfoBlock } from '../../components/info-block';

export class EndState extends AbstractState {
  private victory = false;

  private victoryContainer: PIXI.Container;
  private timeText: PIXI.Text;
  private loseContainer: PIXI.Container;

  private config;

  private fireworks: PIXI.Sprite[] = [];
  
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

  activate(data: {victory: boolean, time?: number}) {
    if (data.victory) {
      this.victoryContainer.visible = true;
      this.loseContainer.visible = false;
      this.timeText.text = `Your time is ${ data.time }s`
    } else {
      this.loseContainer.visible = true;
      this.victoryContainer.visible = false;
    }
    this.victory = data.victory;
  }

  private createVictoryContainer(): PIXI.Container {
    const cfg = this.config.end.victory;
    const container = new PIXI.Container();
    container.visible = false;
    this.scene.addChild(container);

    const text = new PIXI.Text('YOU WON!', cfg.textStyle);
    container.addChild(text);

    this.timeText = new PIXI.Text('Your time is 0000s', cfg.timeTextStyle);
    container.addChild(this.timeText);

    const victoryCupSprite = new PIXI.Sprite( Resources.get(cfg.victoryCupTexture) );
    container.addChild(victoryCupSprite);

    const playAgainButton = new InfoBlock()
        .background( this.config.buttonTexture )
        .setPadding(cfg.playAgainButton.padding)
        .setButtonMode(true)
        .addIcon(cfg.playAgainButton.icon, {}, { x: cfg.playAgainButton.iconSize, y: cfg.playAgainButton.iconSize })
        .addText('PLAY AGAIN', { x: cfg.playAgainButton.marginTextX }, cfg.playAgainButton.textStyle)
        .finishBuild();
    container.addChild(playAgainButton);

    let positionY = 0;
    text.position.set( (container.width - text.width) / 2, positionY );
    positionY += text.height + cfg.timeTextMarginY;
    this.timeText.position.set( (container.width - this.timeText.width) / 2, positionY );
    positionY += this.timeText.height + cfg.victoryCupMarginY;
    victoryCupSprite.position.set( (container.width - victoryCupSprite.width) / 2, positionY );
    positionY += victoryCupSprite.height + cfg.playAgainButton.marginY;
    playAgainButton.position.set( (container.width - playAgainButton.width) / 2, positionY );

    playAgainButton.on('click', () => this.stateChanged('game', true));
    // todo: this code is repeated in multiple places so it needs to be refactored
    container.position.set(
      (this.config.screenWidth - container.width) / 2,
      (this.config.screenHeight - container.height) / 2
    );

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
        .background( this.config.buttonTexture )
        .setPadding(cfg.button.padding)
        .setButtonMode(true)
        .addText('TRY AGAIN', {}, cfg.button.textStyle)
        .finishBuild();
    container.addChild(tryAgainButton);

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