var
fs     = require('fs'),
chars  = require('../lib/chars'),
Canvas = require('canvas');

var
p4      = parseFloat(process.argv[2]),
p32     = parseFloat(process.argv[3]),
font    = process.argv[4],
file  = process.argv[5];

if (isNaN(p4) || isNaN(p32)       ||
    typeof font === 'undefined'   ||
    typeof file === 'undefined') {
  console.log('[usage]: node script/learn.js [p4] [p32] [font] [file]');
  process.exit(0);
}

var
W = 300, H = 300,
canvas = new Canvas(W, H),
ctx = canvas.getContext('2d');

var
inFile = 'db/' + file + '.txt',
chrs = fs.readFileSync(inFile, 'utf-8').split('\n').filter(Boolean);
console.log('read from ' + inFile);

var
learn = {};

chrs.forEach(function (ch, i) {
  console.log('start => "' + ch + '" (' + i + '/' + chrs.length + ')');
  clear(ctx, W, H);
  renderChar(ctx, ch, W, H);

  var
  data   = ctx.getImageData(0, 0, W, H),
  rect   = chars.charRect(data),
  mesh4  = chars.charMesh(data, rect,  4, p4),
  int4   = chars.meshToInt(mesh4),
  mesh32 = chars.charMesh(data, rect, 32, p32);

  learn[int4] = learn[int4] || [];
  learn[int4].push([ch, mesh32]);
});

var
json = JSON.stringify(learn),
outFile = 'db/' + [file, p4, p32, font].join('_');

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
  ctx.font = W + 'px ' + font;
  ctx.fillText(ch, W / 2, H / 2, W);
}
