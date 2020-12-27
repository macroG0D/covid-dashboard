import CurrentCountry from './CurrentCountry';

export default class Summary {
  static total = true;

  static absolute = true;

  static confirmed = 'TotalConfirmed';

  static recovered = 'TotalRecovered';

  static deaths = 'deths';

  static updateStatus() {
    if (this.absolute) {
      if (this.total) {
        this.confirmed = 'cases';
        this.recovered = 'recovered';
        this.deaths = 'deaths';
      } else {
        this.confirmed = 'todayCases';
        this.recovered = 'todayRecovered';
        this.deaths = 'todayDeaths';
      }
    }

    if (!this.absolute) {
      if (this.total) {
        this.confirmed = 'casesPer100k';
        this.recovered = 'recoveredPer100k';
        this.deaths = 'deathsPer100k';
      } else {
        this.confirmed = 'todayCasesPer100k';
        this.recovered = 'todayRecoveredPer100k';
        this.deaths = 'todayDeathsPer100k';
      }
    }
  }

  static updateSummary(data) {
    Summary.updateStatus();
    const summaryCases = document.querySelector('#summary_cases');
    const summaryRecovered = document.querySelector('#summary_recovered');
    const summaryDeaths = document.querySelector('#summary_deaths');
    const selectedCountry = data.findIndex(
      (country) => country.country.toLowerCase()
      === CurrentCountry.selectedCountryName.toLowerCase(),
    );
    const casesNum = data[selectedCountry][Summary.confirmed];
    const recoveredNum = data[selectedCountry][Summary.recovered];
    const deathsNum = data[selectedCountry][Summary.deaths];
    summaryCases.textContent = casesNum > 0 ? casesNum.toLocaleString() : 'N/A';
    summaryRecovered.textContent = recoveredNum > 0 ? recoveredNum.toLocaleString() : 'N/A';
    summaryDeaths.textContent = deathsNum > 0 ? deathsNum.toLocaleString() : 'N/A';
  }
}
