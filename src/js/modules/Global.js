export default class Global {
  static updateGlobal(data) {
    const globalResult = document.querySelector('.global__total');
    globalResult.textContent = Number(data.Global.TotalConfirmed).toLocaleString();
  }
}
