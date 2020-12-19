/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
export default class DataFetcher {
  static data = [];

  static global = [];

  static worldPopulation = 0;

  async getCovidData() {
    const countriesResponse = await fetch('https://disease.sh/v3/covid-19/countries');
    const allCountries = await countriesResponse.json();
    const worldDataResponse = await fetch(
      'https://disease.sh/v3/covid-19/all',
    );
    const WORLD = await worldDataResponse.json();
    DataFetcher.global = WORLD;
    WORLD.country = 'World';
    WORLD.countryInfo = {
      flag: './assets/icons/worldmap.png',
    };
    // add global world stats object to main data array
    allCountries.push(WORLD);
    this.updateData(allCountries);

    // sort by default by cases amount
    allCountries.sort((a, b) => b.cases - a.cases);
    DataFetcher.insert100k();
    return allCountries;
  }

  updateData(data) {
    DataFetcher.data = data;
  }

  static hundredKPopConverter(number, population) {
    const countryPopulation = population;
    const HUNDREDK = 100000;
    const hundredK = countryPopulation / HUNDREDK;
    return Math.ceil(number / hundredK);
  }

  static insert100k() {
    DataFetcher.data.forEach((country) => {
      country.casesPer100k = DataFetcher.hundredKPopConverter(country.cases, country.population);
      country.recoveredPer100k = DataFetcher.hundredKPopConverter(country.recovered, country.population);
      country.deathPer100k = DataFetcher.hundredKPopConverter(country.deaths, country.population);
      country.todayCasesPer100k = DataFetcher.hundredKPopConverter(country.todayCases, country.population);
      country.todayRecoveredPer100k = DataFetcher.hundredKPopConverter(country.todayRecovered, country.population);
      country.todayDeathPer100k = DataFetcher.hundredKPopConverter(country.todayDeaths, country.population);
    });
  }

  // sync and update all the data in all modules
  async updateModules() {
    await this.getCovidData();
  }
}
