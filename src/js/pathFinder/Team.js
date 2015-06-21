/**
 * Created by fima on 20.06.15.
 */

goog.provide('app.pathFinder.Team');

goog.require('app.pathFinder.Person');

/**
 * @constructor
 */
app.pathFinder.Team = function() {
  /**
   * @type {Array.<app.pathFinder.Person>}
   * @private
   */
  this.team_ = [];
  this.selectedIndex_ = 0;
};
goog.addSingletonGetter(app.pathFinder.Team);

/**
 * @param {Array.<{x: number, y: number, direction: number}>}hPos
 * @returns {app.pathFinder.Team}
 */
app.pathFinder.Team.prototype.init = function(hPos) {
  goog.array.forEach(hPos, function(r) {
    this.team_.push(new app.pathFinder.Person(r.x, r.y, r.direction));
  }, this);
  return this;
};

/**
 * @param {number} index
 * @returns {app.pathFinder.Person}
 */
app.pathFinder.Team.prototype.getMemberByIndex = function(index) {
  return this.team_[index];
};

/**
 * @param {app.pathFinder.Coord|app.pathFinder.Poz|app.pathFinder.Person|number} c
 * @returns {app.pathFinder.Person|null}
 */
app.pathFinder.Team.prototype.findMemberByPosition = function(c) {
  if (!(c instanceof app.pathFinder.Coord) && !(c instanceof app.pathFinder.Poz) && !(c instanceof app.pathFinder.Person)) {
    c = app.pathFinder.CoordTransformMatrix.getInstance().D1ToD2[c];
  }
  return goog.array.find(this.team_, function(r) {
    return r.compairByCoord(c);
  });
};

app.pathFinder.Team.prototype.getSelected = function() {
  return this.getMemberByIndex(this.selectedIndex_);
};

app.pathFinder.Team.prototype.calculateVisibility = function() {
  goog.array.forEach(this.team_, function(teamMember) {
    teamMember.calculateVisibility();
  });
  app.pathFinder.UIMap.getInstance().pushVisibility();
  return this;
};
