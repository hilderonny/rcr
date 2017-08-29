# Installation

Anleitung nach http://peterbraden.github.io/node-opencv/.

- OpenCV 2.4.13 von https://sourceforge.net/projects/opencvlibrary/files/opencv-win/2.4.13/opencv-2.4.13.3-vc14.exe/download nach c:\opencv installieren
- NodeJS 8.2.1 von https://nodejs.org/download/release/v8.2.1/node-v8.2.1-x64.msi installieren
- Pfad-Variable **OPENCV_DIR=C:\opencv\build\x64\vc14** setzen
- Pfad-Variable **PATH** um **%OPENCV_DIR%\bin** erweitern
- Visual Studio Community 2017 mit VC++14 Erweiterungen installieren (Einzelne Komponenten > **VC++ 2017 v141-Toolset** und **Visual Studio C++-Kernfeatures**)
- Python 2.7.13 von https://www.python.org/ftp/python/2.7.13/python-2.7.13.msi für Kompilieren von node opencv installieren und python.exe zu **PATH** hinzufügen
- **npm install --global windows-build-tools** in Administrationskonsole ausführen (https://stackoverflow.com/a/31987161/5964970)
- **npm install --save opencv**


# Installation für Python

Anleitung: http://docs.opencv.org/3.1.0/d5/de5/tutorial_py_setup_in_windows.html

- 32 Bit Version verwenden!
- Python 2.7.13 von https://www.python.org/ftp/python/2.7.13/python-2.7.13.msi installieren und python.exe zu **PATH** hinzufügen
- pip install numpy
- pip install matplotlib

# Installation unter MacOS

Anleitung: http://www.mobileway.net/2016/12/15/install-opencv-for-python-on-mac-os-x-or-linux/

- Anaconda 2 installieren von https://www.anaconda.com/download/#download
- pip install pillow
- conda install -c https://conda.anaconda.org/menpo opencv3

Mit python/webcamtest.py kann über die Konsole geprüft werden, ob die Webcam angesprochen werden kann.