(function (global) {
  'use strict';

  var
  chars = typeof global.chars !== 'undefined' ? global.chars : require('../chars.hs'),
  db    = typeof global.db !== 'undefined' ? global.db : require('../../db/db.js');

  function recognize(ctx, W, H) {
    var
    data = ctx.getImageData(0, 0, W, H),
    rect = chars.charRect(data),
    mesh1 = chars.charMesh(data, rect, 4, 0.3),
    candidate = [],
    i, j, k, n, m, z, score,
    mesh2, mesh3, findFlag,
    x, y, maxCircleSize,
    t, b, l, r;

    candidate.push.apply(candidate, db[chars.meshToInt(mesh1)] || []);
    for (i = 0; i < 16; i++) {
      mesh1[i] = +!mesh1[i];
      candidate.push.apply(candidate, db[chars.meshToInt(mesh1)] || []);
      for (j = i+1; j < 16; j++) {
        mesh1[j] = +!mesh1[j];
        candidate.push.apply(candidate, db[chars.meshToInt(mesh1)] || []);
        for (k = j+1; k < 16; k++) {
          mesh1[k] = +!mesh1[k];
          candidate.push.apply(candidate, db[chars.meshToInt(mesh1)] || []);
          for (n = k+1; n < 16; n++) {
            mesh1[n] = +!mesh1[n];
            candidate.push.apply(candidate, db[chars.meshToInt(mesh1)] || []);
            for (m = n+1; m < 16; m++) {
              mesh1[m] = +!mesh1[m];
              candidate.push.apply(candidate, db[chars.meshToInt(mesh1)] || []);
              mesh1[m] = +!mesh1[m];
            }
            mesh1[n] = +!mesh1[n];
          }
          mesh1[k] = +!mesh1[k];
        }
        mesh1[j] = +!mesh1[j];
      }
      mesh1[i] = +!mesh1[i];
    }

    mesh1 = chars.charMesh(data, rect, 32, 0.1);
    for (i = 0; i < candidate.length; i++) {
      score = 0;
      mesh2 = candidate[i][1];
      z = Infinity;
      for (j = 0; j < 32*32; j++) {
        if (mesh1[j] === 1) {
          findFlag = true;
          mesh3 = mesh2;
        } else if (mesh2[j] === 1) {
          findFlag = true;
          mesh3 = mesh1;
        }

        if (findFlag) {
          x = j % 32;
          y = ~~(j / 32);
          maxCircleSize = Math.max(x, y, 32 - x - 1, 32 - y - 1);

          circle:
          for (k = 0; k < maxCircleSize; k++) {
            t = y - k;
            b = y + k;
            l = x - k;
            r = x + k;

            // 上
            if (t >= 0) {
              for (n = l; n <= b; n++) {
                if (0 <= n && n < 32) {
                  if (mesh3[t * 32 + n] === 1) break circle;
                }
              }
            }

            // 下
            if (b < 32) {
              for (n = l; n <= b; n++) {
                if (0 <= n && n < 32) {
                  if (mesh3[b * 32 + n] === 1) break circle;
                }
              }
            }

            // 左
            if (l >= 0) {
              for (n = t; n <= b; n++) {
                if (0 <= n && n < 32) {
                  if (mesh3[n * 32 + l] === 1) break circle;
                }
              }
            }

            // 右
            if (r < 32) {
              for (n = t; n <= b; n++) {
                if (0 <= n && n < 32) {
                  if (mesh3[n * 32 + r] === 1) break circle;
                }
              }
            }
          }

          z = Math.min(z, k);
          score += 1 / Math.pow(2, k - z);
        } else {
          score += 0;
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
  global.recognizeCirclez = recognize;
})((this || 0).self || global);
