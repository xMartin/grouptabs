export default {
  /**
   * Parses a date string in the format `yyyy-MM-dd` as being used by `<input type="date">`
   * consistently across different hosts (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
   */
  parseDate: function (input: string) {
    // backwards compatibility: strip time info from format being used earlier
    input = input.substring(0, 10);

    var params = input.split("-").map(function (x) {
      return parseInt(x, 10);
    });
    return new Date(params[0], params[1] - 1, params[2]);
  },

  /**
   * Formats a date to the format `yyyy-MM-dd` as being used by `<input type="date">`
   */
  formatDate: function (date: Date) {
    var month: number | string = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    var day: string | number = date.getDate();
    day = day < 10 ? "0" + day : day;
    return "" + date.getFullYear() + "-" + month + "-" + day;
  },

  formatHumanDate: function (date: Date | string) {
    if (typeof date === "string") {
      date = this.parseDate(date);
    }

    if (this.isToday(date)) {
      return "Today";
    }

    if (this.isYesterday(date)) {
      return "Yesterday";
    }

    return date.toLocaleDateString();
  },

  addDays: function (date: Date, days: number) {
    var ms = date.getTime();
    var daysInMs = days * 1000 * 60 * 60 * 24;
    return new Date(ms + daysInMs);
  },

  isSameDay: function (date1: Date, date2: Date) {
    return this.formatDate(date1) === this.formatDate(date2);
  },

  isToday: function (date: Date | string) {
    if (typeof date === "string") {
      date = this.parseDate(date);
    }

    var today = new Date();
    return this.isSameDay(today, date);
  },

  isYesterday: function (date: Date | string) {
    if (typeof date === "string") {
      date = this.parseDate(date);
    }

    var yesterday = this.addDays(new Date(), -1);
    return this.isSameDay(yesterday, date);
  },
};
