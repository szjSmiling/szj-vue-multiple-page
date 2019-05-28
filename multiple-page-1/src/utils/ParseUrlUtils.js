export const parseRouter = () => {
  var regex = /flights\/([A-Z]{3})-([A-Z]{3})\/(20\d{2}-\d{2}-\d{2})(-(20\d{2}-\d{2}-\d{2}))?/gi;
  var results = regex.exec(location.href);
  if (results != null) {
    return {
      from: results[1],
      to: results[2],
      departDate: results[3],
      returnDate: results[5]
    };
  }
  return {};
};

export const parseQueryStr = () => {
  const queryStr = location.search.replace(/^\?/, '');
  if (queryStr === '') return {};
  var parameters = queryStr.split(/&/g);
  var result = {};
  for (var i = 0; i < parameters.length; i++) {
    var array = parameters[i].split(/=/);
    var key = decodeURIComponent(array[0]);
    var value = decodeURIComponent(array[1]).replace(/\+/g, '');
    result[key] = value;
  }
  return result;
};
