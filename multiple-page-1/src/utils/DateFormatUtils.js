import { padZero } from './NumberUtils';

export const getMonthSimple = (monthOfYear) => {
  switch (monthOfYear) {
    case 0:
      return 'Jan';
    case 1:
      return 'Feb';
    case 2:
      return 'Mar';
    case 3:
      return 'Apr';
    case 4:
      return 'May';
    case 5:
      return 'Jun';
    case 6:
      return 'Jul';
    case 7:
      return 'Aug';
    case 8:
      return 'Sep';
    case 9:
      return 'Oct';
    case 10:
      return 'Nov';
    case 11:
      return 'Dec';
  }
};

export const getWeekSimple = (dayOfWeek) => {
  switch (dayOfWeek) {
    case 0:
      return 'Sun';
    case 1:
      return 'Mon';
    case 2:
      return 'Tue';
    case 3:
      return 'Wed';
    case 4:
      return 'Thu';
    case 5:
      return 'Fri';
    case 6:
      return 'Sat';
  }
};

export const getHourAndMinute = (date) => {
  let h = date.getHours();
  h = padZero(h);
  let m = date.getMinutes();
  m = padZero(m);
  return `${h}:${m}`;
};
export const minutesToHourAndMinute = (minutes) => {
  let h = Math.floor(minutes / 60);
  h = padZero(h);
  let m = minutes % 60;
  m = padZero(m);
  return `${h}:${m}`;
}
export const getDurationHourAndMinute = (date) => {
  let h = date.getHours();
  h = padZero(h);
  let m = date.getMinutes();
  let unit = Number(m) > 1 ? 'Minutes' : 'Minute';
  m = padZero(m);
  return `${h} Hour ${m} ${unit}`;
};
export const getTimeChaHourAndMinute = (date, type) => {
  let h = parseInt(date / (1000 * 3600));
  h = padZero(h);
  let m = (date - h * 1000 * 3600) / (1000 * 60);
  let unit = Number(m) > 1 ? 'Minutes' : 'Minute';
  m = padZero(m);
  if (type === 2) {
    return `${h}h${m}m`;
  } else {
    return `${h} Hour ${m} ${unit}`;
  }
};
export const getWDMY = (date, type) => {
  if (!date) return;
  let y = date.getFullYear();
  let m = getMonthSimple(date.getMonth());
  let d = date.getDate();
  let w = getWeekSimple(date.getDay());
  if (type) {
    return w + ', ' + d + ' ' + m;
  } else {
    return w + ', ' + d + ' ' + m + ', ' + y;
  }
};
export const countMinutes = (date) => {
  let h = date.getHours();
  let m = date.getMinutes();
  return h * 60 + m;
}
export const getHFWDMY = (date) => {
  if (!date) return;
  let y = date.getFullYear();
  let m = getMonthSimple(date.getMonth());
  let d = date.getDate();
  let w = getWeekSimple(date.getDay());
  let h = String(date.getHours());
  let f = String(date.getMinutes());
  h = padZero(h);
  f = padZero(f);

  return h + ':' + f + ' ' + w + ', ' + d + ' ' + m + ', ' + y;
};

export const getYearMonthDayString = (date) => {
  if (!date) return;

  let y = String(date.getFullYear());
  let m = String(date.getMonth() + 1);
  let d = String(date.getDate());

  m = padZero(m);
  d = padZero(d);

  return y + '-' + m + '-' + d;
};

export const getMonthDayYearString = (date) => {
  if (!date) return;

  let y = date.getFullYear();
  let m = getMonthSimple(date.getMonth());
  let d = String(date.getDate());

  d = padZero(d);

  return m + ' ' + d + ', ' + y;
};
export const getDayMonthYearString = (date) => {
  if (!date) return;

  let y = date.getFullYear();
  let m = getMonthSimple(date.getMonth());
  let d = String(date.getDate());

  d = padZero(d);

  return d + ' ' + m + ', ' + y;
};
