/**
 * Created by fima on 24.05.15.
 */


goog.provide('app.pathFinder.SolFinder');

goog.require('app.pathFinder.MoveConsts');
goog.require('app.pathFinder.MoveMap');
goog.require('app.pathFinder.Poz');
goog.require('app.pathFinder.Solution');
goog.require('app.pathFinder.TimeConsts');
goog.require('app.pathFinder.TransformVocabulary');

var SolFinder = function(map) {
  this.map_ = map;
};
SolFinder.prototype = {
  setFrom: function(p) {
    this.from_ = p;
    return this;
  },
  setTo: function(p) {
    this.to_ = p;
    return this;
  },
  convertMapToWalls: function(v) {
    var m = parseInt(v, 10).toString(2).split('').reverse();
    return {
      vertical: m[0] == '1',
      horizontal: m[1] == '1',
      both: m[0] == '1' && m[1] == '1'
    }
  },
  findPath: function() {
    this.solutionsPull_ = [(new Solution(this.from_))];
    this.moveMap_ = new MoveMap(this.map_.length, this.map_[0].length);
    this.moveMap_.set(this.from_, 0);
    this.betterWay_ = undefined;

    var currentSol,
      lastMove,
      newMove,
      frontMapState,
      frontLeftMapState,
      frontRightMapState,
      currentMapSate,
      didCan,
      newTimeWithRotate;
    while (this.solutionsPull_.length) {
      currentSol = this.solutionsPull_.shift();
      lastMove = currentSol.getLast();
      newTimeWithRotate = currentSol.getTime() + rotateTime;

      // if first solution finded
      if (
        !goog.isDefAndNotNull(this.betterWay_) &&
        lastMove.compairByCoord(this.to_)
      ) {
        this.betterWay_ = currentSol;
        continue;
      }
      // if better way finded
      if (
        goog.isDefAndNotNull(this.betterWay_) &&
        lastMove.compairByCoord(this.to_) &&
        this.betterWay_.getTime() > currentSol.getTime()
      ) {
        this.betterWay_ = currentSol;
        continue;
      }
      // if solution finded and current solution longest
      if (
        goog.isDefAndNotNull(this.betterWay_) &&
        this.betterWay_.getTime() < currentSol.getTime()
      ) {
        continue;
      }

      newTimeWithRotate = currentSol.getTime() + rotateTime;
      // to left
      newMove = lastMove.clone('left');
      if (this.moveMap_.get(newMove) > newTimeWithRotate) {
        this.solutionsPull_.push((currentSol.clone(newMove, rotateTime)));
        this.moveMap_.set(newMove, newTimeWithRotate)
      }
      // to right
      newMove = lastMove.clone('right');
      if (this.moveMap_.get(newMove) > newTimeWithRotate) {
        this.solutionsPull_.push((currentSol.clone(newMove, rotateTime)));
        this.moveMap_.set(newMove, newTimeWithRotate)
      }
      // to front
      newMove = lastMove.clone(lastMove.d);
      if (this.map_[lastMove.x][lastMove.y] !== 'u' && this.moveMap_.get(newMove) > currentSol.getTime() + moveTime) {
        currentMapSate = this.convertMapToWalls(this.map_[lastMove.x][lastMove.y]);
        frontMapState = this.convertMapToWalls(this.map_[lastMove.x + moveKeys[lastMove.d].x][lastMove.y + moveKeys[lastMove.d].y]);
        frontLeftMapState = this.convertMapToWalls(this.map_[lastMove.x + moveKeys[lastMove.calcLeftD()].x][lastMove.y + moveKeys[lastMove.calcLeftD()].y]);
        frontRightMapState = this.convertMapToWalls(this.map_[lastMove.x + moveKeys[lastMove.calcRightD()].x][lastMove.y + moveKeys[lastMove.calcRightD()].y]);
        switch (lastMove.d) {
          case 1:
            didCan = (
            (!frontMapState.both) &&
            (!frontLeftMapState.vertical) &&
            (!frontRightMapState.horizontal)
            );
            break;
          case 2:
            didCan = (
              (!frontMapState.horizontal)
            );
            break;
          case 3:
            didCan = (
            (!frontMapState.horizontal) &&
            (!frontLeftMapState.both) &&
            (!currentMapSate.vertical)
            );
            break;
          case 4:
            didCan = (
              (!currentMapSate.vertical)
            );
            break;
          case 5:
            didCan = (
            (!currentMapSate.both) &&
            (!frontLeftMapState.horizontal) &&
            (!frontRightMapState.vertical)
            );
            break;
          case 6:
            didCan = (
              (!currentMapSate.horizontal)
            );
            break;
          case 7:
            didCan = (
            (!frontRightMapState.both) &&
            (!frontMapState.vertical) &&
            (!currentMapSate.horizontal)
            );
            break;
          case 8:
            didCan = (
              (!frontMapState.vertical)
            );
            break;
        }
        if (didCan) {
          this.solutionsPull_.push((currentSol.clone(newMove, moveTime)));
          this.moveMap_.set(newMove, currentSol.getTime() + moveTime)
        }
      }
    }
    return this;
  },
  printSolutionAsCommands: function() {
    if (goog.isDefAndNotNull(this.betterWay_)) {
      console.log('Time: ' + this.betterWay_.getTime());
      console.log('Solution: ' + this.betterWay_.getSolutionAsCommands().join(', '));
    } else {
      console.log('can\'t find solution');
    }
    return this;
  },
  didGotWay: function() {
    return goog.isDefAndNotNull(this.betterWay_);
  },
  getBetterSolutionAsBinary: function() {
    return this.betterWay_.getSolutionAsBinary();
  },
  transformSolutionBinaryToKeyFrame: function(solAsBin) {
    var r = '';

    goog.array.forEach(solAsBin, function(record) {
      switch (record.transform) {
        case TransformVocabulary.to1:
          break;
        case TransformVocabulary.to2:
          break;
        case TransformVocabulary.to3:
          break;
        case TransformVocabulary.to4:
          break;
        case TransformVocabulary.to5:
          break;
        case TransformVocabulary.to6:
          break;
        case TransformVocabulary.to7:
          break;
        case TransformVocabulary.to8:
          break;
        case TransformVocabulary.toLeft:
          break;
        case TransformVocabulary.fromLeft:
          break;
        case TransformVocabulary.toLeftTop:
          break;
        case TransformVocabulary.fromLeftTop:
          break;
        case TransformVocabulary.toTop:
          break;
        case TransformVocabulary.fromTop:
          break;
        case TransformVocabulary.toRightTop:
          break;
        case TransformVocabulary.fromRightTop:
          break;
      }
    }, this);


    return r;
  }
};