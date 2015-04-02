(function (global) {
  'use strict';

  var
  chars = typeof global.chars !== 'undefined' ? global.chars : require('../chars.js'),
  db    = typeof global.db !== 'undefined' ? global.db : require('../../db/db.js');

  db = Object.keys(db).reduce(function (a, key) {
    return a.concat(db[key]);
  }, []);

  function recognize(ctx, W, H) {
    var
    data = ctx.getImageData(0, 0, W, H),
    rect = chars.charRect(data),
    mesh = chars.charMesh(data, rect, 4, 0.3),
    candidate = db.slice(0),
    i, j, k, score;

    /*
    candidate.push.apply(candidate, db[chars.meshToInt(mesh)] || []);
    for (i = 0; i < 16; i++) {
      mesh[i] = +!mesh[i];
      candidate.push.apply(candidate, db[chars.meshToInt(mesh)] || []);
      for (j = i+1; j < 16; j++) {
        mesh[j] = +!mesh[j];
        candidate.push.apply(candidate, db[chars.meshToInt(mesh)] || []);
        for (k = j+1; k < 16; k++) {
          mesh[k] = +!mesh[k];
          candidate.push.apply(candidate, db[chars.meshToInt(mesh)] || []);
          mesh[k] = +!mesh[k];
        }
        mesh[j] = +!mesh[j];
      }
      mesh[i] = +!mesh[i];
    }
    */

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
