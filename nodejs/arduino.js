var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var servo = new five.Servo({
    pin: 9,
    range: [50, 170] // Check the endstops!
  });
  servo.sweep();
});