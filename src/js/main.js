import '../styles/main.scss';
import DataFetcher from './modules/DataFetcher';
import CountriesTable from './modules/CountriesTable';

async function fetchData() {
  const dataFetcher = new DataFetcher();
  await dataFetcher.updateModules();
  // console.log('covid: ', DataFetcher.data.Countries[0].Country);
  const flags = await dataFetcher.getFlagsAndPopulation();

  const COVIDDATA = DataFetcher.data.Countries;
  COVIDDATA.forEach((country) => {
    flags.forEach((flag) => {
      if (flag.name === country.Country) {
        // eslint-disable-next-line no-param-reassign
        country.flag = flag.flag;
        // eslint-disable-next-line no-param-reassign
        country.population = flag.population;
      }
    });
  });
  COVIDDATA.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
}

async function modulesController() {
  await fetchData();
  CountriesTable.updateTable(DataFetcher.data);
  // console.log(DataFetcher.data);
}

modulesController();
