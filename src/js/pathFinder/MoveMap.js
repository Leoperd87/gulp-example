/**
 * Created by fima on 24.05.15.
 */

goog.provide('app.pathFinder.MoveMap');

/**
 * @param {number} x Horizontal size
 * @param {number} y Vertical size
 * @constructor
 */
app.pathFinder.MoveMap = function(x, y) {
  this.map_ = new Array(x);
  for (var i = 0; i < x; i++) {
    this.map_[i] = new Array(y);
  }
};
/**
 * @param {app.pathFinder.Poz} p
 * @param {number} v
 * @returns {app.pathFinder.MoveMap}
 */
app.pathFinder.MoveMap.prototype.set = function(p, v) {
  if (!goog.isDefAndNotNull(this.map_[p.x][p.y])) {
    this.map_[p.x][p.y] = {};
  }
  this.map_[p.x][p.y][p.d] = v;
  return this;
};
/**
 * @param {app.pathFinder.Poz} p
 * @returns {number}
 */
app.pathFinder.MoveMap.prototype.get = function(p) {
  if (
    (p.x == -1) ||
    (p.x == this.map_.length) ||
    (p.y == -1) ||
    (p.y == this.map_[0].length)
  ) {
    return 0;
  }
  return (
    goog.isDefAndNotNull(this.map_[p.x][p.y]) &&
    goog.isDefAndNotNull(this.map_[p.x][p.y][p.d]) ?
      this.map_[p.x][p.y][p.d] :
      Number['MAX_SAFE_INTEGER']);
};
