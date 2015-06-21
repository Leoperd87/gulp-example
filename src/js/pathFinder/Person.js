/**
 * Created by fima on 20.06.15.
 */

goog.provide('app.pathFinder.Person');

goog.require('app.pathFinder.Poz');

/**
 * @constructor
 * @extends {app.pathFinder.Poz}
 */
app.pathFinder.Person = function(x, y, d) {
  goog.base(this, x, y, d);
  this.m_ = app.pathFinder.UIMap.getInstance();
  this.ws_ = app.pathFinder.WallFunctionStore.getInstance();
};
goog.inherits(app.pathFinder.Person, app.pathFinder.Poz);

app.pathFinder.Person.prototype.findAngle = function(c) {
  var x1 = c.x, y1 = c.y,
    x2 = this.x, y2 = this.y,
    d,
    diffX = (x2 - x1),
    diffY = (y2 - y1);
  if (diffX != 0) {
    alpha = Math.atan(diffY / diffX) / Math.PI * 180;
  } else {
    alpha = 90;
  }
  if (alpha == 0) {
    if (diffX < 0) {
      d = 270;
    } else {
      d = 90;
    }
  } else if (alpha == 90) {
    if (diffY < 0) {
      d = 0;
    } else {
      d = 180;
    }
  } else if (alpha < 0) {
    if (diffX < 0) {
      d = alpha + 90 + 180;
    } else {
      d = alpha + 90 + 0;
    }
  } else if (alpha > 0) {
    if (diffX < 0) {
      d = alpha + 90 + 180;
    } else {
      d = alpha + 90 + 0;
    }
  }
  return d;
};

app.pathFinder.Person.prototype.findDistance = function(c) {
  var dx = this.x - c.x;
  var dy = this.y - c.y;
  return Math.sqrt(dx * dx + dy * dy);
};

app.pathFinder.Person.prototype.checkForWall = function(c) {
  var x1 = this.x, y1 = this.y,
    x2 = c.x, y2 = c.y;

  var result;

  var dx = x2 - x1;
  var dy = y2 - y1;
  var calcF;

  if (dx != 0) {
    var tanX = dy / dx;
    var moveX = x1 * tanX - y1;
    calcF = function(x) {
      return x * tanX - moveX;
    };
  } else {
    calcF = function() {
      return x1;
    };
  }

  result = this.ws_.checkDidntVertical(calcF, Math.max(x1, x2), Math.min(x1, x2));
  if (!result) {
    return result;
  }

  if (dy != 0) {
    var tanY = dx / dy;
    var moveY = y1 * tanY - x1;
    calcF = function(y) {
      return y * tanY - moveY;
    };
  } else {
    calcF = function() {
      return y1;
    };
  }

  result = this.ws_.checkDidntHorizontal(calcF, Math.max(y1, y2), Math.min(y1, y2));
  return result;
};

app.pathFinder.Person.prototype.calculateVisibility = function() {
  var d = (this.d * 45 + 90 + 360) % 360;
  var minAngle1 = d - visibilityAngle,
    maxAngle1 = d + visibilityAngle,
    minAngle2 = d - visibilityAngle + 360,
    maxAngle2 = d + visibilityAngle + 360;
  var isDistanceInfinity = visibilityDistance == -1;
  for (var i = 0; i < this.m_.getTilesCount(); i++) {
    var tile = this.m_.getTileByCoord(i);
    if (
      isDistanceInfinity ||
      (
        (Math.abs(tile.getD2Coord().x - this.x) < visibilityDistance) &&
        (Math.abs(tile.getD2Coord().y - this.y) < visibilityDistance)
      )
    ) {
      if (
        isDistanceInfinity ||
        (this.findDistance(tile.getD2Coord()) < visibilityDistance)
      ) {
        var tileAngle = this.findAngle(tile.getD2Coord());
        if (
          (
            (tileAngle < maxAngle1) &&
            (tileAngle > minAngle1)
          ) ||
          (
            (tileAngle < maxAngle2) &&
            (tileAngle > minAngle2)
          )
        ) {
          if (this.checkForWall(tile.getD2Coord())) {
            tile.setVisibility(true);
          } else {
            tile.setVisibility(false);
          }
        } else {
          tile.setVisibility(false);
        }
      } else {
        tile.setVisibility(false);
      }
    } else {
      tile.setVisibility(false);
    }
  }
};
