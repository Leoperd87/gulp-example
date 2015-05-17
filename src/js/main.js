goog.provide('app.main');

goog.require('cssVocabulary');
goog.require('goog.soy');

goog.require('template1');

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
    '0000300',
    '0000000',
    '0000000',
    '0000000'
  ]).join('');

var hPos = [
  {x: 2, y: 2}
];

var hip = Math.sqrt(Math.pow(size, 2) + Math.pow(size, 2));
var calcHPos = [];
var selectedH = undefined;

for (var i = 0; i < hPos.length; i++) {
  calcHPos.push(hPos[i].x * lineLength + hPos[i].y);
}

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

  arrayOfClasses.push(className + (calcHPos.indexOf(i) > -1 ? ' '+goog.getCssName('man') : ''));

  //h += ([
  //    '<li class="',
  //    className,
  //    (calcHPos.indexOf(i) > -1 ? ' '+goog.getCssName('man') : ''),
  //    '">',
  //    '<div class="'+goog.getCssName('object')+'"></div>',
  //    '<div class="'+goog.getCssName('wall1')+'"></div>',
  //    '<div class="'+goog.getCssName('wall2')+'"></div>',
  //    '</li>']).join('');
  selectedH = (calcHPos.indexOf(i) > -1 ? calcHPos.indexOf(i) : selectedH);
}
var holder = goog.dom.createDom('ul', goog.getCssName('map-holder'));

goog.dom.appendChild(document.body, holder);

goog.soy.renderElement(holder, template1.main, {arrayOfClasses: arrayOfClasses});
