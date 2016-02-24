import d3 from 'd3';
import {FornaContainer} from 'fornac';
import {rnaUtilities} from 'rnautils';

import '../styles/treemap.css';
import '../styles/drforna.css';

function doStepwiseAnimation(elementName, structs, duration) {
    var container = new FornaContainer(elementName, {'applyForce': false,
                                       'allowPanningAndZooming': true,
                                       'labelInterval':0,
                                       'initialSize': null,
                                       'transitionDuration': duration });

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

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

export function cotranscriptionalTimeSeriesLayout() {
    var options = {'applyForce': false, 
        'allowPanningAndZooming': true,
        'labelInterval':0,
        'resizeSvgOnResize': false,    //don't trigger a reflow and keep things speedy
        'transitionDuration': 0}

    var margin = {top: 10, right: 60, bottom: 40, left: 50};
    var totalWidth = 700;
    var totalHeight = 400;

    var treemapWidth = totalWidth - margin.left - margin.right;
    var treemapHeight = totalHeight * 0.85 - margin.top - margin.bottom;

    var lineChartWidth = totalWidth - margin.left - margin.right;
    var lineChartHeight = totalHeight - treemapHeight - margin.top - margin.bottom;

    var lineX = d3.scale.linear().range([0, lineChartWidth]);
    var lineY = d3.scale.linear().range([lineChartHeight, 0]);

    var rectX = d3.scale.linear().range([0, lineChartWidth]);
    var rectY = d3.scale.linear().range([lineChartHeight, 0]);
    var line;

    var color = d3.scale.category20();
    var newTimePointCallback = null;
    var newTimeClickCallback = null;

    var treemap, wholeDiv, treemapDiv, labelSvg, labelDiv;
    var lineChartDiv, outlineDiv, svg, currentTime = 0; 

    var concProfilePaths = null;

    var gXAxis = null, gYAxis = null;
    var yAxisText = null, currentTimeIndicatorLine = null;
    var xAxis = null, yAxis = null;
    var xAxisOverlayRect = null;

    var updateTreemap = null;
    var root = null;

    function chart(selection) {
        selection.each(function(data) {
            treemap = d3.layout.treemap()
            .size([treemapWidth, treemapHeight])
            .sticky(false)
            .value(function(d) { return d.size; });

            wholeDiv = d3.select(this).append('div')
            .style('position', 'relative')
            .attr('id', 'whole-div');

            treemapDiv = wholeDiv.append('div')
            .classed('treemap-div', true)
            .style('position', 'absolute')
            .style('left', margin.left + 'px')
            .style('top', margin.top + 'px');


            labelDiv = wholeDiv.append('div')
            .style('position', 'absolute')
            .style('top', margin.top + 'px')

            labelSvg = labelDiv
            .append('svg')

            /*
            labelSvg.append('text')
            .attr('transform', `translate(${margin.left - 30}, 150)rotate(-90)`)
            .text('Structures')
            */

            lineChartDiv = wholeDiv.append('div')
            .style('position', 'absolute')
            .style('left', 0 + 'px')


            outlineDiv = wholeDiv.append('div')
            .classed('outline-div', true)
            .style('position', 'absolute')
            .style('left', margin.left + 'px')
            .style('top', margin.top + 'px');

            svg = lineChartDiv.append('svg')
            .attr('width', lineChartWidth)
            .attr('height', lineChartHeight)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            line = d3.svg.line()
            .interpolate('basis')
            .x(function(d) { return lineX(+d.time); })
            .y(function(d) { return lineY(+d.conc); });

            function divName(d) {
                return 'div' + d.name;
            }

            var bisectTime = d3.bisector(function(d) { return d.time; }).left;

            function drawCotranscriptionalLine() {
                let rainbowScale = (t) => { return d3.hcl(t * 360, 100, 55); };
                let nucleotideScale = d3.scale.linear()
                                      .domain([0, data[data.length-1].struct.length])
                                      .range([0,1]);

                calculateNucleotideColors(data);

                var dataByTime = d3.nest().key(function(d) { return +d.time;}).entries(data);
                calculateColorPerTimePoint(dataByTime);

                color.domain(d3.set(data.map(function(d) { return d.id })).values());

                lineX.domain(d3.extent(data, function(d) { return +d.time; }));
                lineY.domain(d3.extent(data, function(d) { return +d.conc; }));

                xAxis = d3.svg.axis()
                .scale(lineX)
                .orient('bottom');

                yAxis = d3.svg.axis()
                .scale(lineY)
                .orient('left')
                .ticks(0);

                var _xCoord = 0;
                var runAnimation = false;

                gXAxis = svg.append('g')
                .attr('class', 'x axis')
                .call(xAxis);

                gYAxis = svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis)

                yAxisText = gYAxis
                .append('text')
                .attr('dy', '.71em')
                .style('text-anchor', 'middle')
                .text('Time (Seconds)');

                svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + (0) + ',0)')
                .call(yAxis)
                .append('text')
                .attr('transform', 'translate(-30,0)rotate(-90)')
                .style('text-anchor', 'end')
                .text('Population');

                svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + (0) + ',0)')
                .call(yAxis)
                .append('text')
                .attr('transform', 'translate(-15,0)rotate(-90)')
                .style('text-anchor', 'end')
                .text('Density (%)');
                
                currentTimeIndicatorLine = svg.append('line')
                .attr('x1', currentTime)
                .attr('y1', 0)
                .attr('x2', currentTime)
                .attr('y2', lineChartHeight)
                .classed('time-indicator', true);


                // here we draw a little rectangle to indicate which stem each 
                // nucleotide is in at this time point
                let maxStructLength = 0;

                for (let i = 0; i < dataByTime.length ; i++) {
                    dataByTime[i].dt = 0;

                    // calculate the length of each rectangle
                    if (i < dataByTime.length - 1)
                        dataByTime[i].dt = (+dataByTime[i+1].key) - (+dataByTime[i].key)

                    // the length of the simulation as well as the length of the structure
                    // after it's fully transcribed
                    maxStructLength = +dataByTime[i].values[0].struct.length;
                }

                let minTime = d3.min(dataByTime.map((d) => { return d.key; }));
                let maxTime = d3.max(dataByTime.map((d) => { return d.key; }));
                /*
                */

                console.log('maxTime:', maxTime);
                console.log('maxTime.range():', rectX.range());
                rectX.domain([minTime, maxTime]);
                rectY.domain([0, maxStructLength]);

                let dataRectangles = svg.selectAll('.data-rectangle-group')
                .data(dataByTime)
                .enter()
                .append('g')
                .classed('data-rectangle-group', true)
                .attr('transform', (d) => { return `translate(${rectX(+d.key)},0)`; })
                .each(function(d) {
                    let rectWidth = Math.abs(rectX(+d.key) - rectX(+d.key + d.dt));
                    let rectPos = rectX(+d.key);

                    console.log('rectPos', rectPos, rectPos + rectWidth);
                    
                    d3.select(this).selectAll('.data-rectangle')
                    .data(d.values[0].colors)
                    .enter()
                    .append('rect')
                    .attr('y', (d,i) => { return rectY(i); })
                    .attr('height', Math.abs(rectY.range()[1] - rectY.range()[0]) / maxStructLength)
                    .attr('width', rectWidth)
                    .attr('fill', (d) => {return d;});
                
                });
                

                var nestedData = d3.nest().key(function(d) { return +d.id; }).entries(data)
                function createInitialRoot(nestedData) {
                    let root = {'name': 'graph',
                        'children': nestedData.map(function(d) { return {'name': d.key, 'struct': 
                                                   d.values[0].struct, 'size': 1 / nestedData.length,
                                                   'colors': d.values[0].colors};})};
                        return root;

                }

                var concProfile = svg.selectAll('.concProfile')
                .data(nestedData)
                .enter().append('g')
                .attr('class', 'concProfile');

                root = createInitialRoot(nestedData);
                let populatedValues = [];
                var containers = {};

                var node = treemapDiv.datum(root).selectAll('.treemapNode')
                .data(treemap.nodes)
                .enter().append('div')
                .attr('class', 'treemapNode')
                .attr('id', divName)
                .call(position)
                //.style('background', function(d) { return d.children ? color(d.name) : null; })
                //.text(function(d) { return d.children ? null : d.name; })
                .each(function(d) { 
                    if (typeof d.struct != 'undefined') {
                        containers[divName(d)] = new FornaContainer('#' + divName(d), options);
                        containers[divName(d)].transitionRNA(d.struct);
                        //containers[divName(d)].setOutlineColor(color(d.name));

                        let colorStrings = d.colors.map(function(d, i) {
                            return `${i+1}:${d}`;
                        });

                        let colorString = colorStrings.join(' ');

                        containers[divName(d)].addCustomColorsText(colorString);
                    }
                } );

                /*
                concProfilePaths = concProfile.append('path')
                .attr('class', 'line')
                .attr('d', function(d) { return line(d.values); })
                .style('stroke', function(d) { 
                    return color(d.key); 
                });
                */

                xAxisOverlayRect = svg.append('rect')
                .attr('class', 'overlay')
                .on('mouseover', function() { })
                .on('mousemove', mousemove)
                .on('click', mouseclick);

                wholeDiv
                .on('mouseenter', function() {
                    runAnimation = false;
                })
                .on('mouseleave', function() { 
                    runAnimation = true;

                    updateCurrentTime(_xCoord);
                    /*

                       var xy = d3.mouse(this);

                       if (xy[0] > treemapWidth + lineChartWidth) {
                       var root = createInitialRoot(nestedData);
                       updateTreemap(root);
                       }
                       */
                })

                 updateTreemap = function(root) {
                    var node = treemapDiv.datum(root).selectAll('.treemapNode')
                    .data(treemap.nodes)
                    .call(position)
                    .each(function(d) { 
                        if (typeof d.struct != 'undefined') {
                            var cont = containers[divName(d)];
                            cont.setSize();

                            //cont.setOutlineColor(color(d.name));
                        }
                    });
                }

                function calculateColorPerTimePoint(dataByTime) {
                    dataByTime.forEach((d) => {
                        d.values.sort((a,b) => { return b.conc - a.conc; });
                    });
                }

                function calculateNucleotideColors(data) {
                    data.forEach(function(d) {
                        // determine the colors of each nucleotide according to the position
                        // of the stem that they're in
                        // each 'd' is a line in the dr transfomer output
                        d.time = +d.time;
                        d.conc = +d.conc;

                        // get a pairtable and a list of the secondary structure elements
                        let pt = rnaUtilities.dotbracketToPairtable(d.struct);
                        let elements = rnaUtilities.ptToElements(pt, 0, 1, pt[0], []);

                        // store the colors of each nucleotide
                        let colors = Array(pt[0]).fill('white');

                        for (let i = 0; i < elements.length; i++) {
                            if (elements[i][0] != 's')
                                continue;     //we're not interested in anything but stems

                            // for each nucleotide in the stem
                            // assign it the stem's average nucleotide number
                            let averageBpNum = elements[i][2].reduce(
                                (a,b) => { return a+b }, 0) / elements[i][2].length;

                            // convert average nucleotide numbers to colors
                            elements[i][2].map((d) => { 
                                let nucleotideNormPosition = nucleotideScale(averageBpNum);
                                colors[d-1] = rainbowScale(nucleotideNormPosition);
                            });


                            // each structure gets its own set of structures
                            d.colors = colors;
                        }
                    });
                }

                function valuesAtXPoint(xCoord) {
                    // get the interpolated concentrations at a given coordinate

                    //saveSvgAsPng(document.getElementById('whole-div'), 'rnax.png', 4);
                    var y0 = lineX.invert(xCoord);

                    let i = bisectTime(data, y0, 1);
                    var values = nestedData.map(function(data) { 
                        var i = bisectTime(data.values, y0, 0)

                        if (i >= data.values.length || i == 0)
                            return {'name': data.key, 'struct': data.values[0].struct, 'size': 0};

                        var sc = d3.scale.linear()
                        .domain([data.values[i-1].time, data.values[i].time])
                        .range([data.values[i-1].conc, data.values[i].conc])

                        var value = sc(y0);

                        var retVal= {'name': data.key, 'struct': data.values[0].struct, 'size': +value};
                        containers[divName(retVal)].transitionRNA(data.values[i].struct)
                        return retVal;
                    });


                    return values;

                }

                function updateCurrentTime(xCoord) {
                    let values = valuesAtXPoint(xCoord);
                    populatedValues = values.filter(d => { return d.size > 0; });
                    
                    /*
                    console.log('values:', values);
                    console.log('populatedValues:', populatedValues);
                    */

                    if (newTimePointCallback != null)
                        newTimePointCallback(populatedValues);

                    root = {'name': 'graph',
                        'children': values };

                        updateTreemap(root);

                        currentTimeIndicatorLine.attr('x1', xCoord)
                        .attr('x2', xCoord);

                        if (runAnimation) {
                            _xCoord += lineChartWidth / 100;
                            //setTimeout(function() { updateCurrentTime(_xCoord); }, 300);
                        }

                }

                function mousemove() {
                    _xCoord = (d3.mouse(this)[0]);

                    updateCurrentTime(_xCoord);
                }

                function mouseclick() {
                    if (newTimeClickCallback != null)
                        newTimeClickCallback(populatedValues);
                }
            };


            drawCotranscriptionalLine();

            function position() {
              this.style('left', function(d) {  return d.x + 'px'; })
                  .style('top', function(d) { return d.y + 'px'; })
                  .style('width', function(d) { return Math.max(0, d.dx - 0) + 'px'; })
                  .style('height', function(d) { return Math.max(0, d.dy - 0) + 'px'; })
            }
        });

        updateDimensions();
    }

    var updateDimensions = function() {
        treemapWidth = totalWidth - margin.left - margin.right;
        treemapHeight = totalHeight * 0.85 - margin.top - margin.bottom;

        lineChartHeight = totalHeight - treemapHeight - margin.top - margin.bottom;

        lineChartWidth = totalWidth - margin.left - margin.right;
        lineChartHeight = totalHeight - treemapHeight - margin.top - margin.bottom;

        lineX = lineX.range([0, lineChartWidth]);
        lineY = lineY.range([lineChartHeight, 0]);

        wholeDiv
        .style('width', (treemapWidth + margin.left + margin.right) + 'px')
        .style('height', (treemapHeight + lineChartHeight + margin.top + margin.bottom) + 'px')

        treemapDiv
            .style('width', (treemapWidth) + 'px')
            .style('height', (treemapHeight) + 'px')

        labelDiv
            .style('width', margin.left + 'px')
            .style('height', treemapHeight)

        labelSvg
            .attr('width', margin.left + 'px')
            .attr('height', treemapHeight);

        lineChartDiv
            .style('width', (lineChartWidth + margin.right) + 'px')
            .style('height', (lineChartHeight + margin.bottom + margin.top) + 'px')
            .style('top', treemapHeight + 'px');

        outlineDiv
            .style('width', (treemapWidth) + 'px')
            .style('height', (treemapHeight) + 'px')

        line
            .x(function(d) { return lineX(+d.time); })
            .y(function(d) { return lineY(+d.conc); });

        if (gXAxis != null)
            gXAxis
                .attr('transform', 'translate(0,' + lineChartHeight + ')')

        if (gYAxis != null)
            gYAxis
                .attr('transform', 'translate(' + (0) + ',0)')

        if (xAxis != null) {
            xAxis.scale(lineX)

            gXAxis.call(xAxis);
        }

        if (yAxis != null) {
            yAxis.scale(lineY)

            gYAxis.call(yAxis)
        }

        if (xAxisOverlayRect != null)
            xAxisOverlayRect
                .attr('width', lineChartWidth)
                .attr('height', lineChartHeight)

        if (concProfilePaths != null)
            concProfilePaths
            .attr('d', function(d) { return line(d.values); })


        if (yAxisText != null)
            yAxisText
                .attr('x', lineChartWidth /2)
                .attr('y', lineChartHeight + 25)
        
        if (currentTimeIndicatorLine != null)
            currentTimeIndicatorLine
            .attr('y2', lineChartHeight)

        treemap.size([treemapWidth, treemapHeight])

        if (updateTreemap != null)
            updateTreemap(root)
    }

    chart.updateDimensions = updateDimensions;

    chart.width = function(_) {
        if (!arguments.length) return totalWidth;
        else totalWidth = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return totalHeight;
        else totalHeight = _;
        return chart;
    };

    chart.newTimePointCallback = function(_) {
        if (!arguments.length) return options.newTimePointCallback;
        else newTimePointCallback = _;
        return chart;
    }

    chart.newTimeClickCallback = function(_) {
        if (!arguments.length) return options.newTimeClickCallback;
        else newTimeClickCallback = _;
        return chart;
    }

    return chart;
}

