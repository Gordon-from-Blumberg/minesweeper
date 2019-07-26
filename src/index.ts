import { providePIXI } from './provide-pixi';

document.addEventListener("DOMContentLoaded", () => {
  const PIXI = providePIXI();

  const app = new PIXI.Application({
    width: 800,
    height: 600
  });

  document.getElementById('container').appendChild(app.view);
});


