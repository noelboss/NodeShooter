
var newShip = function(id) {
    var ship = {
        'id': id,
        x: Math.round(Math.random() * 80),
        y: Math.round(Math.random() * 80)
    }
    
    return ship;
}

exports.newShip = newShip;