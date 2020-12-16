export default class CountriesTable {
  static table = document.querySelector('.countriesTableBody');

  static updateTable(data) {
    const tbody = CountriesTable.table;
    data.Countries.forEach((country, index) => {
      const tr = document.createElement('tr');
      const tdPosition = document.createElement('td');
      tdPosition.classList.add('short-col');
      const tdCountry = document.createElement('td');
      tdCountry.classList.add('long-col');

      const flagSpan = document.createElement('span');
      flagSpan.classList.add('flag');

      const flagImg = document.createElement('img');
      flagImg.classList.add('flagImg');
      flagImg.setAttribute('alt', `${country.Country} flag`);
      flagImg.setAttribute('src', country.flag);

      const tdCases = document.createElement('td');
      tdCases.classList.add('long-col');

      tdPosition.textContent = index + 1;
      tdCountry.textContent = country.Country;
      tdCases.textContent = country.TotalConfirmed;

      tr.appendChild(tdPosition);
      if (country.flag) {
        flagSpan.prepend(flagImg);
        tdCountry.prepend(flagSpan);
      }
      tr.appendChild(tdCountry);
      tr.appendChild(tdCases);
      tbody.appendChild(tr);
    });
  }
}
