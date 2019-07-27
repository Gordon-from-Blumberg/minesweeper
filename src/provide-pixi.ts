import * as PIXI from 'pixi.js';
import * as PIXI_LEGACY from 'pixi.js-legacy';

/**
 * Obtain PIXI only using this function to run the game
 * for users whose system does not support WebGL or stencil
 */
export function providePIXI() {
  return PIXI.utils.isWebGLSupported() ? PIXI : PIXI_LEGACY;
}