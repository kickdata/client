


//Format A
var chart;
nv.addGraph(function() {
  chart = nv.models.scatterChart()
                .showDistX(true)
                .showDistY(true)
                //.height(500)
                .useVoronoi(true)
                .color(kickdataColors);

  chart.xAxis.tickFormat(d3.format('.02f'))
  chart.yAxis.tickFormat(d3.format('.02f'))

  d3.select('#test1 svg')
      .datum(randomData(13,40))
    .transition().duration(500)
      .call(chart);

  nv.utils.windowResize(chart.update);

  chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

  return chart;
});


function randomData(groups, points) { //# groups,# points per group
  var data = [],
      shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
      random = d3.random.normal();

  for (i = 0; i < groups; i++) {
    data.push({
      key: 'Name ' + i,
      values: []
    });

    for (j = 0; j < points; j++) {
      data[i].values.push({
        x: random(), 
        y: random(), 
        size: Math.random(), 
        shape: shapes[j % 6]
      });
    }
  }

  return data;
}

