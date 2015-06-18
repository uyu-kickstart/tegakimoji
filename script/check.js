'use strict';

var
chars     = require('../lib/chars'),
recognize = require('../lib/algorithm/simple'),
fs        = require('fs'),
path      = require('path'),
Canvas    = require('canvas');

var
W, H = W = 300;

var
test = process.argv[2];

if (typeof test  === 'undefined') {
  console.log('[usage]: node script/check.js [test]');
  process.exit(0);
}

var
meta = require(path.join('..', test, 'meta.json')),
keys = Object.keys(meta),
miss = [];

keys.forEach(function (key) {
  var
  ans = meta[key],
  canvas = new Canvas(W, H),
  buf    = fs.readFileSync(path.join(test, key + '.png')),
  image  = new Canvas.Image,
  ctx, res;

  image.src = buf;
  ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  res = recognize(ctx, W, H)[0].char;

  console.log(key + '.png: ' + res + ' (' + (res === ans ? 'ok' : 'fail[' + ans + ']') + ')');
  if (res === ans) {
    miss.push(key);
  }
});

console.log((miss.length / keys.length) * 100 + '%');
