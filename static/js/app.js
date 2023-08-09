
function init() {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then( function (data) {
        console.log("data", data);
        let names = data.names;
        setNames(names);
        let samples = data.samples;
        makeGraph(data.samples[0])
        makeBubbleChart(data.samples[0])
        getValues(data.metadata[0])
        makeGuage(data.metadata[0].wfreq)
    });
};



function getData(data) {
    return data
}

function setNames(names) {
    let dropDown = d3.select("#selDataset");
    
    for (i=0; i < names.length ; i++) {
        let addChoice = dropDown.append("option");
        addChoice.text(`${names[i]}`);
    }
};

function makeGraph(data) {
    let [x, y, labels] = getTopOtus(data)
    let trace = {
        x: y,
        y: x,
        text: labels,
        type: "bar",
        orientation: "h"
    }
    let traceData = [trace]
    let layout = {
        title: "Top 10 OTUs"
    }
    Plotly.newPlot("bar", traceData, layout);  
}

function makeBubbleChart(data) {
    let x = data.otu_ids
    let y = data.sample_values
    let trace = {
        x: x,
        y: y,
        text: data.otu_labels,
        mode: "markers",
        marker: {
            size: y,
            color: x
        },
        showscale: true
    }
    let traceData = [trace]
 

    let layout = {
        xaxis: {
            title: "OTU IDs"
        }
    }

    Plotly.newPlot("bubble", traceData, layout);  

}


function optionChanged(value) {
    // Use D3 to select the dropdown menu
    let dropdownMenu = value;
    // console.log("DropDownChange",dropdownMenu)

    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then( function (data) {
        let samples = data.samples;
        let metadata = data.metadata;
        let id = samples.filter( samples => samples.id == dropdownMenu)
        let metaId = metadata.filter( metadata => metadata.id == dropdownMenu)
        makeGraph(id[0])
        // let [x, y, labels] = getTopOtus(id[0])
        // let trace = [{
        //     x: y,
        //     y: x,
        //     text: labels,
        //     type: "bar",
        //     orientation: "h"
        // }]
        // updatePlotly(trace)
        makeBubbleChart(id[0])
        getValues(metaId[0])
        makeGuage(metaId[0].wfreq)
    });
  }

// function updatePlotly(newdata) {
//     console.log(newdata);
//     Plotly.restyle("bar", "values", newdata[0]);
// };

function getTopOtus(id) {
    let otu_ids = id.otu_ids
    // console.log("otuIds1",Array.isArray(otu_ids))
    let top10otus = []
    let top10values = []
    let top10labels = []
    if (otu_ids.length > 10) {
        for (i = 0; i < 10; i++) {
            top10otus.push(`OTU ${otu_ids[i]}`)
            top10values.push(id.sample_values[i])
            top10labels.push(id.otu_labels[i])
        }
    }
    else {
        for (i = 0; i < otu_ids.length; i++) {
            top10otus.push(`OTU ${otu_ids[i]}`)
            top10values.push(id.sample_values[i])
            top10labels.push(id.otu_labels[i])
        }
    }
    top10otus.reverse()
    top10values.reverse()
    top10labels.reverse()
    // console.log("top_otus", top10otus)
    // console.log("top10values", top10values)
    return [top10otus, top10values, top10labels]
};

function getValues(id) {
    let panelBody = d3.select("#sample-metadata")

    if (d3.select("#metaId").empty()) {
        panelBody.append('p').text(`id: ${id.id}`).attr('id', "metaId")   
        panelBody.append('p').text(`ethnicity: ${id.ethnicity}`).attr('id', "metaEth")
        panelBody.append('p').text(`gender: ${id.gender}`).attr('id', "metaGen")
        panelBody.append('p').text(`age: ${id.age}`).attr('id', "metaAge")
        panelBody.append('p').text(`location: ${id.location}`).attr('id', "metaLoc")
        panelBody.append('p').text(`bbtype: ${id.bbtype}`).attr('id', "metaBbt")
        panelBody.append('p').text(`wfreq: ${id.wfreq}`).attr('id', "metaWfr")     
    }
    else {
        d3.select("#metaId").text(`id: ${id.id}`)
        d3.select("#metaEth").text(`ethnicity: ${id.ethnicity}`)
        d3.select("#metaGen").text(`gender: ${id.gender}`)
        d3.select("#metaAge").text(`age: ${id.age}`)
        d3.select("#metaLoc").text(`location: ${id.location}`)
        d3.select("#metaBbt").text(`bbtype: ${id.bbtype}`)
        d3.select("#metaWfr").text(`wfreq: ${id.wfreq}`)

    }
    
}

function makeGuage(data) {
    var data = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: data,
          title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
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
            bar: { color: "darkblue" },
            pointer: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 1], color: "#D9EFFF" },
              { range: [1, 2], color: "#B5DFFA" },
              { range: [2, 3], color: "#8CC2F5" },
              { range: [3, 4], color: "#62A5F0" },
              { range: [4, 5], color: "#3E88EB" },
              { range: [5, 6], color: "#256AE6" },
              { range: [6, 7], color: "#1752C1" },
              { range: [7, 8], color: "#103E99" },
              { range: [8, 9], color: "#0B2D72" }
            ],
            labelFont: { size: 12 }
          }
        }
      ];
      
      var layout = {
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        font: { color: "darkblue", family: "Arial" }
      };
    Plotly.newPlot('gauge', data, layout);
}



init();

