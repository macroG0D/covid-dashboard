export default class DataFetcher {
  static data = [];

  async getCovidData() {
    const countriesResponse = await fetch('https://api.covid19api.com/summary');
    const allCountries = await countriesResponse.json();
    this.updateStatic(allCountries);
    return allCountries;
  }

  async getFlagsAndPopulation() {
    const flagsAndPopulationResponse = await fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag');
    const flagsAndPopulation = await flagsAndPopulationResponse.json();
    return flagsAndPopulation;
  }

  updateStatic(data) {
    DataFetcher.data = data;
  }

  // sync and update all the data in all modules
  async updateModules() {
    // console.log(Date.now());
    await this.getCovidData();
    // console.log(Date.now());
  }
}
