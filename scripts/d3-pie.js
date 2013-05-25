$(document).ready(function() {

  // Function to transform data into pie chart data
  function csv2pie(data) {
    var dataset = {}
    _.each(data, function(row) {
      _.each(_.pairs(row), function(kv) {
        var key = kv[0];
        var value = kv[1];
        if (!dataset[key]) {
          dataset[key] = [];
        }
        dataset[key].push(value);
      });
    });
    return dataset;
  }

  $('.pie-chart').each(function() {
    var chartElem = this;
    var width = $('.chart',this).width(),
      height = $('.chart',this).height(),
      radius = Math.min(width, height) / 2;

    var colors = [ "#78eb05","#ff2505"];

    var pie = d3.layout.pie()
      .sort(null);

    var arc = d3.svg.arc()
      .innerRadius(radius - 75)
      .outerRadius(radius - 40);

    var node = $('.chart', this).get(0);
    var svg = d3.select(node).append('svg')
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.

    function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    }

    var source = $(this).attr('data-source');
    d3.csv(source, function(data) {
      dataset = csv2pie(data);

      var html = '<form class="span5">';
      _.each(_.keys(dataset), function(key, num) {
        html += '<label class="' + key +'"><input type="radio" name="dataset" value="' + key + '" >' + key + '</label>';
      });
      html += "</form>";
      $(chartElem).append(html);

      $(chartElem).append('<div class="percentage">12%</div>');
    
      $('input:first',chartElem).attr('checked','checked');

      function updatePercent() {
        var selectedValue = $('input:checked',chartElem).val();
        var failedNum = parseFloat(dataset[selectedValue][1]);
        var successNum = parseFloat(dataset[selectedValue][0]);
        var successRate = successNum / (failedNum+successNum);
        successRate = Math.floor(successRate * 100)
        $('.percentage',chartElem).html(successRate + "%");        
      }

      $('input',chartElem).change(function() {
        var selectedValue = $('input:checked',chartElem).val();
        updatePercent();
        path = path.data(pie(dataset[selectedValue])); // update the data
        path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
      });

      var selectedValue = $('input:checked',chartElem).val();
      updatePercent();
      var path = svg.selectAll("path")
        .data(pie(dataset[selectedValue]))
        .enter().append("path")
        .attr("fill", function(d, i) {
        return colors[i];
      })
        .attr("d", arc)
        .each(function(d) {
        this._current = d;
      }); // store the initial values


      pie(dataset[$('input[name="dataset"]').val()])
    });
  });

});