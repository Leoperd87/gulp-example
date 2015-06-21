/**
 * Created by fima on 20.06.15.
 */

goog.provide('app.pathFinder.WallFunction');

goog.require('goog.array');

/**
 * Wall function
 * @constructor
 */
app.pathFinder.WallFunction = function() {
  this.type_ = undefined;
  this.x_ = undefined;
  this.y_ = undefined;
  this.diapasones_ = [];
};

/**
 * Set wall function type
 * @param {string} t
 * @returns {app.pathFinder.WallFunction}
 */
app.pathFinder.WallFunction.prototype.setType = function(t) {
  this.type_ = t;
  return this;
};

/**
 * @param {app.pathFinder.Coord} coord
 * @returns {app.pathFinder.WallFunction}
 */
app.pathFinder.WallFunction.prototype.setXConst = function(coord) {
  this.setType('x');
  this.x_ = coord.x + 0.5;
  return this.addDiapasone(coord.y - 0.5, coord.y + 0.5);
};

/**
 * @param {app.pathFinder.Coord} coord
 * @returns {app.pathFinder.WallFunction}
 */
app.pathFinder.WallFunction.prototype.setYConst = function(coord) {
  this.setType('y');
  this.y_ = coord.y + 0.5;
  return this.addDiapasone(coord.x - 0.5, coord.x + 0.5);
};

/**
 * @returns {string}
 */
app.pathFinder.WallFunction.prototype.getType = function() {
  return this.type_;
};

/**
 * @returns {number}
 */
app.pathFinder.WallFunction.prototype.getXConst = function() {
  return this.x_;
};

/**
 * @returns {number}
 */
app.pathFinder.WallFunction.prototype.getYConst = function() {
  return this.y_;
};

/**
 * @returns {number}
 */
app.pathFinder.WallFunction.prototype.getConst = function() {
  return (this.getType() == 'x' ? this.getXConst() : this.getYConst());
};

/**
 * @param k1
 * @param k2
 * @returns {app.pathFinder.WallFunction}
 */
app.pathFinder.WallFunction.prototype.addDiapasone = function(k1, k2) {
  var minP = Math.min(k1, k2);
  var maxP = Math.max(k1, k2);
  var firstIndex = goog.array.findIndex(this.diapasones_, function(r) {
    return r.min == maxP;
  });
  var secondIndex = goog.array.findIndex(this.diapasones_, function(r) {
    return r.max == minP;
  });
  if (firstIndex > -1) {
    if (secondIndex > -1) {
      this.diapasones_[firstIndex] = {
        min: Math.min(
          this.diapasones_[firstIndex].min,
          this.diapasones_[secondIndex].min,
          minP
        ),
        max: Math.max(
          this.diapasones_[firstIndex].max,
          this.diapasones_[secondIndex].max,
          maxP
        )
      };
      goog.array.removeAt(this.diapasones_, secondIndex);
    } else {
      this.diapasones_[firstIndex].min = minP;
    }
  } else {
    if (secondIndex > -1) {
      this.diapasones_[secondIndex].max = maxP;
    } else {
      this.diapasones_.push({
        min: minP,
        max: maxP
      })
    }
  }
  return this;
};

/**
 * @param {number} c
 * @returns {boolean}
 */
app.pathFinder.WallFunction.prototype.didContain = function(c) {
  return goog.array.findIndex(this.diapasones_, function(r) {
      return ((c <= r.max) && (c >= r.min));
    }) > -1;
};
