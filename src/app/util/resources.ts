import { Texture } from 'pixi.js-legacy';

export class Resources {
  private static resources;

  static setResources(resources) {
    this.resources = resources;
  }

  static get(name: string, extension: string = 'png'): Texture {
    console.dir(this.resources);
    return this.resources['spritesheet.json'].textures[name + '.' + extension];
  }
}
