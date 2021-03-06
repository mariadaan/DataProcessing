// Maria Daan (11243406)

// Load in data
var requests = [d3.json("countries.json"), d3.json("data.json")];
Promise.all(requests).then(function(res) {
    makeMap(res[0], res[1])
}).catch(function(e){
    throw(e);
    });

function makeMap(json, data){
	// Define width and height for map svg
	var width = 600;
	var height = 500;

	// Define map projection
	var projection = d3.geoMercator()
						   .center([ 13, 52 ])
						   .translate([ width/2, height/2 ])
						   .scale([ width/1.5 ]);

	//Define path generator
	var path = d3.geoPath()
					 .projection(projection);

	//Create SVG for map
	var svg = d3.select("#container")
				.append("svg")
				.attr("width", width)
				.attr("height", height);

	// Create tooltip element
	var tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) {
				return d.properties.admin + "<br>" + data[d.properties.admin]["Quality of Life Index"];
			});
    svg.call(tool_tip);

	// Make map interactive
	svg.selectAll("path")
	   .data(json.features)
	   .enter()
	   .append("path")
	   .attr("d", path)
	   .attr("stroke", "rgba(8, 81, 156, 0.2)")
	   .attr("fill", "rgba(8, 81, 156, 0.1)")
		 .on('mouseover', tool_tip.show)
     .on('mouseout', tool_tip.hide)
		 .on("click", function(d){
			 makeBarchart(d.properties.admin, data)
			});
};

function makeBarchart(country, data){
	// Remove former barchart and title, if existing
	d3.select("#barchart").select("svg").remove();
	d3.select("#titlebars").select("h1").remove();

	// Create list of all keys and all values
	keys = Object.keys(data[country])
	values = [];
	for (i in keys){
		values.push(data[country][keys[i]]);
	}

	// Remove non-index values from both lists
	keys.splice(0, 1)
	keys.splice(5, 1)
	values.splice(0, 1)
	values.splice(5, 1)

	// Adjust keys to fit into barchart label
	for (i in keys){
		keys[i] = keys[i].replace(" Index", "");
	}

	// Define width and height for barchart svg
	var margin = {top: 20, right: 20, bottom: 50, left: 40},
			width = 600 - margin.left - margin.right;
			height = 500 - margin.top - margin.bottom;

	// Create SVG
	var svg = d3.select("#barchart")
				.append("svg")
				.attr("id", "bars")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
    		.attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

	// Show title
	d3.select("#titlebars")
		.append("h1")
		.text(country + ", 2018")

	// Set the ranges
	var x = d3.scaleBand()
	          .range([0, width])
	          .padding(0.1);
	var y = d3.scaleLinear()
	          .range([height, 0]);

// Scale the range of the data in the domains
// Hardcode y-domain to make it easier to compare barcharts
	x.domain(keys);
	y.domain([0, 200]);

// Create tooltip element
 var tool_tip = d3.tip()
     .attr("class", "d3-tip")
     .offset([-8, 0])
     .html(function(d) { return d; });
   svg.call(tool_tip);

	// Create bars
	svg.selectAll(".bar")
		.data(values)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d, i) { return x(keys[i]); })
		.attr("width", x.bandwidth())
		.attr("y", function(d) { return y(d); })
		.attr("height", function(d) { return height - y(d) })
		.on('mouseover', tool_tip.show)
		.on('mouseout', tool_tip.hide);

	// Add x axis
	svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x))
				.style("font-size", "8px");

	// Add y axis
	svg.append("g")
		.call(d3.axisLeft(y));

	// Add text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", -60)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
			.style("font-size", "12px")
      .text("Index value -->");
}
