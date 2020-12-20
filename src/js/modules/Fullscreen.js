export default class Fullscreen {
  constructor() {
    this.fullscreen = false;
  }

  fullscreenMode(moduleWrapper) {
    this.fullscreen = true;
    console.log(moduleWrapper);
  }

  closeFullScreen() {}
}
