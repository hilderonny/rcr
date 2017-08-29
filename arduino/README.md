# Arduino part

The Arduino part receives serial commands and steers the servo motors.

For this two bytes are sent to the arduino:
- The first byte contains the pin number of the motor to steer
- The second byte contains the angle to set for the motor

## Setup

1. Upload the file "rcr.ino" with Arduino studio to your Arduino Uno
1. Attach two servos to the pins 8 and 9
1. Use the scripts from the [python](../python) directory to control the servos