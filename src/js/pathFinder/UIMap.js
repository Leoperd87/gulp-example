/**
 * Created by fima on 20.06.15.
 */

goog.provide('app.pathFinder.UIMap');

goog.require('goog.ui.Component');
goog.require('app.pathFinder.UITile');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
app.pathFinder.UIMap = function() {
  goog.base(this);
  this.clickFunction_ = function(){};
  this.D1ElList_ = new Array(lineLength * rowCound);
  this.D2ElList_ = {};
};
goog.inherits(app.pathFinder.UIMap, goog.ui.Component);
goog.addSingletonGetter(app.pathFinder.UIMap);

app.pathFinder.UIMap.prototype.initMap = function(size) {
  var hip = Math.sqrt(Math.pow(size, 2) + Math.pow(size, 2));

  var style = goog.dom.createDom('style', null, ([
    '.' + goog.getCssName('map-holder') + '>li:nth-child(' + (lineLength * 2) + 'n+' + (lineLength + 1) + '){',
    'margin: -14px 0px 0px 55px;',
    '}',
    ''
  ]).join(''));

  goog.dom.appendChild(document.head, style);

  this.render(document.body);
};

app.pathFinder.UIMap.prototype.setClickFunction = function(f, opt_handler) {
  this.clickFunction_ = opt_handler ? goog.bind(f, opt_handler) : f;
};

app.pathFinder.UIMap.prototype.getTileByCoord = function(c) {
  if (typeof c != 'number') {
    return this.D2ElList_[c.x][c.y];
  } else {
    return this.D1ElList_[c];
  }
};

app.pathFinder.UIMap.prototype.createDom = function() {
  this.decorateInternal(this.dom_.createDom('ul', goog.getCssName('map-holder')));
};

app.pathFinder.UIMap.prototype.getTilesCount = function() {
  return this.D1ElList_.length;
};

app.pathFinder.UIMap.prototype.pushVisibility = function() {
  goog.array.forEach(this.D1ElList_, function(el) {
    el.pushVisibility();
  })
};

app.pathFinder.UIMap.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);
  for (var i = 0; i < lineLength * rowCound; i++) {
    var el = new app.pathFinder.UITile(i);
    el.render(this.getElement());
    this.D1ElList_[i] = el;
    var elC = el.getD2Coord();
    if (!goog.isDefAndNotNull(this.D2ElList_[elC.x])) {
      this.D2ElList_[elC.x] = {};
    }
    this.D2ElList_[elC.x][elC.y] = el;
  }
};

app.pathFinder.UIMap.prototype.internalClick_ = function(event) {
  var el = event.target;
  while (el['tagName'].toLowerCase() != 'li') {
    el = goog.dom.getParentElement(el);
  }
  el = goog.array.find(this.D1ElList_, function(r) {
    return r.getElement() == el;
  });
  this.clickFunction_(el.getD2Coord());
};

app.pathFinder.UIMap.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
    this.internalClick_);
};
