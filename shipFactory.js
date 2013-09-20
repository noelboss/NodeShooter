
var newShip = function(id) {
    return {
        'id': id,
        x: Math.round(Math.random() * 80),
        y: Math.round(Math.random() * 80),
        direction: 'up'
    }
}

exports.newShip = newShip;