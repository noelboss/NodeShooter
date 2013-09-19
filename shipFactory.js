
var newShip = function(id) {
    var ship = {
        'id': id,
        x: Math.round(Math.random() * 100),
        y: Math.round(Math.random() * 100)
    }
    
    return ship;
}

exports.newShip = newShip;