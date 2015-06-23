goog.provide('app.main');

goog.require('cssVocabulary');
goog.require('goog.soy');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('app.pathFinder.CssRotateAngleConst');

goog.require('app.pathFinder.SolFinder');
goog.require('app.pathFinder.WallFunctionStore');
goog.require('app.pathFinder.CoordTransformMatrix');
goog.require('app.pathFinder.Team');
goog.require('app.pathFinder.UIMap');

var lineLength = 7,
  rowCound = 10,
  size = 50,
  mapAsString = ([
    '0121200',
    '1030200',
    '1010020',
    '2021020',
    '0301010',
    '0002100',
    '0000300'
  ]).join(''),
  hPos = [
    {
      x: 3,
      y: 5,
      direction: 7
    },
    {
      x: 7,
      y: 0,
      direction: 4
    }
  ],
  visibilityAngle = 60, // that mean +-60
  visibilityDistance = -1; // that mean infinity

app.pathFinder.CoordTransformMatrix.getInstance().init(rowCound, lineLength, mapAsString);
app.pathFinder.Team.getInstance().init(hPos);
app.pathFinder.UIMap.getInstance().initMap(size);
app.pathFinder.Team.getInstance().calculateVisibility();
var calc = new app.pathFinder.SolFinder(app.pathFinder.CoordTransformMatrix.getInstance().toArray());

goog.dom.classlist.add(document.body, goog.getCssName('background'));

app.pathFinder.UIMap.getInstance().setClickFunction(function(coord) {
  calc.getStopRunDef().addCallback(function() {
    var memberIndex = app.pathFinder.Team.getInstance().findMemberIndexByPosition(coord);
    if (memberIndex > -1) {
      app.pathFinder.Team.getInstance().setSelected(memberIndex);
      return;
    }

    calc.setFrom(app.pathFinder.Team.getInstance().getSelected());

    var toPoz = new app.pathFinder.Poz(
      coord.x,
      coord.y,
      3
    );
    calc
      .setTo(toPoz)
      .findPath();

    if (calc.didGotWay()) {
      calc.runBinarySolution(calc.printSolutionAsCommands().getBetterSolutionAsBinary());
    }
  });
});
