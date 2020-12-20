import DataFetcher from './DataFetcher';

const Chart = require('chart.js');

export default class Graph {
  static chart = Chart;

  async showChart(currentCountry) {
    const ctx = document.getElementById('myChart').getContext('2d');

    const dataFetcher = new DataFetcher();//TODO DYNAMIC
    let graphData = await fillArrayWithPerMonthCases(dataFetcher, currentCountry);

    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['August', 'September', 'October', 'November'],
        datasets: [
          {
            label: `${currentCountry}`,
             fill: false,

            data: graphData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
}


async function fillArrayWithPerMonthCases(dataFetcher, country) {
    let result = []
    for (let i = 8; i < 12; i += 1) {
      let response = await dataFetcher.fetchDataByCountryAndDate(country, `2020-${i < 10 ? '0' + i : i}-01T00:00:00Z`,`2020-${i+1 < 10 ? '0' + (i+1) : i+1}-01T00:00:00Z`)
      let mappedToCases = response.map((el) => el['Cases']);
      let monthSum = mappedToCases[mappedToCases.length - 1] - mappedToCases[0];
      result.push(monthSum)
    }
    return result;
}