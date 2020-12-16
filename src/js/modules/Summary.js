export default class Summary {
  static updateSummary(data) {
    const summaryCases = document.querySelector('#summary_cases');
    const summaryrEecovered = document.querySelector('#summary_recovered');
    const summaryDeaths = document.querySelector('#summary_deaths');
    summaryCases.textContent = Number(data.Global.TotalConfirmed).toLocaleString();
    summaryrEecovered.textContent = Number(data.Global.TotalRecovered).toLocaleString();
    summaryDeaths.textContent = Number(data.Global.TotalDeaths).toLocaleString();
  }
}
