
var newShip = function(id) {
    return {
        'id': id,
        x: Math.round(Math.random() * 1200),
        y: Math.round(Math.random() * 900),
        direction: 'up'
    }
}

exports.newShip = newShip;