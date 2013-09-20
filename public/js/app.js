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



function onFrame() {
	if (Key.isDown('left'))
		sperm.left();

	if (Key.isDown('right'))
		sperm.right();

	if (Key.isDown('up'))
		sperm.forward();

	if (Key.isDown('down'))
		sperm.reverse();
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