var map = L.map('map').setView([36.7783, -119.4179], 6);
mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 18,
    minZoom: 5,
    attribution: '&copy; ' + mapLink + ' Contributors and Others',
    id: 'smoningi.a304c3dc',
    accessToken: 'pk.eyJ1Ijoic21vbmluZ2kiLCJhIjoiQ21rN1pjSSJ9.WKrPFjjb7LRMBjyban698g'
}).addTo(map);

/* Initialize the SVG layer */
map._initPathRoot()

/* We simply pick up the SVG from the map object */
var svg = d3.select("#map").select("svg"),
  g = svg.append("g");

var cpucMetric = "downMean";
var censusMetric = "income";

d3.json("data/data.geo.json", function(collection) {
  var color = d3.scale.quantile()
      .range(['#d73027', '#fc8d59', '#fee08b', '#ffffbf', '#d9ef8b', '#91cf60', '#1a9850'])
      .domain(d3.extent(collection.features, function(d){return +d.properties[cpucMetric]}))
  var radius = d3.scale.linear()
      .range([3, 20])
      .domain(d3.extent(collection.features, function(d){return +d.properties[censusMetric]}))

  collection.features = collection.features.sort(function(a, b) { return b.properties[censusMetric] - a.properties[censusMetric]; })

  /* Add a LatLng object to each item in the dataset */
  collection.features.forEach(function(d) {
    d.properties.LatLng = new L.LatLng(d.geometry.coordinates[0],
      d.geometry.coordinates[1])
  })

  var feature = g.selectAll("circle")
      .data(collection.features)
    .enter().append("circle")
    .attr("id", function(d){
        return d.properties.geoid10;
      })
      .attr("r", function(d) { return radius(d.properties[censusMetric]); })
      .attr('fill', function(d){ return color(d.properties[cpucMetric]) } )
      .style("stroke-width",0.7)
      .style("fill-opacity", 0.8)
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
    feature.attr("transform",
      function(d) {
        return "translate(" +
          map.latLngToLayerPoint(d.properties.LatLng).x + "," +
          map.latLngToLayerPoint(d.properties.LatLng).y + ")";
      }
    )
  }
})