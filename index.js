(function (global) {
  'use strict';

  var
  W = 300, H = 300;

  var
  down = false,
  x = 0, y = 0,
  canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d');

  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  clear();

  canvas.addEventListener('mousedown', function (e) {
    // console.log('mousedown');
    down = true;
    x = e.offsetX; y = e.offsetY;
  });
  canvas.addEventListener('mouseup', function (e) {
    // console.log('mouseup');
    down = false;
  });
  canvas.addEventListener('mousemove', function (e) {
    // console.log('mousemove: x=' + e.offsetX + ' y=' + e.offsetY);
    if (down) {
      line(e.offsetX, e.offsetY);
    }
  });

  document.getElementById('w_up').addEventListener('click', function () {
    ctx.lineWidth = ctx.lineWidth + 1;
    // console.log('lineWidth=' + ctx.lineWidth);
  });
  document.getElementById('w_down').addEventListener('click', function () {
    ctx.lineWidth = Math.max(1, ctx.lineWidth - 1);
    // console.log('lineWidth=' + ctx.lineWidth);
  });

  document.getElementById('clear').addEventListener('click', function () {
    clear();
  });

  document.getElementById('render').addEventListener('click', function () {
    renderText(document.getElementById('text').value);
  });

  document.getElementById('recognize').addEventListener('click', function () {
    [{
      name: 'simple',
      recognize: recognizeSimple,
    }, {
      name: 'circle',
      recognize: recognizeCircle,
    }, {
      name: 'circlez',
      recognize: recognizeCirclez,
    }].forEach(function (data) {
      var
      start = Date.now(),
      candidate = data.recognize(ctx, W, H),
      time = Date.now() - start,
      ul = document.getElementById('candidate-' + data.name), li;

      while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
      }

      li = document.createElement('li');
      li.textContent = 'time = ' + (time / 1000) + 's';
      ul.appendChild(li);

      candidate.forEach(function (c, i) {
        var
        li = document.createElement('li');
        li.textContent = i + ': ' + c.char + '(' + c.score + ')';
        ul.appendChild(li);
      });
    });
  });

  function clear() {
    ctx.clearRect(0, 0, W, H);
  }

  function line(nx, ny) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x = nx, y = ny);
    ctx.stroke();
  }

  function renderText(txt) {
    clear();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '300px "あくあフォント"';
    ctx.fillText(txt, 150, 150, 300);
  }

})((this || 0).self || global);
