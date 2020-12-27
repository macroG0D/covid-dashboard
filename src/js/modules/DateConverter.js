export default function getTodayConvertedDate() {
  let today = new Date(Date.now());
  today = today.toJSON().slice(0, 10).split('-');
  [today[0], today[2]] = [today[2], today[0]];
  [today[0], today[1]] = [today[1], today[0]];
  today[2] = today[2].slice(0, -2);
  return today.join('/');
}
