import CurrentCountry from './CurrentCountry';
import DataFetcher from './DataFetcher';

const Chart = require('chart.js');

export default class Graph {
  static chart = Chart;

  static myChart = null;

  static destroyChart(myChart) {
    if (myChart) {
      myChart.destroy();
    }
  }

  static showChart() {
    const ctx = document.getElementById('myChart').getContext('2d');

    const currentCountryTimeline = DataFetcher.data[CurrentCountry.selectedCountryID].timeline;
    const labelsData = Object.keys(currentCountryTimeline.cases);
    const casesData = Object.values(currentCountryTimeline.cases);
    const deathCasesData = Object.values(currentCountryTimeline.deaths);
    const recoveredCasesData = Object.values(currentCountryTimeline.recovered);

    // if chart is already exists — destroy it
    Graph.destroyChart(Graph.myChart);

    Graph.myChart = new Chart(ctx, {
      type: 'line',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: 'rgba(49, 49, 49, 0.8)',
          titleFontSize: 14,
          titleFontColor: '#fff',
          bodyFontColor: '#fff',
          bodyFontSize: 14,
          displayColors: false,
          borderColor: 'rgba(255, 65, 65, 1)',
          borderWidth: 1,
        },
      },
      data: {
        labels: labelsData,
        datasets: [
          {
            label: 'cases',
            fill: false,

            data: casesData,
            backgroundColor: 'rgba(214, 219, 227, 1)',
            borderColor: 'rgba(214, 219, 227, 1)',
            borderWidth: 2,
          },
          {
            label: 'recovered',
            fill: false,

            data: recoveredCasesData,
            backgroundColor: 'rgba(100, 206, 129, 1)',
            borderColor: 'rgba(100, 206, 129, 1)',
            borderWidth: 2,
          },
          {
            label: 'death',
            fill: false,

            data: deathCasesData,
            backgroundColor: 'rgba(255, 65, 65, 1)',
            borderColor: 'rgba(255, 65, 65, 1)',
            borderWidth: 2,
          },
        ],
      },
    });
  }
}
