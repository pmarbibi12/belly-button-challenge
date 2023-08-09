d3.json("./static/js/samples.json").then( function (data) {
    // console.log("data", data);
    let names = data.names;
    // console.log("names",names);
    setNames(names);
    let samples = data.samples;
    // console.log("samples", samples);
    // getTopOtus( samples ,samples[0]["id"])
    // console.log("sample1name",samples[0]["id"])
    makeGraph(data.samples[0])
    makeBubbleChart(data.samples[0])
    getValues(data.metadata[0])
});

function setNames(names) {
    let dropDown = d3.select("#selDataset");
    for (i=0; i < names.length ; i++) {
        let addChoice = dropDown.append("option");
        addChoice.text(`${names[i]}`);
    }
};

function makeGraph(data) {
    // let names = data.names;
    // setNames(names)
    // let samples = data.samples;
    let [x,y, labels] = getTopOtus(data)
    // console.log("x",x)
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
        showscale: true,
        colorscale: 'Viridis'
    }
    let traceData = [trace]

    let y_max = Math.max(y)
    let y_min = Math.min(y)
    let yavg = (y_max + y_min)/2

    let x_max = Math.max(x)
    let x_min = Math.min(x)
    let xavg = ((x_max + x_min)-(x_max- x_min))
    

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

    d3.json("./static/js/samples.json").then( function (data) {
        let samples = data.samples;
        let metadata = data.metadata;
        let id = samples.filter( samples => samples.id == dropdownMenu)
        let metaId = metadata.filter( metadata => metadata.id == dropdownMenu)
        console.log("metaId", metaId[0])
        makeGraph(id[0])
        makeBubbleChart(id[0])
        getValues(metaId[0])
    });
  }


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

// let names = data.names;

// console.log("names",names);

// let metadata = jsonData.metadata;
// let samples = jsonData.samples;




