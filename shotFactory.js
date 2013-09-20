
var newShot = function(ship) {
    return {
        'id': ship.id,
        x: ship.x,
        y: ship.y,
        direction: ship.direction
    };
}

exports.newShot = newShot;