/**
 * Created by fima on 20.06.15.
 */

goog.provide('app.pathFinder.Coord');

/**
 * Coodinate
 * @param {number} x
 * @param {number} y
 * @constructor
 */
app.pathFinder.Coord = function(x,y) {
  this.x = x;
  this.y = y;
};

/**
 * Clone coordinate
 * @return {app.pathFinder.Coord}
 */
app.pathFinder.Coord.prototype.clone = function() {
  return new Coord(this.x, this.y);
};

/**
 * Compair coordinate
 * @param {app.pathFinder.Coord} c
 * @returns {boolean}
 */
app.pathFinder.Coord.prototype.compair = function(c) {
  return ((c.x == this.x) && (c.y == this.y));
};