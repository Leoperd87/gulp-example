/**
 * Created by fima on 24.05.15.
 */


goog.provide('app.pathFinder.Solution');

goog.require('app.pathFinder.MoveConsts');
goog.require('app.pathFinder.TimeConsts');
goog.require('app.pathFinder.TransformVocabulary');

var Solution = function(p, t) {
  this.pull_ = [];
  if (goog.isDefAndNotNull(p)) {
    this.pull_.push(p)
  }
  this.time_ = 0;
  if (goog.isDefAndNotNull(t)) {
    this.time_ = t;
  }
};
Solution.prototype = {
  getLast: function() {
    return this.pull_[this.pull_.length - 1];
  },
  getFirst: function() {
    return this.pull_[0];
  },
  getSolutionAsCommands: function() {
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
  },
  getTime: function() {
    return this.time_;
  },
  add: function(p, t) {
    this.pull_.push(p);
    this.time_ += (goog.isDefAndNotNull(t) ? t : 0);
    return this;
  },
  clone: function(p, t) {
    var r = new Solution(undefined, this.time_ + (goog.isDefAndNotNull(t) ? t : 0));
    for (var i = 0; i < this.pull_.length; i++) {
      r.add(this.pull_[i].clone());
    }
    if (goog.isDefAndNotNull(p)) {
      r.add(p)
    }
    return r;
  },
  getSolutionAsBinary: function() {
    var prev = this.pull_[0];
    var r = [];
    var t;
    var currenTime = 0;
    var fullTime = this.getTime();
    for (var i = 1; i < this.pull_.length; i++) {
      if (prev.d == this.pull_[i].d) {
        currenTime += moveTime;
        t = {
          timeAsPercent: currenTime/fullTime*100,
          opTime: moveTime,
          d: this.pull_[i].d
        };
        switch(this.pull_[i].d) {
          case 1:
            t.x = prev.x;
            t.y = prev.y;
            t.transform = TransformVocabulary.toTop;
            break;
          case 2:
            t.x = prev.x;
            t.y = prev.y;
            t.transform = TransformVocabulary.toRightTop;
            break;
          case 3:
            t.x = this.pull_[i].x;
            t.y = this.pull_[i].y;
            t.transform = TransformVocabulary.fromLeft;
            break;
          case 4:
            t.x = this.pull_[i].x;
            t.y = this.pull_[i].y;
            t.transform = TransformVocabulary.fromLeftTop;
            break;
          case 5:
            t.x = this.pull_[i].x;
            t.y = this.pull_[i].y;
            t.transform = TransformVocabulary.fromTop;
            break;
          case 6:
            t.x = this.pull_[i].x;
            t.y = this.pull_[i].y;
            t.transform = TransformVocabulary.fromRightTop;
            break;
          case 7:
            t.x = prev.x;
            t.y = prev.y;
            t.transform = TransformVocabulary.toLeft;
            break;
          case 8:
            t.x = prev.x;
            t.y = prev.y;
            t.transform = TransformVocabulary.toLeftTop;
            break;
        }
      } else {
        currenTime += rotateTime;
        t = {
          x: this.pull_[i].x,
          y: this.pull_[i].y,
          timeAsPercent: currenTime/fullTime*100,
          opTime: rotateTime,
          d: this.pull_[i].d
        };
        switch(this.pull_[i].d) {
          case 1:
            t.transform =
              (prev.calcRightD().d == this.pull_[i].d ? TransformVocabulary.r81 : TransformVocabulary.r21);
            break;
          case 2:
            t.transform =
              (prev.calcRightD().d == this.pull_[i].d ? TransformVocabulary.r12 : TransformVocabulary.r32);
            break;
          case 3:
            t.transform =
              (prev.calcRightD().d == this.pull_[i].d ? TransformVocabulary.r23 : TransformVocabulary.r43);
            break;
          case 4:
            t.transform =
              (prev.calcRightD().d == this.pull_[i].d ? TransformVocabulary.r34 : TransformVocabulary.r54);
            break;
          case 5:
            t.transform =
              (prev.calcRightD().d == this.pull_[i].d ? TransformVocabulary.r45 : TransformVocabulary.r65);
            break;
          case 6:
            t.transform =
              (prev.calcRightD().d == this.pull_[i].d ? TransformVocabulary.r56 : TransformVocabulary.r76);
            break;
          case 7:
            t.transform =
              (prev.calcRightD().d == this.pull_[i].d ? TransformVocabulary.r67 : TransformVocabulary.r87);
            break;
          case 8:
            t.transform =
              (prev.calcRightD().d == this.pull_[i].d ? TransformVocabulary.r78 : TransformVocabulary.r18);
            break;
        }
      }
      r.push(t);
      prev = this.pull_[i];
    }
    return r;
  }
};