/**
 * Created by fima on 20.06.15.
 */

goog.provide('app.pathFinder.WallFunctionStore');

goog.require('goog.structs.Map');
goog.require('app.pathFinder.WallFunction');
goog.require('app.pathFinder.Coord');

/**
 * @constructor
 */
app.pathFinder.WallFunctionStore = function() {
  this.verticalStore_ = new goog.structs.Map();
  this.horizontalStore_ = new goog.structs.Map();
};
goog.addSingletonGetter(app.pathFinder.WallFunctionStore);

/**
 * @param {app.pathFinder.Coord} c
 * @returns {app.pathFinder.WallFunctionStore}
 */
app.pathFinder.WallFunctionStore.prototype.addVertical = function(c) {
  var record = this.verticalStore_.get(c.x + 0.5);
  if (record) {
    record.addDiapasone(c.y - 0.5, c.y + 0.5);
  } else {
    var newWall = new app.pathFinder.WallFunction();
    newWall.setXConst(c);
    this.verticalStore_.set(newWall.getXConst(), newWall);
  }
  return this;
};

/**
 * @param {app.pathFinder.Coord} c
 * @returns {app.pathFinder.WallFunctionStore}
 */
app.pathFinder.WallFunctionStore.prototype.addHorizontal = function(c) {
  var record = this.horizontalStore_.get(c.y + 0.5);
  if (record) {
    record.addDiapasone(c.x - 0.5, c.x + 0.5);
  } else {
    var newWall = new app.pathFinder.WallFunction();
    newWall.setYConst(c);
    this.horizontalStore_.set(newWall.getYConst(), newWall);
  }
};

app.pathFinder.WallFunctionStore.prototype.checkDidntVertical = function(f, maxX, minX) {
  return goog.array.every(this.verticalStore_.getValues(), function(wall) {
    return (wall.getConst()<maxX && wall.getConst()>minX ? !wall.didContain(f(wall.getConst())) : true);
  });
};

app.pathFinder.WallFunctionStore.prototype.checkDidntHorizontal = function(f, maxY, minY) {
  return goog.array.every(this.horizontalStore_.getValues(), function(wall) {
    return (wall.getConst()<maxY && wall.getConst()>minY ? !wall.didContain(f(wall.getConst())) : true);
  });
};
