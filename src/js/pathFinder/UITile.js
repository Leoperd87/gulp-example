/**
 * Created by fima on 20.06.15.
 */

goog.provide('app.pathFinder.UITile');

goog.require('app.soy.UITile');

/**
 * @param {number} c
 * @extends {goog.ui.Component}
 * @constructor
 */
app.pathFinder.UITile = function(c) {
  goog.base(this);
  this.coord1d_ = c;
  this.coord2d_ = app.pathFinder.CoordTransformMatrix.getInstance().D1ToD2[this.coord1d_];
  this.wallFunctionStore_ = app.pathFinder.WallFunctionStore.getInstance();
  this.currentVisibility_ = false;
  this.newVisibility_ = false;
};
goog.inherits(app.pathFinder.UITile, goog.ui.Component);

/**
 * @param {boolean} state
 */
app.pathFinder.UITile.prototype.setVisibility = function(state) {
  this.newVisibility_ = this.newVisibility_ || state;
};

/**
 * @returns {app.pathFinder.UITile}
 */
app.pathFinder.UITile.prototype.pushVisibility = function() {
  if (this.currentVisibility_ != this.newVisibility_) {
    if (this.newVisibility_) {
      this.addCssClass(goog.getCssName('visible'));
    } else {
      this.removeCssClass(goog.getCssName('visible'));
    }
  }
  this.currentVisibility_ = this.newVisibility_;
  this.newVisibility_ = false;
  return this;
};

/**
 * @param {string} cssClass
 * @returns {app.pathFinder.UITile}
 */
app.pathFinder.UITile.prototype.removeCssClass = function(cssClass) {
  goog.dom.classlist.remove(this.getElement(), cssClass);
  return this;
};

/**
 * @param {string} cssClass
 * @returns {app.pathFinder.UITile}
 */
app.pathFinder.UITile.prototype.addCssClass = function(cssClass) {
  goog.dom.classlist.add(this.getElement(), cssClass);
  return this;
};

/**
 * @returns {app.pathFinder.Coord}
 */
app.pathFinder.UITile.prototype.getD2Coord = function() {
  return this.coord2d_;
};

/**
 * @override
 */
app.pathFinder.UITile.prototype.createDom = function() {
  var tileValue = mapAsString[this.coord1d_];
  var className = goog.getCssName('a0');

  if (goog.isDefAndNotNull(tileValue)) {
    switch (tileValue) {
      case '1':
        className = goog.getCssName('a1');
        this.wallFunctionStore_.addVertical(this.coord2d_);
        break;
      case '2':
        className = goog.getCssName('a2');
        this.wallFunctionStore_.addHorizontal(this.coord2d_);
        break;
      case '3':
        className = goog.getCssName('a3');
        this.wallFunctionStore_.addVertical(this.coord2d_);
        this.wallFunctionStore_.addHorizontal(this.coord2d_);
        break;
    }
  }
  var currentArrayOfClasses = [className];

  var member = app.pathFinder.Team.getInstance().findMemberByPosition(this.coord2d_);
  if (member) {
    currentArrayOfClasses.push(goog.getCssName('man'));
    currentArrayOfClasses.push(app.pathFinder.CssRotateAngleConst[member.d]);
  }

  this.decorateInternal(this.dom_.createDom('li', currentArrayOfClasses.join(' ')));
};

/**
 * @override
 * @param element
 */
app.pathFinder.UITile.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);
  goog.soy.renderElement(this.getElement(), app.soy.UITile.main);
};