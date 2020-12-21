/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
export default class DataFetcher {
  static data = [];

  static global = [];

  static worldPopulation = 0;

  static formatWorldTimeLine(worldTimeLineData) {
    // temp object which will be fullfilled and return from the function
    const worldTImeline = {
      cases: {},
      deaths: {},
      recovered: {},
    };

    const MOUNTHLENGTH = 31;

    worldTimeLineData.length = MOUNTHLENGTH; // leave only last month
    worldTimeLineData.reverse(); // reverse to match the format with "covid19-api"
    worldTimeLineData.forEach((day) => {
      const cases = day.total_cases;
      const deaths = day.total_deaths;
      const recovered = day.total_recovered;

      // match timestamp format with "covid19-api"
      let formatedDate = day.last_update.split('-');
      formatedDate[0] = formatedDate[0].slice(2, 4);
      formatedDate[2] = formatedDate[2].slice(0, 2);
      [formatedDate[0], formatedDate[2]] = [formatedDate[2], formatedDate[0]];
      [formatedDate[0], formatedDate[1]] = [formatedDate[1], formatedDate[0]];
      formatedDate = formatedDate.join('/');

      // add formated data to object
      worldTImeline.cases[formatedDate] = cases;
      worldTImeline.deaths[formatedDate] = deaths;
      worldTImeline.recovered[formatedDate] = recovered;
    });
    return worldTImeline;
  }

  async getCovidData() {
    const countriesResponse = await fetch('https://disease.sh/v3/covid-19/countries');
    const allCountries = await countriesResponse.json();

    // GET TIMELINE DATA FOR COUNTRIES
    const countriesTimeLineStatsResponse = await fetch('https://disease.sh/v3/covid-19/historical/');
    const countriesTimeLineStats = await countriesTimeLineStatsResponse.json();
    allCountries.forEach((country) => {
      const matchedCountry = countriesTimeLineStats.find((countriesWithTimeLine) => countriesWithTimeLine.country === country.country);
      if (matchedCountry) {
        country.timeline = matchedCountry.timeline;
      } else {
        country.timeline = 'no data for this country';
      }
    });

    // GET GLOBAL DATA
    const worldDataResponse = await fetch('https://disease.sh/v3/covid-19/all');
    const worldTimeLineDataResponse = await fetch('https://covid19-api.org/api/timeline');
    const worldTimeLineData = await worldTimeLineDataResponse.json();
    const formatedWorldTimeLineData = await DataFetcher.formatWorldTimeLine(worldTimeLineData);

    const WORLD = await worldDataResponse.json();
    DataFetcher.global = WORLD;
    WORLD.country = 'World';
    WORLD.countryInfo = {
      flag: './assets/icons/worldmap.png',
      long: -15,
      lat: -20,
    };
    WORLD.timeline = formatedWorldTimeLineData;
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
    // return Math.floor(number / hundredK);
    return (number / hundredK).toFixed(2);
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
