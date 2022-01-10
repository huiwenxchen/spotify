// SVG Size
var width = 700,
	height = 500;

var genre = [];


// SVG Size
var width = 700,
	height = 500;

var genre = [];

// Load CSV file
d3.csv("data/spotify_data.csv", function(data){

	// Analyze the dataset in the web console
	var preparedData = prepareData(data);


	createVisualization(preparedData);
});

var prepareData = function(data) {
	
	// Analyze and prepare the dataelationship satisfaction 
	data.forEach( function (d) {
		d["streams_in_mils"] = parseInt(d["streams_in_mils"]);
		d["songs"] = parseInt(d["songs"]);
		d["songs_with_mil_plus_streams"] = parseInt(d["songs_with_mil_plus_streams"]);
		if (!genre.includes(d["genre"])) {
			genre.push(d["genre"])
		}
	});
	console.log(data)
	data.sort(function(x,y) {
		return d3.descending(x.songs_with_mil_plus_streams, y.songs_with_mil_plus_streams);
	})
	console.log(data)

	return data;
}

// Initiate margin convention 
var padding = 20;
var margin = {top: 30, bottom: 50, left: 30, right: 30};
var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;




var createVisualization = function(data) {
	
	// Append a new SVG area with D3
	var svg = d3.select("#chart-area").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            	.append("g")
            	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// create scales by using the D3 scale functions
        .domain(d3.extent(data, function (d){
            return d.songs;
        }))
        .range([padding, width - padding]);

	var streamsScale = d3.scaleLinear()
        .domain(d3.extent(data, function (d){
            return d.streams_in_mils;
        }))
        .range([height - padding, padding]);


	// Append the x- and y-axis to your scatterplot
	var xAxis = d3.axisBottom(numSongsScale);
	svg.append("g")
		.attr("class", "axis xAxis")
		.attr("transform", "translate(20, 410)")
		// .attr("transform", "translate(0," + (height - padding) + ")")
		.call(xAxis);

	var yAxis = d3.axisLeft(streamsScale);
	svg.append("g")
		.attr("class", "axis yAxis")
		.attr("transform", "translate(50, 10)")
		// .attr("transform", "translate(0," + (height - padding) + ")")
		.call(yAxis);


	// Label axes
	svg.append("text")
		.attr("class", "x label")
		.attr("text-anchor", "end")
		.attr("x", width)
		.attr("y", height)
		.attr("transform", "translate(0, 30)")
		.text("Number of Songs")

	svg.append("text")
		.attr("class", "y label")
		.attr("text-anchor", "end")
		.attr("y", 6)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		// .attr("transform", "translate(0, 10)")
		.text("NUmber of streams in Millions");


	// Add a scale function for the circle radius	
	let rScale = d3.scaleLinear()
		.domain(d3.extent(data, function(d){
			return d.songs_with_mil_plus_streams;
		}))
		.range([4, 30]);
	
	// Color
	let Colorscale = d3.scaleOrdinal()
		.domain(d3.extent(data, function(d){
		return d.genre;
	}))
		.range(["#de9ed6","#ce6dbd","#a55194","#7b4173", "#e7969c", "#d6616b", "#ad494a", " #843c39"])
	
	svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d){
            return  padding+30+numSongsScale(d.songs);
        })
        .attr("cy", function(d){
            return  streamsScale(d.streams_in_mils);
        })
		.attr("r", function(d){
			return rScale(d.songs_with_mil_plus_streams);
		})
		.attr("fill", function(d){
			return Colorscale(d.genre)
			
	
		})

}
