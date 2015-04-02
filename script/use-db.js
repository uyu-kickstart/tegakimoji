var
fs = require('fs');

var
inFile = process.argv[2];

if (inFile === undefined) {
  console.log('now using ' + fs.readFileSync('db/db.js', 'utf-8').split('\n')[0].replace(/^\/\//, ''));
  process.exit(0);
}

var
outFile = 'db/db.js';

var
json = fs.readFileSync(inFile, 'utf-8');

fs.writeFile(outFile, [
  "// " + inFile,
  "(function (global) {",
  "  var",
  "  db = " + json + ";",
  "  if (typeof module !== 'undefined') {",
  "    module.exports = db;",
  "  }",
  "  global.db = db;",
  "})((this || 0).self || global);",
].join('\n'));
