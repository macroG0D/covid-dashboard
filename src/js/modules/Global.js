import CurrentCountry from './CurrentCountry';

export default class Global {
  static updateGlobal(data) {
    const header = document.querySelector('.global__header');
    header.innerHTML = `<span class="activeCases">Active</span> COVID-19 Cases in ${CurrentCountry.selectedCountryName.toUpperCase()}`;
    const globalResult = document.querySelector('.global__total');
    globalResult.textContent = Number(data[CurrentCountry.selectedCountryID].active)
      .toLocaleString();
  }
}
