
var newShip = function(id) {
	"use strict";
    return {
        "id2": id,
        "x": 300 + Math.round(Math.random() * 800),
        "y": 50 + Math.round(Math.random() * 300),
        direction: "up",
        move: 0,
        speed: 1,
        moving: false
    };
};

exports.newShip = newShip;