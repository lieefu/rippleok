'use strict';
var Remote = ripple.Remote;
var Servers = {
    trace: false,
    trusted: true,
    local_signing: true,
    local_fee: true,
    fee_cushion: 1.5,
    servers: [{
        host: 's1.ripple.com',
        port: 443,
        secure: true
    }, {
        host: 's2.ripple.com',
        port: 443,
        secure: true
    }]
};
var remote = new Remote(Servers);
var rippleconnected = false;

function rippleConnect(callback) {
    remote.connect(function(err, res) {
        if (err) {
            rippleconnected = false;
        } else {
            console.log("Connected to:", remote.getServer()._url);
            rippleconnected = true;
            if (callback) callback();
        }
    });
}
