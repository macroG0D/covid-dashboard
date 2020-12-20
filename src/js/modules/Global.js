import CurrentCountry from './CurrentCountry';

export default class Global {
  static updateGlobal(data) {
    const header = document.querySelector('.global__header');
    header.textContent = `${CurrentCountry.selectedCountryName.toUpperCase()} COVID-19 ACTIVE CASES`;
    const globalResult = document.querySelector('.global__total');
    globalResult.textContent = Number(data[CurrentCountry.selectedCountryID].active)
      .toLocaleString();
  }
}
