import getTodayConvertedDate from './DateConverter';
import {
  WORLD_DATA_ALL, WORLD_DATA_TIMELINE, COUNTRIES_DATA, COUNTRIES_DATA_TIMELINE,
} from '../data/CONSTANTS';

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

  // timeline API and countries API returning different data
  // this function is changing the current day in charts according to
  // counties totals
  static setCurrentDayCovidHistory(allCountries) {
    const today = getTodayConvertedDate();
    let yesterday = today.split('/');
    yesterday[1] = String(Number(yesterday[1]) - 1);
    yesterday = yesterday.join('/');
    // eslint-disable-next-line consistent-return
    allCountries.forEach((country) => {
      try {
        country.timeline.cases[today] = country.cases;
        country.timeline.deaths[today] = country.deaths;
        country.timeline.recovered[today] = country.recovered;
      } catch (e) {
        return false;
      }
    });
  }

  async getCovidData() {
    const countriesResponse = await fetch(COUNTRIES_DATA);
    const allCountries = await countriesResponse.json();

    // GET TIMELINE DATA FOR COUNTRIES
    const countriesTimeLineStatsResponse = await fetch(COUNTRIES_DATA_TIMELINE);
    const countriesTimeLineStats = await countriesTimeLineStatsResponse.json();
    allCountries.forEach((country) => {
      const matchedCountry = countriesTimeLineStats.find((countriesWithTimeLine) => (countriesWithTimeLine.country === country.country) && countriesWithTimeLine.province == null);
      if (matchedCountry) {
        country.timeline = matchedCountry.timeline;
      } else { // if no historical data for country — generate it from known information
        country.timeline = [country.cases, country.recovered, country.deaths, Date.now()];
      }
    });
    // GET GLOBAL DATA
    const worldDataResponse = await fetch(WORLD_DATA_ALL);
    const worldTimeLineDataResponse = await fetch(WORLD_DATA_TIMELINE);
    const worldTimeLineData = await worldTimeLineDataResponse.json();
    const formatedWorldTimeLineData = DataFetcher.formatWorldTimeLine(worldTimeLineData);

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

    // DataFetcher.setCurrentDayCovidHistory(allCountries); // optional function

    // sort by default by cases amount
    allCountries.sort((a, b) => b.cases - a.cases);
    DataFetcher.insert100k();
    return allCountries;
  }

  updateData(data) {
    DataFetcher.data = data;
  }

  static hundredKPopConverter(number, population) {
    if (population <= 0) {
      return 0;
    }
    const countryPopulation = population;
    const HUNDREDK = 100000;
    const hundredK = countryPopulation / HUNDREDK;
    return (number / hundredK).toFixed(2);
  }

  static insert100k() {
    DataFetcher.data.forEach((country) => {
      country.casesPer100k = DataFetcher.hundredKPopConverter(country.cases, country.population);
      country.recoveredPer100k = DataFetcher.hundredKPopConverter(country.recovered, country.population);
      country.deathsPer100k = DataFetcher.hundredKPopConverter(country.deaths, country.population);
      country.todayCasesPer100k = DataFetcher.hundredKPopConverter(country.todayCases, country.population);
      country.todayRecoveredPer100k = DataFetcher.hundredKPopConverter(country.todayRecovered, country.population);
      country.todayDeathsPer100k = DataFetcher.hundredKPopConverter(country.todayDeaths, country.population);
    });
  }

  // sync and update all the data in all modules
  async updateModules() {
    await this.getCovidData();
  }

  static sortByDataType(dataType) {
    DataFetcher.data.sort((a, b) => b[dataType] - a[dataType]);
  }
}
