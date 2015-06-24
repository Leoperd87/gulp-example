/**
 * Created by fima on 24.05.15.
 */


goog.provide('app.pathFinder.Solution');

goog.require('app.pathFinder.MoveConsts');
goog.require('app.pathFinder.TimeConsts');
goog.require('app.pathFinder.TransformVocabulary');

/**
 * @param {app.pathFinder.Poz=} p
 * @param {number=} t
 * @constructor
 */
app.pathFinder.Solution = function(p, t) {
  this.pull_ = [];
  if (goog.isDefAndNotNull(p)) {
    this.pull_.push(p)
  }
  this.time_ = 0;
  if (goog.isDefAndNotNull(t)) {
    this.time_ = t;
  }
};

/**
 * @returns {app.pathFinder.Poz|undefined}
 */
app.pathFinder.Solution.prototype.getLast = function() {
  return this.pull_[this.pull_.length - 1];
};

/**
 * @returns {app.pathFinder.Poz|undefined}
 */
app.pathFinder.Solution.prototype.getFirst = function() {
  return this.pull_[0];
};

/**
 * @returns {Array.<string>}
 */
app.pathFinder.Solution.prototype.getSolutionAsCommands = function() {
  var prev = this.pull_[0];
  var r = [];
  for (var i = 1; i < this.pull_.length; i++) {
    if (prev.d == this.pull_[i].d) {
      r.push('front');
    } else {
      if (prev.calcLeftD() == this.pull_[i].d) {
        r.push('left');
      } else {
        r.push('right');
      }
    }
    prev = this.pull_[i];
  }
  return r;
};

/**
 * @returns {number}
 */
app.pathFinder.Solution.prototype.getTime = function() {
  return this.time_;
};

/**
 * @param {app.pathFinder.Poz} p
 * @param {number} t
 * @returns {app.pathFinder.Solution}
 */
app.pathFinder.Solution.prototype.add = function(p, t) {
  this.pull_.push(p);
  this.time_ += (goog.isDefAndNotNull(t) ? t : 0);
  return this;
};

/**
 * @param {app.pathFinder.Poz} p
 * @param {number} t
 * @returns {app.pathFinder.Solution}
 */
app.pathFinder.Solution.prototype.clone = function(p, t) {
  var r = new app.pathFinder.Solution(undefined, this.time_ + (goog.isDefAndNotNull(t) ? t : 0));
  for (var i = 0; i < this.pull_.length; i++) {
    r.add(this.pull_[i].clone());
  }
  if (goog.isDefAndNotNull(p)) {
    r.add(p)
  }
  return r;
};

/**
 * @returns {Array.<{x:number, y:number, d:number, opTime:number, timeAsPercent:number, transform:string}>}
 */
app.pathFinder.Solution.prototype.getSolutionAsBinary = function() {
  var prev = this.pull_[0];
  var r = [];
  var t;
  var currenTime = 0;
  var fullTime = this.getTime();
  for (var i = 1; i < this.pull_.length; i++) {
    if (prev.d == this.pull_[i].d) {
      currenTime += (prev.d % 2 == 1 ? moveDiagonalTime : moveTime);
      t = {
        timeAsPercent: currenTime / fullTime * 100,
        opTime: (prev.d % 2 == 1 ? moveDiagonalTime : moveTime),
        d: this.pull_[i].d,
        rx: this.pull_[i].x,
        ry: this.pull_[i].y
      };
      switch (this.pull_[i].d) {
        case 1:
          t.x = prev.x;
          t.y = prev.y;
          t.transform = app.pathFinder.TransformVocabulary.toTop;
          break;
        case 2:
          t.x = prev.x;
          t.y = prev.y;
          t.transform = app.pathFinder.TransformVocabulary.toRightTop;
          break;
        case 3:
          t.x = this.pull_[i].x;
          t.y = this.pull_[i].y;
          t.transform = app.pathFinder.TransformVocabulary.fromLeft;
          break;
        case 4:
          t.x = this.pull_[i].x;
          t.y = this.pull_[i].y;
          t.transform = app.pathFinder.TransformVocabulary.fromLeftTop;
          break;
        case 5:
          t.x = this.pull_[i].x;
          t.y = this.pull_[i].y;
          t.transform = app.pathFinder.TransformVocabulary.fromTop;
          break;
        case 6:
          t.x = this.pull_[i].x;
          t.y = this.pull_[i].y;
          t.transform = app.pathFinder.TransformVocabulary.fromRightTop;
          break;
        case 7:
          t.x = prev.x;
          t.y = prev.y;
          t.transform = app.pathFinder.TransformVocabulary.toLeft;
          break;
        case 8:
          t.x = prev.x;
          t.y = prev.y;
          t.transform = app.pathFinder.TransformVocabulary.toLeftTop;
          break;
      }
    } else {
      currenTime += rotateTime;
      t = {
        x: this.pull_[i].x,
        y: this.pull_[i].y,
        timeAsPercent: currenTime / fullTime * 100,
        opTime: rotateTime,
        d: this.pull_[i].d,
        rx: this.pull_[i].x,
        ry: this.pull_[i].y
      };
      switch (this.pull_[i].d) {
        case 1:
          t.transform =
            (prev.calcRightD().d == this.pull_[i].d ? app.pathFinder.TransformVocabulary.r81 : app.pathFinder.TransformVocabulary.r21);
          break;
        case 2:
          t.transform =
            (prev.calcRightD().d == this.pull_[i].d ? app.pathFinder.TransformVocabulary.r12 : app.pathFinder.TransformVocabulary.r32);
          break;
        case 3:
          t.transform =
            (prev.calcRightD().d == this.pull_[i].d ? app.pathFinder.TransformVocabulary.r23 : app.pathFinder.TransformVocabulary.r43);
          break;
        case 4:
          t.transform =
            (prev.calcRightD().d == this.pull_[i].d ? app.pathFinder.TransformVocabulary.r34 : app.pathFinder.TransformVocabulary.r54);
          break;
        case 5:
          t.transform =
            (prev.calcRightD().d == this.pull_[i].d ? app.pathFinder.TransformVocabulary.r45 : app.pathFinder.TransformVocabulary.r65);
          break;
        case 6:
          t.transform =
            (prev.calcRightD().d == this.pull_[i].d ? app.pathFinder.TransformVocabulary.r56 : app.pathFinder.TransformVocabulary.r76);
          break;
        case 7:
          t.transform =
            (prev.calcRightD().d == this.pull_[i].d ? app.pathFinder.TransformVocabulary.r67 : app.pathFinder.TransformVocabulary.r87);
          break;
        case 8:
          t.transform =
            (prev.calcRightD().d == this.pull_[i].d ? app.pathFinder.TransformVocabulary.r78 : app.pathFinder.TransformVocabulary.r18);
          break;
      }
    }
    r.push(t);
    prev = this.pull_[i];
  }
  return r;
};