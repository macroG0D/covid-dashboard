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
async function modulesDefaultInitiator(dataType) {
  await fetchData();
  CountriesTable.updateTable(DataFetcher.data, dataType);
  Global.updateGlobal(DataFetcher.data);
  Summary.updateSummary(DataFetcher.data);
  Map.init(DataFetcher.data, CountriesTable.dataType);
  Graph.showChart();
  keyboard.init();
}

modulesDefaultInitiator('cases');

// LIVE SEARCH
const searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', Search.livesearch);

// SUMMARY buttons
const btnTotal = document.querySelector('#btnTotal');
const btnToday = document.querySelector('#btnToday');
const switchChartBtn = document.querySelector('#switchChartBtn');
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

switchChartBtn.addEventListener('click', (e) => {
  if (e.target.classList.contains('active')) {
    e.target.classList.remove('active');
    Graph.total = true;
    Graph.showChart();
  } else {
    Graph.total = false;
    e.target.classList.add('active');
    Graph.showPolarChart();
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

// COUNTRIES BUTTONS
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
  CountriesTable.updateTable(DataFetcher.data, CountriesTable.dataType);
  Map.init(DataFetcher.data, CountriesTable.dataType);
  Map.selectCountryOnMap(CurrentCountry.long, CurrentCountry.lat);
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
      } else {
        CountriesTable.dataType += 'Per100k';
        DataFetcher.sortByDataType(CountriesTable.dataType);
      }
      CurrentCountry.dataType = countryTabBtn.textContent;
      CountriesTable.updateTable(DataFetcher.data, CountriesTable.dataType);
      Map.init(DataFetcher.data, CountriesTable.dataType);
      Map.selectCountryOnMap(CurrentCountry.long, CurrentCountry.lat);
    }
  });
});

const countriesTable = document.querySelector('.countriesTableBody');
countriesTable.addEventListener('click', (event) => {
  if (event.path[1].nodeName === 'TR') {
    const selectedCountry = event.path[1];
    if (!selectedCountry.classList.contains('selected')) {
      // remove selection from previousely selected row
      CurrentCountry.selectedCountryID = DataFetcher.data.findIndex(
        (country) => country.country.toLowerCase()
        === CurrentCountry.selectedCountryName.toLowerCase(),
      );

      const previouslySelected = document.getElementById(`${CurrentCountry.selectedCountryID}`);
      // const previouslySelected = DataFetcher.data[previouslySelectedInde]
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
      if (Graph.total) {
        Graph.showChart();
      } else {
        Graph.showPolarChart();
      }
    }
  }
});

// FULL SCREEN
let fullscreenOn = false;

function createFullScreenModule(moduleBlock) {
  const fullScreenModule = document.createElement('div');
  const copy = moduleBlock.cloneNode(true);
  const closeBtn = copy.querySelector('.fullScreenBtn');
  if (!fullscreenOn) {
    fullscreenOn = true;
    fullScreenModule.classList.add('fullScreenModule');
    const main = document.querySelector('main');
    fullScreenModule.append(copy);
    main.appendChild(fullScreenModule);
  }
  closeBtn.addEventListener('click', () => {
    copy.remove();
    fullScreenModule.remove();
    fullscreenOn = false;
  });
}

const moduleWrappers = document.querySelectorAll('.moduleWrapper');
moduleWrappers.forEach((moduleWrapper) => {
  const fullScreenBtn = document.createElement('div');
  fullScreenBtn.classList.add('fullScreenBtn');
  moduleWrapper.append(fullScreenBtn);
  fullScreenBtn.addEventListener('click', (e) => {
    const moduleBlock = e.path[1];
    createFullScreenModule(moduleBlock);
  });
});
