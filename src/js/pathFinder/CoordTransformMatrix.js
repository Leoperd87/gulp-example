/**
 * Created by fima on 20.06.15.
 */

goog.provide('app.pathFinder.CoordTransformMatrix');

/**
 * @constructor
 */
app.pathFinder.CoordTransformMatrix = function() {
  this.D1ToD2= [];
  this.D2ToD1= undefined;
};
goog.addSingletonGetter(app.pathFinder.CoordTransformMatrix);

app.pathFinder.CoordTransformMatrix.prototype.init = function(h, w, map) {
  this.realMatrixSize_ = w + Math.floor(h / 2);
  this.m_ = new Array(this.realMatrixSize_);
  this.D2ToD1 = new Array(this.realMatrixSize_);
  for (var i = 0; i < this.realMatrixSize_; i++) {
    this.m_[i] = (new Array(this.realMatrixSize_ + 1)).join('u').split('');
    this.D2ToD1[i] = (new Array(this.realMatrixSize_ + 1)).join('u').split('');
  }
  var mx = 0, my = 0, s = false, rx, ry;
  for (i = 0; i < h * w; i++) {
    if (i > 0 && (i % w) == 0) {
      s = !s;
      if (s) {
        mx++;
      } else {
        my++;
      }
    }
    var state = map[i];
    if (!goog.isDefAndNotNull(state)) {
      state = '0';
    }
    ry = my + w - 1 - (i % w);
    rx = mx + (i % w);
    this.m_[rx][ry] = state;
    this.D1ToD2.push(new app.pathFinder.Coord(rx, ry));
    this.D2ToD1[rx][ry] = i;
  }
};

app.pathFinder.CoordTransformMatrix.prototype.toArray = function() {
  return this.m_;
};
