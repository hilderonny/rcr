# NodeJS version

The combination Arduino - Python - OpenCV - Websockts does not feel good.
So here I will try to use only one language and as less software installation as possible.

The main idea is to:
* Use NodeJS on the PC as server for handling connections and motor controlling
* Use WebRTC in a browser to establish video and audio transfers between clients and the robot

Let's see, what the differences to the python approach are.

# Installation on Android phones

Following the tutorial on https://medium.freecodecamp.org/building-a-node-js-application-on-android-part-1-termux-vim-and-node-js-dfa90c28958f one needs to install termux first from the Play Store (Also install hacker's keyboard for better typing in the shell). After that open a termux shell and input the following commands (about 2GB of download, can take some minutes to complete):

* apt update
* apt upgrade
* apt install coreutils nodejs nano mc git python2 make g++
* git clone https://github.com/hilderonny/rcr.git
* cd rcr/nodejs
* npm install

Now you need to adopt the ports where the server should listen on. On android you cannot use the ports 80 and 443. So open the app.js file and replace the ports 443 and 80 with e.g. 2443 and 2080. Now you can start the server with

* node app.js

You can switch to a browser and input https://127.0.0.1:2443 to open the webserver's content. The server will continue running in the background, even if termux is not in the foreground.

## UPDATE 2018-06-25

Since the deployment of the application there were many changes in NodeJS and its modules. That means that there can come up several problems with installing the node modules.

As mentioned [here](https://github.com/termux/termux-packages/issues/1855#issuecomment-370667316) there can be a problem with the worker-farm module which is used by npm. To get it running on android, you need to edit a file directly on your android phone:

```sh
nano /data/data/com.termux/files/usr/lib/node_modules/npm/node_modules/worker-farm/lib/farm.js
```

In this file somewhere at line 4 or so, an OS call is used which is not available in android. So change this line to:

```
    , maxConcurrentWorkers      : 8
```

and save it with CTRL+o and quit with CTRL+x. After that npm install should run, but:

It seems that the library ```serialport``` which is uses by the johnny-five library, needs to be compiled at installation time. This requires python (2.7.x), make and g++, so install it (but beware, on my phone this installation needed to download about 1.4GB!) via

```
apt install python2 make g++
```

The bad news are: Even after installing all the packages, npm install fails because serialport cannot be recompiled. At the time of writing this I have no idea, how to fix this problem, sorry. Any ideas?

# Steering arduino

For that the Johnny-Five libraries (http://johnny-five.io/) and the StandardFirmataPlus firmware is used.
