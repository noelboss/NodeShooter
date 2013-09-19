
var newShip = function(id) {
    var ship = {
        'id': id,
    }
    var x = Math.round(Math.random() * 100);
    var y = Math.round(Math.random() * 100);

    ship.x = (Math.random() > 0.5) ? x * -1 : x * +1;
    ship.y = (Math.random() > 0.5) ? y * -1 : y * +1;

    
    return ship;
}

exports.newShip = newShip;