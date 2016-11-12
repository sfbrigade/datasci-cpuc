/**
* This function joins data from the cpuc output file
* with lon/lat and income data from the census bureau
* run in terminal using node.js: `$ node join.js`
*/

'use strict'
const fs = require('fs')
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify');

// data files in 'test/' produced with script: `head raw/$datafile.csv > test/$datafile.csv`
// const path = './test/'
const path = './raw/'

let cpucCsv = 'sf_publicdata_calspeed_mobile_field_test_2016-10-22T1609.csv'
let geoCsv = 'caCensusBlocks.csv'
let censusCsv = 'ca-income-by-blockgroup.csv'

let cpucString = fs.readFileSync(path + cpucCsv).toString()
let geoString = fs.readFileSync(path + geoCsv).toString()
let censusString = fs.readFileSync(path + censusCsv).toString()

let cpucData = parse(cpucString, {columns:true})
let geoData = parse(geoString, {columns:true})
let censusData = parse(censusString, {columns:true})

let output = cpucData.map(datapoint => {

  let inc = censusData.find(el => {
    return el.blockgroup === datapoint.blockgroup
  })
  let latlon = geoData.find(el => {
    return el.GEOID10 === datapoint["Calspeed Mobile Field Test Census ID 2010"]
  })

  let income = (inc==undefined) ? undefined : inc.medianHouseholdIncome
  let lon = (latlon==undefined) ? undefined : Number.parseFloat(latlon.INTPTLAT10)
  let lat = (latlon==undefined) ? undefined : Number.parseFloat(latlon.INTPTLON10)

  if (latlon === undefined ) return
  
  return {
    geoid10:    datapoint['Calspeed Mobile Field Test Census ID 2010'],
    downMean:   datapoint['Calspeed Mobile Field Test Average Combined Down Mean'],
    upMean:     datapoint['Calspeed Mobile Field Test Average Combined Up Mean'],
    downStdDev: datapoint['Calspeed Mobile Field Test Average Combined Down Standard Deviation'],
    upStdDev:   datapoint['Calspeed Mobile Field Test Average Combined Up Standard Deviation'],
    tests:      datapoint['Calspeed Mobile Field Test Count of Tests'],
    income:     income,
    lon:        lon,
    lat:        lat
  }
})

stringify(output, {header: true}, function(err, data){
  let filename = 'output.csv'
  fs.writeFile(filename, data, function(err) {
    if (err) { return console.log(err); }
    console.log("The file was saved as", filename);
  });
});

