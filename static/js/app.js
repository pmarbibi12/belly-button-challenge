
//initialize func
function init() {
    //read in json data from URL or change to local json file
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then( function (data) {
        setNames(data.names); // function to set dropdown values
        makeGraph(data.samples[0]); // function to create bar graph of the first choice
        makeBubbleChart(data.samples[0]); // function to create bubble graph of the first choice
        getValues(data.metadata[0]); // function to set metadata values in the demographic info panel
        makeGuage(data.metadata[0].wfreq); // function to create the gauge chart
    });
};

//creates the dropdown choices
function setNames(names) {
    //select the dropDown for editing
    let dropDown = d3.select("#selDataset");
    //loop through values and append as choices
    for (i=0; i < names.length ; i++) {
        let addChoice = dropDown.append("option");
        addChoice.text(`${names[i]}`);
    };
};

//creates a horizontal bar graph
function makeGraph(data) {
    let [x, y, labels] = getTopOtus(data) // call function to get only the top 10 otu data
    //set trace data
    let traceData = [{
        x: y,
        y: x,
        text: labels,
        type: "bar",
        orientation: "h"
    }];
    //set layout
    let layout = {
        margin: { t: 50, r: 25, l: 100, b: 50 },
        title: { text: "Top OTUs"}
    };
    Plotly.newPlot("bar", traceData, layout); //create plot and assign to bar class
};

//creates a bubble graph
function makeBubbleChart(data) {
    //set variables to data values
    let x = data.otu_ids;
    let y = data.sample_values;
    //set trace data
    let trace = [{
        x: x,
        y: y,
        text: data.otu_labels,
        mode: "markers",
        marker: {
            size: y,
            color: x
        },
        showscale: true
    }];
    //set layout
    let layout = {
        xaxis: {
            title: "OTU IDs",
            margin: { t: 0, r: 25, l: 100, b: 50 },
        }
    };
    Plotly.newPlot("bubble", trace, layout);  //create plot and assign to bubble class
};

//function to update graphs and values based on choice selected
function optionChanged(value) {
    //get value and set to a variable
    let dropdownMenu = value;
    //re-read the data to get appropriate values
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then( function (data) {
        let samples = data.samples;
        let metadata = data.metadata;
        //filter for values
        let id = samples.filter( samples => samples.id == dropdownMenu);
        let metaId = metadata.filter( metadata => metadata.id == dropdownMenu);
        //update values in Demographic Info with new metadata values
        getValues(metaId[0]);
        //update plots
        updatePlotly(id[0],metaId[0]);
    });
  };

//function to update plot data
function updatePlotly(sampleData, metaData) {
    //assign new values for bubble graph
    let bubbleData = {
        x: [sampleData.otu_ids],
        y: [sampleData.sample_values],
        text: [sampleData.otu_labels]
    };
    //get top 10 otu data
    let [x, y, labels] = getTopOtus(sampleData);
    //assign new values for h.bar graph
    let barData = {
        x: [y],
        y: [x],
        text: [labels]
    };
    //assign new value for gauge
    let  gaugeData=  {
        value: [metaData.wfreq]
    };
    //restyle the plots
    Plotly.restyle("bubble",  bubbleData, [0]);
    Plotly.restyle("bar", barData, [0]);
    Plotly.restyle("gauge", gaugeData, [0]);
};

//function to get top 10 otu data
function getTopOtus(id) {
    let otu_ids = id.otu_ids //set otu_ids to a variable
    //declare arrays
    let top10otus = [];
    let top10values = [];
    let top10labels = [];
    //if size of otu_ids is bigger than 10, only get the top 10
    if (otu_ids.length > 10) {
        for (i = 0; i < 10; i++) {
            //append values to arrays
            top10otus.push(`OTU ${otu_ids[i]}`);
            top10values.push(id.sample_values[i]);
            top10labels.push(id.otu_labels[i]);
        }
    }  //otherwise, get all the data
    else {
        for (i = 0; i < otu_ids.length; i++) {
            //append values to arrays
            top10otus.push(`OTU ${otu_ids[i]}`);
            top10values.push(id.sample_values[i]);
            top10labels.push(id.otu_labels[i]);
        }
    };
    //reverse arrays to pass to h.bar chart
    top10otus.reverse();
    top10values.reverse();
    top10labels.reverse();
    //return values
    return [top10otus, top10values, top10labels];
};

