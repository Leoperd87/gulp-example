var v = '',
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
  '.map-holder{',
  'width:' + Math.round(hip * (lineLength + 0.5)) + 'px;',
  '} ',
  '.map-holder>li:nth-child(' + (lineLength * 2) + 'n+' + (lineLength + 1) + '){',
  'margin: -14px 0px 0px 55px;',
//   'background:red;',
  '}',
  ''
]).join('');

var style = document.createElement('style');
style.innerHTML = v;

document.head.appendChild(style);


var h = '';
for (i = 0; i < lineLength * rowCound; i++) {
  h += ([
    '<li class="a',
    (mapAsString[i] ? mapAsString[i] : '0'),
    (calcHPos.indexOf(i) > -1 ? ' man' : ''),
    '">',
    '<div class="object"></div>',
    '<div class="wall1"></div>',
    '<div class="wall2"></div>',
    '</li>']).join('');
  selectedH = (calcHPos.indexOf(i) > -1 ? calcHPos.indexOf(i) : selectedH);
}
var holder = document.getElementsByClassName('map-holder')[0];
holder.innerHTML = h;
