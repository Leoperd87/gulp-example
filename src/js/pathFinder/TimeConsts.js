/**
 * Created by fima on 24.05.15.
 */

goog.provide('app.pathFinder.TimeConsts');

var rotateTime = /* @echo moveTime *//* @exclude */1/* @endexclude */,
  moveTime = /* @echo rotateTime *//* @exclude */1/* @endexclude */,
  moveDiagonalTime = +Math.sqrt(2*moveTime*moveTime).toFixed(2);
