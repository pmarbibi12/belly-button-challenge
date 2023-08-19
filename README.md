# belly-button-challenge
by Panfilo Marbibi

# Contents
- static (dir)
   - js (dir)
     - samples.json
     - app.js
- index.html
- README.md

# Summary
- an interactive dashboard to explore the Belly Button Biodiversity dataset, which catalogs the microbes that colonize human navels.
- app.js uses the D3 library to read the JSON file from the URL "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json" and uses the data to fill in the choices for the drop-down menu as well as create graphs/plots to visualize and represent the data.
- "https://pmarbibi12.github.io/belly-button-challenge/"


# functions
- init() - initializes the data pull and calls other functions to fill in the drop-down menu choices and create the initial graphs displayed on the page
- setNames(names) - uses the "names" array from the data set and creates the drop-down menu choices of Test Subject IDs
- makeGraph(data) - uses the "samples" data to create a horizontal bar graph using the top OTUs of the chosen Test Subject ID No.
- makeBubbleChart(data) - uses the "samples" data to create a bubble chart that visualizes the sample values of the different OTUs found on the chosen Test Subject ID No.
- optionChanged(value) - when a new choice is selected from the drop-down menu, this function calls updatePlotly() and getValues() to update the graphs and the Demographic Info Panel
- updatePlotly(sampleData, metaData) - uses the sample data and metaData to update the bubble chart, the horizontal bar graph, and the gauge
- getTopOtus(id) - uses the "samples" data to gather the top 10 OTUs and returns the otu names, the values for the otu names, and the labels of the otus
- getValues(id) - uses the metadata data to update the Demographic Info panel on the page
- makeGuage(data) - uses the metadata from the chosen test subject and displays the amount of times that individual washes/scrubs their bellybutton in a week

# disclaimer
- code used was derived from activities in class as well as the documentation provided from d3 and the plotly library
  
