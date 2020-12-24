export default class FullScreen {
  constructor() {
    this.moduleBlock = '';
    this.homePlace = '';
    this.fullScreenMode = false;
    this.fullScreenModule = document.querySelector('.fullScreenModule');
  }

  fullScreenModeOn(moduleBlock, homePlace) {
    this.moduleBlock = moduleBlock;
    this.homePlace = homePlace;
    this.fullScreenMode = true;
    this.fullScreenModule.classList.add('fullScreenModuleOn');
    this.fullScreenModule.append(this.moduleBlock);
  }

  fullScreenModeOff() {
    this.fullScreenMode = false;
    this.fullScreenModule.classList.remove('fullScreenModuleOn');
    this.homePlace.append(this.moduleBlock);
  }
}
