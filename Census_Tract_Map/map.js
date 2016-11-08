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

d3.json("/data/cal_censustract_2010.geojson", function(collection) {
    var transform = d3.geo.transform({point: projectPoint}),
        path = d3.geo.path().projection(transform);
    var feature = g.selectAll("path")
        .data(collection.features)
        .enter()
        .append("path")
        .attr("id", function(d){
          return d.properties.GEOID;
        })
        .style("stroke", "#000000")
        .style("fill", "#B9E7FF")
        .style("fill-opacity", 0.5)
        .style("stroke-width",0.7)
        .on("mouseover", function(d){
          d3.select(this).style("stroke", "#B9E7FF")
          .style("fill", "ff0000")
          .style("fill-opacity", 1)
          .style("stroke-width",1);
        })
        .on("mouseout", function(d){
           d3.select(this).style("stroke", "#B9E7FF")
           .style("stroke", "#000000")
           .style("fill", "#B9E7FF")
           .style("fill-opacity", 0.5)
           .style("stroke-width",0.7);
        });

    map.on("viewreset", reset);
    reset();

    // Reposition the SVG to cover the features.
    function reset() {
        var bounds = path.bounds(collection),
            topLeft = bounds[0],
            bottomRight = bounds[1];

        svg .attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");

        g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

        feature.attr("d", path);
    }

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }
});
