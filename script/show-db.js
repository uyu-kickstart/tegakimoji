var
fs     = require('fs');

var
db = process.argv[2],
ch = process.argv[3];

if (typeof db === 'undefined' ||
    typeof ch === 'undefined') {
  console.log('node script/showdb [db] [ch]');
  process.exit(0);
}

var
json = JSON.parse(fs.readFileSync(db, 'utf-8')),
i;

json = Object.keys(json).reduce(function (a, key) {
  return a.concat(json[key]);
}, []).reduce(function (json, f) {
  json[f[0]] = f[1];
  return json;
}, {});

ch = json[ch];
for (i = 0; i < 32; i++) {
  console.log(ch.slice(i*32, (i + 1) * 32).map(function (x) {
    return '\u001b[' + (x ? '47m' : '40m') + '  ';
  }).join('') + '\u001b[0m');
}
