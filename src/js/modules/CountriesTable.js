export default class CountriesTable {
  static table = document.querySelector('.countriesTableBody');

  static updateTable(data, handleCountrySelect) {
    const tbody = CountriesTable.table;
    // fill the table with countries composed data
    data.Countries.forEach((country, index) => {
      const tr = document.createElement('tr');
      const tdPosition = document.createElement('td');
      tdPosition.classList.add('short-col');
      const tdCountry = document.createElement('td');
      tdCountry.classList.add('long-col');
      tdCountry.classList.add('countryCell');
      const tdCases = document.createElement('td');
      tdCases.classList.add('long-col');

      // don't give position number to Word
      if (index > 0) {
        tdPosition.textContent = index;
      }

      tdCountry.textContent = country.Country;
      tdCountry.setAttribute('country', country.Country.toLowerCase());
      const total = Number(country.TotalConfirmed).toLocaleString();
      tdCases.textContent = total;

      if (country.flag) {
        const flagSpan = document.createElement('span');
        flagSpan.classList.add('flag');
        const flagImg = document.createElement('div');
        flagImg.classList.add('flagImg');
        flagImg.style.backgroundImage = `url(${country.flag}`;
        flagSpan.prepend(flagImg);
        tdCountry.prepend(flagSpan);
      }

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
