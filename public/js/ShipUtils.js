var ShipUtils = {
    setInitialPosition: function() {
        var x = Math.round(Math.random() * 100);
        var y = Math.round(Math.random() * 100);

        x = (Math.random() > 0.5) ? x * -1 : x * +1;
        y = (Math.random() > 0.5) ? y * -1 : y * +1;
        
        console.info('Initial Position: x ' + x + ', y ' + y);
    }
};