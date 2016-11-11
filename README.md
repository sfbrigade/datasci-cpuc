# California Public Utilities Commission Project
TBD

This project is part of [Data Science Working Group at Code for San Francisco](https://github.com/sfbrigade/data-science-wg)

## Project Description
TBD

### Live links
 - TBD
 
## Working Plan
1. Bubble map/cartogram: 
 - CA baselayer
 - bubbles for each tract: 
     - radius encodes data from CPUC (upload/download speed)
     - color encodes census tract data (income levels)
 - more info on chart to the side

## Contributing DSWG Members
| Name | Slack Handle | Contribution |
| ---| --- | --- |
| Dylan Sather| @dylburger | Analysis |
| Sanat Moningi | @sanat | Visualization |
| Tyler Field | @tyler | Visualization |
| Geoffrey Pay | @gpay | Visualization |


## Tech
- TBD

## Contributing

At the moment, we have just started this project.  If there's something you want to help out with, here's how to get started:  

[Fork this repo](https://help.github.com/articles/fork-a-repo/), then clone your repo locally
```
$ git clone <your-repo>
$ cd <this-repo's-name>
$ git remote add upstream <this-repo>
```
Launch a local server.  If you're on a Mac, you already have [SimpleHTTPServer](http://www.pythonforbeginners.com/modules-in-python/how-to-use-simplehttpserver/) installed:  
```
$ cd path/to/local/clone
$ python -m SimpleHTTPServer
```
You could also use [http-server](https://www.npmjs.com/package/http-server) if you wanted  
Create a feature branch:
```
$ git checkout -b <feature-branch>
```
Do some work:  
```
$ vim <some-files>
```
When you're ready, commit, [merge any upstream changes](https://help.github.com/articles/merging-an-upstream-repository-into-your-fork/), [deal with conflicts](https://help.github.com/articles/resolving-a-merge-conflict-from-the-command-line/), and push your branch ([aka, forking workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow))   
```
$ git commit -am 'my awesome feature'
$ git pull upstream master
  # solve conflicts
$ git push
```
[Create a Pull Request](https://help.github.com/articles/creating-a-pull-request/) from your pushed branch (compare branch) to this repo (base branch)   
...  
Profit!

## Sources

[census shapefile](ftp://ftp2.census.gov/geo/pvs/tiger2010st/06_California/)
[shapefiles](https://www.census.gov/geo/maps-data/data/tiger-line.html)

data steps:
1. download[shapefile](ftp://ftp2.census.gov/geo/pvs/tiger2010st/06_California/06/tl_2010_06_tabblock10.zip) (direct link 439MB) of California census tract blocks 
1. scrape properties of shapefiles into csv `ogr2ogr -f CSV caCensusBlocks.csv tl_2010_06_tabblock10.shp`
1. income estimates only available for blockgroup level. scrape from census API, [posted at numeracy](https://numeracy.co/projects/1CHe8jPRvdd/data-sources/ca-income-by-blockgroup)
1. test results from cpuc pulled out of [looker](https://census.looker.com/embed/explore/sf_publicdata/calspeed_mobile_field_test?qid=s6iV16nhHgzv1S95FbliHY)
1. join lon/lat from caCensusBlocks.csv to CPUC data
1. join 