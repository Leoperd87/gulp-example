/**
 * Created by fima on 24.05.15.
 */

goog.provide('app.pathFinder.MoveMap');

var MoveMap = function(x, y) {
  this.map_ = new Array(x);
  for (var i = 0; i < x; i++) {
    this.map_[i] = new Array(y);
  }
};
MoveMap.prototype = {
  set: function(p, v) {
    if (!goog.isDefAndNotNull(this.map_[p.x][p.y])) {
      this.map_[p.x][p.y] = {};
    }
    this.map_[p.x][p.y][p.d] = v;
    return this;
  },
  get: function(p) {
    return (
      goog.isDefAndNotNull(this.map_[p.x][p.y]) &&
      goog.isDefAndNotNull(this.map_[p.x][p.y][p.d]) ?
        this.map_[p.x][p.y][p.d] :
        Number.MAX_SAFE_INTEGER);
  }
};