# -*- coding: iso-8859-1 -*-
'''
Erster Test, der die Kameras vom InMoov an AFRAME
überträgt und rückwärts die Servos steuert.
pip install flask flask-socketio eventlet numpy pyserial
'''
from multiprocessing import Process, Pipe
import numpy as np
import cv2
from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
import serial
import time

mainConnection, workerConnection = Pipe()
def WorkerFunction(connection):
    # Arduino
    serialPort = 'COM4'
    baudRate = 115200
    horiz = 90
    vert = 90
    serialConnection = serial.Serial(serialPort, baudRate, timeout=.1)
    time.sleep(2) # Auf Auto-Reset warten (https://playground.arduino.cc/Main/DisablingAutoResetOnSerialConnection)

    # Kameras
    cap1 = cv2.VideoCapture(0)
    cap2 = cv2.VideoCapture(1)
    frame = False
    quality = 50
    while(True):
        if (connection.poll()):
            message = connection.recv()
            if message['type'] == 'frame':
                connection.send(frame)
            if message['type'] == 'quality':
                quality = int(message['value'])
            if message['type'] == 'move':
                horiz = int(message['horiz'])
                vert = int(message['vert'])
                if horiz < 70:
                    horiz = 70
                if horiz > 110:
                    horiz = 110
                if vert < 30:
                    vert = 30
                if vert > 150:
                    vert = 150
                serialConnection.write(bytearray([8, horiz]))
                serialConnection.write(bytearray([9, vert]))
                continue
        cap1.grab()
        cap2.grab()
        ret1, raw1 = cap1.retrieve()
        ret2, raw2 = cap2.retrieve()

        beside = np.concatenate((raw1, raw2), axis=1)

        cv2.putText(beside, "Quality: %s" % (quality), (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255))

        ret, arr = cv2.imencode('.jpg', beside, [cv2.IMWRITE_JPEG_QUALITY, quality])
        frame = bytes(bytearray(arr))
        cv2.waitKey(1)


app = Flask(__name__)
@app.route('/')
def index():
    return app.send_static_file('inmoov_stereo.html')


socketio = SocketIO(app, binary=True)
@socketio.on('getimage')
def ws_getimage():
    global mainConnection
    mainConnection.send({'type': 'frame'})
    frame = mainConnection.recv()
    emit(u"image", frame)
@socketio.on('setquality')
def ws_setquality(q):
    mainConnection.send({'type': 'quality', 'value':q})
    socketio.emit(u"quality", q)
@socketio.on('move')
def ws_move(requestObject):
    global mainConnection
    mainConnection.send({'type': 'move', 'horiz':requestObject['horiz'], 'vert':requestObject['vert']})

if __name__ == '__main__':
    # Webcam
    workerProcess = Process(target=WorkerFunction, args=(workerConnection, ))
    workerProcess.start()
    # Server
    socketio.run(app, host = '0.0.0.0', port = 80)
