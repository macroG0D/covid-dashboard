import '../styles/main.scss';
import DataFetcher from './modules/DataFetcher';
import CountriesTable from './modules/CountriesTable';

async function fetchData() {
  const dataFetcher = new DataFetcher();
  await dataFetcher.updateModules();
}

async function modulesController() {
  await fetchData();
  CountriesTable.updateTable(DataFetcher.data);
}

modulesController();
