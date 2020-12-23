import CurrentCountry from './CurrentCountry';
import DataFetcher from './DataFetcher';
import getTodayConvertedDate from './DateConverter';

const Chart = require('chart.js');

export default class Graph {
  static chart = Chart;

  static myChart = null;

  static destroyChart(myChart) {
    if (myChart) {
      myChart.destroy();
    }
  }

  static displayCountryOnCharts() {
    const countryNameOnCharts = document.querySelector('.countryNameOnCharts');
    countryNameOnCharts.textContent = `${CurrentCountry.selectedCountryName.toUpperCase()}`;
  }

  static showPolarChart() {
    // if chart is already exists — destroy it
    Graph.destroyChart(Graph.myChart);
    Graph.displayCountryOnCharts();
    // create new instance
    const data = {
      datasets: [{
        data: [
          DataFetcher.data[CurrentCountry.selectedCountryID].todayCases,
          DataFetcher.data[CurrentCountry.selectedCountryID].todayRecovered,
          DataFetcher.data[CurrentCountry.selectedCountryID].todayDeaths,
        ],
        backgroundColor: [
          'rgba(255,255,255,0.7)',
          'rgba(100, 206, 129, 0.7)',
          'rgba(255,0,0,0.7)',
        ],
        legend: 'Today polar chart', // for legend
      }],
      labels: [
        'Today Cases',
        'Today Recovered',
        'Today Deaths',
      ],
    };
    const ctx = document.getElementById('myChart').getContext('2d');
    Graph.myChart = new Chart(ctx, {
      data,
      type: 'pie',
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  static showChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    Graph.displayCountryOnCharts();
    const currentCountryTimeline = DataFetcher.data[CurrentCountry.selectedCountryID].timeline;
    const { population } = DataFetcher.data[CurrentCountry.selectedCountryID];

    let labelsData;
    let casesData;
    let deathCasesData;
    let recoveredCasesData;

    try {
      labelsData = Object.keys(currentCountryTimeline.cases);
      casesData = Object.values(currentCountryTimeline.cases);
      deathCasesData = Object.values(currentCountryTimeline.deaths);
      recoveredCasesData = Object.values(currentCountryTimeline.recovered);
    } catch (e) {
      const lastUpdated = getTodayConvertedDate();
      const firstKnownCovidCase = '11/11/19';
      labelsData = [firstKnownCovidCase, lastUpdated];
      casesData = [0, currentCountryTimeline[0]];
      recoveredCasesData = [0, currentCountryTimeline[1]];
      deathCasesData = [0, currentCountryTimeline[2]];
    }

    const cases100k = casesData.map((deseaseCase) => DataFetcher
      .hundredKPopConverter(deseaseCase, population));

    const deaths100k = deathCasesData.map((deathCase) => DataFetcher
      .hundredKPopConverter(deathCase, population));

    const recovered100k = recoveredCasesData.map((recoveredCase) => DataFetcher
      .hundredKPopConverter(recoveredCase, population));

    // if chart is already exists — destroy it
    Graph.destroyChart(Graph.myChart);

    // format the left-side data numbers
    Chart.scaleService.updateScaleDefaults('linear', {
      ticks: {
        callback(tick) {
          if (tick >= 1000000) {
            return `${(tick / 1000000).toLocaleString()}M`;
          }
          if (tick >= 100000) {
            return `${(tick / 1000).toLocaleString()}k`;
          }
          return `${tick.toLocaleString()}`;
        },
      },
    });

    // format the tooltip data
    Chart.defaults.global.tooltips.callbacks.label = function (tooltipItem, data) {
      const dataset = data.datasets[tooltipItem.datasetIndex];
      const datasetLabel = dataset.label || '';
      return `${datasetLabel}: ${dataset.data[tooltipItem.index].toLocaleString()}`;
    };

    // create new instance
    Graph.myChart = new Chart(ctx, {
      type: 'line',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: 'x',
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
            label: 'Total Cases',
            fill: false,

            data: casesData,
            backgroundColor: 'rgba(214, 219, 227, 1)',
            borderColor: 'rgba(214, 219, 227, 1)',
            borderWidth: 2,
          },
          {
            label: 'Total Recovered',
            fill: false,

            data: recoveredCasesData,
            backgroundColor: 'rgba(100, 206, 129, 1)',
            borderColor: 'rgba(100, 206, 129, 1)',
            borderWidth: 2,
          },
          {
            label: 'Total Deaths',
            fill: false,

            data: deathCasesData,
            backgroundColor: 'rgba(255, 65, 65, 1)',
            borderColor: 'rgba(255, 65, 65, 1)',
            borderWidth: 2,
          },
          {
            label: 'Cases/100k',
            fill: false,

            data: cases100k,
            backgroundColor: '',
            borderColor: 'rgba(127, 80, 165, 1)',
            borderWidth: 2,
          },
          {
            label: 'Recovered/100k',
            fill: false,

            data: recovered100k,
            backgroundColor: '',
            borderColor: 'rgba(232, 212, 111, 1)',
            borderWidth: 2,
          },
          {
            label: 'Deaths/100k',
            fill: false,

            data: deaths100k,
            backgroundColor: '',
            borderColor: 'rgba(165, 80, 80, 1)',
            borderWidth: 2,
          },
        ],
      },
    });
  }
}
