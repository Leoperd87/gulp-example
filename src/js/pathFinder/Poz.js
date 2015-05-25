/**
 * Created by fima on 24.05.15.
 */


goog.provide('app.pathFinder.Poz');

var Poz = function(x, y, d) {
  this.x = x;
  this.y = y;
  this.d = d;
};
Poz.prototype = {
  clone: function(d) {
    switch (d) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        return new Poz(this.x + moveKeys[d].x, this.y + moveKeys[d].y, this.d);
        break;
      case 'left':
        return new Poz(this.x, this.y, this.calcLeftD());
        break;
      case 'right':
        return new Poz(this.x, this.y, this.calcRightD());
        break;
      default :
        return new Poz(this.x, this.y, this.d);
    }
  },
  calcLeftD: function() {
    var r = this.d - 1;
    if (r == 0) {
      r = 8;
    }
    return r;
  },
  calcRightD: function() {
    var r = this.d + 1;
    if (r == 9) {
      r = 1;
    }
    return r;
  },
  calcRotateTo: function(d) {
    if (this.d == d) {
      return {
        toRight: undefined,
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
  },
  compairByCoord: function(p) {
    return (this.x == p.x) && (this.y == p.y);
  }
};