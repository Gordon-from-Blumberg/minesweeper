import * as PIXI from 'pixi.js-legacy';

import { Resources } from '../util/resources';
import { publicDecrypt } from 'crypto';

type Size = {
  x?: number;
  y?: number;
}

type ComponentSizing = {
  component: PIXI.Container;
  size?: Size;
  margin?: Size;
}

export class InfoBlock extends PIXI.Container {

  private bgSprites: PIXI.Sprite[] = [];
  private bgGraphics: PIXI.Graphics;
  private textComponent: PIXI.Text;
  private iconComponent: PIXI.Sprite;

  private size: Size;
  private padding: Size = { x: 0, y: 0 };

  private layoutMode: 'padding' | 'size' = 'padding';

  private componentsSizing: ComponentSizing[] = [];

  /**
   * @param textures Names of textures.
   * If one - it will be used for whole block
   * If two - the first will be at left and reflected at right, 
   *    the second will be at center
   * If three - they will be used from left to right
   * @param useTilingSprite Flag to determine what class (TilingSprite or Sprite)  
   * to use for the central background sprite
   */
  background(textures: string[] | string | PIXI.Graphics, useTilingSprite?: boolean): InfoBlock {
    let bgTextures: string[];
    if (typeof textures === 'string') {
      bgTextures.push(textures);
    } else if (textures instanceof Array) {
      bgTextures = textures;
    } else {
      this.bgGraphics = textures;
      this.addChild(this.bgGraphics);
      return this;
    }

    if (bgTextures.length === 1) {

      const bgSprite = this.createCenterBgSprite( Resources.get(bgTextures[0]), useTilingSprite );
      
      this.bgSprites.push(bgSprite);

    } else {

      this.bgSprites.push( new PIXI.Sprite( Resources.get(bgTextures[0]) ));
      this.bgSprites.push( this.createCenterBgSprite( Resources.get(bgTextures[1]), useTilingSprite ));
      this.bgSprites.push( this.createRightBgSprite(bgTextures) );

    }

    this.addChild(...this.bgSprites);

    return this;
  }

  /**
   * @param size Width and height of the center sprite. If not specified it is calculated automatically
   */
  setSize(size: Size): InfoBlock {
    this.layoutMode = 'size';
    this.size = size;
    return this;
  }

  /**
   * Sets padding for inner elements
   * @param padding Is Size object is passed it will be used as padding. 
   * If number is passed the value will be set to padding.x and to padding.y, 
   * if y is not specified
   * @param y Value for padding.y
   */
  setPadding(padding: number | Size, y?: number): InfoBlock {
    this.layoutMode = 'padding';

    if (typeof padding === 'number') {
      this.padding = { 
        x: padding, 
        y: y != undefined ? y : padding //y may be 0, so y || padding is not correct
      };
    } else {
      this.padding = {
        x: padding.x || 0,
        y: padding.y || 0
      };
    }

    return this;
  }

  addIcon(texture: string, margin?: Size, size?: Size): InfoBlock {
    this.iconComponent = new PIXI.Sprite( Resources.get(texture) );

    this.componentsSizing.push({
      component: this.iconComponent,
      margin: this.getSizeSafe(margin),
      size: this.getSizeSafe(size)
    });

    this.addChild(this.iconComponent);

    return this;
  }

  addText(text: string, margin?: Size, style?: PIXI.TextStyle): InfoBlock {
    this.textComponent = new PIXI.Text(text, style);
    
    this.componentsSizing.push({
      component: this.textComponent,
      margin: this.getSizeSafe(margin)
    });

    this.addChild(this.textComponent);

    return this;
  }

  setButtonMode(buttonMode: boolean): InfoBlock {
    this.interactive = buttonMode;
    this.buttonMode = buttonMode;
    return this;
  }

  finishBuild(): InfoBlock {
    this.recalculate();

    return this;
  }

  setText(text: string, recalculate: boolean) {
    this.textComponent.text = text;
    if (recalculate) {
      this.recalculate();
    }
  }

  private createCenterBgSprite(texture: PIXI.Texture, useTilingSprite?: boolean): PIXI.Sprite {
    return useTilingSprite 
        ? new PIXI.TilingSprite(texture)
        : new PIXI.Sprite(texture);
  }

  private createRightBgSprite(bgTextures: string[]): PIXI.Sprite {
    if (bgTextures.length === 3) {
      return new PIXI.Sprite( Resources.get(bgTextures[2]) );
    }

    const rightBgSprite = new PIXI.Sprite( Resources.get(bgTextures[0]) );
    rightBgSprite.scale.x = -1;
    return rightBgSprite;
  }

  //calculate size if layoutMode == 'padding'
  //layoutMode == 'size' means size was set explicitly
  //width is sum of paddings, inner elements widths and margins between them
  //height is sum of paddings and max height of inner elements
  private calculateSize() {
    if (this.layoutMode == 'padding') {
      this.size = {
        x: 2 * this.padding.x,
        y: 2 * this.padding.y
      };
      let maxHeight = 0;

      this.componentsSizing.forEach(cs => {
        const width = (cs.size && cs.size.x) || cs.component.width;
        const height = (cs.size && cs.size.y) || cs.component.height;

        this.size.x += cs.margin.x + width;
        maxHeight = height > maxHeight ? height : maxHeight;
      });

      this.size.y += maxHeight;
    }
  }

  private composeBackground() {
    // if graphics is used as bg - set size to it
    if (this.bgGraphics) {

      this.bgGraphics.width = this.size.x;
      this.bgGraphics.height = this.size.y;

      // if bg is one sprite - set size to it
    } else if (this.bgSprites.length === 1) {

      this.bgSprites[0].width = this.size.x;
      this.bgSprites[0].height = this.size.y;

    } else {
      
      let x = 0;
      // if bg consists of three sprites - sizes of left and right leave default,
      // size of center calculate
      this.bgSprites[1].width = this.size.x - this.bgSprites[0].width - this.bgSprites[2].width;

      this.bgSprites.forEach(bgSprite => {
        bgSprite.position.x = x;  // place sprites close to each other
        x += bgSprite.width;
        bgSprite.height = this.size.y; // set the same height for each
      });

    }
  }

  // todo: composing correctly works only for 'padding' mode
  private composeInnerElements() {
    let x = this.padding.x;
    this.componentsSizing.forEach(cs => {
      if (cs.size && cs.size.x) {
        cs.component.width = cs.size.x;
      }
      if (cs.size && cs.size.y) {
        cs.component.height = cs.size.y;
      }

      x += cs.margin.x;
      cs.component.position.set( x, (this.size.y - cs.component.height) / 2 );

      x += cs.component.width;
    });
  }

  private recalculate() {
    this.calculateSize();
    this.composeBackground();
    this.composeInnerElements();
  }

  private getSizeSafe(size: Size): Size {
    return {
      x: size && size.x || 0,
      y: size && size.y || 0
    }
  }
}
