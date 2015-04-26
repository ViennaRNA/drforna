function doStepwiseAnimation(elementName, structs, duration) {
    var container = new FornaContainer(elementName, {'applyForce': false,
            'allowPanningAndZooming': true,
            "labelInterval":0,
            "initialSize": [800,800],
            "transitionDuration": duration });

    var funcs = []

        for (i = 0; i < structs.length; i++) {
            if (funcs.length === 0)
                (function(val) { funcs.push(function() { container.transitionRNA(structs[val]); container.setOutlineColor('white');
                                            })} )(i);
            else
                (function(val, prevFunc) { funcs.push(function() { container.transitionRNA(structs[val], prevFunc); container.setOutlineColor('white');
                                                      })} )(i, funcs[funcs.length-1] );
        }

    funcs[funcs.length-1]();
}

function createCotranscriptionalTreemap(element, filename) {
var options = {'applyForce': false, 
        'allowPanningAndZooming': true,
        "labelInterval":0,
        "initialSize": [800,800],
        "transitionDuration": 0 }

var margin = {top: 10, right: 60, bottom: 40, left: 10},
    totalWidth = 800
    totalHeight = 500

    treemapWidth = totalWidth * 0.75 - margin.left - margin.right,
    treemapHeight = totalHeight - margin.top - margin.bottom,

    lineChartWidth = totalWidth - treemapWidth - margin.left - margin.right,
    lineChartHeight = totalHeight - margin.top - margin.bottom;


var lineX = d3.scale.linear().range([0, lineChartWidth]);
var lineY = d3.scale.linear().range([0, lineChartHeight]);



var color = d3.scale.category20();

var treemap = d3.layout.treemap()
    .size([treemapWidth, treemapHeight])
    .sticky(false)
    .value(function(d) { return d.size; });

var wholeDiv = d3.select(element).append("div")
    .style("position", "relative")
    .style("width", (treemapWidth + lineChartWidth + margin.left + margin.right) + "px")
    .style("height", (treemapHeight + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

var treemapDiv = wholeDiv.append("div")
    .style("position", "absolute")
    .style("width", (treemapWidth) + "px")
    .style("height", (treemapHeight + margin.bottom) + "px")
    .style("left", 0 + "px")
    .style("top", margin.top + "px");

var lineChartDiv = wholeDiv.append("div")
    .style("position", "absolute")
    .style("width", (lineChartWidth + margin.right) + "px")
    .style("height", (lineChartHeight + margin.bottom + margin.top) + "px")
    .style("left", treemapWidth + "px")
    .style("top", 0 + "px");

var svg = lineChartDiv.append("svg")
.attr("width", lineChartWidth)
.attr("height", lineChartHeight)
.append("g")
.attr('transform', "translate(0," + margin.top + ")");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return lineX(+d.conc); })
    .y(function(d) { return lineY(+d.time); });


function divName(d) {
    return "div" + d.name;
}

var bisectTime = d3.bisector(function(d) { return d.time; }).left;

function drawCotranscriptionalLine() {
    d3.dsv(" ", 'text/plain')(filename, function(error, data) {
            data.forEach(function(d) {
                d.time = +d.time;
                d.conc = +d.conc;
                //d.full_id = d.id + '-' + d.struct.length;
                //console.log('d.full_id', d.full_id);
                    });

        color.domain(d3.set(data.map(function(d) { return d.id })).values());

        lineX.domain(d3.extent(data, function(d) { return +d.conc; }));
        lineY.domain(d3.extent(data, function(d) { return +d.time; }));

    var xAxis = d3.svg.axis()
        .scale(lineX)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(lineY)
        .orient("right");
        console.log('extent:', d3.extent(data, function(d) { return +d.time}));
        
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + lineChartHeight + ")")
    .call(xAxis);

    svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (lineChartWidth) + ",0)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr('x', -10)
    .attr("y", 35)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Time (Seconds)");

        var nestedData = d3.nest().key(function(d) { return +d.id; }).entries(data)
        var concProfile = svg.selectAll(".concProfile")
        .data(nestedData)
        .enter().append("g")
        .attr("class", "concProfile");

        function createInitialRoot(nestedData) {
          var root = {"name": "graph",
              "children": nestedData.map(function(d) { return {"name": d.key, "struct": 
                        d.values[0].struct, "size": 1 / nestedData.length};})};
          return root;

        }
        var root = createInitialRoot(nestedData);

      var containers = {};

      var node = treemapDiv.datum(root).selectAll(".treemapNode")
          .data(treemap.nodes)
        .enter().append("div")
          .attr("class", "treemapNode")
          .attr("id", divName)
          .call(position)
          //.style("background", function(d) { return d.children ? color(d.name) : null; })
          //.text(function(d) { return d.children ? null : d.name; })
          .each(function(d) { 
                  if (typeof d.struct != 'undefined') {
                  containers[divName(d)] = new FornaContainer("#" + divName(d), options);
                  containers[divName(d)].transitionRNA(d.struct);
                  containers[divName(d)].setOutlineColor(color(d.name));
                  }
                  } );

        concProfile.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { 
            return color(d.key); 
            });

            svg.append("rect")
            .attr("class", "overlay")
            .attr("width", lineChartWidth)
            .attr("height", lineChartHeight)
            .on("mouseover", function() { })
            .on("mousemove", mousemove);

            wholeDiv
                .on("mouseout", function() { 
                        var xy = d3.mouse(this);

                        /*
                        if (xy[0] < 0 || xy[1] < margin.top || 
                                xy[0] > treemapWidth + lineChartWidth ||
                                xy[1] > treemapHeight + margin.top) {
                        */
                        if (xy[0] > treemapWidth + lineChartWidth) {
                        /*
                           console.log('d3.mouse(this)', d3.mouse(this));
                           console.log('this', this, treemapHeight + margin.top, treemapWidth + lineChartWidth);
                         */

                        var root = createInitialRoot(nestedData);
                        updateTreemap(root);
                        }
                        })

            function updateTreemap(root) {
                var node = treemapDiv.datum(root).selectAll(".treemapNode")
                    .data(treemap.nodes)
                    .call(position)
                    .each(function(d) { 
                            if (typeof d.struct != 'undefined') {
                                var cont = containers[divName(d)];
                                cont.setSize();

                                cont.setOutlineColor(color(d.name));
                            }
                    });
            }

            function mousemove() {
                var y0 = lineY.invert(d3.mouse(this)[1]);
                i = bisectTime(data, y0, 1);
                var values = nestedData.map(function(data) { 
                        var i = bisectTime(data.values, y0, 0)

                        if (i >= data.values.length || i == 0)
                            return {"name": data.key, "struct": data.values[0].struct, "size": 0};

                        var d0 = data.values[i-1];
                        var d1 = data.values[i];

                        var sc = d3.scale.linear()
                        .domain([data.values[i-1].time, data.values[i].time])
                        .range([data.values[i-1].conc, data.values[i].conc])

                        var value = sc(y0);

                        var retVal= {"name": data.key, "struct": data.values[0].struct, "size": +value};
                        containers[divName(retVal)].transitionRNA(data.values[i].struct)
                        return retVal;
                        });

                var root = {"name": "graph",
                    "children": values };

                updateTreemap(root);
            }
    });
}

drawCotranscriptionalLine();

function position() {
  this.style("left", function(d) {  return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}
    }

