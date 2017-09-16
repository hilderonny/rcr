# NodeJS version

The combination Arduino - Python - OpenCV - Websockts does not feel good.
So here I will try to use only one language and as less software installation as possible.

The main idea is to:
* Use NodeJS on the PC as server for handling connections and motor controlling
* Use WebRTC in a browser to establish video and audio transfers between clients and the robot

Let's see, what the differences to the python approach are.

# Installation on Android phones

Following the tutorial on https://medium.freecodecamp.org/building-a-node-js-application-on-android-part-1-termux-vim-and-node-js-dfa90c28958f one needs to install termux first from the Play Store (Also install hacker's keyboard for better typing in the shell). After that open a termux shell and input the following commands:

* apt update
* apt upgrade
* apt install coreutils nodejs nano mc git
* git clone https://github.com/hilderonny/rcr.git
* cd nodejs
* npm install

Now you need to adopt the ports where the server should listen on. On android you cannot use the ports 80 and 443. So open the app.js file and replace the ports 443 and 80 with e.g. 2443 and 2080. Now you can start the server with

* node app.js

You can switch to a browser and input https://127.0.0.1:2443 to open the webserver's content. The server will continue running in the background, even if termux is not in the foreground.

# Steering arduino

For that the Johnny-Five libraries (http://johnny-five.io/) and the StandardFirmataPlus firmware is used.