# Einäugiger Roboter

server.html wird auf dem Roboter gestartet und liefert das Bild
eines Auges als WebRTC-Stream. Ein Auge daher, da das Surface Pro verwendet wird, welches nur eine USB-Kamera gleichzeitig ansteuern kann.

Für erste Demos reicht das auch. Im Chrome muss auf dem Server nach Aufruf
der Seite die richtige Kamera ausgewählt werden.

index.html ist der Client mit FRAME, welches des Stream vom Roboter auf eine Plane (nicht stereo) projiziert und die Kopfbewegungen an den Server
zurück sendet.

client.html ist ein Test, der beim Start sich automatisch mit dem Server
verbindet und dessen Bild anzeigt.