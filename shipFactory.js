
var newShip = function(id) {
    return {
        'id': id,
        x: 300 + Math.round(Math.random() * 800),
        y: 50 + Math.round(Math.random() * 300),
        direction: 'up',
        move: 0,
        speed: 1,
        moving: false
    }
}

exports.newShip = newShip;