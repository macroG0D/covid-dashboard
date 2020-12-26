import getTodayConvertedDate from '../modules/DateConverter';

test('correct year format (XX): ', () => {
  const currentYearLastTwoDigits = String(new Date(Date.now()).getFullYear()).slice(2);
  const convertedDateYear = getTodayConvertedDate().slice(6);
  expect(convertedDateYear).toBe(currentYearLastTwoDigits);
});

test('expected date format: ', () => {
  const expectedFormat = /[0-1][0-9]\/[0-9]*\/[0-9]{2}$/;
  const convertedDate = getTodayConvertedDate();
  expect(convertedDate).toMatch(expectedFormat);
});

test('not default date format: ', () => {
  const today = new Date(Date.now()).toJSON().slice(0, 10);
  expect(getTodayConvertedDate()).not.toBe(today);
});

test('expected return result: ', () => {
  let today = new Date(Date.now());
  today = today.toJSON().slice(0, 10).split('-');
  [today[0], today[2]] = [today[2], today[0]];
  [today[0], today[1]] = [today[1], today[0]];
  today[2] = today[2].slice(0, -2);
  today = today.join('/');
  expect(getTodayConvertedDate()).toBe(today);
});
