import * as PIXI from 'pixi.js-legacy';

import { ISize } from './isize';
import { Resources } from '../util/resources';

export type BackgroundOptions = {
  texture: string;
  useTiling?: boolean;
  size?: ISize;
  padding?: ISize;
}

export class InfoBlock extends PIXI.Container {

  private bgSprite: PIXI.Sprite;
  private textComponent: PIXI.Text;

  private fixedWidth = false;
  private padding: ISize;

  constructor(bgOptions: BackgroundOptions, text: string, textStyle?: PIXI.TextStyle) {
    super();

    if (bgOptions.size && bgOptions.size.x) {
      this.fixedWidth = true;
    }

    if (bgOptions.padding) {
      this.padding = {
        x: bgOptions.padding.x,
        y: bgOptions.padding.y
      };
    }

    const bgTexture = Resources.get(bgOptions.texture);
    this.bgSprite = bgOptions.useTiling
        ? new PIXI.TilingSprite(bgTexture, bgOptions.size.x, bgOptions.size.y)
        : this.createSimpleSprite(bgTexture, bgOptions.size);
    this.addChild(this.bgSprite);

    this.textComponent = new PIXI.Text(text, textStyle);
    this.textComponent.position.set(
      this.padding.x,
      this.padding.y
    );
    this.addChild(this.textComponent);

    this.adjustSize();
  }

  setText(text: string): ISize {
    this.textComponent.text = text;
    this.adjustSize();
    return { x: this.width, y: this.height };
  }

  setTextStyle(style: PIXI.TextStyle): ISize {
    this.textComponent.style = style;
    this.adjustSize();
    return { x: this.width, y: this.height };
  }

  private createSimpleSprite(texture: PIXI.Texture, size?: ISize) {
    const sprite = new PIXI.Sprite(texture);
    if (size) {
      if (size.x) sprite.width = size.x;
      if (size.y) sprite.height = size.y;
    }
    return sprite;
  }

  private adjustSize() {
    if (this.fixedWidth) return;

    this.width = this.textComponent.width + 2 * this.padding.x;
    this.height = this.textComponent.height + 2 * this.padding.y;
  }
}
