import * as PIXI from 'pixi.js';
import * as PIXI_LEGACY from 'pixi.js-legacy';

export function providePIXI() {
  return PIXI.utils.isWebGLSupported() ? PIXI : PIXI_LEGACY;
}