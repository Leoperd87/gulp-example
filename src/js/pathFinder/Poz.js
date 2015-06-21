/**
 * Created by fima on 24.05.15.
 */


goog.provide('app.pathFinder.Poz');
goog.require('app.pathFinder.Coord');

/**
 * @param {number} x
 * @param {number} y
 * @param {number} d
 * @constructor
 * @extends {app.pathFinder.Coord}
 */
app.pathFinder.Poz = function(x, y, d) {
  goog.base(this, x, y);
  this.d = d;
};
goog.inherits(app.pathFinder.Poz, app.pathFinder.Coord);

/**
 * @override
 * @param {number|string|undefined} d
 * @returns {app.pathFinder.Poz}
 */
app.pathFinder.Poz.prototype.clone = function(d) {
  switch (d) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      return new app.pathFinder.Poz(this.x + app.pathFinder.MoveConsts[d].x, this.y + app.pathFinder.MoveConsts[d].y, this.d);
      break;
    case 'left':
      return new app.pathFinder.Poz(this.x, this.y, this.calcLeftD());
      break;
    case 'right':
      return new app.pathFinder.Poz(this.x, this.y, this.calcRightD());
      break;
    default :
      return new app.pathFinder.Poz(this.x, this.y, this.d);
  }
};
/**
 * @returns {number}
 */
app.pathFinder.Poz.prototype.calcLeftD = function() {
  var r = this.d - 1;
  if (r == 0) {
    r = 8;
  }
  return r;
};
/**
 * @returns {number}
 */
app.pathFinder.Poz.prototype.calcRightD = function() {
  var r = this.d + 1;
  if (r == 9) {
    r = 1;
  }
  return r;
};
/**
 * @param {number} d
 * @returns { {toRight: boolean, count: number}}
 */
app.pathFinder.Poz.prototype.calcRotateTo = function(d) {
  if (this.d == d) {
    return {
      toRight: true,
      count: 0
    }
  }
  var from = this.d,
    to = d,
    directionsCount = 8,
    diff = from - to;
  if (Math.abs(diff) > directionsCount / 2) {
    var diffSign = diff / Math.abs(diff);
    to += (directionsCount * diffSign);
  }
  var right = Math.abs(to - (from + 8));
  var left = Math.abs(to - (from - 8));
  return {
    toRight: right <= left,
    count: (right <= left ? left : right) % directionsCount
  };
};
/**
 * @param {app.pathFinder.Poz|app.pathFinder.Coord} p
 * @returns {boolean}
 */
app.pathFinder.Poz.prototype.compairByCoord = function(p) {
  return this.compair(p);
};