export function cotranscriptionalSmallMultiplesLayout() {
    // set all of the parameters
    var padding = [10,10];
    var treemapWidth = 160;
    var treemapHeight = 160;
    var svgWidth = 550;
    var svgHeight = 0;
    var textHeight = 15;

    function getOrCreateSequence(cotranscriptionalState) {
        // extract the sequence from a line of coTranscriptional output
        // and if it doesn't exist (which it shouldn't), just return
        // a string of As
        var letters;
        if ('seq' in cotranscriptionalState)
            return cotranscriptionalState['seq']
        else {
            letters = '';
            for (var i = 0; i < cotranscriptionalState['struct'].length; i++)
                letters = letters + 'A';
        }

        return letters;
    };

    var chart = function(selection) {
        selection.each(function(data) {

            var nestedData = d3.nest().key(function(d) { return d.time; }).entries(data);
            nestedData.sort(function(a,b) { return (+a.key) - (+b.key); });

            var inputData = nestedData.map(function(x) {
                return { 
                    'children': x.values.map(function(y) {
                        return { 
                            'structure': y.struct,
                            'sequence': getOrCreateSequence(y),
                            'size': y.conc,
                            'time': y.time
                        };
                    })
                }});


            // calculate the number of columns and the height of the SVG,
            // which is dependent on the on the number of data points
            var numCols = Math.floor((svgWidth + padding[0]) / (treemapWidth + padding[0]));
            var svgHeight = Math.ceil(inputData.length / numCols) * (treemapHeight + padding[1]) - padding[1];

            // the rna treemap layout, which will be called for every grid point
            var rnaTreemap = rnaTreemapChart()
            .width(treemapWidth)
            .height(treemapHeight - textHeight)

            // the grid layout that will determine the position of each
            // treemap
            var rectGrid = d3.layout.grid()
            .bands()
            .size([svgWidth, svgHeight])
            .cols(numCols)
            .padding(padding)
            .nodeSize([treemapWidth, treemapHeight]);
            var rectData = rectGrid(inputData)
                .map(function(d) { 
                    d.pos = { x: d.x, y: d.y }
                    return d;
                });

            // create an svg as a child of the #rna_ss div
            // and then a g for each grid cell
            var svg = d3.select(this)
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)

            svg.selectAll('.rna-treemap')
            .data(rectData)
            .enter()
            .append('g')
            .attr('transform', function(d) { 
                return 'translate(' + d.x + ',' + d.y + ')'; })
            .classed('rna-treemap', true)
            .call(rnaTreemap);

            svg.selectAll('.time-g')
            .data(rectData)
            .enter()
            .append('g')
            .attr('transform', function(d) { 
                return 'translate(' + d.pos.x + ',' + d.pos.y + ')'; })
            .classed('time-g', true)
            .append('text')
            .attr('x', treemapWidth / 2)
            .attr('y', treemapHeight - textHeight + 16)
            .classed('time-label', true)
            .text(function(d) { 
                  return 'time: ' + d.children[0].time
            });
        });
    };

    chart.width = function(_) {
        if (!arguments.length) return svgWidth;
        else svgWidth = _;
        return chart;
    }

    chart.height = function(_) {
        if (!arguments.length) return svgHeight;
        return chart;
    }


    return chart;
}

