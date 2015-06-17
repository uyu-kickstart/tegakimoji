var
fs     = require('fs'),
Canvas = require('canvas');

var
font = process.argv[2],
ch = process.argv[3];

if (typeof font === 'undefined' ||
    typeof ch === 'undefined') {
  console.log('node script/char-render [font] [ch]');
  process.exit(0);
}

var
W = 300, H = 300,
canvas = new Canvas(W, H),
ctx = canvas.getContext('2d');

renderChar(ctx, ch, font, W, H);

canvas.pngStream().pipe(fs.createWriteStream(font + '-' + ch + '.png'));

// 中央に文字を描画する
function renderChar(ctx, ch, font, W, H) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = W + 'px "' + font + '"';
  ctx.fillText(ch, W / 2, H / 2, W);
}

