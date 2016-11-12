//Setting up leaflet map
var map = L.map('map').setView([36.7783, -119.4179], 6);

//Initialize Map
L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 18,
    minZoom: 5,
    attributionControl: false,
    id: 'smoningi.a304c3dc',
    accessToken: 'pk.eyJ1Ijoic21vbmluZ2kiLCJhIjoiQ21rN1pjSSJ9.WKrPFjjb7LRMBjyban698g'
}).addTo(map);


var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

var cpucMetric = "downMean";
var censusMetric = "income";

d3.csv("/data/output.csv", function(data) {
    var color = d3.scale.linear()
        .range(["#c0e4aa","#e6573d"])
        .domain(d3.extent(data, function(d){return +d[cpucMetric]}))
        // debugger
    // var transform = d3.geo.transform({point: projectPoint}),
    var transform = d3.geo.transform(),
        path = d3.geo.path().projection(transform);
    var radius = d3.scale.linear()
        .range([3, 15])
        .domain(d3.extent(data, function(d){return +d[censusMetric]}))

    data.forEach(function(d) {
			d.LatLng = new L.LatLng(d.lon,d.lat)
		})

    data = data.sort(function(a, b) { return b[censusMetric] - a[censusMetric]; })

    var feature = g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("id", function(d){
          return d.geoid10;
        })
        .attr("r", function(d) { return radius(d[censusMetric]); })
        .attr('fill', function(d){ return color(d[cpucMetric]) } )
        .style("stroke-width",0.7)
        .style("fill-opacity", 0.5)
        .style("cursor", "default")
        .on("mouseover", function(d){
          d3.select(this)
          .style("fill-opacity", 1)
          .style("stroke-width",1);
        })
        .on("mouseout", function(d){
           d3.select(this)
           .style("fill-opacity", 0.5)
           .style("stroke-width",0.7);
        });

    map.on("viewreset", update);
		update();

		function update() {
      // var bounds = path.bounds(feature),
      //     topLeft = bounds[0],
      //     bottomRight = bounds[1];
      //
      // svg .attr("width", bottomRight[0] - topLeft[0])
      //     .attr("height", bottomRight[1] - topLeft[1])
      //     .style("left", topLeft[0] + "px")
      //     .style("top", topLeft[1] + "px");
      //
      // g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

			feature.attr("transform", function(d) {
				return "translate("+
					map.latLngToLayerPoint(d.LatLng).x +","+
					map.latLngToLayerPoint(d.LatLng).y +")";
				}
			)
		}

    // Use Leaflet to implement a D3 geometric transformation.
    // function projectPoint(x, y) {
    //     var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    //     this.stream.point(point.x, point.y);
    // }
});
