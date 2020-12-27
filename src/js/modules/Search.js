export default class Search {
  static livesearch() {
    const countryCells = document.querySelectorAll('.countryCell');
    const searchBar = document.querySelector('.searchBar');
    const searchRequest = searchBar.value.toLowerCase();
    const searchRequestLength = searchBar.value.length;
    countryCells.forEach((cell) => {
      if (cell.getAttribute('country').slice(0, searchRequestLength) !== searchRequest) {
        cell.parentElement.classList.add('hiddenItem');
      } else if (cell.parentElement.classList.contains('hiddenItem')) {
        cell.parentElement.classList.remove('hiddenItem');
      }
    });
  }
}
