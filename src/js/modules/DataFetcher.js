export default class DataFetcher {
  static data = [];

  async getCovidData() {
    const countriesResponse = await fetch('https://api.covid19api.com/summary');
    const allCountries = await countriesResponse.json();
    const WORD = {
      Country: 'Word',
      NewConfirmed: allCountries.Global.NewConfirmed,
      TotalConfirmed: allCountries.Global.TotalConfirmed,
    };
    // add global word stats object to main data array
    allCountries.Countries.push(WORD);
    this.updateStatic(allCountries);
    return allCountries;
  }

  async getFlagsAndPopulation() {
    const flagsAndPopulationResponse = await fetch(
      'https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;population;flag',
    );
    const flagsAndPopulation = await flagsAndPopulationResponse.json();
    return flagsAndPopulation;
  }

  updateStatic(data) {
    DataFetcher.data = data;
  }

  async composeAllData() {
    const flags = await this.getFlagsAndPopulation();
    const covidAPIdata = DataFetcher.data.Countries;
    covidAPIdata.forEach((country) => {
      flags.forEach((flag) => {
        if (flag.alpha2Code === country.CountryCode) {
          // eslint-disable-next-line no-param-reassign
          country.flag = flag.flag;
          // eslint-disable-next-line no-param-reassign
          country.population = flag.population;
        }
      });
    });
    covidAPIdata.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
  }

  // sync and update all the data in all modules
  async updateModules() {
    await this.getCovidData();
    await this.composeAllData();
  }
}
