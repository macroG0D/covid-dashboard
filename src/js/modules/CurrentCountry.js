import DataFetcher from './DataFetcher';

export default class CurrentCountry {
  static selectedCountryID = 0;

  static selectedCountryName = 'World';

  static dataType = 'Total Cases';

  static long = -15;

  static lat = -20;

  static updateCurrentCountryLongLat() {
    CurrentCountry.long = DataFetcher.data[CurrentCountry.selectedCountryID].countryInfo.long;
    CurrentCountry.lat = DataFetcher.data[CurrentCountry.selectedCountryID].countryInfo.lat;
  }
}
