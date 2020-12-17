import '../styles/main.scss';
import DataFetcher from './modules/DataFetcher';
import CountriesTable from './modules/CountriesTable';
import Global from './modules/Global';
import Summary from './modules/Summary';
import Search from './modules/Search';
import Graph from './modules/Graph';

const DEFAULT_SELECTED_COUNTRY = 'ukraine';
const selectedCountry = DEFAULT_SELECTED_COUNTRY;

// Charts\Graph
const graph = new Graph();
graph.showChart(selectedCountry);

const handleCountryChange = (country) => {
  graph.showChart(country);
}

// DATA FROM API
async function fetchData() {
  const dataFetcher = new DataFetcher();
  await dataFetcher.updateModules();
}

// DATA FROM API TO MODULES
async function modulesController() {
  await fetchData();
  CountriesTable.updateTable(DataFetcher.data, handleCountryChange);
  Global.updateGlobal(DataFetcher.data);
  Summary.updateSummary(DataFetcher.data);
}

modulesController();

// LIVE SEARCH
const searchInput = document.querySelector('.searchBar');
const searchBar = new Search();
searchInput.addEventListener('input', searchBar.livesearch);

