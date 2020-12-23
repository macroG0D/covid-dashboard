import '../styles/main.scss';
import DataFetcher from './modules/DataFetcher';
import CountriesTable from './modules/CountriesTable';
import CurrentCountry from './modules/CurrentCountry';
import Global from './modules/Global';
import Summary from './modules/Summary';
import Search from './modules/Search';
import Map from './modules/Map';
import Graph from './modules/Graph';
import Keyboard from './modules/Keyboard';

const keyboard = new Keyboard();

// DATA FROM API
async function fetchData() {
  const dataFetcher = new DataFetcher();
  await dataFetcher.updateModules();
}

// DATA FROM API TO MODULES
async function modulesController(dataType) {
  await fetchData();
  CountriesTable.updateTable(DataFetcher.data, dataType);
  Global.updateGlobal(DataFetcher.data);
  Summary.updateSummary(DataFetcher.data);
  Map.updateMap(DataFetcher.data);
  Graph.showChart();
  keyboard.init();
}

modulesController('cases');

// LIVE SEARCH
const searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', Search.livesearch);

// SUMMARY buttons
const btnTotal = document.querySelector('#btnTotal');
const btnToday = document.querySelector('#btnToday');
const btnAbsolute100k = document.querySelector('#btnAbsolute100k');

btnTotal.addEventListener('click', () => {
  if (Summary.today) {
    Summary.today = false;
    Summary.total = true;
    btnTotal.classList.add('pressed');
    btnToday.classList.remove('pressed');
    Summary.updateSummary(DataFetcher.data);
  }
});

btnToday.addEventListener('click', () => {
  if (Summary.total) {
    Summary.total = false;
    Summary.today = true;
    btnToday.classList.add('pressed');
    btnTotal.classList.remove('pressed');
    Summary.updateSummary(DataFetcher.data);
  }
});

btnAbsolute100k.addEventListener('click', () => {
  if (Summary.absolute) {
    Summary.absolute = false;
    Summary.hundredK = true;
    btnAbsolute100k.classList.add('pressed');
  } else {
    Summary.absolute = true;
    Summary.hundredK = false;
    btnAbsolute100k.classList.remove('pressed');
  }
  Summary.updateSummary(DataFetcher.data);
});

// SELECT COUNTRIES
const countriesAbsolute100kBtn = document.querySelector('.countriesTabsSwitch');
countriesAbsolute100kBtn.addEventListener('click', () => {
  if (CountriesTable.absolute) {
    CountriesTable.absolute = false;
    countriesAbsolute100kBtn.classList.add('pressed');
    CountriesTable.dataType += 'Per100k';
    DataFetcher.sortByDataType(CountriesTable.dataType);
  } else {
    CountriesTable.absolute = true;
    countriesAbsolute100kBtn.classList.remove('pressed');
    CountriesTable.dataType = CountriesTable.dataType.slice(0, -7);
    DataFetcher.sortByDataType(CountriesTable.dataType);
  }
  CountriesTable.updateTable(DataFetcher.data, CountriesTable.dataType);
});

const countriesTabsButtons = document.querySelectorAll('.countriesTabsBtn');
let selectedCountriesTab = countriesTabsButtons[0];
countriesTabsButtons.forEach((countryTabBtn, index) => {
  countryTabBtn.addEventListener('click', () => {
    if (!countryTabBtn.classList.contains('pressed')) {
      // switch class
      selectedCountriesTab.classList.remove('pressed');
      selectedCountriesTab = countriesTabsButtons[index];
      countryTabBtn.classList.add('pressed');

      // update table header
      const tableHeaderStatName = document.querySelector('#countriesStatName');
      tableHeaderStatName.textContent = countryTabBtn.textContent;
      // update table data
      CountriesTable.dataType = countryTabBtn.getAttribute('dataType');
      if (CountriesTable.absolute) {
        DataFetcher.sortByDataType(CountriesTable.dataType);
        CountriesTable.updateTable(DataFetcher.data, CountriesTable.dataType);
      } else {
        CountriesTable.dataType += 'Per100k';
        DataFetcher.sortByDataType(CountriesTable.dataType);
        CountriesTable.updateTable(DataFetcher.data, CountriesTable.dataType);
      }
    }
  });
});

const countriesTable = document.querySelector('.countriesTableBody');
countriesTable.addEventListener('click', (event) => {
  if (event.path[1].nodeName === 'TR') {
    const selectedCountry = event.path[1];
    if (!selectedCountry.classList.contains('selected')) {
      // remove selection from previousely selected row
      const previouslySelected = document.getElementById(`${CurrentCountry.selectedCountryID}`);
      previouslySelected.classList.remove('selected');
      // add selection to current selected row
      selectedCountry.classList.add('selected');
      // update CurrentCountry class statis values
      CurrentCountry.selectedCountryName = selectedCountry.getAttribute('name');
      CurrentCountry.selectedCountryID = selectedCountry.getAttribute('id');
      Summary.updateSummary(DataFetcher.data);
      Global.updateGlobal(DataFetcher.data);
      CurrentCountry.updateCurrentCountryLongLat();
      Map.selectCountryOnMap(CurrentCountry.long, CurrentCountry.lat);
      Graph.showChart();
    }
  }
});

// MAP LEGEND
const mapLegend = document.querySelectorAll('.legendItem');
mapLegend.forEach((marker) => {
  let size = marker.getAttribute('size');
  size = (Map.setMarkerSize(size) * 10) - 1.8;
  // eslint-disable-next-line no-param-reassign
  marker.children[0].style.width = `${size}px`;
  // eslint-disable-next-line no-param-reassign
  marker.children[0].style.height = `${size}px`;
});

// FULL SCREEN
// const moduleWrappers = document.querySelectorAll('.moduleWrapper');
