export const addCommas = (i) => {
  if (i === null || i === undefined) {
    return '';
  }
  return i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const padZero = (num, size = 2) => {
  let s = String(num);
  while (s.length < size) {
    s = `0${s}`;
  }
  return s;
};
