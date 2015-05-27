goog.provide('app.main');

goog.require('cssVocabulary');
goog.require('goog.soy');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('app.pathFinder.CssRotateAngleConst');

goog.require('template1');

goog.require('app.pathFinder.SolFinder');

var v,
  lineLength = 7,
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
  ]).join('');

var coordTransformMap = {
  D1ToD2: [],
  D2ToD1: undefined
};


var Matrix = function(h, w, map, hpos) {
  this.realMatrixSize_ = w + Math.floor(h / 2);
  this.hPos_ = [];
  this.m_ = new Array(this.realMatrixSize_);
  coordTransformMap.D2ToD1 = new Array(this.realMatrixSize_);
  for (var i = 0; i < this.realMatrixSize_; i++) {
    this.m_[i] = (new Array(this.realMatrixSize_ + 1)).join('u').split('');
    coordTransformMap.D2ToD1[i] = (new Array(this.realMatrixSize_ + 1)).join('u').split('');
  }
  var mx = 0, my = 0, s = false, rx, ry, curH;
  for (i = 0; i < h * w; i++) {
    if (i > 0 && (i % w) == 0) {
      s = !s;
      if (s) {
        mx++;
      } else {
        my++;
      }
    }
    var state = map[i];
    if (!goog.isDefAndNotNull(state)) {
      state = '0';
    }
    ry = my + w - 1 - (i % w);
    rx = mx + (i % w);
    this.m_[rx][ry] = state;
    coordTransformMap.D1ToD2.push({
      x: rx,
      y: ry
    });
    coordTransformMap.D2ToD1[rx][ry] = i;
    curH = goog.array.find(hpos, function(r) {
      return r.pos == i;
    });
    if (goog.isDefAndNotNull(curH)) {
      this.hPos_.push({
        direction: curH.direction,
        x: rx,
        y: ry
      })
    }
  }
};
Matrix.prototype = {
  toString: function() {
    var r = [];
    goog.array.forEach(this.m_, function(el) {
      r.push(el.join(''));
    });
    return r.join('\n');
  },
  toArray: function() {
    return this.m_;
  },
  getHPos: function(i) {
    return this.hPos_[i];
  }
};



var hPos = [
  {
    x: 2,
    y: 2,
    direction: 7
  }
];

var hip = Math.sqrt(Math.pow(size, 2) + Math.pow(size, 2));
var calcHPos = [];
var selectedH = undefined;

var hPosAsStringPos = [];

for (var i = 0; i < hPos.length; i++) {
  hPosAsStringPos.push({
    pos: hPos[i].x * lineLength + hPos[i].y,
    direction: hPos[i].direction
  });
  calcHPos.push(hPos[i].x * lineLength + hPos[i].y);
}

var myMatrix = new Matrix(rowCound, lineLength, mapAsString, hPosAsStringPos);
//console.log(myMatrix.toString());

v = ([
  '.' + goog.getCssName('map-holder') + '{',
  'width:' + Math.round(hip * (lineLength + 0.5)) + 'px;',
  '} ',
  '.' + goog.getCssName('map-holder') + '>li:nth-child(' + (lineLength * 2) + 'n+' + (lineLength + 1) + '){',
  'margin: -14px 0px 0px 55px;',
//   'background:red;',
  '}',
  ''
]).join('');

var style = document.createElement('style');
style.innerHTML = v;

document.head.appendChild(style);


var arrayOfClasses = [];
for (i = 0; i < lineLength * rowCound; i++) {
  var className = goog.getCssName('a0');

  if (goog.isDefAndNotNull(mapAsString[i])) {
    switch (mapAsString[i]) {
      case '1':
        className = goog.getCssName('a1');
        break;
      case '2':
        className = goog.getCssName('a2');
        break;
      case '3':
        className = goog.getCssName('a3');
        break;
    }
  }

  var currentArrayOfClasses = [className];
  if (calcHPos.indexOf(i) > -1) {
    currentArrayOfClasses.push(goog.getCssName('man'));
    currentArrayOfClasses.push(CssRotateAngleConst[hPos[calcHPos.indexOf(i)].direction]);
  }
  arrayOfClasses.push(
    currentArrayOfClasses.join(' ')
  );

  selectedH = (calcHPos.indexOf(i) > -1 ? calcHPos.indexOf(i) : selectedH);
}
var holder = goog.dom.createDom('ul', goog.getCssName('map-holder'));

goog.dom.appendChild(document.body, holder);

goog.soy.renderElement(holder, template1.main, {arrayOfClasses: arrayOfClasses});

var lis = goog.dom.getElementsByTagNameAndClass('li', undefined, holder);

var tempHPoz = myMatrix.getHPos(0);
var fromPoz = new Poz(tempHPoz.x, tempHPoz.y, tempHPoz.direction);
var calc = new SolFinder(myMatrix.toArray());
calc
  .setFrom(fromPoz);

goog.events.listen(holder, goog.events.EventType.CLICK, function(event) {
  calc.getStopRunDef().addCallback(function() {
    var el = event.target;
    while (el['tagName'].toLowerCase() != 'li') {
      el = goog.dom.getParentElement(el);
    }
    var D1Index = goog.array.findIndex(lis, function(r) {
      return r == el;
    });
    var toPoz = new Poz(coordTransformMap.D1ToD2[D1Index].x, coordTransformMap.D1ToD2[D1Index].y, 3);
    calc
      .setFrom(calc.getTo())
      .setTo(toPoz)
      .findPath();

    if (calc.didGotWay()) {
      calc.runBinarySolution(calc.printSolutionAsCommands().getBetterSolutionAsBinary());
    }
  });
});
