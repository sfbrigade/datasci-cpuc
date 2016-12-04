'use strict'
const fs = require('fs')
const csv2geojson = require('csv2geojson');

let csvFile = 'output.csv'
let csvString = fs.readFileSync(csvFile).toString()
let filename = 'data.geo.json'

csv2geojson.csv2geojson(csvString, function(err, data) {
  let output = JSON.stringify(data)

  fs.writeFile(filename, output, function(err) {
    if (err) { return console.log(err); }
    console.log("The file was saved as", filename);
  });
});


