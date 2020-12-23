import CurrentCountry from './CurrentCountry';
import DataFetcher from './DataFetcher';
import Search from './Search';

export default class CountriesTable {
  static table = document.querySelector('.countriesTableBody');

  static absolute = true;

  static dataType = 'cases';

  static updateTable(data, dataType) {
    const tbody = CountriesTable.table;
    // remove old rows on each table update
    if (tbody.children.length > 0) {
      tbody.innerHTML = '';
    }

    // fill the table with countries composed data
    data.forEach((country, index) => {
      const tr = document.createElement('tr');
      tr.classList.add('countryRow');
      const tdPosition = document.createElement('td');
      tdPosition.classList.add('short-col');
      const tdCountry = document.createElement('td');
      tdCountry.classList.add('long-col');
      tdCountry.classList.add('countryCell');
      const tdCases = document.createElement('td');
      tdCases.classList.add('long-col');

      // don't give position number to Word if it is first
      if (data[0].country === 'World') {
        if (index > 0) {
          tdPosition.textContent = index;
        }
      } else {
        tdPosition.textContent = index + 1;
      }

      tr.setAttribute('id', index);
      tr.setAttribute('name', country.country.toLowerCase());
      tdCountry.textContent = country.country;
      tdCountry.setAttribute('country', country.country.toLowerCase());
      const dataResult = Number(country[dataType]) > 0 ? Number(country[dataType]).toLocaleString() : 'N/A';
      tdCases.textContent = dataResult;

      const flagSpan = document.createElement('span');
      flagSpan.classList.add('flag');
      const flagImg = document.createElement('div');
      flagImg.classList.add('flagImg');
      flagImg.style.backgroundImage = `url(${country.countryInfo.flag}`;
      flagSpan.prepend(flagImg);
      tdCountry.prepend(flagSpan);

      tr.appendChild(tdPosition);
      tr.appendChild(tdCountry);
      tr.appendChild(tdCases);
      tbody.appendChild(tr);
    });

    const countriesRows = document.querySelectorAll('.countryRow');
    const CurrentCountryIndex = DataFetcher.data.findIndex(
      (country) => country.country.toLowerCase()
      === CurrentCountry.selectedCountryName.toLowerCase(),
    );
    countriesRows[CurrentCountryIndex].scrollIntoView({ block: 'center', behavior: 'smooth' });
    // add auto selection to selected country
    countriesRows[CurrentCountryIndex].classList.add('selected');
    Search.livesearch();
  }
}
