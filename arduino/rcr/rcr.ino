/**
 * Forwards servo controls from the serial port to the motors.
 * 1. Connect two servo motors to pin 8 and 9.
 * 2. Open a serial connection to the Arduino with 115200 baud
 * 3. Write two bytes for steering the motors:
 *    First byte: Pin number of motor (8 or 9)
 *    Second byte: Angle to steer (0 to 180)
*/
#include <Servo.h>

Servo servoPin8, servoPin9;
byte pin, degree;

void setup() {
  // Attach motors to pins
  servoPin8.attach(8);
  servoPin9.attach(9);
  // Init serial connection
  Serial.begin(115200);
  // Center servos at 90 degrees
  servoPin8.write(90);
  servoPin9.write(90);
}

void loop() {
  if (Serial.available() > 3) {
    pin = Serial.read(); // First byte with pin number
    degree = Serial.read(); // Second byte with degree
    if (pin == 8) servoPin8.write(degree);
    else if (pin == 9) servoPin9.write(degree);
  }
}

