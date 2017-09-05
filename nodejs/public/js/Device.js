/**
 * Represents a media device.
 */
function Device() {
    /**
     * ID of the device, unique over all sockets. Consists of the
     * id of the socket plus the physical device id
     * @type {string}
     */
    var id;
    /**
     * Name of the device as shown up on user interfaces.
     * @type {string}
     */
    var label;
    /**
     * ID of the socket the device belongs to. Used when closing
     * sockets to remove its devices from the device list.
     * @type {string}
     */
    var socketId;
}