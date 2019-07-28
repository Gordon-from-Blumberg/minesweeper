import { AbstractState } from '../abstract-state';
import * as PIXI from 'pixi.js-legacy';

export class MainMenuState extends AbstractState {
  private readonly BUTTON_BORDER_COLOR =10848304// 0xa58830;
  private readonly BUTTON_BORDER_HOVERED_COLOR = 0xc5a850;

  private playButtonHovered = false;
  private playButton: PIXI.Graphics;

  constructor(scene: PIXI.Container, resources) {
    super('mainMenu', scene, resources);
  }

  init() {
    const background = new PIXI.TilingSprite(
      this.resources.backgroundColorGrass.texture,
      800,
      600
    );
    this.scene.addChild(background);

    const icon = new PIXI.Sprite(this.resources.minefield2.texture);
    icon.position.set(this.scene.width - icon.width, this.scene.height - icon.height);
    this.scene.addChild(icon);

    this.playButton = new PIXI.Graphics();
    this.playButton.interactive = true;
    this.playButton.buttonMode = true;
    this.scene.addChild(this.playButton);
    this.drawPlayButton(this.BUTTON_BORDER_COLOR);

    const playIcon = new PIXI.Sprite(this.resources.playIcon.texture);
    playIcon.position.set(216, 438);
    this.playButton.addChild(playIcon);

    const playText = new PIXI.Text('PLAY', {
      fill: ['#888', '#444'],
      fontSize: 64
    });
    playText.position.set(296, 438);
    this.playButton.addChild(playText);

    //todo: hightlight on hover does not work
    //this.playButton.on('mouseover', () => this.playButtonHovered = true);
    //this.playButton.on('mouseout', () => this.playButtonHovered = false);
  }
  
  update(dt: number) {
    const lineColor = this.playButton.line.color;
    if (this.playButtonHovered && lineColor < this.BUTTON_BORDER_HOVERED_COLOR) {
      this.drawPlayButton(lineColor + 0x010101);

    } else if (!this.playButtonHovered && lineColor > this.BUTTON_BORDER_COLOR) {
      this.drawPlayButton(lineColor - 0x010101);
    }
  }

  private drawPlayButton(lineColor: number) {
    this.playButton
      .clear()
      .beginFill(0x80aaff)
      .lineStyle(5, lineColor)
      .drawRoundedRect(200, 430, 280, 80, 20)
      .endFill();

    this.scene.addChild(this.playButton);
  }
}
