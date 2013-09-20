
var newShot = function(ship) {
    return {
        'id': ship.id,
        x: ship.x+15,
        y: ship.y+15,
        direction: ship.direction,
    };
}

exports.newShot = newShot;