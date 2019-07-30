import { Texture } from 'pixi.js-legacy';

export class Resources {
  private static resources;

  static setResources(resources) {
    this.resources = resources;
  }

  static get(name: string): Texture {
    return this.resources[name].texture;
  }
}
