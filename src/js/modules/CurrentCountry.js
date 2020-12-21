import DataFetcher from './DataFetcher';

export default class CurrentCountry {
  static selectedCountryID = 0;

  static selectedCountryName = 'World';

  static long = 0;

  static lat = 0;

  static updateCurrentCountryLongLat() {
    CurrentCountry.long = DataFetcher.data[CurrentCountry.selectedCountryID].countryInfo.long;
    CurrentCountry.lat = DataFetcher.data[CurrentCountry.selectedCountryID].countryInfo.lat;
  }
}
