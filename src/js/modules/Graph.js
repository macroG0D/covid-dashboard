import CurrentCountry from './CurrentCountry';
import DataFetcher from './DataFetcher';

const Chart = require('chart.js');

export default class Graph {
  static chart = Chart;

  static showChart() {
    const ctx = document.getElementById('myChart').getContext('2d');

    const currentCountryTimeline = DataFetcher.data[CurrentCountry.selectedCountryID].timeline;
    const labelsData = Object.keys(currentCountryTimeline.cases);
    const casesData = Object.values(currentCountryTimeline.cases);
    const deathCasesData = Object.values(currentCountryTimeline.deaths);
    const recoveredCasesData = Object.values(currentCountryTimeline.recovered);

    const myChart = new Chart(ctx, {
      type: 'line',
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
      data: {
        labels: labelsData,
        datasets: [
          {
            label: 'cases',
            fill: false,

            data: casesData,
            backgroundColor: 'rgba(0, 0, 255)',
            borderColor: 'rgb(0,0,255)',
            borderWidth: 1,
          },
          {
            label: 'recovered',
            fill: false,

            data: recoveredCasesData,
            backgroundColor: 'rgba(0, 255, 0)',
            borderColor: 'green',
            borderWidth: 1,
          },
          {
            label: 'death',
            fill: false,

            data: deathCasesData,
            backgroundColor: 'rgba(255, 0, 0)',
            borderColor: 'red',
            borderWidth: 1,
          },
        ],
      },
    });
  }
}