//function to assign text to Demographic Info Panel
function getValues(id) {
    //select the panel body for edits
    let panelBody = d3.select(".panel-body");
    //assign new values only if empty
    if (d3.select("#metaId").empty()) {
        panelBody.append('p').text(`id: ${id.id}`).attr('id', "metaId")   
        panelBody.append('p').text(`ethnicity: ${id.ethnicity}`).attr('id', "metaEth")
        panelBody.append('p').text(`gender: ${id.gender}`).attr('id', "metaGen")
        panelBody.append('p').text(`age: ${id.age}`).attr('id', "metaAge")
        panelBody.append('p').text(`location: ${id.location}`).attr('id', "metaLoc")
        panelBody.append('p').text(`bbtype: ${id.bbtype}`).attr('id', "metaBbt")
        panelBody.append('p').text(`wfreq: ${id.wfreq}`).attr('id', "metaWfr")
    } //otherwise, replace the values
    else {
        d3.select("#metaId").text(`id: ${id.id}`)
        d3.select("#metaEth").text(`ethnicity: ${id.ethnicity}`)
        d3.select("#metaGen").text(`gender: ${id.gender}`)
        d3.select("#metaAge").text(`age: ${id.age}`)
        d3.select("#metaLoc").text(`location: ${id.location}`)
        d3.select("#metaBbt").text(`bbtype: ${id.bbtype}`)
        d3.select("#metaWfr").text(`wfreq: ${id.wfreq}`)
    };  
};

//function to create gauge
function makeGuage(data) {
    //colors values to be used --blue shades
    let colors = [
        "#D9EFFF", 
        "#B5DFFA",
        "#8CC2F5", 
        "62A5F0", 
        "3E88EB", 
        "256AE6", 
        "1752C1", 
        "103E99", 
        "0B2D72"
    ];
    //color values to be used --pink shades
    pink_color_gradient = [
        "#FF82C7",  //# Hot Pink
        "#FF87C7",  //# Bright Pink
        "#FF8CC7",  //# Pink
        "#FF91C7",  //# Light Pink
        "#FF96C7",  //# Pale Pink
        "#FF9BC7", // # Baby Pink
        "#FFA0C7", // # Pastel Pink
        "#FFA5C7", // # Soft Pink
        "#FFAAC7"  // # Very Light Pink
    ].reverse(); 
    //assign gaugeData
    let guageData = [{
          type: "indicator",
          mode: "gauge+number",
          value: data,
          title: { text: "Scrubs per Week", font: { size: 20} },
          gauge: {
            axis: { 
                    range: [0,9],
                    tickwidth: 1,
                    tickcolor: "darkblue",
                    tickmode: "array",
                    tickvals: [0,1,2,3,4,5,6,7,8,9],
                    ticktext: ["0","1","2","3","4","5","6","7","8","9"],
                    showticklabels: true,
                    ticklabels: "inside",
                    tickfont: { color: "darkblue", size: 12 }
                  },
            bar: { 
                color: pink_color_gradient[data-1] //gauge bar will change colors depending on data value
            },
            borderwidth: 2,
            bordercolor: "black",
            steps: [ //assign shades of blue to steps
              { range: [0, 1], color: colors[0] },
              { range: [1, 2], color: colors[1] },
              { range: [2, 3], color: colors[2] },
              { range: [3, 4], color: colors[3] },
              { range: [4, 5], color: colors[4] },
              { range: [5, 6], color: colors[5] },
              { range: [6, 7], color: colors[6] },
              { range: [7, 8], color: colors[7] },
              { range: [8, 9], color: colors[8] }
            ],
            labelFont: { size: 15 }
          }
        }];
      //set layout of gauge
      let layout = {
        title: { text: "Belly Button Washing Frequency", font: { size: 30}},
        width: 500,
        height: 400,
        margin: { t: 50, r: 25, l: 25, b: 10 },
        font: { color: "darkblue", family: "Arial" }
      };
    //plot gauge to gauge class
    Plotly.newPlot('gauge', guageData, layout);
};


//initialize page
init();

