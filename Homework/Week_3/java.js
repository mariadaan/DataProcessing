// # Name: Maria Daan
// # Student number: 11243406

var fileName = "data.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
        jason = (JSON.parse(txtFile.responseText));
        keys = Object.keys(jason);

        var temps = []
        var dates = []

        // Create list of all dates and temperatures
        keys.forEach(function(key) {
          temps.push(jason[key]["TN"])
          var year = key.slice(0, 4)
          var month = key.slice(4, 6)
          var day = key.slice(6, 8)
          var date = new Date(year, (month - 1), day)
          dates.push(date)
        });

        // Define starting points
        var first_date = dates[0]
        var last_date = dates.slice(-1)[0]
        var min_temp = Math.min(...temps);
        var max_temp = Math.max(...temps);

        // Create function to calculate coordinates on canvas
        yTransform = createTransform([min_temp, max_temp], [0, 300]);
        xTransform = createTransform([first_date, last_date], [0, 800]);

        // Create 2D canvas to draw chart on
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');

        // Draw linechart
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(xTransform(dates[0]), yTransform(temps[0]))

        for (var i = 0; i < temps.length; i++){
          var x_coordinate = xTransform(dates[i])
          var y_coordinate = yTransform(temps[i])
          ctx.lineTo(x_coordinate, y_coordinate)
          ctx.moveTo(x_coordinate, y_coordinate)
        }

        // Add title
        // ctx.textAlign = "right";
        ctx.fillText('Minimum temperatuur in Hupsel (in 0.1 graden Celsius)', 240, 380);
        ctx.stroke();

    }
  }


txtFile.open("GET", fileName);
txtFile.send();

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}
