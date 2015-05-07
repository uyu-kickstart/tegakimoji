(function (global) {
  'use strict';

  var
  chars = typeof global.chars !== 'undefined' ? global.chars : require('../chars.js'),
  db    = typeof global.db !== 'undefined' ? global.db : require('../../db/db.js');

  function recognize(ctx, W, H) {
    var
    data = ctx.getImageData(0, 0, W, H),
    rect = chars.charSquare(data),
    mesh = chars.charMesh(data, rect, 4, 0.3),
    candidate = db.slice(0),
    i, j, k, score;

    mesh = chars.charMesh(data, rect, 32, 0.1);
    for (i = 0; i < candidate.length; i++) {
      score = 0;
      for (j = 0; j < 32*32; j++) {
        if (mesh[j] === candidate[i][1][j]) {
          score += 1;
        }
      }
      candidate[i] = {
        char: candidate[i][0],
        score: score / (32*32),
      };
    }

    return candidate.sort(function (a, b) {
      return b.score - a.score;
    });
  }

  // 公開
  if (typeof module !== 'undefined') {
    module.exports = recognize;
  }
  global.recognize = recognize;
  global.recognizeSimple = recognize;
})((this || 0).self || global);
