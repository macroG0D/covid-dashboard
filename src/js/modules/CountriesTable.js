import CurrentCountry from './CurrentCountry';

export default class CountriesTable {
  static table = document.querySelector('.countriesTableBody');

  static updateTable(data, handleCountrySelect) {
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

      // add auto selection to selected country
      if (index === CurrentCountry.selectedCountryID) {
        tr.classList.add('selected');
      }
      // don't give position number to Word
      if (index > 0) {
        tdPosition.textContent = index;
      }
      tr.setAttribute('id', index);
      tr.setAttribute('name', country.country.toLowerCase());
      tdCountry.textContent = country.country;
      tdCountry.setAttribute('country', country.country.toLowerCase());
      const total = Number(country.cases).toLocaleString();
      tdCases.textContent = total;

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
      tr.addEventListener('click', () => {
        handleCountrySelect(country.Slug);
      })
      tbody.appendChild(tr);
    });
  }
}
