import CurrentCountry from './CurrentCountry';
import DataFetcher from './DataFetcher';
import getTodayConvertedDate from './DateConverter';

const Chart = require('chart.js');

export default class Graph {
  static chart = Chart;

  static myChart = null;

  static total = true;

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
          DataFetcher.data[CurrentCountry.selectedCountryID].todayCasesPer100k,
          DataFetcher.data[CurrentCountry.selectedCountryID].todayRecoveredPer100k,
          DataFetcher.data[CurrentCountry.selectedCountryID].todayDeathsPer100k,
        ],
        backgroundColor: [
          'rgba(255, 65, 65, 0.5)',
          'rgba(100, 206, 129, 0.5)',
          'rgba(141, 71, 158, 0.5)',
          'rgba(231, 30, 30, 0.5)',
          'rgba(47, 255, 105, 0.5)',
          'rgba(204, 0, 255, 0.5)',
        ],
        legend: 'Today polar chart', // for legend
      }],
      labels: [
        'Today Cases',
        'Today Recovered',
        'Today Deaths',
        'Today Cases per 100k',
        'Today Recovered per 100k',
        'Today Deaths per 100k',
      ],
    };
    const ctx = document.getElementById('myChart').getContext('2d');
    Graph.myChart = new Chart(ctx, {
      data,
      type: 'pie',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 15,
            bottom: 15,
          },
        },
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

    // format the left-side data numbers`
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
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 15,
            bottom: 0,
          },
        },
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
            backgroundColor: '#ff4141',
            borderColor: '#ff4141',
            borderWidth: 2,
          },
          {
            label: 'Total Recovered',
            fill: false,

            data: recoveredCasesData,
            backgroundColor: '#64CE81',
            borderColor: '#64CE81',
            borderWidth: 2,
          },
          {
            label: 'Total Deaths',
            fill: false,

            data: deathCasesData,
            backgroundColor: '#8D479E',
            borderColor: '#8D479E',
            borderWidth: 2,
          },
          {
            label: 'Cases/100k',
            fill: false,

            data: cases100k,
            backgroundColor: '',
            borderColor: '#e71e1e',
            borderWidth: 2,
          },
          {
            label: 'Recovered/100k',
            fill: false,

            data: recovered100k,
            backgroundColor: '',
            borderColor: '#2FFF69',
            borderWidth: 2,
          },
          {
            label: 'Deaths/100k',
            fill: false,

            data: deaths100k,
            backgroundColor: '',
            borderColor: '#CC00FF',
            borderWidth: 2,
          },
        ],
      },
    });
  }
}
