
/**
 * Parses a date string in the format `yyyy-MM-dd` as being used by `<input type="date">`
 * consistently across different hosts (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
 */
export function parseDate (input: string) {
  // backwards compatibility: strip time info from format being used earlier
  input = input.substring(0, 10);

  var params = input.split("-").map(function (x) {
    return parseInt(x, 10);
  });
  return new Date(params[0], params[1] - 1, params[2]);
}

/**
 * Formats a date to the format `yyyy-MM-dd` as being used by `<input type="date">`
 */
export function formatDate (date: Date) {
  var month: number | string = date.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  var day: string | number = date.getDate();
  day = day < 10 ? "0" + day : day;
  return "" + date.getFullYear() + "-" + month + "-" + day;
}

export function formatHumanDate (date: Date | string) {
  if (typeof date === "string") {
    date = parseDate(date);
  }

  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  return date.toLocaleDateString();
}

export function addDays (date: Date, days: number) {
  var ms = date.getTime();
  var daysInMs = days * 1000 * 60 * 60 * 24;
  return new Date(ms + daysInMs);
}

export function isSameDay (date1: Date, date2: Date) {
  return formatDate(date1) === formatDate(date2);
}

export function isToday (date: Date | string) {
  if (typeof date === "string") {
    date = parseDate(date);
  }

  var today = new Date();
  return isSameDay(today, date);
}

export function isYesterday (date: Date | string) {
  if (typeof date === "string") {
    date = parseDate(date);
  }

  var yesterday = addDays(new Date(), -1);
  return isSameDay(yesterday, date);
}
