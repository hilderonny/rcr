var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var upDownRange = [50, 170];
  var leftRightRange = [50, 130];
  var upDown = new five.Servo({
    pin: 9,
    range: upDownRange,
    center: true
  });
  var leftRight = new five.Servo({
    pin: 8,
    range: leftRightRange,
    center: true
  });

  var joystick = new five.Joystick({
    pins: ["A0", "A1"],
    freq: 100
  });

  joystick.on("change", function() {
    upDown.to(five.Fn.scale(this.y, -1, 1, upDownRange[0], upDownRange[1]));
    leftRight.to(five.Fn.scale(this.x, -1, 1, leftRightRange[0], leftRightRange[1]));
  });

});