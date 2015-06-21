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

goog.require('goog.dom.classlist');
goog.require('goog.async.Deferred');
goog.require('goog.Timer');
goog.require('app.pathFinder.CoordTransformMatrix');

app.pathFinder.SolFinder = function(map) {
  this.map_ = map;
  this.runDef_ = new goog.async.Deferred();
  this.runDef_.callback({});
  this.uiMap_ = app.pathFinder.UIMap.getInstance();
  this.t_ = app.pathFinder.Team.getInstance();
};
app.pathFinder.SolFinder.prototype.setFrom = function(p) {
  this.from_ = p;
  return this;
};
app.pathFinder.SolFinder.prototype.setTo = function(p) {
  this.to_ = p;
  return this;
};
app.pathFinder.SolFinder.prototype.convertMapToWalls = function(v) {
  var m = parseInt(v, 10).toString(2).split('').reverse();
  return {
    vertical: m[0] == '1',
    horizontal: m[1] == '1',
    both: m[0] == '1' && m[1] == '1',
    any: m[0] == '1' || m[1] == '1'
  }
};
app.pathFinder.SolFinder.prototype.findPath = function() {
  this.betterWay_ = undefined;

  if (this.to_.compairByCoord(this.from_)) {
    return this;
  }

  this.solutionsPull_ = [(new app.pathFinder.Solution(this.from_))];
  this.moveMap_ = new app.pathFinder.MoveMap(this.map_.length, this.map_[0].length);
  this.moveMap_.set(this.from_, 0);

  var selectedTeamMember = this.t_.getSelectedIndex();
  for (var i = 0; i < this.t_.getMemberCount(); i++) {
    if (i != selectedTeamMember) {
      this.moveMap_.set(this.t_.getMemberByIndex(i), -1, true);
    }
  }

  var currentSol,
    lastMove,
    newMove,
    frontMapState,
    frontLeftMapState,
    frontRightMapState,
    currentMapSate,
    didCan,
    newTimeWithRotate;
  console.time('calc time');
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
    if (
      (this.map_[lastMove.x][lastMove.y] !== 'u') &&
      (this.moveMap_.get(newMove) > -1) &&
      (this.moveMap_.get(newMove) > currentSol.getTime() + moveTime)
    ) {
      currentMapSate = this.convertMapToWalls(this.getLocalMap_(lastMove.x, lastMove.y));
      frontMapState = this.convertMapToWalls(this.getLocalMap_(lastMove.x + app.pathFinder.MoveConsts[lastMove.d].x, lastMove.y + app.pathFinder.MoveConsts[lastMove.d].y));
      frontLeftMapState = this.convertMapToWalls(this.getLocalMap_(lastMove.x + app.pathFinder.MoveConsts[lastMove.calcLeftD()].x, lastMove.y + app.pathFinder.MoveConsts[lastMove.calcLeftD()].y));
      frontRightMapState = this.convertMapToWalls(this.getLocalMap_(lastMove.x + app.pathFinder.MoveConsts[lastMove.calcRightD()].x, lastMove.y + app.pathFinder.MoveConsts[lastMove.calcRightD()].y));
      switch (lastMove.d) {
        case 1:
          didCan = (
            (!frontMapState.any) &&
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
            (!frontLeftMapState.any) &&
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
            (!currentMapSate.any) &&
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
            (!frontRightMapState.any) &&
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
  console.timeEnd('calc time');
  if (!goog.isDefAndNotNull(this.betterWay_)) {
    this.to_ = this.from_.clone();
  }
  return this;
};
app.pathFinder.SolFinder.prototype.getLocalMap_ = function(x, y) {
  var r = 0;
  if (
    goog.isDefAndNotNull(this.map_[x]) &&
    goog.isDefAndNotNull(this.map_[x][y])
  ) {
    r = this.map_[x][y];
  }
  return r;
};
app.pathFinder.SolFinder.prototype.printSolutionAsCommands = function() {
  if (goog.isDefAndNotNull(this.betterWay_)) {
    console.log('Time: ' + this.betterWay_.getTime());
    console.log('Solution: ' + this.betterWay_.getSolutionAsCommands().join(', '));
  } else {
    console.log('can\'t find solution');
  }
  return this;
};
app.pathFinder.SolFinder.prototype.didGotWay = function() {
  return goog.isDefAndNotNull(this.betterWay_);
};
app.pathFinder.SolFinder.prototype.getBetterSolutionAsBinary = function() {
  return this.betterWay_.getSolutionAsBinary();
};
app.pathFinder.SolFinder.prototype.runBinarySolution = function(solAsBin) {
  this.runDef_ = new goog.async.Deferred();
  this.uiMap_.getTileByCoord(this.from_).removeCssClass(app.pathFinder.CssRotateAngleConst[this.from_.d]);
  this.vizualizationIteration_(solAsBin);
};
app.pathFinder.SolFinder.prototype.vizualizationIteration_ = function(sol) {
  var step = sol.shift();
  var el = this.uiMap_.getTileByCoord(step)
    .addCssClass(goog.getCssName('man'))
    .addCssClass(step.transform);
  goog.Timer.callOnce(function() {
    el
      .removeCssClass(goog.getCssName('man'))
      .removeCssClass(step.transform);
    if (sol.length) {
      this.vizualizationIteration_(sol);
    } else {
      this.to_.d = step.d;
      this.uiMap_.getTileByCoord(this.to_)
        .addCssClass(goog.getCssName('man'))
        .addCssClass(app.pathFinder.CssRotateAngleConst[step.d]);
      this.runDef_.callback({});
    }
    var teamMember = app.pathFinder.Team.getInstance().getSelected();
    teamMember.x = step.rx;
    teamMember.y = step.ry;
    teamMember.d = step.d;
    app.pathFinder.Team.getInstance().calculateVisibility();
  }, step.opTime * 1000, this);
};
app.pathFinder.SolFinder.prototype.getStopRunDef = function() {
  return this.runDef_;
};
app.pathFinder.SolFinder.prototype.getTo = function() {
  return (goog.isDefAndNotNull(this.to_) ? this.to_ : this.from_).clone();
};