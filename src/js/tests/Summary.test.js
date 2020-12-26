import Summary from '../modules/Summary';

test('Summary: update confirmed cases when absulute false', () => {
  Summary.absolute = false;
  Summary.updateStatus();
  expect(Summary.confirmed).toBe('casesPer100k');
});

test('Summary: no change when absolute true but updateStatus() was\'n called', () => {
  Summary.absolute = true;
  expect(Summary.confirmed).toBe('casesPer100k');
});

test('Summary: check if updates correctly', () => {
  Summary.updateStatus();
  expect(Summary.confirmed).toBe('cases');
});
