define(function () {
  'use strict';

  return {

    /**
     * Parses a date string in the format `yyyy-MM-dd` as being used by `<input type="date">`
     * consistently across different hosts (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
     */
    parseDate: function (input) {
      // backwards compatibility: strip time info from format being used earlier
      input = input.substring(0, 10);

      var params = input.split('-').map(function (x) {
        return parseInt(x, 10);
      });
      return new Date(params[0], params[1] - 1, params[2]);
    }

  };

});
