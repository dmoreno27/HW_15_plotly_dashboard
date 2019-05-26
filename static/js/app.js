function buildMetadata(sample) {
  var url = "/metadata/" + sample;


  d3.json(url).then(function (sample_metadata) {



    // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.select('#sample-metadata').html("");
    // Object.entries(response).forEach(([key, value]) => console.log(`Key: ${key} and Value ${value}`));
    Object.entries(sample_metadata).forEach(([key, value]) => d3.select('#sample-metadata').append("p").text(`${key}: ${value}`));
    console.log(sample_metadata.WFREQ);

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    d3.select('#gauge').html("");

    // Enter a speed between 0 and 180
    var level = sample_metadata.WFREQ;

    // Trig to calc meter point
    // var degrees = 180 - level,
    var degrees = 180 - (180/9)* level,
      radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data3 = [{
      type: 'scatter',
      x: [0], y: [0],
      marker: { size: 25, color: '#ff0000' },
      showlegend: false,
      name: 'speed',
      text: level,
      hoverinfo: 'text+name'
    },
    {
      // values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9],
      values:[ 50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6',
                '4-5', '3-4', '2-3','1-2','0-1', ''],
      textinfo: 'text',
      textposition: 'inside',
      marker: {
        colors: ['rgba(14, 127, 0, 0.99)',
        'rgba(14, 127, 0, 0.88)', 'rgba(14, 127, 0, 0.77 )',
        'rgba(14, 127, 0, 0.66)', 'rgba(14, 127, 0, 0.55)',
        'rgba(14, 127, 0, 0.44)', 'rgba(14, 127, 0, 0.33)',
        'rgba(14, 127, 0, 0.22)','rgba(14, 127, 0, 0.11)',
          'rgba(255, 255, 255, 0)']
      },
      labels: ['8-9', '7-8', '6-7', '5-6',
      '4-5', '3-4', '2-3','1-2','0-1', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout3 = {
      shapes: [{
        type: 'path',
        path: path,
        fillcolor: '#ff0000',
        line: {
          color: '#ff0000'
        }
      }],
      title: 'Belly Button Washing Frequency<br>Scrubs Per Week',
      // height: 1000,
      // width: 1000,
      xaxis: {
        zeroline: false, showticklabels: false,
        showgrid: false, range: [-1, 1]
      },
      yaxis: {
        zeroline: false, showticklabels: false,
        showgrid: false, range: [-1, 1]
      }
    };

    Plotly.newPlot('gauge', data3, layout3);



  });

};
// BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);



function buildCharts(sample) {
  var url = "/samples/" + sample;
  function get_top_ten(item) {
    return item.slice(0, 10);
  }

  d3.json(url).then(function (samples_data) {

    var arr = [];
    var len = samples_data.sample_values.length;
    for (var i = 0; i < len; i++) {
      arr.push({
        otu_labels: samples_data.otu_labels[i],
        otu_ids: samples_data.otu_ids[i],
        sample_values: samples_data.sample_values[i]
      });

    };
    var arr = arr.sort(function (a, b) { return b.sample_values - a.sample_values });




    // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data
    d3.select('#bubble').html("");

    var bubble_x = [];
    var bubble_y = [];
    var bubble_labels = [];
    for (var item in arr) {
      bubble_x.push(arr[item].otu_ids);
      bubble_y.push(arr[item].sample_values);
      bubble_labels.push(arr[item].otu_labels);
    };
    var trace1 = {

      x: bubble_x,
      y: bubble_y,
      text: bubble_labels,
      mode: 'markers',
      marker: {
        color: bubble_x,
        size: bubble_y
      }
    };
    var data1 = [trace1];
    // var layout1 = { title: "Bubble Chart" };
    Plotly.newPlot("bubble", data1);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    // top_ten = arr.sort(function (a, b) { return b.sample_values - a.sample_values }).slice(0, 10);

    // var values = [];
    // var labels = [];
    // var texts = [];
    // for (var item in top_ten) {
    //   values.push(top_ten[item].sample_values);
    //   labels.push(top_ten[item].otu_ids);
    //   texts.push(top_ten[item].otu_labels);
    // };

    // d3.select('#pie').html("");
    // var trace2 = {
    //   labels: labels,
    //   values: values,
    //   text: texts,
    //   hoverinfo: 'text',
    //   type: "pie",
    //   textinfo: "value"
    // };
    // var data2 = [trace2];
    // var layout2 = { title: "Pie Chart" };
    // Plotly.newPlot("pie", data2, layout2);


    d3.select('#pie').html("");
    var trace2 = {
      labels: get_top_ten(bubble_x),
      values: get_top_ten(bubble_y),
      text: get_top_ten(bubble_labels),
      hoverinfo: 'text',
      type: "pie",
      textinfo: "percent"
    };
    var data2 = [trace2];
    Plotly.newPlot("pie", data2);

  });
};




function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();