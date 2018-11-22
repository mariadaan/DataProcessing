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
        xTransform = createTransform([first_date, last_date], [55, 800]);
        yTransform = createTransform([min_temp, max_temp], [50, 300]);

        // Create 2D canvas to draw chart on
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');

        // Add labels to x axis
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
        for(var m = 0, s = 0; m <= months.length; m++, s+=30){
          ctx.fillText(months[m], xTransform(dates[s]), 375)
        }
        ctx.fillText('Maanden', 720, 395);

        // Add labels to y axis
        degrees = ['-10', '-5', '0', '5', '10', '15', '20', '25']
        for (var i = degrees.length, j = 55; i > 0; i--, j+=44){
          ctx.fillText(degrees[i - 1] + '°C', 30, j)
        }
        ctx.fillText('Temperatuur', 10, 20);

        // Flip canvas
        ctx.transform(1, 0, 0, -1, 0, canvas.height)

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
        ctx.stroke();

        // Draw x axis
        ctx.beginPath();
        ctx.moveTo(xTransform(first_date), yTransform(0));
        ctx.lineWidth = 1;
        ctx.lineTo(xTransform(last_date), yTransform(0));
        ctx.stroke();

        // Draw extra lines
        for (var i = 0, j = 250; i < 10; i++, j-=50){
          ctx.beginPath();
          ctx.moveTo(xTransform(first_date), yTransform(j));
          ctx.lineWidth = 0.2;
          ctx.lineTo(xTransform(last_date), yTransform(j));
          ctx.stroke();
        };

        // Draw y axis
        ctx.beginPath();
        ctx.moveTo(xTransform(first_date), 38);
        ctx.lineWidth = 1;
        ctx.lineTo(xTransform(first_date), 370);
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
