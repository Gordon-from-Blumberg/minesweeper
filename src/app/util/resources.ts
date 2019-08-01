import { Texture } from 'pixi.js-legacy';

export class Resources {
  private static resources;
  private static resourceName: string;

  static setResources(resources, resourceName: string) {
    this.resources = resources;
    this.resourceName = resourceName;
  }

  static get(name: string, extension: string = 'png'): Texture {
    console.dir(this.resources);
    return this.resources[this.resourceName]
        .textures[name + '.' + extension];
  }
}
