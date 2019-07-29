export class Resources {
  private static resources;

  static setResources(resources) {
    this.resources = resources;
  }

  static get(name: string) {
    return this.resources[name].texture;
  }
}
