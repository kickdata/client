          var dataset = {
            art: [20, 70],
            comics: [50,50],
            dance: [20, 70],
            design: [50,50],
            fashion: [20, 70],
            film: [50,50],
            food: [20, 70],
            games: [50,50],
            music: [20, 70],
            photography: [50,50],
            publishing: [20, 70],
            technology: [50,50],
            theater: [20, 70]
          };

          var width = 300,
              height = 300,
              radius = Math.min(width, height) / 2;

          var color = ["#ff2505","#78eb05"];

          var pie = d3.layout.pie()
              .sort(null);

          var arc = d3.svg.arc()
              .innerRadius(radius - 75)
              .outerRadius(radius - 40);

          var svg = d3.select(".chart").append("svg")
              .attr("width", width)
              .attr("height", height)
            .append("g")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

          var path = svg.selectAll("path")
              .data(pie(dataset.art))
            .enter().append("path")
              .attr("fill", function(d, i) { return color[i]; })
              .attr("d", arc)
              .each(function(d) { this._current = d; }); // store the initial values

          d3.selectAll("input").on("change", change);

          var timeout = setTimeout(function() {
            d3.select("input[value=\"art\"]").property("checked", true).each(change);
          }, 2000);

          function change() {
            clearTimeout(timeout);
            path = path.data(pie(dataset[this.value])); // update the data
            path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
          }

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