const path = require('path');
const glob = require('glob');

exports.getMultiEntry = function (globPath) {
  var entries = {};
  var basename; var tmp; var pathname;

  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-4);

    var pathsrc = tmp[0] + '/' + tmp[1];
    if (tmp[0] === 'src') {
      pathsrc = tmp[1];
    }
    pathname = pathsrc + '/' + basename; // 正确输出js和html的路径
    entries[pathname] = entry;
  });

  return entries;
};
