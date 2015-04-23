var
fs     = require('fs'),
chars  = require('../lib/chars'),
Canvas = require('canvas');

var
p32       = parseFloat(process.argv[2]),
font      = process.argv[3],
file      = process.argv[4],
useSquare = process.argv[5];

if (isNaN(p32)                       ||
    typeof font      === 'undefined' ||
    typeof file      === 'undefined' ||
    typeof useSquare === 'undefined') {
  console.log('[usage]: node script/train-db.js [p32] [font] [file] [useSquare]');
  process.exit(1);
}

useSquare = /^yes$/i.test(useSquare);

var
W = 300, H = 300,
canvas = new Canvas(W, H),
ctx = canvas.getContext('2d');

var
inFile = 'res/' + file + '.txt',
chrs = fs.readFileSync(inFile, 'utf-8').split('\n').filter(Boolean);
console.log('read from ' + inFile);

var
learn = [];

chrs.forEach(function (ch, i) {
  console.log('start => "' + ch + '" (' + i + '/' + chrs.length + ')');
  clear(ctx, W, H);
  renderChar(ctx, ch, W, H);

  var
  data = ctx.getImageData(0, 0, W, H),
  rect = chars[useSquare ? 'charSquare' : 'charRect'](data),
  mesh = chars.charMesh(data, rect, 32, p32);

  learn.push([ch, mesh]);
});

var
json = JSON.stringify(learn),
outFile = 'db/' + [file, p32, font, useSquare].join('_');

fs.writeFileSync(outFile + '.json', json);
console.log('write to ' + outFile + '.json (size: ' + Buffer(json).length + ')');

// キャンバスをクリアする
function clear(ctx, W, H) {
  ctx.clearRect(0, 0, W, H);
}

// 中央に文字を描画する
function renderChar(ctx, ch, W, H) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = W + 'px "' + font + '"';
  ctx.fillText(ch, W / 2, H / 2, W);
}
