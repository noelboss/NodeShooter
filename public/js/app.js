var socket = io.connect();

$(document).ready(function(){
    $(window).keydown(function(e) {
        //console.log('Keypress: '+e.which);
        if(config.keys.hasOwnProperty(e.which)){
            socket.emit('keyPress', {'sid': shipId, 'key': config.keys[e.which]});
        }
    });
});

(function($){
    socket.on('config', function(conf) {
        config = conf;
        shipId = config.shipId;
    });
})(jQuery);


/* space */
// The amount of symbol we want to place;
var count = 30;

// Create a symbol, which we will use to place instances of later:
var path = new Path.Circle({
	center: [0, 0],
	radius: 5,
	fillColor: '#ddd',
	strokeColor: '#ddd'
});

var symbol = new Symbol(path);

// Place the instances of the symbol:
for (var i = 0; i < count; i++) {
	// The center position is a random point in the view:
	var center = Point.random() * view.size;
	var placed = symbol.place(center);
	placed.scale(i / count + 0.001);
	placed.data.vector = new Point({
		angle: Math.random() * 360,
		length : (i / count) * Math.random() / 5
	});
}

var vector = new Point({
	angle: 45,
	length: 0
});

var mouseVector = vector.clone();

function onMouseMove(event) {
	mouseVector = view.center - event.point;
}

function keepInView(item) {
	var position = item.position;
	var viewBounds = view.bounds;
	if (position.isInside(viewBounds))
		return;
	var itemBounds = item.bounds;
	if (position.x > viewBounds.width + 5) {
		position.x = -item.bounds.width;
	}

	if (position.x < -itemBounds.width - 5) {
		position.x = viewBounds.width;
	}

	if (position.y > viewBounds.height + 5) {
		position.y = -itemBounds.height;
	}

	if (position.y < -itemBounds.height - 5) {
		position.y = viewBounds.height
	}
}

/* Sperm */

function onFrame() {
	if (Key.isDown('left')){
    	vector = vector + (new Point(10,0) - vector) / 30;
		sperm.left();
	    
	}

	if (Key.isDown('right')){
    	vector = vector + (new Point(-10,0) - vector) / 30;
		sperm.right();
	    
	}

	if (Key.isDown('up')){
    	vector = vector + (new Point(0,-10) - vector) / 30;
		sperm.forward();
	}

	if (Key.isDown('down')){
    	vector = vector + (new Point(0,10) - vector) / 30;
		sperm.reverse();
	    
	}
    
        
	// Run through the active layer's children list and change
	// the position of the placed symbols:
	for (var i = 0; i < count; i++) {
		var item = project.activeLayer.children[i];
		var size = item.bounds.size;
		var length = vector.length / 10 * size.width / 10;
		item.position += vector.normalize(length) + item.data.vector;
		keepInView(item);
	}
    
	sperm.draw();
}

function onKeyDown(event) {
	// Prevent the arrow keys from scrolling the window:
	return !(/left|right|up|down/.test(event.key));
}

project.currentStyle = {
	strokeColor: 'black',
	strokeWidth: 4,
	strokeCap: 'round'
};

var sperm = new function() {
	var center = view.center;
	var size = 20;
	var partLength = 5;
	var path = new Path();
	for (var i = 0; i < size; i++) {
		path.add(center - [i * partLength, 0]);
	}
	path.strokeColor = '#ddd';

	var headPath = new Path.Oval({
		from: [0, 0],
		to: [13, 8],
		fillColor: '#aaa',
		strokeColor: null
	});
	headPath.scale(1.3);
	var headSymbol = new Symbol(headPath);
	var head = new PlacedSymbol(headSymbol);
	var vector = new Point({
		angle: 0,
		length: 20
	});
	var speed = 1;
	var maxSteer = 4.5;
	var friction = 0.98;
	var steering = 1.5;
	var maxSpeed = 10;
	var minSpeed = 1;
	var position = center;
	var lastRotation = 0;
	var count = 0;
	return {
		left: function() {
			if (speed >= 0.01) {
				if (speed < 3 && speed >= 0) {
					vector.angle -= (speed * 2);
				} else if (speed < 0) {
					vector.angle -= (speed / 2);
				} else {
					vector.angle -= maxSteer * steering;
				}
				speed *= friction;
			}
		},

		right: function() {
			if (speed >= 0.01) {
				if (speed < 3 && speed >= 0) {
					vector.angle += (speed * 2);
				} else if (speed < 0) {
					vector.angle += (speed / 2);
				} else {
					vector.angle += maxSteer * steering;
				}
				speed *= friction;
			}
		},

		forward: function() {
			speed += 0.3;
			speed = Math.min(maxSpeed, speed);
		},

		reverse: function() {
			speed -= 0.3;
			if (speed < minSpeed)
				speed = minSpeed;
		},

		draw: function() {
			var vec = vector.normalize(Math.abs(speed));
			speed = speed * friction;
			position += vec;
			var lastPoint = path.firstSegment.point = position;
			var lastVector = vec;
			var segments = path.segments;
			for (var i = 1, l = segments.length; i < l; i++) {
				var segment = segments[i];
				var vector2 = lastPoint - segment.point;
				count += vec.length * 10;
				var rotLength = Math.sin((count + i * 3) / 600);
				var rotated = lastVector.rotate(90).normalize(rotLength);
				lastPoint = segment.point = lastPoint + lastVector.normalize(-partLength - vec.length / 10);
				segment.point += rotated;

				if (i == 1) {
					head.position = position;
					var rotation = vector2.angle;
					head.rotate(rotation - lastRotation);
					lastRotation = rotation;
				}
				lastVector = vector2;
			}
			path.smooth();
			this.constrain();
		},

		constrain: function() {
			var bounds = path.bounds;
			var size = view.size;
			if (!bounds.intersects(view.bounds)) {
				if (position.x < -bounds.width)
					position.x = size.width + bounds.width;
				if (position.y < -bounds.height)
					position.y = size.height + bounds.height;
				if (position.x > size.width + bounds.width)
					position.x = -bounds.width;
				if (position.y > size.height + bounds.height)
					position.y = -bounds.height;
				path.position = position;
			}
		}
	}
};