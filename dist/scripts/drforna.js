(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["drforna"] = factory();
	else
		root["drforna"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.cotranscriptionalTimeSeriesLayout = cotranscriptionalTimeSeriesLayout;
	exports.cotranscriptionalSmallMultiplesLayout = cotranscriptionalSmallMultiplesLayout;

	var _d = __webpack_require__(2);

	var _d2 = _interopRequireDefault(_d);

	var _fornac = __webpack_require__(3);

	__webpack_require__(4);

	__webpack_require__(8);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function doStepwiseAnimation(elementName, structs, duration) {
	    var container = new _fornac.FornaContainer(elementName, { 'applyForce': false,
	        'allowPanningAndZooming': true,
	        'labelInterval': 0,
	        'initialSize': [800, 800],
	        'transitionDuration': duration });

	    var funcs = [];

	    for (i = 0; i < structs.length; i++) {
	        if (funcs.length === 0) (function (val) {
	            funcs.push(function () {
	                container.transitionRNA(structs[val]);container.setOutlineColor('white');
	            });
	        })(i);else (function (val, prevFunc) {
	            funcs.push(function () {
	                container.transitionRNA(structs[val], prevFunc);container.setOutlineColor('white');
	            });
	        })(i, funcs[funcs.length - 1]);
	    }

	    funcs[funcs.length - 1]();
	}

	function cotranscriptionalTimeSeriesLayout() {
	    var options = { 'applyForce': false,
	        'allowPanningAndZooming': true,
	        'labelInterval': 0,
	        'resizeSvgOnResize': false, //don't trigger a reflow and keep things speedy
	        'transitionDuration': 0 };

	    var margin = { top: 10, right: 60, bottom: 40, left: 50 };
	    var totalWidth = 700;
	    var totalHeight = 400;

	    var treemapWidth = totalWidth - margin.left - margin.right;
	    var treemapHeight = totalHeight * 0.85 - margin.top - margin.bottom;

	    var lineChartWidth = totalWidth - margin.left - margin.right;
	    var lineChartHeight = totalHeight - treemapHeight - margin.top - margin.bottom;

	    var lineX = _d2.default.scale.linear().range([0, lineChartWidth]);
	    var lineY = _d2.default.scale.linear().range([lineChartHeight, 0]);

	    var color = _d2.default.scale.category20();
	    var newTimePointCallback = null;
	    var newTimeClickCallback = null;

	    function chart(selection) {
	        selection.each(function (data) {

	            var treemap = _d2.default.layout.treemap().size([treemapWidth, treemapHeight]).sticky(false).value(function (d) {
	                return d.size;
	            });

	            var wholeDiv = _d2.default.select(this).append('div').style('position', 'relative').style('width', treemapWidth + margin.left + margin.right + 'px').style('height', treemapHeight + lineChartHeight + margin.top + margin.bottom + 'px').attr('id', 'whole-div');

	            var treemapDiv = wholeDiv.append('div').classed('treemap-div', true).style('position', 'absolute').style('width', treemapWidth + 'px').style('height', treemapHeight + 'px').style('left', margin.left + 'px').style('top', margin.top + 'px');

	            var labelSvg = wholeDiv.append('div').style('position', 'absolute').style('width', margin.left + 'px').style('height', treemapHeight).style('top', margin.top + 'px').append('svg').attr('width', margin.left + 'px').attr('height', treemapHeight);

	            labelSvg.append('text').attr('transform', 'translate(' + (margin.left - 30) + ', 150)rotate(-90)').text('Structures');

	            var lineChartDiv = wholeDiv.append('div').style('position', 'absolute').style('width', lineChartWidth + margin.right + 'px').style('height', lineChartHeight + margin.bottom + margin.top + 'px').style('left', 0 + 'px').style('top', treemapHeight + 'px');

	            var outlineDiv = wholeDiv.append('div').classed('outline-div', true).style('position', 'absolute').style('width', treemapWidth + 'px').style('height', treemapHeight + 'px').style('left', margin.left + 'px').style('top', margin.top + 'px');

	            var svg = lineChartDiv.append('svg').attr('width', lineChartWidth).attr('height', lineChartHeight).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	            var line = _d2.default.svg.line().interpolate('basis').x(function (d) {
	                return lineX(+d.time);
	            }).y(function (d) {
	                return lineY(+d.conc);
	            });

	            function divName(d) {
	                return 'div' + d.name;
	            }

	            var bisectTime = _d2.default.bisector(function (d) {
	                return d.time;
	            }).left;

	            function drawCotranscriptionalLine() {
	                data.forEach(function (d) {
	                    d.time = +d.time;
	                    d.conc = +d.conc;
	                    //d.full_id = d.id + '-' + d.struct.length;
	                    //console.log('d.full_id', d.full_id);
	                });

	                color.domain(_d2.default.set(data.map(function (d) {
	                    return d.id;
	                })).values());

	                lineX.domain(_d2.default.extent(data, function (d) {
	                    return +d.time;
	                }));
	                lineY.domain(_d2.default.extent(data, function (d) {
	                    return +d.conc;
	                }));

	                var xAxis = _d2.default.svg.axis().scale(lineX).orient('bottom');

	                var yAxis = _d2.default.svg.axis().scale(lineY).orient('left').ticks(0);

	                var _xCoord = 0;
	                var runAnimation = false;

	                svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + lineChartHeight + ')').call(xAxis);

	                svg.append('g').attr('class', 'y axis').attr('transform', 'translate(' + 0 + ',0)').call(yAxis).append('text').attr('x', lineChartWidth / 2).attr('y', lineChartHeight + 25).attr('dy', '.71em').style('text-anchor', 'middle').text('Time (Seconds)');

	                svg.append('g').attr('class', 'y axis').attr('transform', 'translate(' + 0 + ',0)').call(yAxis).append('text').attr('transform', 'translate(-30,0)rotate(-90)').style('text-anchor', 'end').text('Population');

	                svg.append('g').attr('class', 'y axis').attr('transform', 'translate(' + 0 + ',0)').call(yAxis).append('text').attr('transform', 'translate(-15,0)rotate(-90)').style('text-anchor', 'end').text('Density (%)');

	                var currentTimeIndicatorLine = svg.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', lineChartHeight).classed('time-indicator', true);

	                var nestedData = _d2.default.nest().key(function (d) {
	                    return +d.id;
	                }).entries(data);
	                var concProfile = svg.selectAll('.concProfile').data(nestedData).enter().append('g').attr('class', 'concProfile');

	                function createInitialRoot(nestedData) {
	                    var root = { 'name': 'graph',
	                        'children': nestedData.map(function (d) {
	                            return { 'name': d.key, 'struct': d.values[0].struct, 'size': 1 / nestedData.length };
	                        }) };
	                    return root;
	                }

	                var root = createInitialRoot(nestedData);
	                var populatedValues = [];
	                var containers = {};

	                var node = treemapDiv.datum(root).selectAll('.treemapNode').data(treemap.nodes).enter().append('div').attr('class', 'treemapNode').attr('id', divName).call(position)
	                //.style('background', function(d) { return d.children ? color(d.name) : null; })
	                //.text(function(d) { return d.children ? null : d.name; })
	                .each(function (d) {
	                    if (typeof d.struct != 'undefined') {
	                        containers[divName(d)] = new _fornac.FornaContainer('#' + divName(d), options);
	                        containers[divName(d)].transitionRNA(d.struct);
	                        containers[divName(d)].setOutlineColor(color(d.name));
	                    }
	                });

	                concProfile.append('path').attr('class', 'line').attr('d', function (d) {
	                    return line(d.values);
	                }).style('stroke', function (d) {
	                    return color(d.key);
	                });

	                svg.append('rect').attr('class', 'overlay').attr('width', lineChartWidth).attr('height', lineChartHeight).on('mouseover', function () {}).on('mousemove', mousemove).on('click', mouseclick);

	                wholeDiv.on('mouseenter', function () {
	                    runAnimation = false;
	                }).on('mouseleave', function () {
	                    runAnimation = true;

	                    updateCurrentTime(_xCoord);
	                    /*
	                       console.log('mouseleave');
	                        var xy = d3.mouse(this);
	                        if (xy[0] > treemapWidth + lineChartWidth) {
	                       var root = createInitialRoot(nestedData);
	                       updateTreemap(root);
	                       }
	                       */
	                });

	                function updateTreemap(root) {
	                    var node = treemapDiv.datum(root).selectAll('.treemapNode').data(treemap.nodes).call(position).each(function (d) {
	                        if (typeof d.struct != 'undefined') {
	                            var cont = containers[divName(d)];
	                            cont.setSize();

	                            cont.setOutlineColor(color(d.name));
	                        }
	                    });
	                }

	                function updateCurrentTime(xCoord) {
	                    //saveSvgAsPng(document.getElementById('whole-div'), 'rnax.png', 4);

	                    var y0 = lineX.invert(xCoord);

	                    var i = bisectTime(data, y0, 1);
	                    var values = nestedData.map(function (data) {
	                        var i = bisectTime(data.values, y0, 0);

	                        if (i >= data.values.length || i == 0) return { 'name': data.key, 'struct': data.values[0].struct, 'size': 0 };

	                        var d0 = data.values[i - 1];
	                        var d1 = data.values[i];

	                        var sc = _d2.default.scale.linear().domain([data.values[i - 1].time, data.values[i].time]).range([data.values[i - 1].conc, data.values[i].conc]);

	                        var value = sc(y0);

	                        var retVal = { 'name': data.key, 'struct': data.values[0].struct, 'size': +value };
	                        containers[divName(retVal)].transitionRNA(data.values[i].struct);
	                        return retVal;
	                    });

	                    populatedValues = values.filter(function (d) {
	                        return d.size > 0;
	                    });

	                    if (newTimePointCallback != null) newTimePointCallback(populatedValues);

	                    var root = { 'name': 'graph',
	                        'children': values };

	                    updateTreemap(root);

	                    currentTimeIndicatorLine.attr('x1', xCoord).attr('x2', xCoord);

	                    if (runAnimation) {
	                        _xCoord += lineChartWidth / 100;
	                        //setTimeout(function() { updateCurrentTime(_xCoord); }, 300);
	                    }
	                }

	                function mousemove() {
	                    _xCoord = _d2.default.mouse(this)[0];

	                    updateCurrentTime(_xCoord);
	                }

	                function mouseclick() {
	                    if (newTimeClickCallback != null) newTimeClickCallback(populatedValues);
	                }
	            };

	            drawCotranscriptionalLine();

	            function position() {
	                this.style('left', function (d) {
	                    return d.x + 'px';
	                }).style('top', function (d) {
	                    return d.y + 'px';
	                }).style('width', function (d) {
	                    return Math.max(0, d.dx - 0) + 'px';
	                }).style('height', function (d) {
	                    return Math.max(0, d.dy - 0) + 'px';
	                });
	            }
	        });
	    }

	    chart.width = function (_) {
	        if (!arguments.length) return totalWidth;else totalWidth = _;
	        return chart;
	    };

	    chart.height = function (_) {
	        if (!arguments.length) return totalHeight;else totalHeight = _;
	        return chart;
	    };

	    chart.newTimePointCallback = function (_) {
	        if (!arguments.length) return options.newTimePointCallback;else newTimePointCallback = _;
	        return chart;
	    };

	    chart.newTimeClickCallback = function (_) {
	        if (!arguments.length) return options.newTimeClickCallback;else newTimeClickCallback = _;
	        return chart;
	    };

	    return chart;
	}

	function cotranscriptionalSmallMultiplesLayout() {
	    // set all of the parameters
	    var padding = [10, 10];
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
	        if ('seq' in cotranscriptionalState) return cotranscriptionalState['seq'];else {
	            letters = '';
	            for (var i = 0; i < cotranscriptionalState['struct'].length; i++) {
	                letters = letters + 'A';
	            }
	        }

	        return letters;
	    };

	    var chart = function chart(selection) {
	        selection.each(function (data) {

	            var nestedData = _d2.default.nest().key(function (d) {
	                return d.time;
	            }).entries(data);
	            nestedData.sort(function (a, b) {
	                return +a.key - +b.key;
	            });

	            var inputData = nestedData.map(function (x) {
	                return {
	                    'children': x.values.map(function (y) {
	                        return {
	                            'structure': y.struct,
	                            'sequence': getOrCreateSequence(y),
	                            'size': y.conc,
	                            'time': y.time
	                        };
	                    })
	                };
	            });

	            // calculate the number of columns and the height of the SVG,
	            // which is dependent on the on the number of data points
	            var numCols = Math.floor((svgWidth + padding[0]) / (treemapWidth + padding[0]));
	            var svgHeight = Math.ceil(inputData.length / numCols) * (treemapHeight + padding[1]) - padding[1];

	            // the rna treemap layout, which will be called for every grid point
	            var rnaTreemap = rnaTreemapChart().width(treemapWidth).height(treemapHeight - textHeight);

	            // the grid layout that will determine the position of each
	            // treemap
	            var rectGrid = _d2.default.layout.grid().bands().size([svgWidth, svgHeight]).cols(numCols).padding(padding).nodeSize([treemapWidth, treemapHeight]);
	            var rectData = rectGrid(inputData).map(function (d) {
	                d.pos = { x: d.x, y: d.y };
	                return d;
	            });

	            // create an svg as a child of the #rna_ss div
	            // and then a g for each grid cell
	            var svg = _d2.default.select(this).append('svg').attr('width', svgWidth).attr('height', svgHeight);

	            svg.selectAll('.rna-treemap').data(rectData).enter().append('g').attr('transform', function (d) {
	                return 'translate(' + d.x + ',' + d.y + ')';
	            }).classed('rna-treemap', true).call(rnaTreemap);

	            svg.selectAll('.time-g').data(rectData).enter().append('g').attr('transform', function (d) {
	                return 'translate(' + d.pos.x + ',' + d.pos.y + ')';
	            }).classed('time-g', true).append('text').attr('x', treemapWidth / 2).attr('y', treemapHeight - textHeight + 16).classed('time-label', true).text(function (d) {
	                return 'time: ' + d.children[0].time;
	            });
	        });
	    };

	    chart.width = function (_) {
	        if (!arguments.length) return svgWidth;else svgWidth = _;
	        return chart;
	    };

	    chart.height = function (_) {
	        if (!arguments.length) return svgHeight;
	        return chart;
	    };

	    return chart;
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;!function() {
	  var d3 = {
	    version: "3.5.15"
	  };
	  var d3_arraySlice = [].slice, d3_array = function(list) {
	    return d3_arraySlice.call(list);
	  };
	  var d3_document = this.document;
	  function d3_documentElement(node) {
	    return node && (node.ownerDocument || node.document || node).documentElement;
	  }
	  function d3_window(node) {
	    return node && (node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView);
	  }
	  if (d3_document) {
	    try {
	      d3_array(d3_document.documentElement.childNodes)[0].nodeType;
	    } catch (e) {
	      d3_array = function(list) {
	        var i = list.length, array = new Array(i);
	        while (i--) array[i] = list[i];
	        return array;
	      };
	    }
	  }
	  if (!Date.now) Date.now = function() {
	    return +new Date();
	  };
	  if (d3_document) {
	    try {
	      d3_document.createElement("DIV").style.setProperty("opacity", 0, "");
	    } catch (error) {
	      var d3_element_prototype = this.Element.prototype, d3_element_setAttribute = d3_element_prototype.setAttribute, d3_element_setAttributeNS = d3_element_prototype.setAttributeNS, d3_style_prototype = this.CSSStyleDeclaration.prototype, d3_style_setProperty = d3_style_prototype.setProperty;
	      d3_element_prototype.setAttribute = function(name, value) {
	        d3_element_setAttribute.call(this, name, value + "");
	      };
	      d3_element_prototype.setAttributeNS = function(space, local, value) {
	        d3_element_setAttributeNS.call(this, space, local, value + "");
	      };
	      d3_style_prototype.setProperty = function(name, value, priority) {
	        d3_style_setProperty.call(this, name, value + "", priority);
	      };
	    }
	  }
	  d3.ascending = d3_ascending;
	  function d3_ascending(a, b) {
	    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	  }
	  d3.descending = function(a, b) {
	    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
	  };
	  d3.min = function(array, f) {
	    var i = -1, n = array.length, a, b;
	    if (arguments.length === 1) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) {
	        a = b;
	        break;
	      }
	      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
	    } else {
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
	        a = b;
	        break;
	      }
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;
	    }
	    return a;
	  };
	  d3.max = function(array, f) {
	    var i = -1, n = array.length, a, b;
	    if (arguments.length === 1) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) {
	        a = b;
	        break;
	      }
	      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
	    } else {
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
	        a = b;
	        break;
	      }
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;
	    }
	    return a;
	  };
	  d3.extent = function(array, f) {
	    var i = -1, n = array.length, a, b, c;
	    if (arguments.length === 1) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) {
	        a = c = b;
	        break;
	      }
	      while (++i < n) if ((b = array[i]) != null) {
	        if (a > b) a = b;
	        if (c < b) c = b;
	      }
	    } else {
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
	        a = c = b;
	        break;
	      }
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null) {
	        if (a > b) a = b;
	        if (c < b) c = b;
	      }
	    }
	    return [ a, c ];
	  };
	  function d3_number(x) {
	    return x === null ? NaN : +x;
	  }
	  function d3_numeric(x) {
	    return !isNaN(x);
	  }
	  d3.sum = function(array, f) {
	    var s = 0, n = array.length, a, i = -1;
	    if (arguments.length === 1) {
	      while (++i < n) if (d3_numeric(a = +array[i])) s += a;
	    } else {
	      while (++i < n) if (d3_numeric(a = +f.call(array, array[i], i))) s += a;
	    }
	    return s;
	  };
	  d3.mean = function(array, f) {
	    var s = 0, n = array.length, a, i = -1, j = n;
	    if (arguments.length === 1) {
	      while (++i < n) if (d3_numeric(a = d3_number(array[i]))) s += a; else --j;
	    } else {
	      while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) s += a; else --j;
	    }
	    if (j) return s / j;
	  };
	  d3.quantile = function(values, p) {
	    var H = (values.length - 1) * p + 1, h = Math.floor(H), v = +values[h - 1], e = H - h;
	    return e ? v + e * (values[h] - v) : v;
	  };
	  d3.median = function(array, f) {
	    var numbers = [], n = array.length, a, i = -1;
	    if (arguments.length === 1) {
	      while (++i < n) if (d3_numeric(a = d3_number(array[i]))) numbers.push(a);
	    } else {
	      while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) numbers.push(a);
	    }
	    if (numbers.length) return d3.quantile(numbers.sort(d3_ascending), .5);
	  };
	  d3.variance = function(array, f) {
	    var n = array.length, m = 0, a, d, s = 0, i = -1, j = 0;
	    if (arguments.length === 1) {
	      while (++i < n) {
	        if (d3_numeric(a = d3_number(array[i]))) {
	          d = a - m;
	          m += d / ++j;
	          s += d * (a - m);
	        }
	      }
	    } else {
	      while (++i < n) {
	        if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) {
	          d = a - m;
	          m += d / ++j;
	          s += d * (a - m);
	        }
	      }
	    }
	    if (j > 1) return s / (j - 1);
	  };
	  d3.deviation = function() {
	    var v = d3.variance.apply(this, arguments);
	    return v ? Math.sqrt(v) : v;
	  };
	  function d3_bisector(compare) {
	    return {
	      left: function(a, x, lo, hi) {
	        if (arguments.length < 3) lo = 0;
	        if (arguments.length < 4) hi = a.length;
	        while (lo < hi) {
	          var mid = lo + hi >>> 1;
	          if (compare(a[mid], x) < 0) lo = mid + 1; else hi = mid;
	        }
	        return lo;
	      },
	      right: function(a, x, lo, hi) {
	        if (arguments.length < 3) lo = 0;
	        if (arguments.length < 4) hi = a.length;
	        while (lo < hi) {
	          var mid = lo + hi >>> 1;
	          if (compare(a[mid], x) > 0) hi = mid; else lo = mid + 1;
	        }
	        return lo;
	      }
	    };
	  }
	  var d3_bisect = d3_bisector(d3_ascending);
	  d3.bisectLeft = d3_bisect.left;
	  d3.bisect = d3.bisectRight = d3_bisect.right;
	  d3.bisector = function(f) {
	    return d3_bisector(f.length === 1 ? function(d, x) {
	      return d3_ascending(f(d), x);
	    } : f);
	  };
	  d3.shuffle = function(array, i0, i1) {
	    if ((m = arguments.length) < 3) {
	      i1 = array.length;
	      if (m < 2) i0 = 0;
	    }
	    var m = i1 - i0, t, i;
	    while (m) {
	      i = Math.random() * m-- | 0;
	      t = array[m + i0], array[m + i0] = array[i + i0], array[i + i0] = t;
	    }
	    return array;
	  };
	  d3.permute = function(array, indexes) {
	    var i = indexes.length, permutes = new Array(i);
	    while (i--) permutes[i] = array[indexes[i]];
	    return permutes;
	  };
	  d3.pairs = function(array) {
	    var i = 0, n = array.length - 1, p0, p1 = array[0], pairs = new Array(n < 0 ? 0 : n);
	    while (i < n) pairs[i] = [ p0 = p1, p1 = array[++i] ];
	    return pairs;
	  };
	  d3.transpose = function(matrix) {
	    if (!(n = matrix.length)) return [];
	    for (var i = -1, m = d3.min(matrix, d3_transposeLength), transpose = new Array(m); ++i < m; ) {
	      for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n; ) {
	        row[j] = matrix[j][i];
	      }
	    }
	    return transpose;
	  };
	  function d3_transposeLength(d) {
	    return d.length;
	  }
	  d3.zip = function() {
	    return d3.transpose(arguments);
	  };
	  d3.keys = function(map) {
	    var keys = [];
	    for (var key in map) keys.push(key);
	    return keys;
	  };
	  d3.values = function(map) {
	    var values = [];
	    for (var key in map) values.push(map[key]);
	    return values;
	  };
	  d3.entries = function(map) {
	    var entries = [];
	    for (var key in map) entries.push({
	      key: key,
	      value: map[key]
	    });
	    return entries;
	  };
	  d3.merge = function(arrays) {
	    var n = arrays.length, m, i = -1, j = 0, merged, array;
	    while (++i < n) j += arrays[i].length;
	    merged = new Array(j);
	    while (--n >= 0) {
	      array = arrays[n];
	      m = array.length;
	      while (--m >= 0) {
	        merged[--j] = array[m];
	      }
	    }
	    return merged;
	  };
	  var abs = Math.abs;
	  d3.range = function(start, stop, step) {
	    if (arguments.length < 3) {
	      step = 1;
	      if (arguments.length < 2) {
	        stop = start;
	        start = 0;
	      }
	    }
	    if ((stop - start) / step === Infinity) throw new Error("infinite range");
	    var range = [], k = d3_range_integerScale(abs(step)), i = -1, j;
	    start *= k, stop *= k, step *= k;
	    if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); else while ((j = start + step * ++i) < stop) range.push(j / k);
	    return range;
	  };
	  function d3_range_integerScale(x) {
	    var k = 1;
	    while (x * k % 1) k *= 10;
	    return k;
	  }
	  function d3_class(ctor, properties) {
	    for (var key in properties) {
	      Object.defineProperty(ctor.prototype, key, {
	        value: properties[key],
	        enumerable: false
	      });
	    }
	  }
	  d3.map = function(object, f) {
	    var map = new d3_Map();
	    if (object instanceof d3_Map) {
	      object.forEach(function(key, value) {
	        map.set(key, value);
	      });
	    } else if (Array.isArray(object)) {
	      var i = -1, n = object.length, o;
	      if (arguments.length === 1) while (++i < n) map.set(i, object[i]); else while (++i < n) map.set(f.call(object, o = object[i], i), o);
	    } else {
	      for (var key in object) map.set(key, object[key]);
	    }
	    return map;
	  };
	  function d3_Map() {
	    this._ = Object.create(null);
	  }
	  var d3_map_proto = "__proto__", d3_map_zero = "\x00";
	  d3_class(d3_Map, {
	    has: d3_map_has,
	    get: function(key) {
	      return this._[d3_map_escape(key)];
	    },
	    set: function(key, value) {
	      return this._[d3_map_escape(key)] = value;
	    },
	    remove: d3_map_remove,
	    keys: d3_map_keys,
	    values: function() {
	      var values = [];
	      for (var key in this._) values.push(this._[key]);
	      return values;
	    },
	    entries: function() {
	      var entries = [];
	      for (var key in this._) entries.push({
	        key: d3_map_unescape(key),
	        value: this._[key]
	      });
	      return entries;
	    },
	    size: d3_map_size,
	    empty: d3_map_empty,
	    forEach: function(f) {
	      for (var key in this._) f.call(this, d3_map_unescape(key), this._[key]);
	    }
	  });
	  function d3_map_escape(key) {
	    return (key += "") === d3_map_proto || key[0] === d3_map_zero ? d3_map_zero + key : key;
	  }
	  function d3_map_unescape(key) {
	    return (key += "")[0] === d3_map_zero ? key.slice(1) : key;
	  }
	  function d3_map_has(key) {
	    return d3_map_escape(key) in this._;
	  }
	  function d3_map_remove(key) {
	    return (key = d3_map_escape(key)) in this._ && delete this._[key];
	  }
	  function d3_map_keys() {
	    var keys = [];
	    for (var key in this._) keys.push(d3_map_unescape(key));
	    return keys;
	  }
	  function d3_map_size() {
	    var size = 0;
	    for (var key in this._) ++size;
	    return size;
	  }
	  function d3_map_empty() {
	    for (var key in this._) return false;
	    return true;
	  }
	  d3.nest = function() {
	    var nest = {}, keys = [], sortKeys = [], sortValues, rollup;
	    function map(mapType, array, depth) {
	      if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;
	      var i = -1, n = array.length, key = keys[depth++], keyValue, object, setter, valuesByKey = new d3_Map(), values;
	      while (++i < n) {
	        if (values = valuesByKey.get(keyValue = key(object = array[i]))) {
	          values.push(object);
	        } else {
	          valuesByKey.set(keyValue, [ object ]);
	        }
	      }
	      if (mapType) {
	        object = mapType();
	        setter = function(keyValue, values) {
	          object.set(keyValue, map(mapType, values, depth));
	        };
	      } else {
	        object = {};
	        setter = function(keyValue, values) {
	          object[keyValue] = map(mapType, values, depth);
	        };
	      }
	      valuesByKey.forEach(setter);
	      return object;
	    }
	    function entries(map, depth) {
	      if (depth >= keys.length) return map;
	      var array = [], sortKey = sortKeys[depth++];
	      map.forEach(function(key, keyMap) {
	        array.push({
	          key: key,
	          values: entries(keyMap, depth)
	        });
	      });
	      return sortKey ? array.sort(function(a, b) {
	        return sortKey(a.key, b.key);
	      }) : array;
	    }
	    nest.map = function(array, mapType) {
	      return map(mapType, array, 0);
	    };
	    nest.entries = function(array) {
	      return entries(map(d3.map, array, 0), 0);
	    };
	    nest.key = function(d) {
	      keys.push(d);
	      return nest;
	    };
	    nest.sortKeys = function(order) {
	      sortKeys[keys.length - 1] = order;
	      return nest;
	    };
	    nest.sortValues = function(order) {
	      sortValues = order;
	      return nest;
	    };
	    nest.rollup = function(f) {
	      rollup = f;
	      return nest;
	    };
	    return nest;
	  };
	  d3.set = function(array) {
	    var set = new d3_Set();
	    if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i]);
	    return set;
	  };
	  function d3_Set() {
	    this._ = Object.create(null);
	  }
	  d3_class(d3_Set, {
	    has: d3_map_has,
	    add: function(key) {
	      this._[d3_map_escape(key += "")] = true;
	      return key;
	    },
	    remove: d3_map_remove,
	    values: d3_map_keys,
	    size: d3_map_size,
	    empty: d3_map_empty,
	    forEach: function(f) {
	      for (var key in this._) f.call(this, d3_map_unescape(key));
	    }
	  });
	  d3.behavior = {};
	  function d3_identity(d) {
	    return d;
	  }
	  d3.rebind = function(target, source) {
	    var i = 1, n = arguments.length, method;
	    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
	    return target;
	  };
	  function d3_rebind(target, source, method) {
	    return function() {
	      var value = method.apply(source, arguments);
	      return value === source ? target : value;
	    };
	  }
	  function d3_vendorSymbol(object, name) {
	    if (name in object) return name;
	    name = name.charAt(0).toUpperCase() + name.slice(1);
	    for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
	      var prefixName = d3_vendorPrefixes[i] + name;
	      if (prefixName in object) return prefixName;
	    }
	  }
	  var d3_vendorPrefixes = [ "webkit", "ms", "moz", "Moz", "o", "O" ];
	  function d3_noop() {}
	  d3.dispatch = function() {
	    var dispatch = new d3_dispatch(), i = -1, n = arguments.length;
	    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
	    return dispatch;
	  };
	  function d3_dispatch() {}
	  d3_dispatch.prototype.on = function(type, listener) {
	    var i = type.indexOf("."), name = "";
	    if (i >= 0) {
	      name = type.slice(i + 1);
	      type = type.slice(0, i);
	    }
	    if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);
	    if (arguments.length === 2) {
	      if (listener == null) for (type in this) {
	        if (this.hasOwnProperty(type)) this[type].on(name, null);
	      }
	      return this;
	    }
	  };
	  function d3_dispatch_event(dispatch) {
	    var listeners = [], listenerByName = new d3_Map();
	    function event() {
	      var z = listeners, i = -1, n = z.length, l;
	      while (++i < n) if (l = z[i].on) l.apply(this, arguments);
	      return dispatch;
	    }
	    event.on = function(name, listener) {
	      var l = listenerByName.get(name), i;
	      if (arguments.length < 2) return l && l.on;
	      if (l) {
	        l.on = null;
	        listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
	        listenerByName.remove(name);
	      }
	      if (listener) listeners.push(listenerByName.set(name, {
	        on: listener
	      }));
	      return dispatch;
	    };
	    return event;
	  }
	  d3.event = null;
	  function d3_eventPreventDefault() {
	    d3.event.preventDefault();
	  }
	  function d3_eventSource() {
	    var e = d3.event, s;
	    while (s = e.sourceEvent) e = s;
	    return e;
	  }
	  function d3_eventDispatch(target) {
	    var dispatch = new d3_dispatch(), i = 0, n = arguments.length;
	    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
	    dispatch.of = function(thiz, argumentz) {
	      return function(e1) {
	        try {
	          var e0 = e1.sourceEvent = d3.event;
	          e1.target = target;
	          d3.event = e1;
	          dispatch[e1.type].apply(thiz, argumentz);
	        } finally {
	          d3.event = e0;
	        }
	      };
	    };
	    return dispatch;
	  }
	  d3.requote = function(s) {
	    return s.replace(d3_requote_re, "\\$&");
	  };
	  var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
	  var d3_subclass = {}.__proto__ ? function(object, prototype) {
	    object.__proto__ = prototype;
	  } : function(object, prototype) {
	    for (var property in prototype) object[property] = prototype[property];
	  };
	  function d3_selection(groups) {
	    d3_subclass(groups, d3_selectionPrototype);
	    return groups;
	  }
	  var d3_select = function(s, n) {
	    return n.querySelector(s);
	  }, d3_selectAll = function(s, n) {
	    return n.querySelectorAll(s);
	  }, d3_selectMatches = function(n, s) {
	    var d3_selectMatcher = n.matches || n[d3_vendorSymbol(n, "matchesSelector")];
	    d3_selectMatches = function(n, s) {
	      return d3_selectMatcher.call(n, s);
	    };
	    return d3_selectMatches(n, s);
	  };
	  if (typeof Sizzle === "function") {
	    d3_select = function(s, n) {
	      return Sizzle(s, n)[0] || null;
	    };
	    d3_selectAll = Sizzle;
	    d3_selectMatches = Sizzle.matchesSelector;
	  }
	  d3.selection = function() {
	    return d3.select(d3_document.documentElement);
	  };
	  var d3_selectionPrototype = d3.selection.prototype = [];
	  d3_selectionPrototype.select = function(selector) {
	    var subgroups = [], subgroup, subnode, group, node;
	    selector = d3_selection_selector(selector);
	    for (var j = -1, m = this.length; ++j < m; ) {
	      subgroups.push(subgroup = []);
	      subgroup.parentNode = (group = this[j]).parentNode;
	      for (var i = -1, n = group.length; ++i < n; ) {
	        if (node = group[i]) {
	          subgroup.push(subnode = selector.call(node, node.__data__, i, j));
	          if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
	        } else {
	          subgroup.push(null);
	        }
	      }
	    }
	    return d3_selection(subgroups);
	  };
	  function d3_selection_selector(selector) {
	    return typeof selector === "function" ? selector : function() {
	      return d3_select(selector, this);
	    };
	  }
	  d3_selectionPrototype.selectAll = function(selector) {
	    var subgroups = [], subgroup, node;
	    selector = d3_selection_selectorAll(selector);
	    for (var j = -1, m = this.length; ++j < m; ) {
	      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
	        if (node = group[i]) {
	          subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
	          subgroup.parentNode = node;
	        }
	      }
	    }
	    return d3_selection(subgroups);
	  };
	  function d3_selection_selectorAll(selector) {
	    return typeof selector === "function" ? selector : function() {
	      return d3_selectAll(selector, this);
	    };
	  }
	  var d3_nsPrefix = {
	    svg: "http://www.w3.org/2000/svg",
	    xhtml: "http://www.w3.org/1999/xhtml",
	    xlink: "http://www.w3.org/1999/xlink",
	    xml: "http://www.w3.org/XML/1998/namespace",
	    xmlns: "http://www.w3.org/2000/xmlns/"
	  };
	  d3.ns = {
	    prefix: d3_nsPrefix,
	    qualify: function(name) {
	      var i = name.indexOf(":"), prefix = name;
	      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	      return d3_nsPrefix.hasOwnProperty(prefix) ? {
	        space: d3_nsPrefix[prefix],
	        local: name
	      } : name;
	    }
	  };
	  d3_selectionPrototype.attr = function(name, value) {
	    if (arguments.length < 2) {
	      if (typeof name === "string") {
	        var node = this.node();
	        name = d3.ns.qualify(name);
	        return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);
	      }
	      for (value in name) this.each(d3_selection_attr(value, name[value]));
	      return this;
	    }
	    return this.each(d3_selection_attr(name, value));
	  };
	  function d3_selection_attr(name, value) {
	    name = d3.ns.qualify(name);
	    function attrNull() {
	      this.removeAttribute(name);
	    }
	    function attrNullNS() {
	      this.removeAttributeNS(name.space, name.local);
	    }
	    function attrConstant() {
	      this.setAttribute(name, value);
	    }
	    function attrConstantNS() {
	      this.setAttributeNS(name.space, name.local, value);
	    }
	    function attrFunction() {
	      var x = value.apply(this, arguments);
	      if (x == null) this.removeAttribute(name); else this.setAttribute(name, x);
	    }
	    function attrFunctionNS() {
	      var x = value.apply(this, arguments);
	      if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x);
	    }
	    return value == null ? name.local ? attrNullNS : attrNull : typeof value === "function" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;
	  }
	  function d3_collapse(s) {
	    return s.trim().replace(/\s+/g, " ");
	  }
	  d3_selectionPrototype.classed = function(name, value) {
	    if (arguments.length < 2) {
	      if (typeof name === "string") {
	        var node = this.node(), n = (name = d3_selection_classes(name)).length, i = -1;
	        if (value = node.classList) {
	          while (++i < n) if (!value.contains(name[i])) return false;
	        } else {
	          value = node.getAttribute("class");
	          while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
	        }
	        return true;
	      }
	      for (value in name) this.each(d3_selection_classed(value, name[value]));
	      return this;
	    }
	    return this.each(d3_selection_classed(name, value));
	  };
	  function d3_selection_classedRe(name) {
	    return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
	  }
	  function d3_selection_classes(name) {
	    return (name + "").trim().split(/^|\s+/);
	  }
	  function d3_selection_classed(name, value) {
	    name = d3_selection_classes(name).map(d3_selection_classedName);
	    var n = name.length;
	    function classedConstant() {
	      var i = -1;
	      while (++i < n) name[i](this, value);
	    }
	    function classedFunction() {
	      var i = -1, x = value.apply(this, arguments);
	      while (++i < n) name[i](this, x);
	    }
	    return typeof value === "function" ? classedFunction : classedConstant;
	  }
	  function d3_selection_classedName(name) {
	    var re = d3_selection_classedRe(name);
	    return function(node, value) {
	      if (c = node.classList) return value ? c.add(name) : c.remove(name);
	      var c = node.getAttribute("class") || "";
	      if (value) {
	        re.lastIndex = 0;
	        if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
	      } else {
	        node.setAttribute("class", d3_collapse(c.replace(re, " ")));
	      }
	    };
	  }
	  d3_selectionPrototype.style = function(name, value, priority) {
	    var n = arguments.length;
	    if (n < 3) {
	      if (typeof name !== "string") {
	        if (n < 2) value = "";
	        for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
	        return this;
	      }
	      if (n < 2) {
	        var node = this.node();
	        return d3_window(node).getComputedStyle(node, null).getPropertyValue(name);
	      }
	      priority = "";
	    }
	    return this.each(d3_selection_style(name, value, priority));
	  };
	  function d3_selection_style(name, value, priority) {
	    function styleNull() {
	      this.style.removeProperty(name);
	    }
	    function styleConstant() {
	      this.style.setProperty(name, value, priority);
	    }
	    function styleFunction() {
	      var x = value.apply(this, arguments);
	      if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority);
	    }
	    return value == null ? styleNull : typeof value === "function" ? styleFunction : styleConstant;
	  }
	  d3_selectionPrototype.property = function(name, value) {
	    if (arguments.length < 2) {
	      if (typeof name === "string") return this.node()[name];
	      for (value in name) this.each(d3_selection_property(value, name[value]));
	      return this;
	    }
	    return this.each(d3_selection_property(name, value));
	  };
	  function d3_selection_property(name, value) {
	    function propertyNull() {
	      delete this[name];
	    }
	    function propertyConstant() {
	      this[name] = value;
	    }
	    function propertyFunction() {
	      var x = value.apply(this, arguments);
	      if (x == null) delete this[name]; else this[name] = x;
	    }
	    return value == null ? propertyNull : typeof value === "function" ? propertyFunction : propertyConstant;
	  }
	  d3_selectionPrototype.text = function(value) {
	    return arguments.length ? this.each(typeof value === "function" ? function() {
	      var v = value.apply(this, arguments);
	      this.textContent = v == null ? "" : v;
	    } : value == null ? function() {
	      this.textContent = "";
	    } : function() {
	      this.textContent = value;
	    }) : this.node().textContent;
	  };
	  d3_selectionPrototype.html = function(value) {
	    return arguments.length ? this.each(typeof value === "function" ? function() {
	      var v = value.apply(this, arguments);
	      this.innerHTML = v == null ? "" : v;
	    } : value == null ? function() {
	      this.innerHTML = "";
	    } : function() {
	      this.innerHTML = value;
	    }) : this.node().innerHTML;
	  };
	  d3_selectionPrototype.append = function(name) {
	    name = d3_selection_creator(name);
	    return this.select(function() {
	      return this.appendChild(name.apply(this, arguments));
	    });
	  };
	  function d3_selection_creator(name) {
	    function create() {
	      var document = this.ownerDocument, namespace = this.namespaceURI;
	      return namespace && namespace !== document.documentElement.namespaceURI ? document.createElementNS(namespace, name) : document.createElement(name);
	    }
	    function createNS() {
	      return this.ownerDocument.createElementNS(name.space, name.local);
	    }
	    return typeof name === "function" ? name : (name = d3.ns.qualify(name)).local ? createNS : create;
	  }
	  d3_selectionPrototype.insert = function(name, before) {
	    name = d3_selection_creator(name);
	    before = d3_selection_selector(before);
	    return this.select(function() {
	      return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
	    });
	  };
	  d3_selectionPrototype.remove = function() {
	    return this.each(d3_selectionRemove);
	  };
	  function d3_selectionRemove() {
	    var parent = this.parentNode;
	    if (parent) parent.removeChild(this);
	  }
	  d3_selectionPrototype.data = function(value, key) {
	    var i = -1, n = this.length, group, node;
	    if (!arguments.length) {
	      value = new Array(n = (group = this[0]).length);
	      while (++i < n) {
	        if (node = group[i]) {
	          value[i] = node.__data__;
	        }
	      }
	      return value;
	    }
	    function bind(group, groupData) {
	      var i, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n), node, nodeData;
	      if (key) {
	        var nodeByKeyValue = new d3_Map(), keyValues = new Array(n), keyValue;
	        for (i = -1; ++i < n; ) {
	          if (node = group[i]) {
	            if (nodeByKeyValue.has(keyValue = key.call(node, node.__data__, i))) {
	              exitNodes[i] = node;
	            } else {
	              nodeByKeyValue.set(keyValue, node);
	            }
	            keyValues[i] = keyValue;
	          }
	        }
	        for (i = -1; ++i < m; ) {
	          if (!(node = nodeByKeyValue.get(keyValue = key.call(groupData, nodeData = groupData[i], i)))) {
	            enterNodes[i] = d3_selection_dataNode(nodeData);
	          } else if (node !== true) {
	            updateNodes[i] = node;
	            node.__data__ = nodeData;
	          }
	          nodeByKeyValue.set(keyValue, true);
	        }
	        for (i = -1; ++i < n; ) {
	          if (i in keyValues && nodeByKeyValue.get(keyValues[i]) !== true) {
	            exitNodes[i] = group[i];
	          }
	        }
	      } else {
	        for (i = -1; ++i < n0; ) {
	          node = group[i];
	          nodeData = groupData[i];
	          if (node) {
	            node.__data__ = nodeData;
	            updateNodes[i] = node;
	          } else {
	            enterNodes[i] = d3_selection_dataNode(nodeData);
	          }
	        }
	        for (;i < m; ++i) {
	          enterNodes[i] = d3_selection_dataNode(groupData[i]);
	        }
	        for (;i < n; ++i) {
	          exitNodes[i] = group[i];
	        }
	      }
	      enterNodes.update = updateNodes;
	      enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;
	      enter.push(enterNodes);
	      update.push(updateNodes);
	      exit.push(exitNodes);
	    }
	    var enter = d3_selection_enter([]), update = d3_selection([]), exit = d3_selection([]);
	    if (typeof value === "function") {
	      while (++i < n) {
	        bind(group = this[i], value.call(group, group.parentNode.__data__, i));
	      }
	    } else {
	      while (++i < n) {
	        bind(group = this[i], value);
	      }
	    }
	    update.enter = function() {
	      return enter;
	    };
	    update.exit = function() {
	      return exit;
	    };
	    return update;
	  };
	  function d3_selection_dataNode(data) {
	    return {
	      __data__: data
	    };
	  }
	  d3_selectionPrototype.datum = function(value) {
	    return arguments.length ? this.property("__data__", value) : this.property("__data__");
	  };
	  d3_selectionPrototype.filter = function(filter) {
	    var subgroups = [], subgroup, group, node;
	    if (typeof filter !== "function") filter = d3_selection_filter(filter);
	    for (var j = 0, m = this.length; j < m; j++) {
	      subgroups.push(subgroup = []);
	      subgroup.parentNode = (group = this[j]).parentNode;
	      for (var i = 0, n = group.length; i < n; i++) {
	        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
	          subgroup.push(node);
	        }
	      }
	    }
	    return d3_selection(subgroups);
	  };
	  function d3_selection_filter(selector) {
	    return function() {
	      return d3_selectMatches(this, selector);
	    };
	  }
	  d3_selectionPrototype.order = function() {
	    for (var j = -1, m = this.length; ++j < m; ) {
	      for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
	        if (node = group[i]) {
	          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
	          next = node;
	        }
	      }
	    }
	    return this;
	  };
	  d3_selectionPrototype.sort = function(comparator) {
	    comparator = d3_selection_sortComparator.apply(this, arguments);
	    for (var j = -1, m = this.length; ++j < m; ) this[j].sort(comparator);
	    return this.order();
	  };
	  function d3_selection_sortComparator(comparator) {
	    if (!arguments.length) comparator = d3_ascending;
	    return function(a, b) {
	      return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
	    };
	  }
	  d3_selectionPrototype.each = function(callback) {
	    return d3_selection_each(this, function(node, i, j) {
	      callback.call(node, node.__data__, i, j);
	    });
	  };
	  function d3_selection_each(groups, callback) {
	    for (var j = 0, m = groups.length; j < m; j++) {
	      for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
	        if (node = group[i]) callback(node, i, j);
	      }
	    }
	    return groups;
	  }
	  d3_selectionPrototype.call = function(callback) {
	    var args = d3_array(arguments);
	    callback.apply(args[0] = this, args);
	    return this;
	  };
	  d3_selectionPrototype.empty = function() {
	    return !this.node();
	  };
	  d3_selectionPrototype.node = function() {
	    for (var j = 0, m = this.length; j < m; j++) {
	      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
	        var node = group[i];
	        if (node) return node;
	      }
	    }
	    return null;
	  };
	  d3_selectionPrototype.size = function() {
	    var n = 0;
	    d3_selection_each(this, function() {
	      ++n;
	    });
	    return n;
	  };
	  function d3_selection_enter(selection) {
	    d3_subclass(selection, d3_selection_enterPrototype);
	    return selection;
	  }
	  var d3_selection_enterPrototype = [];
	  d3.selection.enter = d3_selection_enter;
	  d3.selection.enter.prototype = d3_selection_enterPrototype;
	  d3_selection_enterPrototype.append = d3_selectionPrototype.append;
	  d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;
	  d3_selection_enterPrototype.node = d3_selectionPrototype.node;
	  d3_selection_enterPrototype.call = d3_selectionPrototype.call;
	  d3_selection_enterPrototype.size = d3_selectionPrototype.size;
	  d3_selection_enterPrototype.select = function(selector) {
	    var subgroups = [], subgroup, subnode, upgroup, group, node;
	    for (var j = -1, m = this.length; ++j < m; ) {
	      upgroup = (group = this[j]).update;
	      subgroups.push(subgroup = []);
	      subgroup.parentNode = group.parentNode;
	      for (var i = -1, n = group.length; ++i < n; ) {
	        if (node = group[i]) {
	          subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
	          subnode.__data__ = node.__data__;
	        } else {
	          subgroup.push(null);
	        }
	      }
	    }
	    return d3_selection(subgroups);
	  };
	  d3_selection_enterPrototype.insert = function(name, before) {
	    if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
	    return d3_selectionPrototype.insert.call(this, name, before);
	  };
	  function d3_selection_enterInsertBefore(enter) {
	    var i0, j0;
	    return function(d, i, j) {
	      var group = enter[j].update, n = group.length, node;
	      if (j != j0) j0 = j, i0 = 0;
	      if (i >= i0) i0 = i + 1;
	      while (!(node = group[i0]) && ++i0 < n) ;
	      return node;
	    };
	  }
	  d3.select = function(node) {
	    var group;
	    if (typeof node === "string") {
	      group = [ d3_select(node, d3_document) ];
	      group.parentNode = d3_document.documentElement;
	    } else {
	      group = [ node ];
	      group.parentNode = d3_documentElement(node);
	    }
	    return d3_selection([ group ]);
	  };
	  d3.selectAll = function(nodes) {
	    var group;
	    if (typeof nodes === "string") {
	      group = d3_array(d3_selectAll(nodes, d3_document));
	      group.parentNode = d3_document.documentElement;
	    } else {
	      group = d3_array(nodes);
	      group.parentNode = null;
	    }
	    return d3_selection([ group ]);
	  };
	  d3_selectionPrototype.on = function(type, listener, capture) {
	    var n = arguments.length;
	    if (n < 3) {
	      if (typeof type !== "string") {
	        if (n < 2) listener = false;
	        for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
	        return this;
	      }
	      if (n < 2) return (n = this.node()["__on" + type]) && n._;
	      capture = false;
	    }
	    return this.each(d3_selection_on(type, listener, capture));
	  };
	  function d3_selection_on(type, listener, capture) {
	    var name = "__on" + type, i = type.indexOf("."), wrap = d3_selection_onListener;
	    if (i > 0) type = type.slice(0, i);
	    var filter = d3_selection_onFilters.get(type);
	    if (filter) type = filter, wrap = d3_selection_onFilter;
	    function onRemove() {
	      var l = this[name];
	      if (l) {
	        this.removeEventListener(type, l, l.$);
	        delete this[name];
	      }
	    }
	    function onAdd() {
	      var l = wrap(listener, d3_array(arguments));
	      onRemove.call(this);
	      this.addEventListener(type, this[name] = l, l.$ = capture);
	      l._ = listener;
	    }
	    function removeAll() {
	      var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"), match;
	      for (var name in this) {
	        if (match = name.match(re)) {
	          var l = this[name];
	          this.removeEventListener(match[1], l, l.$);
	          delete this[name];
	        }
	      }
	    }
	    return i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll;
	  }
	  var d3_selection_onFilters = d3.map({
	    mouseenter: "mouseover",
	    mouseleave: "mouseout"
	  });
	  if (d3_document) {
	    d3_selection_onFilters.forEach(function(k) {
	      if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
	    });
	  }
	  function d3_selection_onListener(listener, argumentz) {
	    return function(e) {
	      var o = d3.event;
	      d3.event = e;
	      argumentz[0] = this.__data__;
	      try {
	        listener.apply(this, argumentz);
	      } finally {
	        d3.event = o;
	      }
	    };
	  }
	  function d3_selection_onFilter(listener, argumentz) {
	    var l = d3_selection_onListener(listener, argumentz);
	    return function(e) {
	      var target = this, related = e.relatedTarget;
	      if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {
	        l.call(target, e);
	      }
	    };
	  }
	  var d3_event_dragSelect, d3_event_dragId = 0;
	  function d3_event_dragSuppress(node) {
	    var name = ".dragsuppress-" + ++d3_event_dragId, click = "click" + name, w = d3.select(d3_window(node)).on("touchmove" + name, d3_eventPreventDefault).on("dragstart" + name, d3_eventPreventDefault).on("selectstart" + name, d3_eventPreventDefault);
	    if (d3_event_dragSelect == null) {
	      d3_event_dragSelect = "onselectstart" in node ? false : d3_vendorSymbol(node.style, "userSelect");
	    }
	    if (d3_event_dragSelect) {
	      var style = d3_documentElement(node).style, select = style[d3_event_dragSelect];
	      style[d3_event_dragSelect] = "none";
	    }
	    return function(suppressClick) {
	      w.on(name, null);
	      if (d3_event_dragSelect) style[d3_event_dragSelect] = select;
	      if (suppressClick) {
	        var off = function() {
	          w.on(click, null);
	        };
	        w.on(click, function() {
	          d3_eventPreventDefault();
	          off();
	        }, true);
	        setTimeout(off, 0);
	      }
	    };
	  }
	  d3.mouse = function(container) {
	    return d3_mousePoint(container, d3_eventSource());
	  };
	  var d3_mouse_bug44083 = this.navigator && /WebKit/.test(this.navigator.userAgent) ? -1 : 0;
	  function d3_mousePoint(container, e) {
	    if (e.changedTouches) e = e.changedTouches[0];
	    var svg = container.ownerSVGElement || container;
	    if (svg.createSVGPoint) {
	      var point = svg.createSVGPoint();
	      if (d3_mouse_bug44083 < 0) {
	        var window = d3_window(container);
	        if (window.scrollX || window.scrollY) {
	          svg = d3.select("body").append("svg").style({
	            position: "absolute",
	            top: 0,
	            left: 0,
	            margin: 0,
	            padding: 0,
	            border: "none"
	          }, "important");
	          var ctm = svg[0][0].getScreenCTM();
	          d3_mouse_bug44083 = !(ctm.f || ctm.e);
	          svg.remove();
	        }
	      }
	      if (d3_mouse_bug44083) point.x = e.pageX, point.y = e.pageY; else point.x = e.clientX, 
	      point.y = e.clientY;
	      point = point.matrixTransform(container.getScreenCTM().inverse());
	      return [ point.x, point.y ];
	    }
	    var rect = container.getBoundingClientRect();
	    return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];
	  }
	  d3.touch = function(container, touches, identifier) {
	    if (arguments.length < 3) identifier = touches, touches = d3_eventSource().changedTouches;
	    if (touches) for (var i = 0, n = touches.length, touch; i < n; ++i) {
	      if ((touch = touches[i]).identifier === identifier) {
	        return d3_mousePoint(container, touch);
	      }
	    }
	  };
	  d3.behavior.drag = function() {
	    var event = d3_eventDispatch(drag, "drag", "dragstart", "dragend"), origin = null, mousedown = dragstart(d3_noop, d3.mouse, d3_window, "mousemove", "mouseup"), touchstart = dragstart(d3_behavior_dragTouchId, d3.touch, d3_identity, "touchmove", "touchend");
	    function drag() {
	      this.on("mousedown.drag", mousedown).on("touchstart.drag", touchstart);
	    }
	    function dragstart(id, position, subject, move, end) {
	      return function() {
	        var that = this, target = d3.event.target.correspondingElement || d3.event.target, parent = that.parentNode, dispatch = event.of(that, arguments), dragged = 0, dragId = id(), dragName = ".drag" + (dragId == null ? "" : "-" + dragId), dragOffset, dragSubject = d3.select(subject(target)).on(move + dragName, moved).on(end + dragName, ended), dragRestore = d3_event_dragSuppress(target), position0 = position(parent, dragId);
	        if (origin) {
	          dragOffset = origin.apply(that, arguments);
	          dragOffset = [ dragOffset.x - position0[0], dragOffset.y - position0[1] ];
	        } else {
	          dragOffset = [ 0, 0 ];
	        }
	        dispatch({
	          type: "dragstart"
	        });
	        function moved() {
	          var position1 = position(parent, dragId), dx, dy;
	          if (!position1) return;
	          dx = position1[0] - position0[0];
	          dy = position1[1] - position0[1];
	          dragged |= dx | dy;
	          position0 = position1;
	          dispatch({
	            type: "drag",
	            x: position1[0] + dragOffset[0],
	            y: position1[1] + dragOffset[1],
	            dx: dx,
	            dy: dy
	          });
	        }
	        function ended() {
	          if (!position(parent, dragId)) return;
	          dragSubject.on(move + dragName, null).on(end + dragName, null);
	          dragRestore(dragged);
	          dispatch({
	            type: "dragend"
	          });
	        }
	      };
	    }
	    drag.origin = function(x) {
	      if (!arguments.length) return origin;
	      origin = x;
	      return drag;
	    };
	    return d3.rebind(drag, event, "on");
	  };
	  function d3_behavior_dragTouchId() {
	    return d3.event.changedTouches[0].identifier;
	  }
	  d3.touches = function(container, touches) {
	    if (arguments.length < 2) touches = d3_eventSource().touches;
	    return touches ? d3_array(touches).map(function(touch) {
	      var point = d3_mousePoint(container, touch);
	      point.identifier = touch.identifier;
	      return point;
	    }) : [];
	  };
	  var ε = 1e-6, ε2 = ε * ε, π = Math.PI, τ = 2 * π, τε = τ - ε, halfπ = π / 2, d3_radians = π / 180, d3_degrees = 180 / π;
	  function d3_sgn(x) {
	    return x > 0 ? 1 : x < 0 ? -1 : 0;
	  }
	  function d3_cross2d(a, b, c) {
	    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
	  }
	  function d3_acos(x) {
	    return x > 1 ? 0 : x < -1 ? π : Math.acos(x);
	  }
	  function d3_asin(x) {
	    return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);
	  }
	  function d3_sinh(x) {
	    return ((x = Math.exp(x)) - 1 / x) / 2;
	  }
	  function d3_cosh(x) {
	    return ((x = Math.exp(x)) + 1 / x) / 2;
	  }
	  function d3_tanh(x) {
	    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
	  }
	  function d3_haversin(x) {
	    return (x = Math.sin(x / 2)) * x;
	  }
	  var ρ = Math.SQRT2, ρ2 = 2, ρ4 = 4;
	  d3.interpolateZoom = function(p0, p1) {
	    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
	    if (d2 < ε2) {
	      S = Math.log(w1 / w0) / ρ;
	      i = function(t) {
	        return [ ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(ρ * t * S) ];
	      };
	    } else {
	      var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1), b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
	      S = (r1 - r0) / ρ;
	      i = function(t) {
	        var s = t * S, coshr0 = d3_cosh(r0), u = w0 / (ρ2 * d1) * (coshr0 * d3_tanh(ρ * s + r0) - d3_sinh(r0));
	        return [ ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / d3_cosh(ρ * s + r0) ];
	      };
	    }
	    i.duration = S * 1e3;
	    return i;
	  };
	  d3.behavior.zoom = function() {
	    var view = {
	      x: 0,
	      y: 0,
	      k: 1
	    }, translate0, center0, center, size = [ 960, 500 ], scaleExtent = d3_behavior_zoomInfinity, duration = 250, zooming = 0, mousedown = "mousedown.zoom", mousemove = "mousemove.zoom", mouseup = "mouseup.zoom", mousewheelTimer, touchstart = "touchstart.zoom", touchtime, event = d3_eventDispatch(zoom, "zoomstart", "zoom", "zoomend"), x0, x1, y0, y1;
	    if (!d3_behavior_zoomWheel) {
	      d3_behavior_zoomWheel = "onwheel" in d3_document ? (d3_behavior_zoomDelta = function() {
	        return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1);
	      }, "wheel") : "onmousewheel" in d3_document ? (d3_behavior_zoomDelta = function() {
	        return d3.event.wheelDelta;
	      }, "mousewheel") : (d3_behavior_zoomDelta = function() {
	        return -d3.event.detail;
	      }, "MozMousePixelScroll");
	    }
	    function zoom(g) {
	      g.on(mousedown, mousedowned).on(d3_behavior_zoomWheel + ".zoom", mousewheeled).on("dblclick.zoom", dblclicked).on(touchstart, touchstarted);
	    }
	    zoom.event = function(g) {
	      g.each(function() {
	        var dispatch = event.of(this, arguments), view1 = view;
	        if (d3_transitionInheritId) {
	          d3.select(this).transition().each("start.zoom", function() {
	            view = this.__chart__ || {
	              x: 0,
	              y: 0,
	              k: 1
	            };
	            zoomstarted(dispatch);
	          }).tween("zoom:zoom", function() {
	            var dx = size[0], dy = size[1], cx = center0 ? center0[0] : dx / 2, cy = center0 ? center0[1] : dy / 2, i = d3.interpolateZoom([ (cx - view.x) / view.k, (cy - view.y) / view.k, dx / view.k ], [ (cx - view1.x) / view1.k, (cy - view1.y) / view1.k, dx / view1.k ]);
	            return function(t) {
	              var l = i(t), k = dx / l[2];
	              this.__chart__ = view = {
	                x: cx - l[0] * k,
	                y: cy - l[1] * k,
	                k: k
	              };
	              zoomed(dispatch);
	            };
	          }).each("interrupt.zoom", function() {
	            zoomended(dispatch);
	          }).each("end.zoom", function() {
	            zoomended(dispatch);
	          });
	        } else {
	          this.__chart__ = view;
	          zoomstarted(dispatch);
	          zoomed(dispatch);
	          zoomended(dispatch);
	        }
	      });
	    };
	    zoom.translate = function(_) {
	      if (!arguments.length) return [ view.x, view.y ];
	      view = {
	        x: +_[0],
	        y: +_[1],
	        k: view.k
	      };
	      rescale();
	      return zoom;
	    };
	    zoom.scale = function(_) {
	      if (!arguments.length) return view.k;
	      view = {
	        x: view.x,
	        y: view.y,
	        k: null
	      };
	      scaleTo(+_);
	      rescale();
	      return zoom;
	    };
	    zoom.scaleExtent = function(_) {
	      if (!arguments.length) return scaleExtent;
	      scaleExtent = _ == null ? d3_behavior_zoomInfinity : [ +_[0], +_[1] ];
	      return zoom;
	    };
	    zoom.center = function(_) {
	      if (!arguments.length) return center;
	      center = _ && [ +_[0], +_[1] ];
	      return zoom;
	    };
	    zoom.size = function(_) {
	      if (!arguments.length) return size;
	      size = _ && [ +_[0], +_[1] ];
	      return zoom;
	    };
	    zoom.duration = function(_) {
	      if (!arguments.length) return duration;
	      duration = +_;
	      return zoom;
	    };
	    zoom.x = function(z) {
	      if (!arguments.length) return x1;
	      x1 = z;
	      x0 = z.copy();
	      view = {
	        x: 0,
	        y: 0,
	        k: 1
	      };
	      return zoom;
	    };
	    zoom.y = function(z) {
	      if (!arguments.length) return y1;
	      y1 = z;
	      y0 = z.copy();
	      view = {
	        x: 0,
	        y: 0,
	        k: 1
	      };
	      return zoom;
	    };
	    function location(p) {
	      return [ (p[0] - view.x) / view.k, (p[1] - view.y) / view.k ];
	    }
	    function point(l) {
	      return [ l[0] * view.k + view.x, l[1] * view.k + view.y ];
	    }
	    function scaleTo(s) {
	      view.k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s));
	    }
	    function translateTo(p, l) {
	      l = point(l);
	      view.x += p[0] - l[0];
	      view.y += p[1] - l[1];
	    }
	    function zoomTo(that, p, l, k) {
	      that.__chart__ = {
	        x: view.x,
	        y: view.y,
	        k: view.k
	      };
	      scaleTo(Math.pow(2, k));
	      translateTo(center0 = p, l);
	      that = d3.select(that);
	      if (duration > 0) that = that.transition().duration(duration);
	      that.call(zoom.event);
	    }
	    function rescale() {
	      if (x1) x1.domain(x0.range().map(function(x) {
	        return (x - view.x) / view.k;
	      }).map(x0.invert));
	      if (y1) y1.domain(y0.range().map(function(y) {
	        return (y - view.y) / view.k;
	      }).map(y0.invert));
	    }
	    function zoomstarted(dispatch) {
	      if (!zooming++) dispatch({
	        type: "zoomstart"
	      });
	    }
	    function zoomed(dispatch) {
	      rescale();
	      dispatch({
	        type: "zoom",
	        scale: view.k,
	        translate: [ view.x, view.y ]
	      });
	    }
	    function zoomended(dispatch) {
	      if (!--zooming) dispatch({
	        type: "zoomend"
	      }), center0 = null;
	    }
	    function mousedowned() {
	      var that = this, dispatch = event.of(that, arguments), dragged = 0, subject = d3.select(d3_window(that)).on(mousemove, moved).on(mouseup, ended), location0 = location(d3.mouse(that)), dragRestore = d3_event_dragSuppress(that);
	      d3_selection_interrupt.call(that);
	      zoomstarted(dispatch);
	      function moved() {
	        dragged = 1;
	        translateTo(d3.mouse(that), location0);
	        zoomed(dispatch);
	      }
	      function ended() {
	        subject.on(mousemove, null).on(mouseup, null);
	        dragRestore(dragged);
	        zoomended(dispatch);
	      }
	    }
	    function touchstarted() {
	      var that = this, dispatch = event.of(that, arguments), locations0 = {}, distance0 = 0, scale0, zoomName = ".zoom-" + d3.event.changedTouches[0].identifier, touchmove = "touchmove" + zoomName, touchend = "touchend" + zoomName, targets = [], subject = d3.select(that), dragRestore = d3_event_dragSuppress(that);
	      started();
	      zoomstarted(dispatch);
	      subject.on(mousedown, null).on(touchstart, started);
	      function relocate() {
	        var touches = d3.touches(that);
	        scale0 = view.k;
	        touches.forEach(function(t) {
	          if (t.identifier in locations0) locations0[t.identifier] = location(t);
	        });
	        return touches;
	      }
	      function started() {
	        var target = d3.event.target;
	        d3.select(target).on(touchmove, moved).on(touchend, ended);
	        targets.push(target);
	        var changed = d3.event.changedTouches;
	        for (var i = 0, n = changed.length; i < n; ++i) {
	          locations0[changed[i].identifier] = null;
	        }
	        var touches = relocate(), now = Date.now();
	        if (touches.length === 1) {
	          if (now - touchtime < 500) {
	            var p = touches[0];
	            zoomTo(that, p, locations0[p.identifier], Math.floor(Math.log(view.k) / Math.LN2) + 1);
	            d3_eventPreventDefault();
	          }
	          touchtime = now;
	        } else if (touches.length > 1) {
	          var p = touches[0], q = touches[1], dx = p[0] - q[0], dy = p[1] - q[1];
	          distance0 = dx * dx + dy * dy;
	        }
	      }
	      function moved() {
	        var touches = d3.touches(that), p0, l0, p1, l1;
	        d3_selection_interrupt.call(that);
	        for (var i = 0, n = touches.length; i < n; ++i, l1 = null) {
	          p1 = touches[i];
	          if (l1 = locations0[p1.identifier]) {
	            if (l0) break;
	            p0 = p1, l0 = l1;
	          }
	        }
	        if (l1) {
	          var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1, scale1 = distance0 && Math.sqrt(distance1 / distance0);
	          p0 = [ (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 ];
	          l0 = [ (l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2 ];
	          scaleTo(scale1 * scale0);
	        }
	        touchtime = null;
	        translateTo(p0, l0);
	        zoomed(dispatch);
	      }
	      function ended() {
	        if (d3.event.touches.length) {
	          var changed = d3.event.changedTouches;
	          for (var i = 0, n = changed.length; i < n; ++i) {
	            delete locations0[changed[i].identifier];
	          }
	          for (var identifier in locations0) {
	            return void relocate();
	          }
	        }
	        d3.selectAll(targets).on(zoomName, null);
	        subject.on(mousedown, mousedowned).on(touchstart, touchstarted);
	        dragRestore();
	        zoomended(dispatch);
	      }
	    }
	    function mousewheeled() {
	      var dispatch = event.of(this, arguments);
	      if (mousewheelTimer) clearTimeout(mousewheelTimer); else d3_selection_interrupt.call(this), 
	      translate0 = location(center0 = center || d3.mouse(this)), zoomstarted(dispatch);
	      mousewheelTimer = setTimeout(function() {
	        mousewheelTimer = null;
	        zoomended(dispatch);
	      }, 50);
	      d3_eventPreventDefault();
	      scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * view.k);
	      translateTo(center0, translate0);
	      zoomed(dispatch);
	    }
	    function dblclicked() {
	      var p = d3.mouse(this), k = Math.log(view.k) / Math.LN2;
	      zoomTo(this, p, location(p), d3.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1);
	    }
	    return d3.rebind(zoom, event, "on");
	  };
	  var d3_behavior_zoomInfinity = [ 0, Infinity ], d3_behavior_zoomDelta, d3_behavior_zoomWheel;
	  d3.color = d3_color;
	  function d3_color() {}
	  d3_color.prototype.toString = function() {
	    return this.rgb() + "";
	  };
	  d3.hsl = d3_hsl;
	  function d3_hsl(h, s, l) {
	    return this instanceof d3_hsl ? void (this.h = +h, this.s = +s, this.l = +l) : arguments.length < 2 ? h instanceof d3_hsl ? new d3_hsl(h.h, h.s, h.l) : d3_rgb_parse("" + h, d3_rgb_hsl, d3_hsl) : new d3_hsl(h, s, l);
	  }
	  var d3_hslPrototype = d3_hsl.prototype = new d3_color();
	  d3_hslPrototype.brighter = function(k) {
	    k = Math.pow(.7, arguments.length ? k : 1);
	    return new d3_hsl(this.h, this.s, this.l / k);
	  };
	  d3_hslPrototype.darker = function(k) {
	    k = Math.pow(.7, arguments.length ? k : 1);
	    return new d3_hsl(this.h, this.s, k * this.l);
	  };
	  d3_hslPrototype.rgb = function() {
	    return d3_hsl_rgb(this.h, this.s, this.l);
	  };
	  function d3_hsl_rgb(h, s, l) {
	    var m1, m2;
	    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
	    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
	    l = l < 0 ? 0 : l > 1 ? 1 : l;
	    m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
	    m1 = 2 * l - m2;
	    function v(h) {
	      if (h > 360) h -= 360; else if (h < 0) h += 360;
	      if (h < 60) return m1 + (m2 - m1) * h / 60;
	      if (h < 180) return m2;
	      if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
	      return m1;
	    }
	    function vv(h) {
	      return Math.round(v(h) * 255);
	    }
	    return new d3_rgb(vv(h + 120), vv(h), vv(h - 120));
	  }
	  d3.hcl = d3_hcl;
	  function d3_hcl(h, c, l) {
	    return this instanceof d3_hcl ? void (this.h = +h, this.c = +c, this.l = +l) : arguments.length < 2 ? h instanceof d3_hcl ? new d3_hcl(h.h, h.c, h.l) : h instanceof d3_lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : new d3_hcl(h, c, l);
	  }
	  var d3_hclPrototype = d3_hcl.prototype = new d3_color();
	  d3_hclPrototype.brighter = function(k) {
	    return new d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)));
	  };
	  d3_hclPrototype.darker = function(k) {
	    return new d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)));
	  };
	  d3_hclPrototype.rgb = function() {
	    return d3_hcl_lab(this.h, this.c, this.l).rgb();
	  };
	  function d3_hcl_lab(h, c, l) {
	    if (isNaN(h)) h = 0;
	    if (isNaN(c)) c = 0;
	    return new d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c);
	  }
	  d3.lab = d3_lab;
	  function d3_lab(l, a, b) {
	    return this instanceof d3_lab ? void (this.l = +l, this.a = +a, this.b = +b) : arguments.length < 2 ? l instanceof d3_lab ? new d3_lab(l.l, l.a, l.b) : l instanceof d3_hcl ? d3_hcl_lab(l.h, l.c, l.l) : d3_rgb_lab((l = d3_rgb(l)).r, l.g, l.b) : new d3_lab(l, a, b);
	  }
	  var d3_lab_K = 18;
	  var d3_lab_X = .95047, d3_lab_Y = 1, d3_lab_Z = 1.08883;
	  var d3_labPrototype = d3_lab.prototype = new d3_color();
	  d3_labPrototype.brighter = function(k) {
	    return new d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
	  };
	  d3_labPrototype.darker = function(k) {
	    return new d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
	  };
	  d3_labPrototype.rgb = function() {
	    return d3_lab_rgb(this.l, this.a, this.b);
	  };
	  function d3_lab_rgb(l, a, b) {
	    var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200;
	    x = d3_lab_xyz(x) * d3_lab_X;
	    y = d3_lab_xyz(y) * d3_lab_Y;
	    z = d3_lab_xyz(z) * d3_lab_Z;
	    return new d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));
	  }
	  function d3_lab_hcl(l, a, b) {
	    return l > 0 ? new d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : new d3_hcl(NaN, NaN, l);
	  }
	  function d3_lab_xyz(x) {
	    return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;
	  }
	  function d3_xyz_lab(x) {
	    return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;
	  }
	  function d3_xyz_rgb(r) {
	    return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));
	  }
	  d3.rgb = d3_rgb;
	  function d3_rgb(r, g, b) {
	    return this instanceof d3_rgb ? void (this.r = ~~r, this.g = ~~g, this.b = ~~b) : arguments.length < 2 ? r instanceof d3_rgb ? new d3_rgb(r.r, r.g, r.b) : d3_rgb_parse("" + r, d3_rgb, d3_hsl_rgb) : new d3_rgb(r, g, b);
	  }
	  function d3_rgbNumber(value) {
	    return new d3_rgb(value >> 16, value >> 8 & 255, value & 255);
	  }
	  function d3_rgbString(value) {
	    return d3_rgbNumber(value) + "";
	  }
	  var d3_rgbPrototype = d3_rgb.prototype = new d3_color();
	  d3_rgbPrototype.brighter = function(k) {
	    k = Math.pow(.7, arguments.length ? k : 1);
	    var r = this.r, g = this.g, b = this.b, i = 30;
	    if (!r && !g && !b) return new d3_rgb(i, i, i);
	    if (r && r < i) r = i;
	    if (g && g < i) g = i;
	    if (b && b < i) b = i;
	    return new d3_rgb(Math.min(255, r / k), Math.min(255, g / k), Math.min(255, b / k));
	  };
	  d3_rgbPrototype.darker = function(k) {
	    k = Math.pow(.7, arguments.length ? k : 1);
	    return new d3_rgb(k * this.r, k * this.g, k * this.b);
	  };
	  d3_rgbPrototype.hsl = function() {
	    return d3_rgb_hsl(this.r, this.g, this.b);
	  };
	  d3_rgbPrototype.toString = function() {
	    return "#" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);
	  };
	  function d3_rgb_hex(v) {
	    return v < 16 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
	  }
	  function d3_rgb_parse(format, rgb, hsl) {
	    var r = 0, g = 0, b = 0, m1, m2, color;
	    m1 = /([a-z]+)\((.*)\)/.exec(format = format.toLowerCase());
	    if (m1) {
	      m2 = m1[2].split(",");
	      switch (m1[1]) {
	       case "hsl":
	        {
	          return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
	        }

	       case "rgb":
	        {
	          return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]));
	        }
	      }
	    }
	    if (color = d3_rgb_names.get(format)) {
	      return rgb(color.r, color.g, color.b);
	    }
	    if (format != null && format.charAt(0) === "#" && !isNaN(color = parseInt(format.slice(1), 16))) {
	      if (format.length === 4) {
	        r = (color & 3840) >> 4;
	        r = r >> 4 | r;
	        g = color & 240;
	        g = g >> 4 | g;
	        b = color & 15;
	        b = b << 4 | b;
	      } else if (format.length === 7) {
	        r = (color & 16711680) >> 16;
	        g = (color & 65280) >> 8;
	        b = color & 255;
	      }
	    }
	    return rgb(r, g, b);
	  }
	  function d3_rgb_hsl(r, g, b) {
	    var min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, h, s, l = (max + min) / 2;
	    if (d) {
	      s = l < .5 ? d / (max + min) : d / (2 - max - min);
	      if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;
	      h *= 60;
	    } else {
	      h = NaN;
	      s = l > 0 && l < 1 ? 0 : h;
	    }
	    return new d3_hsl(h, s, l);
	  }
	  function d3_rgb_lab(r, g, b) {
	    r = d3_rgb_xyz(r);
	    g = d3_rgb_xyz(g);
	    b = d3_rgb_xyz(b);
	    var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X), y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y), z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);
	    return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));
	  }
	  function d3_rgb_xyz(r) {
	    return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);
	  }
	  function d3_rgb_parseNumber(c) {
	    var f = parseFloat(c);
	    return c.charAt(c.length - 1) === "%" ? Math.round(f * 2.55) : f;
	  }
	  var d3_rgb_names = d3.map({
	    aliceblue: 15792383,
	    antiquewhite: 16444375,
	    aqua: 65535,
	    aquamarine: 8388564,
	    azure: 15794175,
	    beige: 16119260,
	    bisque: 16770244,
	    black: 0,
	    blanchedalmond: 16772045,
	    blue: 255,
	    blueviolet: 9055202,
	    brown: 10824234,
	    burlywood: 14596231,
	    cadetblue: 6266528,
	    chartreuse: 8388352,
	    chocolate: 13789470,
	    coral: 16744272,
	    cornflowerblue: 6591981,
	    cornsilk: 16775388,
	    crimson: 14423100,
	    cyan: 65535,
	    darkblue: 139,
	    darkcyan: 35723,
	    darkgoldenrod: 12092939,
	    darkgray: 11119017,
	    darkgreen: 25600,
	    darkgrey: 11119017,
	    darkkhaki: 12433259,
	    darkmagenta: 9109643,
	    darkolivegreen: 5597999,
	    darkorange: 16747520,
	    darkorchid: 10040012,
	    darkred: 9109504,
	    darksalmon: 15308410,
	    darkseagreen: 9419919,
	    darkslateblue: 4734347,
	    darkslategray: 3100495,
	    darkslategrey: 3100495,
	    darkturquoise: 52945,
	    darkviolet: 9699539,
	    deeppink: 16716947,
	    deepskyblue: 49151,
	    dimgray: 6908265,
	    dimgrey: 6908265,
	    dodgerblue: 2003199,
	    firebrick: 11674146,
	    floralwhite: 16775920,
	    forestgreen: 2263842,
	    fuchsia: 16711935,
	    gainsboro: 14474460,
	    ghostwhite: 16316671,
	    gold: 16766720,
	    goldenrod: 14329120,
	    gray: 8421504,
	    green: 32768,
	    greenyellow: 11403055,
	    grey: 8421504,
	    honeydew: 15794160,
	    hotpink: 16738740,
	    indianred: 13458524,
	    indigo: 4915330,
	    ivory: 16777200,
	    khaki: 15787660,
	    lavender: 15132410,
	    lavenderblush: 16773365,
	    lawngreen: 8190976,
	    lemonchiffon: 16775885,
	    lightblue: 11393254,
	    lightcoral: 15761536,
	    lightcyan: 14745599,
	    lightgoldenrodyellow: 16448210,
	    lightgray: 13882323,
	    lightgreen: 9498256,
	    lightgrey: 13882323,
	    lightpink: 16758465,
	    lightsalmon: 16752762,
	    lightseagreen: 2142890,
	    lightskyblue: 8900346,
	    lightslategray: 7833753,
	    lightslategrey: 7833753,
	    lightsteelblue: 11584734,
	    lightyellow: 16777184,
	    lime: 65280,
	    limegreen: 3329330,
	    linen: 16445670,
	    magenta: 16711935,
	    maroon: 8388608,
	    mediumaquamarine: 6737322,
	    mediumblue: 205,
	    mediumorchid: 12211667,
	    mediumpurple: 9662683,
	    mediumseagreen: 3978097,
	    mediumslateblue: 8087790,
	    mediumspringgreen: 64154,
	    mediumturquoise: 4772300,
	    mediumvioletred: 13047173,
	    midnightblue: 1644912,
	    mintcream: 16121850,
	    mistyrose: 16770273,
	    moccasin: 16770229,
	    navajowhite: 16768685,
	    navy: 128,
	    oldlace: 16643558,
	    olive: 8421376,
	    olivedrab: 7048739,
	    orange: 16753920,
	    orangered: 16729344,
	    orchid: 14315734,
	    palegoldenrod: 15657130,
	    palegreen: 10025880,
	    paleturquoise: 11529966,
	    palevioletred: 14381203,
	    papayawhip: 16773077,
	    peachpuff: 16767673,
	    peru: 13468991,
	    pink: 16761035,
	    plum: 14524637,
	    powderblue: 11591910,
	    purple: 8388736,
	    rebeccapurple: 6697881,
	    red: 16711680,
	    rosybrown: 12357519,
	    royalblue: 4286945,
	    saddlebrown: 9127187,
	    salmon: 16416882,
	    sandybrown: 16032864,
	    seagreen: 3050327,
	    seashell: 16774638,
	    sienna: 10506797,
	    silver: 12632256,
	    skyblue: 8900331,
	    slateblue: 6970061,
	    slategray: 7372944,
	    slategrey: 7372944,
	    snow: 16775930,
	    springgreen: 65407,
	    steelblue: 4620980,
	    tan: 13808780,
	    teal: 32896,
	    thistle: 14204888,
	    tomato: 16737095,
	    turquoise: 4251856,
	    violet: 15631086,
	    wheat: 16113331,
	    white: 16777215,
	    whitesmoke: 16119285,
	    yellow: 16776960,
	    yellowgreen: 10145074
	  });
	  d3_rgb_names.forEach(function(key, value) {
	    d3_rgb_names.set(key, d3_rgbNumber(value));
	  });
	  function d3_functor(v) {
	    return typeof v === "function" ? v : function() {
	      return v;
	    };
	  }
	  d3.functor = d3_functor;
	  d3.xhr = d3_xhrType(d3_identity);
	  function d3_xhrType(response) {
	    return function(url, mimeType, callback) {
	      if (arguments.length === 2 && typeof mimeType === "function") callback = mimeType, 
	      mimeType = null;
	      return d3_xhr(url, mimeType, response, callback);
	    };
	  }
	  function d3_xhr(url, mimeType, response, callback) {
	    var xhr = {}, dispatch = d3.dispatch("beforesend", "progress", "load", "error"), headers = {}, request = new XMLHttpRequest(), responseType = null;
	    if (this.XDomainRequest && !("withCredentials" in request) && /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest();
	    "onload" in request ? request.onload = request.onerror = respond : request.onreadystatechange = function() {
	      request.readyState > 3 && respond();
	    };
	    function respond() {
	      var status = request.status, result;
	      if (!status && d3_xhrHasResponse(request) || status >= 200 && status < 300 || status === 304) {
	        try {
	          result = response.call(xhr, request);
	        } catch (e) {
	          dispatch.error.call(xhr, e);
	          return;
	        }
	        dispatch.load.call(xhr, result);
	      } else {
	        dispatch.error.call(xhr, request);
	      }
	    }
	    request.onprogress = function(event) {
	      var o = d3.event;
	      d3.event = event;
	      try {
	        dispatch.progress.call(xhr, request);
	      } finally {
	        d3.event = o;
	      }
	    };
	    xhr.header = function(name, value) {
	      name = (name + "").toLowerCase();
	      if (arguments.length < 2) return headers[name];
	      if (value == null) delete headers[name]; else headers[name] = value + "";
	      return xhr;
	    };
	    xhr.mimeType = function(value) {
	      if (!arguments.length) return mimeType;
	      mimeType = value == null ? null : value + "";
	      return xhr;
	    };
	    xhr.responseType = function(value) {
	      if (!arguments.length) return responseType;
	      responseType = value;
	      return xhr;
	    };
	    xhr.response = function(value) {
	      response = value;
	      return xhr;
	    };
	    [ "get", "post" ].forEach(function(method) {
	      xhr[method] = function() {
	        return xhr.send.apply(xhr, [ method ].concat(d3_array(arguments)));
	      };
	    });
	    xhr.send = function(method, data, callback) {
	      if (arguments.length === 2 && typeof data === "function") callback = data, data = null;
	      request.open(method, url, true);
	      if (mimeType != null && !("accept" in headers)) headers["accept"] = mimeType + ",*/*";
	      if (request.setRequestHeader) for (var name in headers) request.setRequestHeader(name, headers[name]);
	      if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType);
	      if (responseType != null) request.responseType = responseType;
	      if (callback != null) xhr.on("error", callback).on("load", function(request) {
	        callback(null, request);
	      });
	      dispatch.beforesend.call(xhr, request);
	      request.send(data == null ? null : data);
	      return xhr;
	    };
	    xhr.abort = function() {
	      request.abort();
	      return xhr;
	    };
	    d3.rebind(xhr, dispatch, "on");
	    return callback == null ? xhr : xhr.get(d3_xhr_fixCallback(callback));
	  }
	  function d3_xhr_fixCallback(callback) {
	    return callback.length === 1 ? function(error, request) {
	      callback(error == null ? request : null);
	    } : callback;
	  }
	  function d3_xhrHasResponse(request) {
	    var type = request.responseType;
	    return type && type !== "text" ? request.response : request.responseText;
	  }
	  d3.dsv = function(delimiter, mimeType) {
	    var reFormat = new RegExp('["' + delimiter + "\n]"), delimiterCode = delimiter.charCodeAt(0);
	    function dsv(url, row, callback) {
	      if (arguments.length < 3) callback = row, row = null;
	      var xhr = d3_xhr(url, mimeType, row == null ? response : typedResponse(row), callback);
	      xhr.row = function(_) {
	        return arguments.length ? xhr.response((row = _) == null ? response : typedResponse(_)) : row;
	      };
	      return xhr;
	    }
	    function response(request) {
	      return dsv.parse(request.responseText);
	    }
	    function typedResponse(f) {
	      return function(request) {
	        return dsv.parse(request.responseText, f);
	      };
	    }
	    dsv.parse = function(text, f) {
	      var o;
	      return dsv.parseRows(text, function(row, i) {
	        if (o) return o(row, i - 1);
	        var a = new Function("d", "return {" + row.map(function(name, i) {
	          return JSON.stringify(name) + ": d[" + i + "]";
	        }).join(",") + "}");
	        o = f ? function(row, i) {
	          return f(a(row), i);
	        } : a;
	      });
	    };
	    dsv.parseRows = function(text, f) {
	      var EOL = {}, EOF = {}, rows = [], N = text.length, I = 0, n = 0, t, eol;
	      function token() {
	        if (I >= N) return EOF;
	        if (eol) return eol = false, EOL;
	        var j = I;
	        if (text.charCodeAt(j) === 34) {
	          var i = j;
	          while (i++ < N) {
	            if (text.charCodeAt(i) === 34) {
	              if (text.charCodeAt(i + 1) !== 34) break;
	              ++i;
	            }
	          }
	          I = i + 2;
	          var c = text.charCodeAt(i + 1);
	          if (c === 13) {
	            eol = true;
	            if (text.charCodeAt(i + 2) === 10) ++I;
	          } else if (c === 10) {
	            eol = true;
	          }
	          return text.slice(j + 1, i).replace(/""/g, '"');
	        }
	        while (I < N) {
	          var c = text.charCodeAt(I++), k = 1;
	          if (c === 10) eol = true; else if (c === 13) {
	            eol = true;
	            if (text.charCodeAt(I) === 10) ++I, ++k;
	          } else if (c !== delimiterCode) continue;
	          return text.slice(j, I - k);
	        }
	        return text.slice(j);
	      }
	      while ((t = token()) !== EOF) {
	        var a = [];
	        while (t !== EOL && t !== EOF) {
	          a.push(t);
	          t = token();
	        }
	        if (f && (a = f(a, n++)) == null) continue;
	        rows.push(a);
	      }
	      return rows;
	    };
	    dsv.format = function(rows) {
	      if (Array.isArray(rows[0])) return dsv.formatRows(rows);
	      var fieldSet = new d3_Set(), fields = [];
	      rows.forEach(function(row) {
	        for (var field in row) {
	          if (!fieldSet.has(field)) {
	            fields.push(fieldSet.add(field));
	          }
	        }
	      });
	      return [ fields.map(formatValue).join(delimiter) ].concat(rows.map(function(row) {
	        return fields.map(function(field) {
	          return formatValue(row[field]);
	        }).join(delimiter);
	      })).join("\n");
	    };
	    dsv.formatRows = function(rows) {
	      return rows.map(formatRow).join("\n");
	    };
	    function formatRow(row) {
	      return row.map(formatValue).join(delimiter);
	    }
	    function formatValue(text) {
	      return reFormat.test(text) ? '"' + text.replace(/\"/g, '""') + '"' : text;
	    }
	    return dsv;
	  };
	  d3.csv = d3.dsv(",", "text/csv");
	  d3.tsv = d3.dsv("	", "text/tab-separated-values");
	  var d3_timer_queueHead, d3_timer_queueTail, d3_timer_interval, d3_timer_timeout, d3_timer_frame = this[d3_vendorSymbol(this, "requestAnimationFrame")] || function(callback) {
	    setTimeout(callback, 17);
	  };
	  d3.timer = function() {
	    d3_timer.apply(this, arguments);
	  };
	  function d3_timer(callback, delay, then) {
	    var n = arguments.length;
	    if (n < 2) delay = 0;
	    if (n < 3) then = Date.now();
	    var time = then + delay, timer = {
	      c: callback,
	      t: time,
	      n: null
	    };
	    if (d3_timer_queueTail) d3_timer_queueTail.n = timer; else d3_timer_queueHead = timer;
	    d3_timer_queueTail = timer;
	    if (!d3_timer_interval) {
	      d3_timer_timeout = clearTimeout(d3_timer_timeout);
	      d3_timer_interval = 1;
	      d3_timer_frame(d3_timer_step);
	    }
	    return timer;
	  }
	  function d3_timer_step() {
	    var now = d3_timer_mark(), delay = d3_timer_sweep() - now;
	    if (delay > 24) {
	      if (isFinite(delay)) {
	        clearTimeout(d3_timer_timeout);
	        d3_timer_timeout = setTimeout(d3_timer_step, delay);
	      }
	      d3_timer_interval = 0;
	    } else {
	      d3_timer_interval = 1;
	      d3_timer_frame(d3_timer_step);
	    }
	  }
	  d3.timer.flush = function() {
	    d3_timer_mark();
	    d3_timer_sweep();
	  };
	  function d3_timer_mark() {
	    var now = Date.now(), timer = d3_timer_queueHead;
	    while (timer) {
	      if (now >= timer.t && timer.c(now - timer.t)) timer.c = null;
	      timer = timer.n;
	    }
	    return now;
	  }
	  function d3_timer_sweep() {
	    var t0, t1 = d3_timer_queueHead, time = Infinity;
	    while (t1) {
	      if (t1.c) {
	        if (t1.t < time) time = t1.t;
	        t1 = (t0 = t1).n;
	      } else {
	        t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n;
	      }
	    }
	    d3_timer_queueTail = t0;
	    return time;
	  }
	  function d3_format_precision(x, p) {
	    return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);
	  }
	  d3.round = function(x, n) {
	    return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
	  };
	  var d3_formatPrefixes = [ "y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y" ].map(d3_formatPrefix);
	  d3.formatPrefix = function(value, precision) {
	    var i = 0;
	    if (value = +value) {
	      if (value < 0) value *= -1;
	      if (precision) value = d3.round(value, d3_format_precision(value, precision));
	      i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
	      i = Math.max(-24, Math.min(24, Math.floor((i - 1) / 3) * 3));
	    }
	    return d3_formatPrefixes[8 + i / 3];
	  };
	  function d3_formatPrefix(d, i) {
	    var k = Math.pow(10, abs(8 - i) * 3);
	    return {
	      scale: i > 8 ? function(d) {
	        return d / k;
	      } : function(d) {
	        return d * k;
	      },
	      symbol: d
	    };
	  }
	  function d3_locale_numberFormat(locale) {
	    var locale_decimal = locale.decimal, locale_thousands = locale.thousands, locale_grouping = locale.grouping, locale_currency = locale.currency, formatGroup = locale_grouping && locale_thousands ? function(value, width) {
	      var i = value.length, t = [], j = 0, g = locale_grouping[0], length = 0;
	      while (i > 0 && g > 0) {
	        if (length + g + 1 > width) g = Math.max(1, width - length);
	        t.push(value.substring(i -= g, i + g));
	        if ((length += g + 1) > width) break;
	        g = locale_grouping[j = (j + 1) % locale_grouping.length];
	      }
	      return t.reverse().join(locale_thousands);
	    } : d3_identity;
	    return function(specifier) {
	      var match = d3_format_re.exec(specifier), fill = match[1] || " ", align = match[2] || ">", sign = match[3] || "-", symbol = match[4] || "", zfill = match[5], width = +match[6], comma = match[7], precision = match[8], type = match[9], scale = 1, prefix = "", suffix = "", integer = false, exponent = true;
	      if (precision) precision = +precision.substring(1);
	      if (zfill || fill === "0" && align === "=") {
	        zfill = fill = "0";
	        align = "=";
	      }
	      switch (type) {
	       case "n":
	        comma = true;
	        type = "g";
	        break;

	       case "%":
	        scale = 100;
	        suffix = "%";
	        type = "f";
	        break;

	       case "p":
	        scale = 100;
	        suffix = "%";
	        type = "r";
	        break;

	       case "b":
	       case "o":
	       case "x":
	       case "X":
	        if (symbol === "#") prefix = "0" + type.toLowerCase();

	       case "c":
	        exponent = false;

	       case "d":
	        integer = true;
	        precision = 0;
	        break;

	       case "s":
	        scale = -1;
	        type = "r";
	        break;
	      }
	      if (symbol === "$") prefix = locale_currency[0], suffix = locale_currency[1];
	      if (type == "r" && !precision) type = "g";
	      if (precision != null) {
	        if (type == "g") precision = Math.max(1, Math.min(21, precision)); else if (type == "e" || type == "f") precision = Math.max(0, Math.min(20, precision));
	      }
	      type = d3_format_types.get(type) || d3_format_typeDefault;
	      var zcomma = zfill && comma;
	      return function(value) {
	        var fullSuffix = suffix;
	        if (integer && value % 1) return "";
	        var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, "-") : sign === "-" ? "" : sign;
	        if (scale < 0) {
	          var unit = d3.formatPrefix(value, precision);
	          value = unit.scale(value);
	          fullSuffix = unit.symbol + suffix;
	        } else {
	          value *= scale;
	        }
	        value = type(value, precision);
	        var i = value.lastIndexOf("."), before, after;
	        if (i < 0) {
	          var j = exponent ? value.lastIndexOf("e") : -1;
	          if (j < 0) before = value, after = ""; else before = value.substring(0, j), after = value.substring(j);
	        } else {
	          before = value.substring(0, i);
	          after = locale_decimal + value.substring(i + 1);
	        }
	        if (!zfill && comma) before = formatGroup(before, Infinity);
	        var length = prefix.length + before.length + after.length + (zcomma ? 0 : negative.length), padding = length < width ? new Array(length = width - length + 1).join(fill) : "";
	        if (zcomma) before = formatGroup(padding + before, padding.length ? width - after.length : Infinity);
	        negative += prefix;
	        value = before + after;
	        return (align === "<" ? negative + value + padding : align === ">" ? padding + negative + value : align === "^" ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + fullSuffix;
	      };
	    };
	  }
	  var d3_format_re = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i;
	  var d3_format_types = d3.map({
	    b: function(x) {
	      return x.toString(2);
	    },
	    c: function(x) {
	      return String.fromCharCode(x);
	    },
	    o: function(x) {
	      return x.toString(8);
	    },
	    x: function(x) {
	      return x.toString(16);
	    },
	    X: function(x) {
	      return x.toString(16).toUpperCase();
	    },
	    g: function(x, p) {
	      return x.toPrecision(p);
	    },
	    e: function(x, p) {
	      return x.toExponential(p);
	    },
	    f: function(x, p) {
	      return x.toFixed(p);
	    },
	    r: function(x, p) {
	      return (x = d3.round(x, d3_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, d3_format_precision(x * (1 + 1e-15), p))));
	    }
	  });
	  function d3_format_typeDefault(x) {
	    return x + "";
	  }
	  var d3_time = d3.time = {}, d3_date = Date;
	  function d3_date_utc() {
	    this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0]);
	  }
	  d3_date_utc.prototype = {
	    getDate: function() {
	      return this._.getUTCDate();
	    },
	    getDay: function() {
	      return this._.getUTCDay();
	    },
	    getFullYear: function() {
	      return this._.getUTCFullYear();
	    },
	    getHours: function() {
	      return this._.getUTCHours();
	    },
	    getMilliseconds: function() {
	      return this._.getUTCMilliseconds();
	    },
	    getMinutes: function() {
	      return this._.getUTCMinutes();
	    },
	    getMonth: function() {
	      return this._.getUTCMonth();
	    },
	    getSeconds: function() {
	      return this._.getUTCSeconds();
	    },
	    getTime: function() {
	      return this._.getTime();
	    },
	    getTimezoneOffset: function() {
	      return 0;
	    },
	    valueOf: function() {
	      return this._.valueOf();
	    },
	    setDate: function() {
	      d3_time_prototype.setUTCDate.apply(this._, arguments);
	    },
	    setDay: function() {
	      d3_time_prototype.setUTCDay.apply(this._, arguments);
	    },
	    setFullYear: function() {
	      d3_time_prototype.setUTCFullYear.apply(this._, arguments);
	    },
	    setHours: function() {
	      d3_time_prototype.setUTCHours.apply(this._, arguments);
	    },
	    setMilliseconds: function() {
	      d3_time_prototype.setUTCMilliseconds.apply(this._, arguments);
	    },
	    setMinutes: function() {
	      d3_time_prototype.setUTCMinutes.apply(this._, arguments);
	    },
	    setMonth: function() {
	      d3_time_prototype.setUTCMonth.apply(this._, arguments);
	    },
	    setSeconds: function() {
	      d3_time_prototype.setUTCSeconds.apply(this._, arguments);
	    },
	    setTime: function() {
	      d3_time_prototype.setTime.apply(this._, arguments);
	    }
	  };
	  var d3_time_prototype = Date.prototype;
	  function d3_time_interval(local, step, number) {
	    function round(date) {
	      var d0 = local(date), d1 = offset(d0, 1);
	      return date - d0 < d1 - date ? d0 : d1;
	    }
	    function ceil(date) {
	      step(date = local(new d3_date(date - 1)), 1);
	      return date;
	    }
	    function offset(date, k) {
	      step(date = new d3_date(+date), k);
	      return date;
	    }
	    function range(t0, t1, dt) {
	      var time = ceil(t0), times = [];
	      if (dt > 1) {
	        while (time < t1) {
	          if (!(number(time) % dt)) times.push(new Date(+time));
	          step(time, 1);
	        }
	      } else {
	        while (time < t1) times.push(new Date(+time)), step(time, 1);
	      }
	      return times;
	    }
	    function range_utc(t0, t1, dt) {
	      try {
	        d3_date = d3_date_utc;
	        var utc = new d3_date_utc();
	        utc._ = t0;
	        return range(utc, t1, dt);
	      } finally {
	        d3_date = Date;
	      }
	    }
	    local.floor = local;
	    local.round = round;
	    local.ceil = ceil;
	    local.offset = offset;
	    local.range = range;
	    var utc = local.utc = d3_time_interval_utc(local);
	    utc.floor = utc;
	    utc.round = d3_time_interval_utc(round);
	    utc.ceil = d3_time_interval_utc(ceil);
	    utc.offset = d3_time_interval_utc(offset);
	    utc.range = range_utc;
	    return local;
	  }
	  function d3_time_interval_utc(method) {
	    return function(date, k) {
	      try {
	        d3_date = d3_date_utc;
	        var utc = new d3_date_utc();
	        utc._ = date;
	        return method(utc, k)._;
	      } finally {
	        d3_date = Date;
	      }
	    };
	  }
	  d3_time.year = d3_time_interval(function(date) {
	    date = d3_time.day(date);
	    date.setMonth(0, 1);
	    return date;
	  }, function(date, offset) {
	    date.setFullYear(date.getFullYear() + offset);
	  }, function(date) {
	    return date.getFullYear();
	  });
	  d3_time.years = d3_time.year.range;
	  d3_time.years.utc = d3_time.year.utc.range;
	  d3_time.day = d3_time_interval(function(date) {
	    var day = new d3_date(2e3, 0);
	    day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
	    return day;
	  }, function(date, offset) {
	    date.setDate(date.getDate() + offset);
	  }, function(date) {
	    return date.getDate() - 1;
	  });
	  d3_time.days = d3_time.day.range;
	  d3_time.days.utc = d3_time.day.utc.range;
	  d3_time.dayOfYear = function(date) {
	    var year = d3_time.year(date);
	    return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);
	  };
	  [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ].forEach(function(day, i) {
	    i = 7 - i;
	    var interval = d3_time[day] = d3_time_interval(function(date) {
	      (date = d3_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);
	      return date;
	    }, function(date, offset) {
	      date.setDate(date.getDate() + Math.floor(offset) * 7);
	    }, function(date) {
	      var day = d3_time.year(date).getDay();
	      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);
	    });
	    d3_time[day + "s"] = interval.range;
	    d3_time[day + "s"].utc = interval.utc.range;
	    d3_time[day + "OfYear"] = function(date) {
	      var day = d3_time.year(date).getDay();
	      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7);
	    };
	  });
	  d3_time.week = d3_time.sunday;
	  d3_time.weeks = d3_time.sunday.range;
	  d3_time.weeks.utc = d3_time.sunday.utc.range;
	  d3_time.weekOfYear = d3_time.sundayOfYear;
	  function d3_locale_timeFormat(locale) {
	    var locale_dateTime = locale.dateTime, locale_date = locale.date, locale_time = locale.time, locale_periods = locale.periods, locale_days = locale.days, locale_shortDays = locale.shortDays, locale_months = locale.months, locale_shortMonths = locale.shortMonths;
	    function d3_time_format(template) {
	      var n = template.length;
	      function format(date) {
	        var string = [], i = -1, j = 0, c, p, f;
	        while (++i < n) {
	          if (template.charCodeAt(i) === 37) {
	            string.push(template.slice(j, i));
	            if ((p = d3_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i);
	            if (f = d3_time_formats[c]) c = f(date, p == null ? c === "e" ? " " : "0" : p);
	            string.push(c);
	            j = i + 1;
	          }
	        }
	        string.push(template.slice(j, i));
	        return string.join("");
	      }
	      format.parse = function(string) {
	        var d = {
	          y: 1900,
	          m: 0,
	          d: 1,
	          H: 0,
	          M: 0,
	          S: 0,
	          L: 0,
	          Z: null
	        }, i = d3_time_parse(d, template, string, 0);
	        if (i != string.length) return null;
	        if ("p" in d) d.H = d.H % 12 + d.p * 12;
	        var localZ = d.Z != null && d3_date !== d3_date_utc, date = new (localZ ? d3_date_utc : d3_date)();
	        if ("j" in d) date.setFullYear(d.y, 0, d.j); else if ("W" in d || "U" in d) {
	          if (!("w" in d)) d.w = "W" in d ? 1 : 0;
	          date.setFullYear(d.y, 0, 1);
	          date.setFullYear(d.y, 0, "W" in d ? (d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7 : d.w + d.U * 7 - (date.getDay() + 6) % 7);
	        } else date.setFullYear(d.y, d.m, d.d);
	        date.setHours(d.H + (d.Z / 100 | 0), d.M + d.Z % 100, d.S, d.L);
	        return localZ ? date._ : date;
	      };
	      format.toString = function() {
	        return template;
	      };
	      return format;
	    }
	    function d3_time_parse(date, template, string, j) {
	      var c, p, t, i = 0, n = template.length, m = string.length;
	      while (i < n) {
	        if (j >= m) return -1;
	        c = template.charCodeAt(i++);
	        if (c === 37) {
	          t = template.charAt(i++);
	          p = d3_time_parsers[t in d3_time_formatPads ? template.charAt(i++) : t];
	          if (!p || (j = p(date, string, j)) < 0) return -1;
	        } else if (c != string.charCodeAt(j++)) {
	          return -1;
	        }
	      }
	      return j;
	    }
	    d3_time_format.utc = function(template) {
	      var local = d3_time_format(template);
	      function format(date) {
	        try {
	          d3_date = d3_date_utc;
	          var utc = new d3_date();
	          utc._ = date;
	          return local(utc);
	        } finally {
	          d3_date = Date;
	        }
	      }
	      format.parse = function(string) {
	        try {
	          d3_date = d3_date_utc;
	          var date = local.parse(string);
	          return date && date._;
	        } finally {
	          d3_date = Date;
	        }
	      };
	      format.toString = local.toString;
	      return format;
	    };
	    d3_time_format.multi = d3_time_format.utc.multi = d3_time_formatMulti;
	    var d3_time_periodLookup = d3.map(), d3_time_dayRe = d3_time_formatRe(locale_days), d3_time_dayLookup = d3_time_formatLookup(locale_days), d3_time_dayAbbrevRe = d3_time_formatRe(locale_shortDays), d3_time_dayAbbrevLookup = d3_time_formatLookup(locale_shortDays), d3_time_monthRe = d3_time_formatRe(locale_months), d3_time_monthLookup = d3_time_formatLookup(locale_months), d3_time_monthAbbrevRe = d3_time_formatRe(locale_shortMonths), d3_time_monthAbbrevLookup = d3_time_formatLookup(locale_shortMonths);
	    locale_periods.forEach(function(p, i) {
	      d3_time_periodLookup.set(p.toLowerCase(), i);
	    });
	    var d3_time_formats = {
	      a: function(d) {
	        return locale_shortDays[d.getDay()];
	      },
	      A: function(d) {
	        return locale_days[d.getDay()];
	      },
	      b: function(d) {
	        return locale_shortMonths[d.getMonth()];
	      },
	      B: function(d) {
	        return locale_months[d.getMonth()];
	      },
	      c: d3_time_format(locale_dateTime),
	      d: function(d, p) {
	        return d3_time_formatPad(d.getDate(), p, 2);
	      },
	      e: function(d, p) {
	        return d3_time_formatPad(d.getDate(), p, 2);
	      },
	      H: function(d, p) {
	        return d3_time_formatPad(d.getHours(), p, 2);
	      },
	      I: function(d, p) {
	        return d3_time_formatPad(d.getHours() % 12 || 12, p, 2);
	      },
	      j: function(d, p) {
	        return d3_time_formatPad(1 + d3_time.dayOfYear(d), p, 3);
	      },
	      L: function(d, p) {
	        return d3_time_formatPad(d.getMilliseconds(), p, 3);
	      },
	      m: function(d, p) {
	        return d3_time_formatPad(d.getMonth() + 1, p, 2);
	      },
	      M: function(d, p) {
	        return d3_time_formatPad(d.getMinutes(), p, 2);
	      },
	      p: function(d) {
	        return locale_periods[+(d.getHours() >= 12)];
	      },
	      S: function(d, p) {
	        return d3_time_formatPad(d.getSeconds(), p, 2);
	      },
	      U: function(d, p) {
	        return d3_time_formatPad(d3_time.sundayOfYear(d), p, 2);
	      },
	      w: function(d) {
	        return d.getDay();
	      },
	      W: function(d, p) {
	        return d3_time_formatPad(d3_time.mondayOfYear(d), p, 2);
	      },
	      x: d3_time_format(locale_date),
	      X: d3_time_format(locale_time),
	      y: function(d, p) {
	        return d3_time_formatPad(d.getFullYear() % 100, p, 2);
	      },
	      Y: function(d, p) {
	        return d3_time_formatPad(d.getFullYear() % 1e4, p, 4);
	      },
	      Z: d3_time_zone,
	      "%": function() {
	        return "%";
	      }
	    };
	    var d3_time_parsers = {
	      a: d3_time_parseWeekdayAbbrev,
	      A: d3_time_parseWeekday,
	      b: d3_time_parseMonthAbbrev,
	      B: d3_time_parseMonth,
	      c: d3_time_parseLocaleFull,
	      d: d3_time_parseDay,
	      e: d3_time_parseDay,
	      H: d3_time_parseHour24,
	      I: d3_time_parseHour24,
	      j: d3_time_parseDayOfYear,
	      L: d3_time_parseMilliseconds,
	      m: d3_time_parseMonthNumber,
	      M: d3_time_parseMinutes,
	      p: d3_time_parseAmPm,
	      S: d3_time_parseSeconds,
	      U: d3_time_parseWeekNumberSunday,
	      w: d3_time_parseWeekdayNumber,
	      W: d3_time_parseWeekNumberMonday,
	      x: d3_time_parseLocaleDate,
	      X: d3_time_parseLocaleTime,
	      y: d3_time_parseYear,
	      Y: d3_time_parseFullYear,
	      Z: d3_time_parseZone,
	      "%": d3_time_parseLiteralPercent
	    };
	    function d3_time_parseWeekdayAbbrev(date, string, i) {
	      d3_time_dayAbbrevRe.lastIndex = 0;
	      var n = d3_time_dayAbbrevRe.exec(string.slice(i));
	      return n ? (date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
	    }
	    function d3_time_parseWeekday(date, string, i) {
	      d3_time_dayRe.lastIndex = 0;
	      var n = d3_time_dayRe.exec(string.slice(i));
	      return n ? (date.w = d3_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
	    }
	    function d3_time_parseMonthAbbrev(date, string, i) {
	      d3_time_monthAbbrevRe.lastIndex = 0;
	      var n = d3_time_monthAbbrevRe.exec(string.slice(i));
	      return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
	    }
	    function d3_time_parseMonth(date, string, i) {
	      d3_time_monthRe.lastIndex = 0;
	      var n = d3_time_monthRe.exec(string.slice(i));
	      return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
	    }
	    function d3_time_parseLocaleFull(date, string, i) {
	      return d3_time_parse(date, d3_time_formats.c.toString(), string, i);
	    }
	    function d3_time_parseLocaleDate(date, string, i) {
	      return d3_time_parse(date, d3_time_formats.x.toString(), string, i);
	    }
	    function d3_time_parseLocaleTime(date, string, i) {
	      return d3_time_parse(date, d3_time_formats.X.toString(), string, i);
	    }
	    function d3_time_parseAmPm(date, string, i) {
	      var n = d3_time_periodLookup.get(string.slice(i, i += 2).toLowerCase());
	      return n == null ? -1 : (date.p = n, i);
	    }
	    return d3_time_format;
	  }
	  var d3_time_formatPads = {
	    "-": "",
	    _: " ",
	    "0": "0"
	  }, d3_time_numberRe = /^\s*\d+/, d3_time_percentRe = /^%/;
	  function d3_time_formatPad(value, fill, width) {
	    var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
	    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
	  }
	  function d3_time_formatRe(names) {
	    return new RegExp("^(?:" + names.map(d3.requote).join("|") + ")", "i");
	  }
	  function d3_time_formatLookup(names) {
	    var map = new d3_Map(), i = -1, n = names.length;
	    while (++i < n) map.set(names[i].toLowerCase(), i);
	    return map;
	  }
	  function d3_time_parseWeekdayNumber(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 1));
	    return n ? (date.w = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseWeekNumberSunday(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i));
	    return n ? (date.U = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseWeekNumberMonday(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i));
	    return n ? (date.W = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseFullYear(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 4));
	    return n ? (date.y = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseYear(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.y = d3_time_expandYear(+n[0]), i + n[0].length) : -1;
	  }
	  function d3_time_parseZone(date, string, i) {
	    return /^[+-]\d{4}$/.test(string = string.slice(i, i + 5)) ? (date.Z = -string, 
	    i + 5) : -1;
	  }
	  function d3_time_expandYear(d) {
	    return d + (d > 68 ? 1900 : 2e3);
	  }
	  function d3_time_parseMonthNumber(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.m = n[0] - 1, i + n[0].length) : -1;
	  }
	  function d3_time_parseDay(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.d = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseDayOfYear(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 3));
	    return n ? (date.j = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseHour24(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.H = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseMinutes(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.M = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseSeconds(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.S = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseMilliseconds(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 3));
	    return n ? (date.L = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_zone(d) {
	    var z = d.getTimezoneOffset(), zs = z > 0 ? "-" : "+", zh = abs(z) / 60 | 0, zm = abs(z) % 60;
	    return zs + d3_time_formatPad(zh, "0", 2) + d3_time_formatPad(zm, "0", 2);
	  }
	  function d3_time_parseLiteralPercent(date, string, i) {
	    d3_time_percentRe.lastIndex = 0;
	    var n = d3_time_percentRe.exec(string.slice(i, i + 1));
	    return n ? i + n[0].length : -1;
	  }
	  function d3_time_formatMulti(formats) {
	    var n = formats.length, i = -1;
	    while (++i < n) formats[i][0] = this(formats[i][0]);
	    return function(date) {
	      var i = 0, f = formats[i];
	      while (!f[1](date)) f = formats[++i];
	      return f[0](date);
	    };
	  }
	  d3.locale = function(locale) {
	    return {
	      numberFormat: d3_locale_numberFormat(locale),
	      timeFormat: d3_locale_timeFormat(locale)
	    };
	  };
	  var d3_locale_enUS = d3.locale({
	    decimal: ".",
	    thousands: ",",
	    grouping: [ 3 ],
	    currency: [ "$", "" ],
	    dateTime: "%a %b %e %X %Y",
	    date: "%m/%d/%Y",
	    time: "%H:%M:%S",
	    periods: [ "AM", "PM" ],
	    days: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
	    shortDays: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
	    months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
	    shortMonths: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
	  });
	  d3.format = d3_locale_enUS.numberFormat;
	  d3.geo = {};
	  function d3_adder() {}
	  d3_adder.prototype = {
	    s: 0,
	    t: 0,
	    add: function(y) {
	      d3_adderSum(y, this.t, d3_adderTemp);
	      d3_adderSum(d3_adderTemp.s, this.s, this);
	      if (this.s) this.t += d3_adderTemp.t; else this.s = d3_adderTemp.t;
	    },
	    reset: function() {
	      this.s = this.t = 0;
	    },
	    valueOf: function() {
	      return this.s;
	    }
	  };
	  var d3_adderTemp = new d3_adder();
	  function d3_adderSum(a, b, o) {
	    var x = o.s = a + b, bv = x - a, av = x - bv;
	    o.t = a - av + (b - bv);
	  }
	  d3.geo.stream = function(object, listener) {
	    if (object && d3_geo_streamObjectType.hasOwnProperty(object.type)) {
	      d3_geo_streamObjectType[object.type](object, listener);
	    } else {
	      d3_geo_streamGeometry(object, listener);
	    }
	  };
	  function d3_geo_streamGeometry(geometry, listener) {
	    if (geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type)) {
	      d3_geo_streamGeometryType[geometry.type](geometry, listener);
	    }
	  }
	  var d3_geo_streamObjectType = {
	    Feature: function(feature, listener) {
	      d3_geo_streamGeometry(feature.geometry, listener);
	    },
	    FeatureCollection: function(object, listener) {
	      var features = object.features, i = -1, n = features.length;
	      while (++i < n) d3_geo_streamGeometry(features[i].geometry, listener);
	    }
	  };
	  var d3_geo_streamGeometryType = {
	    Sphere: function(object, listener) {
	      listener.sphere();
	    },
	    Point: function(object, listener) {
	      object = object.coordinates;
	      listener.point(object[0], object[1], object[2]);
	    },
	    MultiPoint: function(object, listener) {
	      var coordinates = object.coordinates, i = -1, n = coordinates.length;
	      while (++i < n) object = coordinates[i], listener.point(object[0], object[1], object[2]);
	    },
	    LineString: function(object, listener) {
	      d3_geo_streamLine(object.coordinates, listener, 0);
	    },
	    MultiLineString: function(object, listener) {
	      var coordinates = object.coordinates, i = -1, n = coordinates.length;
	      while (++i < n) d3_geo_streamLine(coordinates[i], listener, 0);
	    },
	    Polygon: function(object, listener) {
	      d3_geo_streamPolygon(object.coordinates, listener);
	    },
	    MultiPolygon: function(object, listener) {
	      var coordinates = object.coordinates, i = -1, n = coordinates.length;
	      while (++i < n) d3_geo_streamPolygon(coordinates[i], listener);
	    },
	    GeometryCollection: function(object, listener) {
	      var geometries = object.geometries, i = -1, n = geometries.length;
	      while (++i < n) d3_geo_streamGeometry(geometries[i], listener);
	    }
	  };
	  function d3_geo_streamLine(coordinates, listener, closed) {
	    var i = -1, n = coordinates.length - closed, coordinate;
	    listener.lineStart();
	    while (++i < n) coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1], coordinate[2]);
	    listener.lineEnd();
	  }
	  function d3_geo_streamPolygon(coordinates, listener) {
	    var i = -1, n = coordinates.length;
	    listener.polygonStart();
	    while (++i < n) d3_geo_streamLine(coordinates[i], listener, 1);
	    listener.polygonEnd();
	  }
	  d3.geo.area = function(object) {
	    d3_geo_areaSum = 0;
	    d3.geo.stream(object, d3_geo_area);
	    return d3_geo_areaSum;
	  };
	  var d3_geo_areaSum, d3_geo_areaRingSum = new d3_adder();
	  var d3_geo_area = {
	    sphere: function() {
	      d3_geo_areaSum += 4 * π;
	    },
	    point: d3_noop,
	    lineStart: d3_noop,
	    lineEnd: d3_noop,
	    polygonStart: function() {
	      d3_geo_areaRingSum.reset();
	      d3_geo_area.lineStart = d3_geo_areaRingStart;
	    },
	    polygonEnd: function() {
	      var area = 2 * d3_geo_areaRingSum;
	      d3_geo_areaSum += area < 0 ? 4 * π + area : area;
	      d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop;
	    }
	  };
	  function d3_geo_areaRingStart() {
	    var λ00, φ00, λ0, cosφ0, sinφ0;
	    d3_geo_area.point = function(λ, φ) {
	      d3_geo_area.point = nextPoint;
	      λ0 = (λ00 = λ) * d3_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4), 
	      sinφ0 = Math.sin(φ);
	    };
	    function nextPoint(λ, φ) {
	      λ *= d3_radians;
	      φ = φ * d3_radians / 2 + π / 4;
	      var dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, cosφ = Math.cos(φ), sinφ = Math.sin(φ), k = sinφ0 * sinφ, u = cosφ0 * cosφ + k * Math.cos(adλ), v = k * sdλ * Math.sin(adλ);
	      d3_geo_areaRingSum.add(Math.atan2(v, u));
	      λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ;
	    }
	    d3_geo_area.lineEnd = function() {
	      nextPoint(λ00, φ00);
	    };
	  }
	  function d3_geo_cartesian(spherical) {
	    var λ = spherical[0], φ = spherical[1], cosφ = Math.cos(φ);
	    return [ cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ) ];
	  }
	  function d3_geo_cartesianDot(a, b) {
	    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	  }
	  function d3_geo_cartesianCross(a, b) {
	    return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ];
	  }
	  function d3_geo_cartesianAdd(a, b) {
	    a[0] += b[0];
	    a[1] += b[1];
	    a[2] += b[2];
	  }
	  function d3_geo_cartesianScale(vector, k) {
	    return [ vector[0] * k, vector[1] * k, vector[2] * k ];
	  }
	  function d3_geo_cartesianNormalize(d) {
	    var l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
	    d[0] /= l;
	    d[1] /= l;
	    d[2] /= l;
	  }
	  function d3_geo_spherical(cartesian) {
	    return [ Math.atan2(cartesian[1], cartesian[0]), d3_asin(cartesian[2]) ];
	  }
	  function d3_geo_sphericalEqual(a, b) {
	    return abs(a[0] - b[0]) < ε && abs(a[1] - b[1]) < ε;
	  }
	  d3.geo.bounds = function() {
	    var λ0, φ0, λ1, φ1, λ_, λ__, φ__, p0, dλSum, ranges, range;
	    var bound = {
	      point: point,
	      lineStart: lineStart,
	      lineEnd: lineEnd,
	      polygonStart: function() {
	        bound.point = ringPoint;
	        bound.lineStart = ringStart;
	        bound.lineEnd = ringEnd;
	        dλSum = 0;
	        d3_geo_area.polygonStart();
	      },
	      polygonEnd: function() {
	        d3_geo_area.polygonEnd();
	        bound.point = point;
	        bound.lineStart = lineStart;
	        bound.lineEnd = lineEnd;
	        if (d3_geo_areaRingSum < 0) λ0 = -(λ1 = 180), φ0 = -(φ1 = 90); else if (dλSum > ε) φ1 = 90; else if (dλSum < -ε) φ0 = -90;
	        range[0] = λ0, range[1] = λ1;
	      }
	    };
	    function point(λ, φ) {
	      ranges.push(range = [ λ0 = λ, λ1 = λ ]);
	      if (φ < φ0) φ0 = φ;
	      if (φ > φ1) φ1 = φ;
	    }
	    function linePoint(λ, φ) {
	      var p = d3_geo_cartesian([ λ * d3_radians, φ * d3_radians ]);
	      if (p0) {
	        var normal = d3_geo_cartesianCross(p0, p), equatorial = [ normal[1], -normal[0], 0 ], inflection = d3_geo_cartesianCross(equatorial, normal);
	        d3_geo_cartesianNormalize(inflection);
	        inflection = d3_geo_spherical(inflection);
	        var dλ = λ - λ_, s = dλ > 0 ? 1 : -1, λi = inflection[0] * d3_degrees * s, antimeridian = abs(dλ) > 180;
	        if (antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
	          var φi = inflection[1] * d3_degrees;
	          if (φi > φ1) φ1 = φi;
	        } else if (λi = (λi + 360) % 360 - 180, antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
	          var φi = -inflection[1] * d3_degrees;
	          if (φi < φ0) φ0 = φi;
	        } else {
	          if (φ < φ0) φ0 = φ;
	          if (φ > φ1) φ1 = φ;
	        }
	        if (antimeridian) {
	          if (λ < λ_) {
	            if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
	          } else {
	            if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
	          }
	        } else {
	          if (λ1 >= λ0) {
	            if (λ < λ0) λ0 = λ;
	            if (λ > λ1) λ1 = λ;
	          } else {
	            if (λ > λ_) {
	              if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
	            } else {
	              if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
	            }
	          }
	        }
	      } else {
	        point(λ, φ);
	      }
	      p0 = p, λ_ = λ;
	    }
	    function lineStart() {
	      bound.point = linePoint;
	    }
	    function lineEnd() {
	      range[0] = λ0, range[1] = λ1;
	      bound.point = point;
	      p0 = null;
	    }
	    function ringPoint(λ, φ) {
	      if (p0) {
	        var dλ = λ - λ_;
	        dλSum += abs(dλ) > 180 ? dλ + (dλ > 0 ? 360 : -360) : dλ;
	      } else λ__ = λ, φ__ = φ;
	      d3_geo_area.point(λ, φ);
	      linePoint(λ, φ);
	    }
	    function ringStart() {
	      d3_geo_area.lineStart();
	    }
	    function ringEnd() {
	      ringPoint(λ__, φ__);
	      d3_geo_area.lineEnd();
	      if (abs(dλSum) > ε) λ0 = -(λ1 = 180);
	      range[0] = λ0, range[1] = λ1;
	      p0 = null;
	    }
	    function angle(λ0, λ1) {
	      return (λ1 -= λ0) < 0 ? λ1 + 360 : λ1;
	    }
	    function compareRanges(a, b) {
	      return a[0] - b[0];
	    }
	    function withinRange(x, range) {
	      return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
	    }
	    return function(feature) {
	      φ1 = λ1 = -(λ0 = φ0 = Infinity);
	      ranges = [];
	      d3.geo.stream(feature, bound);
	      var n = ranges.length;
	      if (n) {
	        ranges.sort(compareRanges);
	        for (var i = 1, a = ranges[0], b, merged = [ a ]; i < n; ++i) {
	          b = ranges[i];
	          if (withinRange(b[0], a) || withinRange(b[1], a)) {
	            if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
	            if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
	          } else {
	            merged.push(a = b);
	          }
	        }
	        var best = -Infinity, dλ;
	        for (var n = merged.length - 1, i = 0, a = merged[n], b; i <= n; a = b, ++i) {
	          b = merged[i];
	          if ((dλ = angle(a[1], b[0])) > best) best = dλ, λ0 = b[0], λ1 = a[1];
	        }
	      }
	      ranges = range = null;
	      return λ0 === Infinity || φ0 === Infinity ? [ [ NaN, NaN ], [ NaN, NaN ] ] : [ [ λ0, φ0 ], [ λ1, φ1 ] ];
	    };
	  }();
	  d3.geo.centroid = function(object) {
	    d3_geo_centroidW0 = d3_geo_centroidW1 = d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
	    d3.geo.stream(object, d3_geo_centroid);
	    var x = d3_geo_centroidX2, y = d3_geo_centroidY2, z = d3_geo_centroidZ2, m = x * x + y * y + z * z;
	    if (m < ε2) {
	      x = d3_geo_centroidX1, y = d3_geo_centroidY1, z = d3_geo_centroidZ1;
	      if (d3_geo_centroidW1 < ε) x = d3_geo_centroidX0, y = d3_geo_centroidY0, z = d3_geo_centroidZ0;
	      m = x * x + y * y + z * z;
	      if (m < ε2) return [ NaN, NaN ];
	    }
	    return [ Math.atan2(y, x) * d3_degrees, d3_asin(z / Math.sqrt(m)) * d3_degrees ];
	  };
	  var d3_geo_centroidW0, d3_geo_centroidW1, d3_geo_centroidX0, d3_geo_centroidY0, d3_geo_centroidZ0, d3_geo_centroidX1, d3_geo_centroidY1, d3_geo_centroidZ1, d3_geo_centroidX2, d3_geo_centroidY2, d3_geo_centroidZ2;
	  var d3_geo_centroid = {
	    sphere: d3_noop,
	    point: d3_geo_centroidPoint,
	    lineStart: d3_geo_centroidLineStart,
	    lineEnd: d3_geo_centroidLineEnd,
	    polygonStart: function() {
	      d3_geo_centroid.lineStart = d3_geo_centroidRingStart;
	    },
	    polygonEnd: function() {
	      d3_geo_centroid.lineStart = d3_geo_centroidLineStart;
	    }
	  };
	  function d3_geo_centroidPoint(λ, φ) {
	    λ *= d3_radians;
	    var cosφ = Math.cos(φ *= d3_radians);
	    d3_geo_centroidPointXYZ(cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ));
	  }
	  function d3_geo_centroidPointXYZ(x, y, z) {
	    ++d3_geo_centroidW0;
	    d3_geo_centroidX0 += (x - d3_geo_centroidX0) / d3_geo_centroidW0;
	    d3_geo_centroidY0 += (y - d3_geo_centroidY0) / d3_geo_centroidW0;
	    d3_geo_centroidZ0 += (z - d3_geo_centroidZ0) / d3_geo_centroidW0;
	  }
	  function d3_geo_centroidLineStart() {
	    var x0, y0, z0;
	    d3_geo_centroid.point = function(λ, φ) {
	      λ *= d3_radians;
	      var cosφ = Math.cos(φ *= d3_radians);
	      x0 = cosφ * Math.cos(λ);
	      y0 = cosφ * Math.sin(λ);
	      z0 = Math.sin(φ);
	      d3_geo_centroid.point = nextPoint;
	      d3_geo_centroidPointXYZ(x0, y0, z0);
	    };
	    function nextPoint(λ, φ) {
	      λ *= d3_radians;
	      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), w = Math.atan2(Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
	      d3_geo_centroidW1 += w;
	      d3_geo_centroidX1 += w * (x0 + (x0 = x));
	      d3_geo_centroidY1 += w * (y0 + (y0 = y));
	      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
	      d3_geo_centroidPointXYZ(x0, y0, z0);
	    }
	  }
	  function d3_geo_centroidLineEnd() {
	    d3_geo_centroid.point = d3_geo_centroidPoint;
	  }
	  function d3_geo_centroidRingStart() {
	    var λ00, φ00, x0, y0, z0;
	    d3_geo_centroid.point = function(λ, φ) {
	      λ00 = λ, φ00 = φ;
	      d3_geo_centroid.point = nextPoint;
	      λ *= d3_radians;
	      var cosφ = Math.cos(φ *= d3_radians);
	      x0 = cosφ * Math.cos(λ);
	      y0 = cosφ * Math.sin(λ);
	      z0 = Math.sin(φ);
	      d3_geo_centroidPointXYZ(x0, y0, z0);
	    };
	    d3_geo_centroid.lineEnd = function() {
	      nextPoint(λ00, φ00);
	      d3_geo_centroid.lineEnd = d3_geo_centroidLineEnd;
	      d3_geo_centroid.point = d3_geo_centroidPoint;
	    };
	    function nextPoint(λ, φ) {
	      λ *= d3_radians;
	      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), cx = y0 * z - z0 * y, cy = z0 * x - x0 * z, cz = x0 * y - y0 * x, m = Math.sqrt(cx * cx + cy * cy + cz * cz), u = x0 * x + y0 * y + z0 * z, v = m && -d3_acos(u) / m, w = Math.atan2(m, u);
	      d3_geo_centroidX2 += v * cx;
	      d3_geo_centroidY2 += v * cy;
	      d3_geo_centroidZ2 += v * cz;
	      d3_geo_centroidW1 += w;
	      d3_geo_centroidX1 += w * (x0 + (x0 = x));
	      d3_geo_centroidY1 += w * (y0 + (y0 = y));
	      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
	      d3_geo_centroidPointXYZ(x0, y0, z0);
	    }
	  }
	  function d3_geo_compose(a, b) {
	    function compose(x, y) {
	      return x = a(x, y), b(x[0], x[1]);
	    }
	    if (a.invert && b.invert) compose.invert = function(x, y) {
	      return x = b.invert(x, y), x && a.invert(x[0], x[1]);
	    };
	    return compose;
	  }
	  function d3_true() {
	    return true;
	  }
	  function d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener) {
	    var subject = [], clip = [];
	    segments.forEach(function(segment) {
	      if ((n = segment.length - 1) <= 0) return;
	      var n, p0 = segment[0], p1 = segment[n];
	      if (d3_geo_sphericalEqual(p0, p1)) {
	        listener.lineStart();
	        for (var i = 0; i < n; ++i) listener.point((p0 = segment[i])[0], p0[1]);
	        listener.lineEnd();
	        return;
	      }
	      var a = new d3_geo_clipPolygonIntersection(p0, segment, null, true), b = new d3_geo_clipPolygonIntersection(p0, null, a, false);
	      a.o = b;
	      subject.push(a);
	      clip.push(b);
	      a = new d3_geo_clipPolygonIntersection(p1, segment, null, false);
	      b = new d3_geo_clipPolygonIntersection(p1, null, a, true);
	      a.o = b;
	      subject.push(a);
	      clip.push(b);
	    });
	    clip.sort(compare);
	    d3_geo_clipPolygonLinkCircular(subject);
	    d3_geo_clipPolygonLinkCircular(clip);
	    if (!subject.length) return;
	    for (var i = 0, entry = clipStartInside, n = clip.length; i < n; ++i) {
	      clip[i].e = entry = !entry;
	    }
	    var start = subject[0], points, point;
	    while (1) {
	      var current = start, isSubject = true;
	      while (current.v) if ((current = current.n) === start) return;
	      points = current.z;
	      listener.lineStart();
	      do {
	        current.v = current.o.v = true;
	        if (current.e) {
	          if (isSubject) {
	            for (var i = 0, n = points.length; i < n; ++i) listener.point((point = points[i])[0], point[1]);
	          } else {
	            interpolate(current.x, current.n.x, 1, listener);
	          }
	          current = current.n;
	        } else {
	          if (isSubject) {
	            points = current.p.z;
	            for (var i = points.length - 1; i >= 0; --i) listener.point((point = points[i])[0], point[1]);
	          } else {
	            interpolate(current.x, current.p.x, -1, listener);
	          }
	          current = current.p;
	        }
	        current = current.o;
	        points = current.z;
	        isSubject = !isSubject;
	      } while (!current.v);
	      listener.lineEnd();
	    }
	  }
	  function d3_geo_clipPolygonLinkCircular(array) {
	    if (!(n = array.length)) return;
	    var n, i = 0, a = array[0], b;
	    while (++i < n) {
	      a.n = b = array[i];
	      b.p = a;
	      a = b;
	    }
	    a.n = b = array[0];
	    b.p = a;
	  }
	  function d3_geo_clipPolygonIntersection(point, points, other, entry) {
	    this.x = point;
	    this.z = points;
	    this.o = other;
	    this.e = entry;
	    this.v = false;
	    this.n = this.p = null;
	  }
	  function d3_geo_clip(pointVisible, clipLine, interpolate, clipStart) {
	    return function(rotate, listener) {
	      var line = clipLine(listener), rotatedClipStart = rotate.invert(clipStart[0], clipStart[1]);
	      var clip = {
	        point: point,
	        lineStart: lineStart,
	        lineEnd: lineEnd,
	        polygonStart: function() {
	          clip.point = pointRing;
	          clip.lineStart = ringStart;
	          clip.lineEnd = ringEnd;
	          segments = [];
	          polygon = [];
	        },
	        polygonEnd: function() {
	          clip.point = point;
	          clip.lineStart = lineStart;
	          clip.lineEnd = lineEnd;
	          segments = d3.merge(segments);
	          var clipStartInside = d3_geo_pointInPolygon(rotatedClipStart, polygon);
	          if (segments.length) {
	            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
	            d3_geo_clipPolygon(segments, d3_geo_clipSort, clipStartInside, interpolate, listener);
	          } else if (clipStartInside) {
	            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
	            listener.lineStart();
	            interpolate(null, null, 1, listener);
	            listener.lineEnd();
	          }
	          if (polygonStarted) listener.polygonEnd(), polygonStarted = false;
	          segments = polygon = null;
	        },
	        sphere: function() {
	          listener.polygonStart();
	          listener.lineStart();
	          interpolate(null, null, 1, listener);
	          listener.lineEnd();
	          listener.polygonEnd();
	        }
	      };
	      function point(λ, φ) {
	        var point = rotate(λ, φ);
	        if (pointVisible(λ = point[0], φ = point[1])) listener.point(λ, φ);
	      }
	      function pointLine(λ, φ) {
	        var point = rotate(λ, φ);
	        line.point(point[0], point[1]);
	      }
	      function lineStart() {
	        clip.point = pointLine;
	        line.lineStart();
	      }
	      function lineEnd() {
	        clip.point = point;
	        line.lineEnd();
	      }
	      var segments;
	      var buffer = d3_geo_clipBufferListener(), ringListener = clipLine(buffer), polygonStarted = false, polygon, ring;
	      function pointRing(λ, φ) {
	        ring.push([ λ, φ ]);
	        var point = rotate(λ, φ);
	        ringListener.point(point[0], point[1]);
	      }
	      function ringStart() {
	        ringListener.lineStart();
	        ring = [];
	      }
	      function ringEnd() {
	        pointRing(ring[0][0], ring[0][1]);
	        ringListener.lineEnd();
	        var clean = ringListener.clean(), ringSegments = buffer.buffer(), segment, n = ringSegments.length;
	        ring.pop();
	        polygon.push(ring);
	        ring = null;
	        if (!n) return;
	        if (clean & 1) {
	          segment = ringSegments[0];
	          var n = segment.length - 1, i = -1, point;
	          if (n > 0) {
	            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
	            listener.lineStart();
	            while (++i < n) listener.point((point = segment[i])[0], point[1]);
	            listener.lineEnd();
	          }
	          return;
	        }
	        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));
	        segments.push(ringSegments.filter(d3_geo_clipSegmentLength1));
	      }
	      return clip;
	    };
	  }
	  function d3_geo_clipSegmentLength1(segment) {
	    return segment.length > 1;
	  }
	  function d3_geo_clipBufferListener() {
	    var lines = [], line;
	    return {
	      lineStart: function() {
	        lines.push(line = []);
	      },
	      point: function(λ, φ) {
	        line.push([ λ, φ ]);
	      },
	      lineEnd: d3_noop,
	      buffer: function() {
	        var buffer = lines;
	        lines = [];
	        line = null;
	        return buffer;
	      },
	      rejoin: function() {
	        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
	      }
	    };
	  }
	  function d3_geo_clipSort(a, b) {
	    return ((a = a.x)[0] < 0 ? a[1] - halfπ - ε : halfπ - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfπ - ε : halfπ - b[1]);
	  }
	  var d3_geo_clipAntimeridian = d3_geo_clip(d3_true, d3_geo_clipAntimeridianLine, d3_geo_clipAntimeridianInterpolate, [ -π, -π / 2 ]);
	  function d3_geo_clipAntimeridianLine(listener) {
	    var λ0 = NaN, φ0 = NaN, sλ0 = NaN, clean;
	    return {
	      lineStart: function() {
	        listener.lineStart();
	        clean = 1;
	      },
	      point: function(λ1, φ1) {
	        var sλ1 = λ1 > 0 ? π : -π, dλ = abs(λ1 - λ0);
	        if (abs(dλ - π) < ε) {
	          listener.point(λ0, φ0 = (φ0 + φ1) / 2 > 0 ? halfπ : -halfπ);
	          listener.point(sλ0, φ0);
	          listener.lineEnd();
	          listener.lineStart();
	          listener.point(sλ1, φ0);
	          listener.point(λ1, φ0);
	          clean = 0;
	        } else if (sλ0 !== sλ1 && dλ >= π) {
	          if (abs(λ0 - sλ0) < ε) λ0 -= sλ0 * ε;
	          if (abs(λ1 - sλ1) < ε) λ1 -= sλ1 * ε;
	          φ0 = d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1);
	          listener.point(sλ0, φ0);
	          listener.lineEnd();
	          listener.lineStart();
	          listener.point(sλ1, φ0);
	          clean = 0;
	        }
	        listener.point(λ0 = λ1, φ0 = φ1);
	        sλ0 = sλ1;
	      },
	      lineEnd: function() {
	        listener.lineEnd();
	        λ0 = φ0 = NaN;
	      },
	      clean: function() {
	        return 2 - clean;
	      }
	    };
	  }
	  function d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1) {
	    var cosφ0, cosφ1, sinλ0_λ1 = Math.sin(λ0 - λ1);
	    return abs(sinλ0_λ1) > ε ? Math.atan((Math.sin(φ0) * (cosφ1 = Math.cos(φ1)) * Math.sin(λ1) - Math.sin(φ1) * (cosφ0 = Math.cos(φ0)) * Math.sin(λ0)) / (cosφ0 * cosφ1 * sinλ0_λ1)) : (φ0 + φ1) / 2;
	  }
	  function d3_geo_clipAntimeridianInterpolate(from, to, direction, listener) {
	    var φ;
	    if (from == null) {
	      φ = direction * halfπ;
	      listener.point(-π, φ);
	      listener.point(0, φ);
	      listener.point(π, φ);
	      listener.point(π, 0);
	      listener.point(π, -φ);
	      listener.point(0, -φ);
	      listener.point(-π, -φ);
	      listener.point(-π, 0);
	      listener.point(-π, φ);
	    } else if (abs(from[0] - to[0]) > ε) {
	      var s = from[0] < to[0] ? π : -π;
	      φ = direction * s / 2;
	      listener.point(-s, φ);
	      listener.point(0, φ);
	      listener.point(s, φ);
	    } else {
	      listener.point(to[0], to[1]);
	    }
	  }
	  function d3_geo_pointInPolygon(point, polygon) {
	    var meridian = point[0], parallel = point[1], meridianNormal = [ Math.sin(meridian), -Math.cos(meridian), 0 ], polarAngle = 0, winding = 0;
	    d3_geo_areaRingSum.reset();
	    for (var i = 0, n = polygon.length; i < n; ++i) {
	      var ring = polygon[i], m = ring.length;
	      if (!m) continue;
	      var point0 = ring[0], λ0 = point0[0], φ0 = point0[1] / 2 + π / 4, sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), j = 1;
	      while (true) {
	        if (j === m) j = 0;
	        point = ring[j];
	        var λ = point[0], φ = point[1] / 2 + π / 4, sinφ = Math.sin(φ), cosφ = Math.cos(φ), dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, antimeridian = adλ > π, k = sinφ0 * sinφ;
	        d3_geo_areaRingSum.add(Math.atan2(k * sdλ * Math.sin(adλ), cosφ0 * cosφ + k * Math.cos(adλ)));
	        polarAngle += antimeridian ? dλ + sdλ * τ : dλ;
	        if (antimeridian ^ λ0 >= meridian ^ λ >= meridian) {
	          var arc = d3_geo_cartesianCross(d3_geo_cartesian(point0), d3_geo_cartesian(point));
	          d3_geo_cartesianNormalize(arc);
	          var intersection = d3_geo_cartesianCross(meridianNormal, arc);
	          d3_geo_cartesianNormalize(intersection);
	          var φarc = (antimeridian ^ dλ >= 0 ? -1 : 1) * d3_asin(intersection[2]);
	          if (parallel > φarc || parallel === φarc && (arc[0] || arc[1])) {
	            winding += antimeridian ^ dλ >= 0 ? 1 : -1;
	          }
	        }
	        if (!j++) break;
	        λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ, point0 = point;
	      }
	    }
	    return (polarAngle < -ε || polarAngle < ε && d3_geo_areaRingSum < 0) ^ winding & 1;
	  }
	  function d3_geo_clipCircle(radius) {
	    var cr = Math.cos(radius), smallRadius = cr > 0, notHemisphere = abs(cr) > ε, interpolate = d3_geo_circleInterpolate(radius, 6 * d3_radians);
	    return d3_geo_clip(visible, clipLine, interpolate, smallRadius ? [ 0, -radius ] : [ -π, radius - π ]);
	    function visible(λ, φ) {
	      return Math.cos(λ) * Math.cos(φ) > cr;
	    }
	    function clipLine(listener) {
	      var point0, c0, v0, v00, clean;
	      return {
	        lineStart: function() {
	          v00 = v0 = false;
	          clean = 1;
	        },
	        point: function(λ, φ) {
	          var point1 = [ λ, φ ], point2, v = visible(λ, φ), c = smallRadius ? v ? 0 : code(λ, φ) : v ? code(λ + (λ < 0 ? π : -π), φ) : 0;
	          if (!point0 && (v00 = v0 = v)) listener.lineStart();
	          if (v !== v0) {
	            point2 = intersect(point0, point1);
	            if (d3_geo_sphericalEqual(point0, point2) || d3_geo_sphericalEqual(point1, point2)) {
	              point1[0] += ε;
	              point1[1] += ε;
	              v = visible(point1[0], point1[1]);
	            }
	          }
	          if (v !== v0) {
	            clean = 0;
	            if (v) {
	              listener.lineStart();
	              point2 = intersect(point1, point0);
	              listener.point(point2[0], point2[1]);
	            } else {
	              point2 = intersect(point0, point1);
	              listener.point(point2[0], point2[1]);
	              listener.lineEnd();
	            }
	            point0 = point2;
	          } else if (notHemisphere && point0 && smallRadius ^ v) {
	            var t;
	            if (!(c & c0) && (t = intersect(point1, point0, true))) {
	              clean = 0;
	              if (smallRadius) {
	                listener.lineStart();
	                listener.point(t[0][0], t[0][1]);
	                listener.point(t[1][0], t[1][1]);
	                listener.lineEnd();
	              } else {
	                listener.point(t[1][0], t[1][1]);
	                listener.lineEnd();
	                listener.lineStart();
	                listener.point(t[0][0], t[0][1]);
	              }
	            }
	          }
	          if (v && (!point0 || !d3_geo_sphericalEqual(point0, point1))) {
	            listener.point(point1[0], point1[1]);
	          }
	          point0 = point1, v0 = v, c0 = c;
	        },
	        lineEnd: function() {
	          if (v0) listener.lineEnd();
	          point0 = null;
	        },
	        clean: function() {
	          return clean | (v00 && v0) << 1;
	        }
	      };
	    }
	    function intersect(a, b, two) {
	      var pa = d3_geo_cartesian(a), pb = d3_geo_cartesian(b);
	      var n1 = [ 1, 0, 0 ], n2 = d3_geo_cartesianCross(pa, pb), n2n2 = d3_geo_cartesianDot(n2, n2), n1n2 = n2[0], determinant = n2n2 - n1n2 * n1n2;
	      if (!determinant) return !two && a;
	      var c1 = cr * n2n2 / determinant, c2 = -cr * n1n2 / determinant, n1xn2 = d3_geo_cartesianCross(n1, n2), A = d3_geo_cartesianScale(n1, c1), B = d3_geo_cartesianScale(n2, c2);
	      d3_geo_cartesianAdd(A, B);
	      var u = n1xn2, w = d3_geo_cartesianDot(A, u), uu = d3_geo_cartesianDot(u, u), t2 = w * w - uu * (d3_geo_cartesianDot(A, A) - 1);
	      if (t2 < 0) return;
	      var t = Math.sqrt(t2), q = d3_geo_cartesianScale(u, (-w - t) / uu);
	      d3_geo_cartesianAdd(q, A);
	      q = d3_geo_spherical(q);
	      if (!two) return q;
	      var λ0 = a[0], λ1 = b[0], φ0 = a[1], φ1 = b[1], z;
	      if (λ1 < λ0) z = λ0, λ0 = λ1, λ1 = z;
	      var δλ = λ1 - λ0, polar = abs(δλ - π) < ε, meridian = polar || δλ < ε;
	      if (!polar && φ1 < φ0) z = φ0, φ0 = φ1, φ1 = z;
	      if (meridian ? polar ? φ0 + φ1 > 0 ^ q[1] < (abs(q[0] - λ0) < ε ? φ0 : φ1) : φ0 <= q[1] && q[1] <= φ1 : δλ > π ^ (λ0 <= q[0] && q[0] <= λ1)) {
	        var q1 = d3_geo_cartesianScale(u, (-w + t) / uu);
	        d3_geo_cartesianAdd(q1, A);
	        return [ q, d3_geo_spherical(q1) ];
	      }
	    }
	    function code(λ, φ) {
	      var r = smallRadius ? radius : π - radius, code = 0;
	      if (λ < -r) code |= 1; else if (λ > r) code |= 2;
	      if (φ < -r) code |= 4; else if (φ > r) code |= 8;
	      return code;
	    }
	  }
	  function d3_geom_clipLine(x0, y0, x1, y1) {
	    return function(line) {
	      var a = line.a, b = line.b, ax = a.x, ay = a.y, bx = b.x, by = b.y, t0 = 0, t1 = 1, dx = bx - ax, dy = by - ay, r;
	      r = x0 - ax;
	      if (!dx && r > 0) return;
	      r /= dx;
	      if (dx < 0) {
	        if (r < t0) return;
	        if (r < t1) t1 = r;
	      } else if (dx > 0) {
	        if (r > t1) return;
	        if (r > t0) t0 = r;
	      }
	      r = x1 - ax;
	      if (!dx && r < 0) return;
	      r /= dx;
	      if (dx < 0) {
	        if (r > t1) return;
	        if (r > t0) t0 = r;
	      } else if (dx > 0) {
	        if (r < t0) return;
	        if (r < t1) t1 = r;
	      }
	      r = y0 - ay;
	      if (!dy && r > 0) return;
	      r /= dy;
	      if (dy < 0) {
	        if (r < t0) return;
	        if (r < t1) t1 = r;
	      } else if (dy > 0) {
	        if (r > t1) return;
	        if (r > t0) t0 = r;
	      }
	      r = y1 - ay;
	      if (!dy && r < 0) return;
	      r /= dy;
	      if (dy < 0) {
	        if (r > t1) return;
	        if (r > t0) t0 = r;
	      } else if (dy > 0) {
	        if (r < t0) return;
	        if (r < t1) t1 = r;
	      }
	      if (t0 > 0) line.a = {
	        x: ax + t0 * dx,
	        y: ay + t0 * dy
	      };
	      if (t1 < 1) line.b = {
	        x: ax + t1 * dx,
	        y: ay + t1 * dy
	      };
	      return line;
	    };
	  }
	  var d3_geo_clipExtentMAX = 1e9;
	  d3.geo.clipExtent = function() {
	    var x0, y0, x1, y1, stream, clip, clipExtent = {
	      stream: function(output) {
	        if (stream) stream.valid = false;
	        stream = clip(output);
	        stream.valid = true;
	        return stream;
	      },
	      extent: function(_) {
	        if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
	        clip = d3_geo_clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]);
	        if (stream) stream.valid = false, stream = null;
	        return clipExtent;
	      }
	    };
	    return clipExtent.extent([ [ 0, 0 ], [ 960, 500 ] ]);
	  };
	  function d3_geo_clipExtent(x0, y0, x1, y1) {
	    return function(listener) {
	      var listener_ = listener, bufferListener = d3_geo_clipBufferListener(), clipLine = d3_geom_clipLine(x0, y0, x1, y1), segments, polygon, ring;
	      var clip = {
	        point: point,
	        lineStart: lineStart,
	        lineEnd: lineEnd,
	        polygonStart: function() {
	          listener = bufferListener;
	          segments = [];
	          polygon = [];
	          clean = true;
	        },
	        polygonEnd: function() {
	          listener = listener_;
	          segments = d3.merge(segments);
	          var clipStartInside = insidePolygon([ x0, y1 ]), inside = clean && clipStartInside, visible = segments.length;
	          if (inside || visible) {
	            listener.polygonStart();
	            if (inside) {
	              listener.lineStart();
	              interpolate(null, null, 1, listener);
	              listener.lineEnd();
	            }
	            if (visible) {
	              d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener);
	            }
	            listener.polygonEnd();
	          }
	          segments = polygon = ring = null;
	        }
	      };
	      function insidePolygon(p) {
	        var wn = 0, n = polygon.length, y = p[1];
	        for (var i = 0; i < n; ++i) {
	          for (var j = 1, v = polygon[i], m = v.length, a = v[0], b; j < m; ++j) {
	            b = v[j];
	            if (a[1] <= y) {
	              if (b[1] > y && d3_cross2d(a, b, p) > 0) ++wn;
	            } else {
	              if (b[1] <= y && d3_cross2d(a, b, p) < 0) --wn;
	            }
	            a = b;
	          }
	        }
	        return wn !== 0;
	      }
	      function interpolate(from, to, direction, listener) {
	        var a = 0, a1 = 0;
	        if (from == null || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoints(from, to) < 0 ^ direction > 0) {
	          do {
	            listener.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
	          } while ((a = (a + direction + 4) % 4) !== a1);
	        } else {
	          listener.point(to[0], to[1]);
	        }
	      }
	      function pointVisible(x, y) {
	        return x0 <= x && x <= x1 && y0 <= y && y <= y1;
	      }
	      function point(x, y) {
	        if (pointVisible(x, y)) listener.point(x, y);
	      }
	      var x__, y__, v__, x_, y_, v_, first, clean;
	      function lineStart() {
	        clip.point = linePoint;
	        if (polygon) polygon.push(ring = []);
	        first = true;
	        v_ = false;
	        x_ = y_ = NaN;
	      }
	      function lineEnd() {
	        if (segments) {
	          linePoint(x__, y__);
	          if (v__ && v_) bufferListener.rejoin();
	          segments.push(bufferListener.buffer());
	        }
	        clip.point = point;
	        if (v_) listener.lineEnd();
	      }
	      function linePoint(x, y) {
	        x = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, x));
	        y = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, y));
	        var v = pointVisible(x, y);
	        if (polygon) ring.push([ x, y ]);
	        if (first) {
	          x__ = x, y__ = y, v__ = v;
	          first = false;
	          if (v) {
	            listener.lineStart();
	            listener.point(x, y);
	          }
	        } else {
	          if (v && v_) listener.point(x, y); else {
	            var l = {
	              a: {
	                x: x_,
	                y: y_
	              },
	              b: {
	                x: x,
	                y: y
	              }
	            };
	            if (clipLine(l)) {
	              if (!v_) {
	                listener.lineStart();
	                listener.point(l.a.x, l.a.y);
	              }
	              listener.point(l.b.x, l.b.y);
	              if (!v) listener.lineEnd();
	              clean = false;
	            } else if (v) {
	              listener.lineStart();
	              listener.point(x, y);
	              clean = false;
	            }
	          }
	        }
	        x_ = x, y_ = y, v_ = v;
	      }
	      return clip;
	    };
	    function corner(p, direction) {
	      return abs(p[0] - x0) < ε ? direction > 0 ? 0 : 3 : abs(p[0] - x1) < ε ? direction > 0 ? 2 : 1 : abs(p[1] - y0) < ε ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2;
	    }
	    function compare(a, b) {
	      return comparePoints(a.x, b.x);
	    }
	    function comparePoints(a, b) {
	      var ca = corner(a, 1), cb = corner(b, 1);
	      return ca !== cb ? ca - cb : ca === 0 ? b[1] - a[1] : ca === 1 ? a[0] - b[0] : ca === 2 ? a[1] - b[1] : b[0] - a[0];
	    }
	  }
	  function d3_geo_conic(projectAt) {
	    var φ0 = 0, φ1 = π / 3, m = d3_geo_projectionMutator(projectAt), p = m(φ0, φ1);
	    p.parallels = function(_) {
	      if (!arguments.length) return [ φ0 / π * 180, φ1 / π * 180 ];
	      return m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180);
	    };
	    return p;
	  }
	  function d3_geo_conicEqualArea(φ0, φ1) {
	    var sinφ0 = Math.sin(φ0), n = (sinφ0 + Math.sin(φ1)) / 2, C = 1 + sinφ0 * (2 * n - sinφ0), ρ0 = Math.sqrt(C) / n;
	    function forward(λ, φ) {
	      var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n;
	      return [ ρ * Math.sin(λ *= n), ρ0 - ρ * Math.cos(λ) ];
	    }
	    forward.invert = function(x, y) {
	      var ρ0_y = ρ0 - y;
	      return [ Math.atan2(x, ρ0_y) / n, d3_asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n)) ];
	    };
	    return forward;
	  }
	  (d3.geo.conicEqualArea = function() {
	    return d3_geo_conic(d3_geo_conicEqualArea);
	  }).raw = d3_geo_conicEqualArea;
	  d3.geo.albers = function() {
	    return d3.geo.conicEqualArea().rotate([ 96, 0 ]).center([ -.6, 38.7 ]).parallels([ 29.5, 45.5 ]).scale(1070);
	  };
	  d3.geo.albersUsa = function() {
	    var lower48 = d3.geo.albers();
	    var alaska = d3.geo.conicEqualArea().rotate([ 154, 0 ]).center([ -2, 58.5 ]).parallels([ 55, 65 ]);
	    var hawaii = d3.geo.conicEqualArea().rotate([ 157, 0 ]).center([ -3, 19.9 ]).parallels([ 8, 18 ]);
	    var point, pointStream = {
	      point: function(x, y) {
	        point = [ x, y ];
	      }
	    }, lower48Point, alaskaPoint, hawaiiPoint;
	    function albersUsa(coordinates) {
	      var x = coordinates[0], y = coordinates[1];
	      point = null;
	      (lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y);
	      return point;
	    }
	    albersUsa.invert = function(coordinates) {
	      var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k;
	      return (y >= .12 && y < .234 && x >= -.425 && x < -.214 ? alaska : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii : lower48).invert(coordinates);
	    };
	    albersUsa.stream = function(stream) {
	      var lower48Stream = lower48.stream(stream), alaskaStream = alaska.stream(stream), hawaiiStream = hawaii.stream(stream);
	      return {
	        point: function(x, y) {
	          lower48Stream.point(x, y);
	          alaskaStream.point(x, y);
	          hawaiiStream.point(x, y);
	        },
	        sphere: function() {
	          lower48Stream.sphere();
	          alaskaStream.sphere();
	          hawaiiStream.sphere();
	        },
	        lineStart: function() {
	          lower48Stream.lineStart();
	          alaskaStream.lineStart();
	          hawaiiStream.lineStart();
	        },
	        lineEnd: function() {
	          lower48Stream.lineEnd();
	          alaskaStream.lineEnd();
	          hawaiiStream.lineEnd();
	        },
	        polygonStart: function() {
	          lower48Stream.polygonStart();
	          alaskaStream.polygonStart();
	          hawaiiStream.polygonStart();
	        },
	        polygonEnd: function() {
	          lower48Stream.polygonEnd();
	          alaskaStream.polygonEnd();
	          hawaiiStream.polygonEnd();
	        }
	      };
	    };
	    albersUsa.precision = function(_) {
	      if (!arguments.length) return lower48.precision();
	      lower48.precision(_);
	      alaska.precision(_);
	      hawaii.precision(_);
	      return albersUsa;
	    };
	    albersUsa.scale = function(_) {
	      if (!arguments.length) return lower48.scale();
	      lower48.scale(_);
	      alaska.scale(_ * .35);
	      hawaii.scale(_);
	      return albersUsa.translate(lower48.translate());
	    };
	    albersUsa.translate = function(_) {
	      if (!arguments.length) return lower48.translate();
	      var k = lower48.scale(), x = +_[0], y = +_[1];
	      lower48Point = lower48.translate(_).clipExtent([ [ x - .455 * k, y - .238 * k ], [ x + .455 * k, y + .238 * k ] ]).stream(pointStream).point;
	      alaskaPoint = alaska.translate([ x - .307 * k, y + .201 * k ]).clipExtent([ [ x - .425 * k + ε, y + .12 * k + ε ], [ x - .214 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
	      hawaiiPoint = hawaii.translate([ x - .205 * k, y + .212 * k ]).clipExtent([ [ x - .214 * k + ε, y + .166 * k + ε ], [ x - .115 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
	      return albersUsa;
	    };
	    return albersUsa.scale(1070);
	  };
	  var d3_geo_pathAreaSum, d3_geo_pathAreaPolygon, d3_geo_pathArea = {
	    point: d3_noop,
	    lineStart: d3_noop,
	    lineEnd: d3_noop,
	    polygonStart: function() {
	      d3_geo_pathAreaPolygon = 0;
	      d3_geo_pathArea.lineStart = d3_geo_pathAreaRingStart;
	    },
	    polygonEnd: function() {
	      d3_geo_pathArea.lineStart = d3_geo_pathArea.lineEnd = d3_geo_pathArea.point = d3_noop;
	      d3_geo_pathAreaSum += abs(d3_geo_pathAreaPolygon / 2);
	    }
	  };
	  function d3_geo_pathAreaRingStart() {
	    var x00, y00, x0, y0;
	    d3_geo_pathArea.point = function(x, y) {
	      d3_geo_pathArea.point = nextPoint;
	      x00 = x0 = x, y00 = y0 = y;
	    };
	    function nextPoint(x, y) {
	      d3_geo_pathAreaPolygon += y0 * x - x0 * y;
	      x0 = x, y0 = y;
	    }
	    d3_geo_pathArea.lineEnd = function() {
	      nextPoint(x00, y00);
	    };
	  }
	  var d3_geo_pathBoundsX0, d3_geo_pathBoundsY0, d3_geo_pathBoundsX1, d3_geo_pathBoundsY1;
	  var d3_geo_pathBounds = {
	    point: d3_geo_pathBoundsPoint,
	    lineStart: d3_noop,
	    lineEnd: d3_noop,
	    polygonStart: d3_noop,
	    polygonEnd: d3_noop
	  };
	  function d3_geo_pathBoundsPoint(x, y) {
	    if (x < d3_geo_pathBoundsX0) d3_geo_pathBoundsX0 = x;
	    if (x > d3_geo_pathBoundsX1) d3_geo_pathBoundsX1 = x;
	    if (y < d3_geo_pathBoundsY0) d3_geo_pathBoundsY0 = y;
	    if (y > d3_geo_pathBoundsY1) d3_geo_pathBoundsY1 = y;
	  }
	  function d3_geo_pathBuffer() {
	    var pointCircle = d3_geo_pathBufferCircle(4.5), buffer = [];
	    var stream = {
	      point: point,
	      lineStart: function() {
	        stream.point = pointLineStart;
	      },
	      lineEnd: lineEnd,
	      polygonStart: function() {
	        stream.lineEnd = lineEndPolygon;
	      },
	      polygonEnd: function() {
	        stream.lineEnd = lineEnd;
	        stream.point = point;
	      },
	      pointRadius: function(_) {
	        pointCircle = d3_geo_pathBufferCircle(_);
	        return stream;
	      },
	      result: function() {
	        if (buffer.length) {
	          var result = buffer.join("");
	          buffer = [];
	          return result;
	        }
	      }
	    };
	    function point(x, y) {
	      buffer.push("M", x, ",", y, pointCircle);
	    }
	    function pointLineStart(x, y) {
	      buffer.push("M", x, ",", y);
	      stream.point = pointLine;
	    }
	    function pointLine(x, y) {
	      buffer.push("L", x, ",", y);
	    }
	    function lineEnd() {
	      stream.point = point;
	    }
	    function lineEndPolygon() {
	      buffer.push("Z");
	    }
	    return stream;
	  }
	  function d3_geo_pathBufferCircle(radius) {
	    return "m0," + radius + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius + "z";
	  }
	  var d3_geo_pathCentroid = {
	    point: d3_geo_pathCentroidPoint,
	    lineStart: d3_geo_pathCentroidLineStart,
	    lineEnd: d3_geo_pathCentroidLineEnd,
	    polygonStart: function() {
	      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidRingStart;
	    },
	    polygonEnd: function() {
	      d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
	      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidLineStart;
	      d3_geo_pathCentroid.lineEnd = d3_geo_pathCentroidLineEnd;
	    }
	  };
	  function d3_geo_pathCentroidPoint(x, y) {
	    d3_geo_centroidX0 += x;
	    d3_geo_centroidY0 += y;
	    ++d3_geo_centroidZ0;
	  }
	  function d3_geo_pathCentroidLineStart() {
	    var x0, y0;
	    d3_geo_pathCentroid.point = function(x, y) {
	      d3_geo_pathCentroid.point = nextPoint;
	      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
	    };
	    function nextPoint(x, y) {
	      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
	      d3_geo_centroidX1 += z * (x0 + x) / 2;
	      d3_geo_centroidY1 += z * (y0 + y) / 2;
	      d3_geo_centroidZ1 += z;
	      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
	    }
	  }
	  function d3_geo_pathCentroidLineEnd() {
	    d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
	  }
	  function d3_geo_pathCentroidRingStart() {
	    var x00, y00, x0, y0;
	    d3_geo_pathCentroid.point = function(x, y) {
	      d3_geo_pathCentroid.point = nextPoint;
	      d3_geo_pathCentroidPoint(x00 = x0 = x, y00 = y0 = y);
	    };
	    function nextPoint(x, y) {
	      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
	      d3_geo_centroidX1 += z * (x0 + x) / 2;
	      d3_geo_centroidY1 += z * (y0 + y) / 2;
	      d3_geo_centroidZ1 += z;
	      z = y0 * x - x0 * y;
	      d3_geo_centroidX2 += z * (x0 + x);
	      d3_geo_centroidY2 += z * (y0 + y);
	      d3_geo_centroidZ2 += z * 3;
	      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
	    }
	    d3_geo_pathCentroid.lineEnd = function() {
	      nextPoint(x00, y00);
	    };
	  }
	  function d3_geo_pathContext(context) {
	    var pointRadius = 4.5;
	    var stream = {
	      point: point,
	      lineStart: function() {
	        stream.point = pointLineStart;
	      },
	      lineEnd: lineEnd,
	      polygonStart: function() {
	        stream.lineEnd = lineEndPolygon;
	      },
	      polygonEnd: function() {
	        stream.lineEnd = lineEnd;
	        stream.point = point;
	      },
	      pointRadius: function(_) {
	        pointRadius = _;
	        return stream;
	      },
	      result: d3_noop
	    };
	    function point(x, y) {
	      context.moveTo(x + pointRadius, y);
	      context.arc(x, y, pointRadius, 0, τ);
	    }
	    function pointLineStart(x, y) {
	      context.moveTo(x, y);
	      stream.point = pointLine;
	    }
	    function pointLine(x, y) {
	      context.lineTo(x, y);
	    }
	    function lineEnd() {
	      stream.point = point;
	    }
	    function lineEndPolygon() {
	      context.closePath();
	    }
	    return stream;
	  }
	  function d3_geo_resample(project) {
	    var δ2 = .5, cosMinDistance = Math.cos(30 * d3_radians), maxDepth = 16;
	    function resample(stream) {
	      return (maxDepth ? resampleRecursive : resampleNone)(stream);
	    }
	    function resampleNone(stream) {
	      return d3_geo_transformPoint(stream, function(x, y) {
	        x = project(x, y);
	        stream.point(x[0], x[1]);
	      });
	    }
	    function resampleRecursive(stream) {
	      var λ00, φ00, x00, y00, a00, b00, c00, λ0, x0, y0, a0, b0, c0;
	      var resample = {
	        point: point,
	        lineStart: lineStart,
	        lineEnd: lineEnd,
	        polygonStart: function() {
	          stream.polygonStart();
	          resample.lineStart = ringStart;
	        },
	        polygonEnd: function() {
	          stream.polygonEnd();
	          resample.lineStart = lineStart;
	        }
	      };
	      function point(x, y) {
	        x = project(x, y);
	        stream.point(x[0], x[1]);
	      }
	      function lineStart() {
	        x0 = NaN;
	        resample.point = linePoint;
	        stream.lineStart();
	      }
	      function linePoint(λ, φ) {
	        var c = d3_geo_cartesian([ λ, φ ]), p = project(λ, φ);
	        resampleLineTo(x0, y0, λ0, a0, b0, c0, x0 = p[0], y0 = p[1], λ0 = λ, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
	        stream.point(x0, y0);
	      }
	      function lineEnd() {
	        resample.point = point;
	        stream.lineEnd();
	      }
	      function ringStart() {
	        lineStart();
	        resample.point = ringPoint;
	        resample.lineEnd = ringEnd;
	      }
	      function ringPoint(λ, φ) {
	        linePoint(λ00 = λ, φ00 = φ), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
	        resample.point = linePoint;
	      }
	      function ringEnd() {
	        resampleLineTo(x0, y0, λ0, a0, b0, c0, x00, y00, λ00, a00, b00, c00, maxDepth, stream);
	        resample.lineEnd = lineEnd;
	        lineEnd();
	      }
	      return resample;
	    }
	    function resampleLineTo(x0, y0, λ0, a0, b0, c0, x1, y1, λ1, a1, b1, c1, depth, stream) {
	      var dx = x1 - x0, dy = y1 - y0, d2 = dx * dx + dy * dy;
	      if (d2 > 4 * δ2 && depth--) {
	        var a = a0 + a1, b = b0 + b1, c = c0 + c1, m = Math.sqrt(a * a + b * b + c * c), φ2 = Math.asin(c /= m), λ2 = abs(abs(c) - 1) < ε || abs(λ0 - λ1) < ε ? (λ0 + λ1) / 2 : Math.atan2(b, a), p = project(λ2, φ2), x2 = p[0], y2 = p[1], dx2 = x2 - x0, dy2 = y2 - y0, dz = dy * dx2 - dx * dy2;
	        if (dz * dz / d2 > δ2 || abs((dx * dx2 + dy * dy2) / d2 - .5) > .3 || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) {
	          resampleLineTo(x0, y0, λ0, a0, b0, c0, x2, y2, λ2, a /= m, b /= m, c, depth, stream);
	          stream.point(x2, y2);
	          resampleLineTo(x2, y2, λ2, a, b, c, x1, y1, λ1, a1, b1, c1, depth, stream);
	        }
	      }
	    }
	    resample.precision = function(_) {
	      if (!arguments.length) return Math.sqrt(δ2);
	      maxDepth = (δ2 = _ * _) > 0 && 16;
	      return resample;
	    };
	    return resample;
	  }
	  d3.geo.path = function() {
	    var pointRadius = 4.5, projection, context, projectStream, contextStream, cacheStream;
	    function path(object) {
	      if (object) {
	        if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
	        if (!cacheStream || !cacheStream.valid) cacheStream = projectStream(contextStream);
	        d3.geo.stream(object, cacheStream);
	      }
	      return contextStream.result();
	    }
	    path.area = function(object) {
	      d3_geo_pathAreaSum = 0;
	      d3.geo.stream(object, projectStream(d3_geo_pathArea));
	      return d3_geo_pathAreaSum;
	    };
	    path.centroid = function(object) {
	      d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
	      d3.geo.stream(object, projectStream(d3_geo_pathCentroid));
	      return d3_geo_centroidZ2 ? [ d3_geo_centroidX2 / d3_geo_centroidZ2, d3_geo_centroidY2 / d3_geo_centroidZ2 ] : d3_geo_centroidZ1 ? [ d3_geo_centroidX1 / d3_geo_centroidZ1, d3_geo_centroidY1 / d3_geo_centroidZ1 ] : d3_geo_centroidZ0 ? [ d3_geo_centroidX0 / d3_geo_centroidZ0, d3_geo_centroidY0 / d3_geo_centroidZ0 ] : [ NaN, NaN ];
	    };
	    path.bounds = function(object) {
	      d3_geo_pathBoundsX1 = d3_geo_pathBoundsY1 = -(d3_geo_pathBoundsX0 = d3_geo_pathBoundsY0 = Infinity);
	      d3.geo.stream(object, projectStream(d3_geo_pathBounds));
	      return [ [ d3_geo_pathBoundsX0, d3_geo_pathBoundsY0 ], [ d3_geo_pathBoundsX1, d3_geo_pathBoundsY1 ] ];
	    };
	    path.projection = function(_) {
	      if (!arguments.length) return projection;
	      projectStream = (projection = _) ? _.stream || d3_geo_pathProjectStream(_) : d3_identity;
	      return reset();
	    };
	    path.context = function(_) {
	      if (!arguments.length) return context;
	      contextStream = (context = _) == null ? new d3_geo_pathBuffer() : new d3_geo_pathContext(_);
	      if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
	      return reset();
	    };
	    path.pointRadius = function(_) {
	      if (!arguments.length) return pointRadius;
	      pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
	      return path;
	    };
	    function reset() {
	      cacheStream = null;
	      return path;
	    }
	    return path.projection(d3.geo.albersUsa()).context(null);
	  };
	  function d3_geo_pathProjectStream(project) {
	    var resample = d3_geo_resample(function(x, y) {
	      return project([ x * d3_degrees, y * d3_degrees ]);
	    });
	    return function(stream) {
	      return d3_geo_projectionRadians(resample(stream));
	    };
	  }
	  d3.geo.transform = function(methods) {
	    return {
	      stream: function(stream) {
	        var transform = new d3_geo_transform(stream);
	        for (var k in methods) transform[k] = methods[k];
	        return transform;
	      }
	    };
	  };
	  function d3_geo_transform(stream) {
	    this.stream = stream;
	  }
	  d3_geo_transform.prototype = {
	    point: function(x, y) {
	      this.stream.point(x, y);
	    },
	    sphere: function() {
	      this.stream.sphere();
	    },
	    lineStart: function() {
	      this.stream.lineStart();
	    },
	    lineEnd: function() {
	      this.stream.lineEnd();
	    },
	    polygonStart: function() {
	      this.stream.polygonStart();
	    },
	    polygonEnd: function() {
	      this.stream.polygonEnd();
	    }
	  };
	  function d3_geo_transformPoint(stream, point) {
	    return {
	      point: point,
	      sphere: function() {
	        stream.sphere();
	      },
	      lineStart: function() {
	        stream.lineStart();
	      },
	      lineEnd: function() {
	        stream.lineEnd();
	      },
	      polygonStart: function() {
	        stream.polygonStart();
	      },
	      polygonEnd: function() {
	        stream.polygonEnd();
	      }
	    };
	  }
	  d3.geo.projection = d3_geo_projection;
	  d3.geo.projectionMutator = d3_geo_projectionMutator;
	  function d3_geo_projection(project) {
	    return d3_geo_projectionMutator(function() {
	      return project;
	    })();
	  }
	  function d3_geo_projectionMutator(projectAt) {
	    var project, rotate, projectRotate, projectResample = d3_geo_resample(function(x, y) {
	      x = project(x, y);
	      return [ x[0] * k + δx, δy - x[1] * k ];
	    }), k = 150, x = 480, y = 250, λ = 0, φ = 0, δλ = 0, δφ = 0, δγ = 0, δx, δy, preclip = d3_geo_clipAntimeridian, postclip = d3_identity, clipAngle = null, clipExtent = null, stream;
	    function projection(point) {
	      point = projectRotate(point[0] * d3_radians, point[1] * d3_radians);
	      return [ point[0] * k + δx, δy - point[1] * k ];
	    }
	    function invert(point) {
	      point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k);
	      return point && [ point[0] * d3_degrees, point[1] * d3_degrees ];
	    }
	    projection.stream = function(output) {
	      if (stream) stream.valid = false;
	      stream = d3_geo_projectionRadians(preclip(rotate, projectResample(postclip(output))));
	      stream.valid = true;
	      return stream;
	    };
	    projection.clipAngle = function(_) {
	      if (!arguments.length) return clipAngle;
	      preclip = _ == null ? (clipAngle = _, d3_geo_clipAntimeridian) : d3_geo_clipCircle((clipAngle = +_) * d3_radians);
	      return invalidate();
	    };
	    projection.clipExtent = function(_) {
	      if (!arguments.length) return clipExtent;
	      clipExtent = _;
	      postclip = _ ? d3_geo_clipExtent(_[0][0], _[0][1], _[1][0], _[1][1]) : d3_identity;
	      return invalidate();
	    };
	    projection.scale = function(_) {
	      if (!arguments.length) return k;
	      k = +_;
	      return reset();
	    };
	    projection.translate = function(_) {
	      if (!arguments.length) return [ x, y ];
	      x = +_[0];
	      y = +_[1];
	      return reset();
	    };
	    projection.center = function(_) {
	      if (!arguments.length) return [ λ * d3_degrees, φ * d3_degrees ];
	      λ = _[0] % 360 * d3_radians;
	      φ = _[1] % 360 * d3_radians;
	      return reset();
	    };
	    projection.rotate = function(_) {
	      if (!arguments.length) return [ δλ * d3_degrees, δφ * d3_degrees, δγ * d3_degrees ];
	      δλ = _[0] % 360 * d3_radians;
	      δφ = _[1] % 360 * d3_radians;
	      δγ = _.length > 2 ? _[2] % 360 * d3_radians : 0;
	      return reset();
	    };
	    d3.rebind(projection, projectResample, "precision");
	    function reset() {
	      projectRotate = d3_geo_compose(rotate = d3_geo_rotation(δλ, δφ, δγ), project);
	      var center = project(λ, φ);
	      δx = x - center[0] * k;
	      δy = y + center[1] * k;
	      return invalidate();
	    }
	    function invalidate() {
	      if (stream) stream.valid = false, stream = null;
	      return projection;
	    }
	    return function() {
	      project = projectAt.apply(this, arguments);
	      projection.invert = project.invert && invert;
	      return reset();
	    };
	  }
	  function d3_geo_projectionRadians(stream) {
	    return d3_geo_transformPoint(stream, function(x, y) {
	      stream.point(x * d3_radians, y * d3_radians);
	    });
	  }
	  function d3_geo_equirectangular(λ, φ) {
	    return [ λ, φ ];
	  }
	  (d3.geo.equirectangular = function() {
	    return d3_geo_projection(d3_geo_equirectangular);
	  }).raw = d3_geo_equirectangular.invert = d3_geo_equirectangular;
	  d3.geo.rotation = function(rotate) {
	    rotate = d3_geo_rotation(rotate[0] % 360 * d3_radians, rotate[1] * d3_radians, rotate.length > 2 ? rotate[2] * d3_radians : 0);
	    function forward(coordinates) {
	      coordinates = rotate(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
	      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
	    }
	    forward.invert = function(coordinates) {
	      coordinates = rotate.invert(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
	      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
	    };
	    return forward;
	  };
	  function d3_geo_identityRotation(λ, φ) {
	    return [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];
	  }
	  d3_geo_identityRotation.invert = d3_geo_equirectangular;
	  function d3_geo_rotation(δλ, δφ, δγ) {
	    return δλ ? δφ || δγ ? d3_geo_compose(d3_geo_rotationλ(δλ), d3_geo_rotationφγ(δφ, δγ)) : d3_geo_rotationλ(δλ) : δφ || δγ ? d3_geo_rotationφγ(δφ, δγ) : d3_geo_identityRotation;
	  }
	  function d3_geo_forwardRotationλ(δλ) {
	    return function(λ, φ) {
	      return λ += δλ, [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];
	    };
	  }
	  function d3_geo_rotationλ(δλ) {
	    var rotation = d3_geo_forwardRotationλ(δλ);
	    rotation.invert = d3_geo_forwardRotationλ(-δλ);
	    return rotation;
	  }
	  function d3_geo_rotationφγ(δφ, δγ) {
	    var cosδφ = Math.cos(δφ), sinδφ = Math.sin(δφ), cosδγ = Math.cos(δγ), sinδγ = Math.sin(δγ);
	    function rotation(λ, φ) {
	      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδφ + x * sinδφ;
	      return [ Math.atan2(y * cosδγ - k * sinδγ, x * cosδφ - z * sinδφ), d3_asin(k * cosδγ + y * sinδγ) ];
	    }
	    rotation.invert = function(λ, φ) {
	      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδγ - y * sinδγ;
	      return [ Math.atan2(y * cosδγ + z * sinδγ, x * cosδφ + k * sinδφ), d3_asin(k * cosδφ - x * sinδφ) ];
	    };
	    return rotation;
	  }
	  d3.geo.circle = function() {
	    var origin = [ 0, 0 ], angle, precision = 6, interpolate;
	    function circle() {
	      var center = typeof origin === "function" ? origin.apply(this, arguments) : origin, rotate = d3_geo_rotation(-center[0] * d3_radians, -center[1] * d3_radians, 0).invert, ring = [];
	      interpolate(null, null, 1, {
	        point: function(x, y) {
	          ring.push(x = rotate(x, y));
	          x[0] *= d3_degrees, x[1] *= d3_degrees;
	        }
	      });
	      return {
	        type: "Polygon",
	        coordinates: [ ring ]
	      };
	    }
	    circle.origin = function(x) {
	      if (!arguments.length) return origin;
	      origin = x;
	      return circle;
	    };
	    circle.angle = function(x) {
	      if (!arguments.length) return angle;
	      interpolate = d3_geo_circleInterpolate((angle = +x) * d3_radians, precision * d3_radians);
	      return circle;
	    };
	    circle.precision = function(_) {
	      if (!arguments.length) return precision;
	      interpolate = d3_geo_circleInterpolate(angle * d3_radians, (precision = +_) * d3_radians);
	      return circle;
	    };
	    return circle.angle(90);
	  };
	  function d3_geo_circleInterpolate(radius, precision) {
	    var cr = Math.cos(radius), sr = Math.sin(radius);
	    return function(from, to, direction, listener) {
	      var step = direction * precision;
	      if (from != null) {
	        from = d3_geo_circleAngle(cr, from);
	        to = d3_geo_circleAngle(cr, to);
	        if (direction > 0 ? from < to : from > to) from += direction * τ;
	      } else {
	        from = radius + direction * τ;
	        to = radius - .5 * step;
	      }
	      for (var point, t = from; direction > 0 ? t > to : t < to; t -= step) {
	        listener.point((point = d3_geo_spherical([ cr, -sr * Math.cos(t), -sr * Math.sin(t) ]))[0], point[1]);
	      }
	    };
	  }
	  function d3_geo_circleAngle(cr, point) {
	    var a = d3_geo_cartesian(point);
	    a[0] -= cr;
	    d3_geo_cartesianNormalize(a);
	    var angle = d3_acos(-a[1]);
	    return ((-a[2] < 0 ? -angle : angle) + 2 * Math.PI - ε) % (2 * Math.PI);
	  }
	  d3.geo.distance = function(a, b) {
	    var Δλ = (b[0] - a[0]) * d3_radians, φ0 = a[1] * d3_radians, φ1 = b[1] * d3_radians, sinΔλ = Math.sin(Δλ), cosΔλ = Math.cos(Δλ), sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1), t;
	    return Math.atan2(Math.sqrt((t = cosφ1 * sinΔλ) * t + (t = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * t), sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ);
	  };
	  d3.geo.graticule = function() {
	    var x1, x0, X1, X0, y1, y0, Y1, Y0, dx = 10, dy = dx, DX = 90, DY = 360, x, y, X, Y, precision = 2.5;
	    function graticule() {
	      return {
	        type: "MultiLineString",
	        coordinates: lines()
	      };
	    }
	    function lines() {
	      return d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) {
	        return abs(x % DX) > ε;
	      }).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy, y1, dy).filter(function(y) {
	        return abs(y % DY) > ε;
	      }).map(y));
	    }
	    graticule.lines = function() {
	      return lines().map(function(coordinates) {
	        return {
	          type: "LineString",
	          coordinates: coordinates
	        };
	      });
	    };
	    graticule.outline = function() {
	      return {
	        type: "Polygon",
	        coordinates: [ X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1)) ]
	      };
	    };
	    graticule.extent = function(_) {
	      if (!arguments.length) return graticule.minorExtent();
	      return graticule.majorExtent(_).minorExtent(_);
	    };
	    graticule.majorExtent = function(_) {
	      if (!arguments.length) return [ [ X0, Y0 ], [ X1, Y1 ] ];
	      X0 = +_[0][0], X1 = +_[1][0];
	      Y0 = +_[0][1], Y1 = +_[1][1];
	      if (X0 > X1) _ = X0, X0 = X1, X1 = _;
	      if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
	      return graticule.precision(precision);
	    };
	    graticule.minorExtent = function(_) {
	      if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
	      x0 = +_[0][0], x1 = +_[1][0];
	      y0 = +_[0][1], y1 = +_[1][1];
	      if (x0 > x1) _ = x0, x0 = x1, x1 = _;
	      if (y0 > y1) _ = y0, y0 = y1, y1 = _;
	      return graticule.precision(precision);
	    };
	    graticule.step = function(_) {
	      if (!arguments.length) return graticule.minorStep();
	      return graticule.majorStep(_).minorStep(_);
	    };
	    graticule.majorStep = function(_) {
	      if (!arguments.length) return [ DX, DY ];
	      DX = +_[0], DY = +_[1];
	      return graticule;
	    };
	    graticule.minorStep = function(_) {
	      if (!arguments.length) return [ dx, dy ];
	      dx = +_[0], dy = +_[1];
	      return graticule;
	    };
	    graticule.precision = function(_) {
	      if (!arguments.length) return precision;
	      precision = +_;
	      x = d3_geo_graticuleX(y0, y1, 90);
	      y = d3_geo_graticuleY(x0, x1, precision);
	      X = d3_geo_graticuleX(Y0, Y1, 90);
	      Y = d3_geo_graticuleY(X0, X1, precision);
	      return graticule;
	    };
	    return graticule.majorExtent([ [ -180, -90 + ε ], [ 180, 90 - ε ] ]).minorExtent([ [ -180, -80 - ε ], [ 180, 80 + ε ] ]);
	  };
	  function d3_geo_graticuleX(y0, y1, dy) {
	    var y = d3.range(y0, y1 - ε, dy).concat(y1);
	    return function(x) {
	      return y.map(function(y) {
	        return [ x, y ];
	      });
	    };
	  }
	  function d3_geo_graticuleY(x0, x1, dx) {
	    var x = d3.range(x0, x1 - ε, dx).concat(x1);
	    return function(y) {
	      return x.map(function(x) {
	        return [ x, y ];
	      });
	    };
	  }
	  function d3_source(d) {
	    return d.source;
	  }
	  function d3_target(d) {
	    return d.target;
	  }
	  d3.geo.greatArc = function() {
	    var source = d3_source, source_, target = d3_target, target_;
	    function greatArc() {
	      return {
	        type: "LineString",
	        coordinates: [ source_ || source.apply(this, arguments), target_ || target.apply(this, arguments) ]
	      };
	    }
	    greatArc.distance = function() {
	      return d3.geo.distance(source_ || source.apply(this, arguments), target_ || target.apply(this, arguments));
	    };
	    greatArc.source = function(_) {
	      if (!arguments.length) return source;
	      source = _, source_ = typeof _ === "function" ? null : _;
	      return greatArc;
	    };
	    greatArc.target = function(_) {
	      if (!arguments.length) return target;
	      target = _, target_ = typeof _ === "function" ? null : _;
	      return greatArc;
	    };
	    greatArc.precision = function() {
	      return arguments.length ? greatArc : 0;
	    };
	    return greatArc;
	  };
	  d3.geo.interpolate = function(source, target) {
	    return d3_geo_interpolate(source[0] * d3_radians, source[1] * d3_radians, target[0] * d3_radians, target[1] * d3_radians);
	  };
	  function d3_geo_interpolate(x0, y0, x1, y1) {
	    var cy0 = Math.cos(y0), sy0 = Math.sin(y0), cy1 = Math.cos(y1), sy1 = Math.sin(y1), kx0 = cy0 * Math.cos(x0), ky0 = cy0 * Math.sin(x0), kx1 = cy1 * Math.cos(x1), ky1 = cy1 * Math.sin(x1), d = 2 * Math.asin(Math.sqrt(d3_haversin(y1 - y0) + cy0 * cy1 * d3_haversin(x1 - x0))), k = 1 / Math.sin(d);
	    var interpolate = d ? function(t) {
	      var B = Math.sin(t *= d) * k, A = Math.sin(d - t) * k, x = A * kx0 + B * kx1, y = A * ky0 + B * ky1, z = A * sy0 + B * sy1;
	      return [ Math.atan2(y, x) * d3_degrees, Math.atan2(z, Math.sqrt(x * x + y * y)) * d3_degrees ];
	    } : function() {
	      return [ x0 * d3_degrees, y0 * d3_degrees ];
	    };
	    interpolate.distance = d;
	    return interpolate;
	  }
	  d3.geo.length = function(object) {
	    d3_geo_lengthSum = 0;
	    d3.geo.stream(object, d3_geo_length);
	    return d3_geo_lengthSum;
	  };
	  var d3_geo_lengthSum;
	  var d3_geo_length = {
	    sphere: d3_noop,
	    point: d3_noop,
	    lineStart: d3_geo_lengthLineStart,
	    lineEnd: d3_noop,
	    polygonStart: d3_noop,
	    polygonEnd: d3_noop
	  };
	  function d3_geo_lengthLineStart() {
	    var λ0, sinφ0, cosφ0;
	    d3_geo_length.point = function(λ, φ) {
	      λ0 = λ * d3_radians, sinφ0 = Math.sin(φ *= d3_radians), cosφ0 = Math.cos(φ);
	      d3_geo_length.point = nextPoint;
	    };
	    d3_geo_length.lineEnd = function() {
	      d3_geo_length.point = d3_geo_length.lineEnd = d3_noop;
	    };
	    function nextPoint(λ, φ) {
	      var sinφ = Math.sin(φ *= d3_radians), cosφ = Math.cos(φ), t = abs((λ *= d3_radians) - λ0), cosΔλ = Math.cos(t);
	      d3_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ);
	      λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ;
	    }
	  }
	  function d3_geo_azimuthal(scale, angle) {
	    function azimuthal(λ, φ) {
	      var cosλ = Math.cos(λ), cosφ = Math.cos(φ), k = scale(cosλ * cosφ);
	      return [ k * cosφ * Math.sin(λ), k * Math.sin(φ) ];
	    }
	    azimuthal.invert = function(x, y) {
	      var ρ = Math.sqrt(x * x + y * y), c = angle(ρ), sinc = Math.sin(c), cosc = Math.cos(c);
	      return [ Math.atan2(x * sinc, ρ * cosc), Math.asin(ρ && y * sinc / ρ) ];
	    };
	    return azimuthal;
	  }
	  var d3_geo_azimuthalEqualArea = d3_geo_azimuthal(function(cosλcosφ) {
	    return Math.sqrt(2 / (1 + cosλcosφ));
	  }, function(ρ) {
	    return 2 * Math.asin(ρ / 2);
	  });
	  (d3.geo.azimuthalEqualArea = function() {
	    return d3_geo_projection(d3_geo_azimuthalEqualArea);
	  }).raw = d3_geo_azimuthalEqualArea;
	  var d3_geo_azimuthalEquidistant = d3_geo_azimuthal(function(cosλcosφ) {
	    var c = Math.acos(cosλcosφ);
	    return c && c / Math.sin(c);
	  }, d3_identity);
	  (d3.geo.azimuthalEquidistant = function() {
	    return d3_geo_projection(d3_geo_azimuthalEquidistant);
	  }).raw = d3_geo_azimuthalEquidistant;
	  function d3_geo_conicConformal(φ0, φ1) {
	    var cosφ0 = Math.cos(φ0), t = function(φ) {
	      return Math.tan(π / 4 + φ / 2);
	    }, n = φ0 === φ1 ? Math.sin(φ0) : Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)), F = cosφ0 * Math.pow(t(φ0), n) / n;
	    if (!n) return d3_geo_mercator;
	    function forward(λ, φ) {
	      if (F > 0) {
	        if (φ < -halfπ + ε) φ = -halfπ + ε;
	      } else {
	        if (φ > halfπ - ε) φ = halfπ - ε;
	      }
	      var ρ = F / Math.pow(t(φ), n);
	      return [ ρ * Math.sin(n * λ), F - ρ * Math.cos(n * λ) ];
	    }
	    forward.invert = function(x, y) {
	      var ρ0_y = F - y, ρ = d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);
	      return [ Math.atan2(x, ρ0_y) / n, 2 * Math.atan(Math.pow(F / ρ, 1 / n)) - halfπ ];
	    };
	    return forward;
	  }
	  (d3.geo.conicConformal = function() {
	    return d3_geo_conic(d3_geo_conicConformal);
	  }).raw = d3_geo_conicConformal;
	  function d3_geo_conicEquidistant(φ0, φ1) {
	    var cosφ0 = Math.cos(φ0), n = φ0 === φ1 ? Math.sin(φ0) : (cosφ0 - Math.cos(φ1)) / (φ1 - φ0), G = cosφ0 / n + φ0;
	    if (abs(n) < ε) return d3_geo_equirectangular;
	    function forward(λ, φ) {
	      var ρ = G - φ;
	      return [ ρ * Math.sin(n * λ), G - ρ * Math.cos(n * λ) ];
	    }
	    forward.invert = function(x, y) {
	      var ρ0_y = G - y;
	      return [ Math.atan2(x, ρ0_y) / n, G - d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y) ];
	    };
	    return forward;
	  }
	  (d3.geo.conicEquidistant = function() {
	    return d3_geo_conic(d3_geo_conicEquidistant);
	  }).raw = d3_geo_conicEquidistant;
	  var d3_geo_gnomonic = d3_geo_azimuthal(function(cosλcosφ) {
	    return 1 / cosλcosφ;
	  }, Math.atan);
	  (d3.geo.gnomonic = function() {
	    return d3_geo_projection(d3_geo_gnomonic);
	  }).raw = d3_geo_gnomonic;
	  function d3_geo_mercator(λ, φ) {
	    return [ λ, Math.log(Math.tan(π / 4 + φ / 2)) ];
	  }
	  d3_geo_mercator.invert = function(x, y) {
	    return [ x, 2 * Math.atan(Math.exp(y)) - halfπ ];
	  };
	  function d3_geo_mercatorProjection(project) {
	    var m = d3_geo_projection(project), scale = m.scale, translate = m.translate, clipExtent = m.clipExtent, clipAuto;
	    m.scale = function() {
	      var v = scale.apply(m, arguments);
	      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
	    };
	    m.translate = function() {
	      var v = translate.apply(m, arguments);
	      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
	    };
	    m.clipExtent = function(_) {
	      var v = clipExtent.apply(m, arguments);
	      if (v === m) {
	        if (clipAuto = _ == null) {
	          var k = π * scale(), t = translate();
	          clipExtent([ [ t[0] - k, t[1] - k ], [ t[0] + k, t[1] + k ] ]);
	        }
	      } else if (clipAuto) {
	        v = null;
	      }
	      return v;
	    };
	    return m.clipExtent(null);
	  }
	  (d3.geo.mercator = function() {
	    return d3_geo_mercatorProjection(d3_geo_mercator);
	  }).raw = d3_geo_mercator;
	  var d3_geo_orthographic = d3_geo_azimuthal(function() {
	    return 1;
	  }, Math.asin);
	  (d3.geo.orthographic = function() {
	    return d3_geo_projection(d3_geo_orthographic);
	  }).raw = d3_geo_orthographic;
	  var d3_geo_stereographic = d3_geo_azimuthal(function(cosλcosφ) {
	    return 1 / (1 + cosλcosφ);
	  }, function(ρ) {
	    return 2 * Math.atan(ρ);
	  });
	  (d3.geo.stereographic = function() {
	    return d3_geo_projection(d3_geo_stereographic);
	  }).raw = d3_geo_stereographic;
	  function d3_geo_transverseMercator(λ, φ) {
	    return [ Math.log(Math.tan(π / 4 + φ / 2)), -λ ];
	  }
	  d3_geo_transverseMercator.invert = function(x, y) {
	    return [ -y, 2 * Math.atan(Math.exp(x)) - halfπ ];
	  };
	  (d3.geo.transverseMercator = function() {
	    var projection = d3_geo_mercatorProjection(d3_geo_transverseMercator), center = projection.center, rotate = projection.rotate;
	    projection.center = function(_) {
	      return _ ? center([ -_[1], _[0] ]) : (_ = center(), [ _[1], -_[0] ]);
	    };
	    projection.rotate = function(_) {
	      return _ ? rotate([ _[0], _[1], _.length > 2 ? _[2] + 90 : 90 ]) : (_ = rotate(), 
	      [ _[0], _[1], _[2] - 90 ]);
	    };
	    return rotate([ 0, 0, 90 ]);
	  }).raw = d3_geo_transverseMercator;
	  d3.geom = {};
	  function d3_geom_pointX(d) {
	    return d[0];
	  }
	  function d3_geom_pointY(d) {
	    return d[1];
	  }
	  d3.geom.hull = function(vertices) {
	    var x = d3_geom_pointX, y = d3_geom_pointY;
	    if (arguments.length) return hull(vertices);
	    function hull(data) {
	      if (data.length < 3) return [];
	      var fx = d3_functor(x), fy = d3_functor(y), i, n = data.length, points = [], flippedPoints = [];
	      for (i = 0; i < n; i++) {
	        points.push([ +fx.call(this, data[i], i), +fy.call(this, data[i], i), i ]);
	      }
	      points.sort(d3_geom_hullOrder);
	      for (i = 0; i < n; i++) flippedPoints.push([ points[i][0], -points[i][1] ]);
	      var upper = d3_geom_hullUpper(points), lower = d3_geom_hullUpper(flippedPoints);
	      var skipLeft = lower[0] === upper[0], skipRight = lower[lower.length - 1] === upper[upper.length - 1], polygon = [];
	      for (i = upper.length - 1; i >= 0; --i) polygon.push(data[points[upper[i]][2]]);
	      for (i = +skipLeft; i < lower.length - skipRight; ++i) polygon.push(data[points[lower[i]][2]]);
	      return polygon;
	    }
	    hull.x = function(_) {
	      return arguments.length ? (x = _, hull) : x;
	    };
	    hull.y = function(_) {
	      return arguments.length ? (y = _, hull) : y;
	    };
	    return hull;
	  };
	  function d3_geom_hullUpper(points) {
	    var n = points.length, hull = [ 0, 1 ], hs = 2;
	    for (var i = 2; i < n; i++) {
	      while (hs > 1 && d3_cross2d(points[hull[hs - 2]], points[hull[hs - 1]], points[i]) <= 0) --hs;
	      hull[hs++] = i;
	    }
	    return hull.slice(0, hs);
	  }
	  function d3_geom_hullOrder(a, b) {
	    return a[0] - b[0] || a[1] - b[1];
	  }
	  d3.geom.polygon = function(coordinates) {
	    d3_subclass(coordinates, d3_geom_polygonPrototype);
	    return coordinates;
	  };
	  var d3_geom_polygonPrototype = d3.geom.polygon.prototype = [];
	  d3_geom_polygonPrototype.area = function() {
	    var i = -1, n = this.length, a, b = this[n - 1], area = 0;
	    while (++i < n) {
	      a = b;
	      b = this[i];
	      area += a[1] * b[0] - a[0] * b[1];
	    }
	    return area * .5;
	  };
	  d3_geom_polygonPrototype.centroid = function(k) {
	    var i = -1, n = this.length, x = 0, y = 0, a, b = this[n - 1], c;
	    if (!arguments.length) k = -1 / (6 * this.area());
	    while (++i < n) {
	      a = b;
	      b = this[i];
	      c = a[0] * b[1] - b[0] * a[1];
	      x += (a[0] + b[0]) * c;
	      y += (a[1] + b[1]) * c;
	    }
	    return [ x * k, y * k ];
	  };
	  d3_geom_polygonPrototype.clip = function(subject) {
	    var input, closed = d3_geom_polygonClosed(subject), i = -1, n = this.length - d3_geom_polygonClosed(this), j, m, a = this[n - 1], b, c, d;
	    while (++i < n) {
	      input = subject.slice();
	      subject.length = 0;
	      b = this[i];
	      c = input[(m = input.length - closed) - 1];
	      j = -1;
	      while (++j < m) {
	        d = input[j];
	        if (d3_geom_polygonInside(d, a, b)) {
	          if (!d3_geom_polygonInside(c, a, b)) {
	            subject.push(d3_geom_polygonIntersect(c, d, a, b));
	          }
	          subject.push(d);
	        } else if (d3_geom_polygonInside(c, a, b)) {
	          subject.push(d3_geom_polygonIntersect(c, d, a, b));
	        }
	        c = d;
	      }
	      if (closed) subject.push(subject[0]);
	      a = b;
	    }
	    return subject;
	  };
	  function d3_geom_polygonInside(p, a, b) {
	    return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);
	  }
	  function d3_geom_polygonIntersect(c, d, a, b) {
	    var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3, ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
	    return [ x1 + ua * x21, y1 + ua * y21 ];
	  }
	  function d3_geom_polygonClosed(coordinates) {
	    var a = coordinates[0], b = coordinates[coordinates.length - 1];
	    return !(a[0] - b[0] || a[1] - b[1]);
	  }
	  var d3_geom_voronoiEdges, d3_geom_voronoiCells, d3_geom_voronoiBeaches, d3_geom_voronoiBeachPool = [], d3_geom_voronoiFirstCircle, d3_geom_voronoiCircles, d3_geom_voronoiCirclePool = [];
	  function d3_geom_voronoiBeach() {
	    d3_geom_voronoiRedBlackNode(this);
	    this.edge = this.site = this.circle = null;
	  }
	  function d3_geom_voronoiCreateBeach(site) {
	    var beach = d3_geom_voronoiBeachPool.pop() || new d3_geom_voronoiBeach();
	    beach.site = site;
	    return beach;
	  }
	  function d3_geom_voronoiDetachBeach(beach) {
	    d3_geom_voronoiDetachCircle(beach);
	    d3_geom_voronoiBeaches.remove(beach);
	    d3_geom_voronoiBeachPool.push(beach);
	    d3_geom_voronoiRedBlackNode(beach);
	  }
	  function d3_geom_voronoiRemoveBeach(beach) {
	    var circle = beach.circle, x = circle.x, y = circle.cy, vertex = {
	      x: x,
	      y: y
	    }, previous = beach.P, next = beach.N, disappearing = [ beach ];
	    d3_geom_voronoiDetachBeach(beach);
	    var lArc = previous;
	    while (lArc.circle && abs(x - lArc.circle.x) < ε && abs(y - lArc.circle.cy) < ε) {
	      previous = lArc.P;
	      disappearing.unshift(lArc);
	      d3_geom_voronoiDetachBeach(lArc);
	      lArc = previous;
	    }
	    disappearing.unshift(lArc);
	    d3_geom_voronoiDetachCircle(lArc);
	    var rArc = next;
	    while (rArc.circle && abs(x - rArc.circle.x) < ε && abs(y - rArc.circle.cy) < ε) {
	      next = rArc.N;
	      disappearing.push(rArc);
	      d3_geom_voronoiDetachBeach(rArc);
	      rArc = next;
	    }
	    disappearing.push(rArc);
	    d3_geom_voronoiDetachCircle(rArc);
	    var nArcs = disappearing.length, iArc;
	    for (iArc = 1; iArc < nArcs; ++iArc) {
	      rArc = disappearing[iArc];
	      lArc = disappearing[iArc - 1];
	      d3_geom_voronoiSetEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
	    }
	    lArc = disappearing[0];
	    rArc = disappearing[nArcs - 1];
	    rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, rArc.site, null, vertex);
	    d3_geom_voronoiAttachCircle(lArc);
	    d3_geom_voronoiAttachCircle(rArc);
	  }
	  function d3_geom_voronoiAddBeach(site) {
	    var x = site.x, directrix = site.y, lArc, rArc, dxl, dxr, node = d3_geom_voronoiBeaches._;
	    while (node) {
	      dxl = d3_geom_voronoiLeftBreakPoint(node, directrix) - x;
	      if (dxl > ε) node = node.L; else {
	        dxr = x - d3_geom_voronoiRightBreakPoint(node, directrix);
	        if (dxr > ε) {
	          if (!node.R) {
	            lArc = node;
	            break;
	          }
	          node = node.R;
	        } else {
	          if (dxl > -ε) {
	            lArc = node.P;
	            rArc = node;
	          } else if (dxr > -ε) {
	            lArc = node;
	            rArc = node.N;
	          } else {
	            lArc = rArc = node;
	          }
	          break;
	        }
	      }
	    }
	    var newArc = d3_geom_voronoiCreateBeach(site);
	    d3_geom_voronoiBeaches.insert(lArc, newArc);
	    if (!lArc && !rArc) return;
	    if (lArc === rArc) {
	      d3_geom_voronoiDetachCircle(lArc);
	      rArc = d3_geom_voronoiCreateBeach(lArc.site);
	      d3_geom_voronoiBeaches.insert(newArc, rArc);
	      newArc.edge = rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
	      d3_geom_voronoiAttachCircle(lArc);
	      d3_geom_voronoiAttachCircle(rArc);
	      return;
	    }
	    if (!rArc) {
	      newArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
	      return;
	    }
	    d3_geom_voronoiDetachCircle(lArc);
	    d3_geom_voronoiDetachCircle(rArc);
	    var lSite = lArc.site, ax = lSite.x, ay = lSite.y, bx = site.x - ax, by = site.y - ay, rSite = rArc.site, cx = rSite.x - ax, cy = rSite.y - ay, d = 2 * (bx * cy - by * cx), hb = bx * bx + by * by, hc = cx * cx + cy * cy, vertex = {
	      x: (cy * hb - by * hc) / d + ax,
	      y: (bx * hc - cx * hb) / d + ay
	    };
	    d3_geom_voronoiSetEdgeEnd(rArc.edge, lSite, rSite, vertex);
	    newArc.edge = d3_geom_voronoiCreateEdge(lSite, site, null, vertex);
	    rArc.edge = d3_geom_voronoiCreateEdge(site, rSite, null, vertex);
	    d3_geom_voronoiAttachCircle(lArc);
	    d3_geom_voronoiAttachCircle(rArc);
	  }
	  function d3_geom_voronoiLeftBreakPoint(arc, directrix) {
	    var site = arc.site, rfocx = site.x, rfocy = site.y, pby2 = rfocy - directrix;
	    if (!pby2) return rfocx;
	    var lArc = arc.P;
	    if (!lArc) return -Infinity;
	    site = lArc.site;
	    var lfocx = site.x, lfocy = site.y, plby2 = lfocy - directrix;
	    if (!plby2) return lfocx;
	    var hl = lfocx - rfocx, aby2 = 1 / pby2 - 1 / plby2, b = hl / plby2;
	    if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;
	    return (rfocx + lfocx) / 2;
	  }
	  function d3_geom_voronoiRightBreakPoint(arc, directrix) {
	    var rArc = arc.N;
	    if (rArc) return d3_geom_voronoiLeftBreakPoint(rArc, directrix);
	    var site = arc.site;
	    return site.y === directrix ? site.x : Infinity;
	  }
	  function d3_geom_voronoiCell(site) {
	    this.site = site;
	    this.edges = [];
	  }
	  d3_geom_voronoiCell.prototype.prepare = function() {
	    var halfEdges = this.edges, iHalfEdge = halfEdges.length, edge;
	    while (iHalfEdge--) {
	      edge = halfEdges[iHalfEdge].edge;
	      if (!edge.b || !edge.a) halfEdges.splice(iHalfEdge, 1);
	    }
	    halfEdges.sort(d3_geom_voronoiHalfEdgeOrder);
	    return halfEdges.length;
	  };
	  function d3_geom_voronoiCloseCells(extent) {
	    var x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], x2, y2, x3, y3, cells = d3_geom_voronoiCells, iCell = cells.length, cell, iHalfEdge, halfEdges, nHalfEdges, start, end;
	    while (iCell--) {
	      cell = cells[iCell];
	      if (!cell || !cell.prepare()) continue;
	      halfEdges = cell.edges;
	      nHalfEdges = halfEdges.length;
	      iHalfEdge = 0;
	      while (iHalfEdge < nHalfEdges) {
	        end = halfEdges[iHalfEdge].end(), x3 = end.x, y3 = end.y;
	        start = halfEdges[++iHalfEdge % nHalfEdges].start(), x2 = start.x, y2 = start.y;
	        if (abs(x3 - x2) > ε || abs(y3 - y2) > ε) {
	          halfEdges.splice(iHalfEdge, 0, new d3_geom_voronoiHalfEdge(d3_geom_voronoiCreateBorderEdge(cell.site, end, abs(x3 - x0) < ε && y1 - y3 > ε ? {
	            x: x0,
	            y: abs(x2 - x0) < ε ? y2 : y1
	          } : abs(y3 - y1) < ε && x1 - x3 > ε ? {
	            x: abs(y2 - y1) < ε ? x2 : x1,
	            y: y1
	          } : abs(x3 - x1) < ε && y3 - y0 > ε ? {
	            x: x1,
	            y: abs(x2 - x1) < ε ? y2 : y0
	          } : abs(y3 - y0) < ε && x3 - x0 > ε ? {
	            x: abs(y2 - y0) < ε ? x2 : x0,
	            y: y0
	          } : null), cell.site, null));
	          ++nHalfEdges;
	        }
	      }
	    }
	  }
	  function d3_geom_voronoiHalfEdgeOrder(a, b) {
	    return b.angle - a.angle;
	  }
	  function d3_geom_voronoiCircle() {
	    d3_geom_voronoiRedBlackNode(this);
	    this.x = this.y = this.arc = this.site = this.cy = null;
	  }
	  function d3_geom_voronoiAttachCircle(arc) {
	    var lArc = arc.P, rArc = arc.N;
	    if (!lArc || !rArc) return;
	    var lSite = lArc.site, cSite = arc.site, rSite = rArc.site;
	    if (lSite === rSite) return;
	    var bx = cSite.x, by = cSite.y, ax = lSite.x - bx, ay = lSite.y - by, cx = rSite.x - bx, cy = rSite.y - by;
	    var d = 2 * (ax * cy - ay * cx);
	    if (d >= -ε2) return;
	    var ha = ax * ax + ay * ay, hc = cx * cx + cy * cy, x = (cy * ha - ay * hc) / d, y = (ax * hc - cx * ha) / d, cy = y + by;
	    var circle = d3_geom_voronoiCirclePool.pop() || new d3_geom_voronoiCircle();
	    circle.arc = arc;
	    circle.site = cSite;
	    circle.x = x + bx;
	    circle.y = cy + Math.sqrt(x * x + y * y);
	    circle.cy = cy;
	    arc.circle = circle;
	    var before = null, node = d3_geom_voronoiCircles._;
	    while (node) {
	      if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {
	        if (node.L) node = node.L; else {
	          before = node.P;
	          break;
	        }
	      } else {
	        if (node.R) node = node.R; else {
	          before = node;
	          break;
	        }
	      }
	    }
	    d3_geom_voronoiCircles.insert(before, circle);
	    if (!before) d3_geom_voronoiFirstCircle = circle;
	  }
	  function d3_geom_voronoiDetachCircle(arc) {
	    var circle = arc.circle;
	    if (circle) {
	      if (!circle.P) d3_geom_voronoiFirstCircle = circle.N;
	      d3_geom_voronoiCircles.remove(circle);
	      d3_geom_voronoiCirclePool.push(circle);
	      d3_geom_voronoiRedBlackNode(circle);
	      arc.circle = null;
	    }
	  }
	  function d3_geom_voronoiClipEdges(extent) {
	    var edges = d3_geom_voronoiEdges, clip = d3_geom_clipLine(extent[0][0], extent[0][1], extent[1][0], extent[1][1]), i = edges.length, e;
	    while (i--) {
	      e = edges[i];
	      if (!d3_geom_voronoiConnectEdge(e, extent) || !clip(e) || abs(e.a.x - e.b.x) < ε && abs(e.a.y - e.b.y) < ε) {
	        e.a = e.b = null;
	        edges.splice(i, 1);
	      }
	    }
	  }
	  function d3_geom_voronoiConnectEdge(edge, extent) {
	    var vb = edge.b;
	    if (vb) return true;
	    var va = edge.a, x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], lSite = edge.l, rSite = edge.r, lx = lSite.x, ly = lSite.y, rx = rSite.x, ry = rSite.y, fx = (lx + rx) / 2, fy = (ly + ry) / 2, fm, fb;
	    if (ry === ly) {
	      if (fx < x0 || fx >= x1) return;
	      if (lx > rx) {
	        if (!va) va = {
	          x: fx,
	          y: y0
	        }; else if (va.y >= y1) return;
	        vb = {
	          x: fx,
	          y: y1
	        };
	      } else {
	        if (!va) va = {
	          x: fx,
	          y: y1
	        }; else if (va.y < y0) return;
	        vb = {
	          x: fx,
	          y: y0
	        };
	      }
	    } else {
	      fm = (lx - rx) / (ry - ly);
	      fb = fy - fm * fx;
	      if (fm < -1 || fm > 1) {
	        if (lx > rx) {
	          if (!va) va = {
	            x: (y0 - fb) / fm,
	            y: y0
	          }; else if (va.y >= y1) return;
	          vb = {
	            x: (y1 - fb) / fm,
	            y: y1
	          };
	        } else {
	          if (!va) va = {
	            x: (y1 - fb) / fm,
	            y: y1
	          }; else if (va.y < y0) return;
	          vb = {
	            x: (y0 - fb) / fm,
	            y: y0
	          };
	        }
	      } else {
	        if (ly < ry) {
	          if (!va) va = {
	            x: x0,
	            y: fm * x0 + fb
	          }; else if (va.x >= x1) return;
	          vb = {
	            x: x1,
	            y: fm * x1 + fb
	          };
	        } else {
	          if (!va) va = {
	            x: x1,
	            y: fm * x1 + fb
	          }; else if (va.x < x0) return;
	          vb = {
	            x: x0,
	            y: fm * x0 + fb
	          };
	        }
	      }
	    }
	    edge.a = va;
	    edge.b = vb;
	    return true;
	  }
	  function d3_geom_voronoiEdge(lSite, rSite) {
	    this.l = lSite;
	    this.r = rSite;
	    this.a = this.b = null;
	  }
	  function d3_geom_voronoiCreateEdge(lSite, rSite, va, vb) {
	    var edge = new d3_geom_voronoiEdge(lSite, rSite);
	    d3_geom_voronoiEdges.push(edge);
	    if (va) d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, va);
	    if (vb) d3_geom_voronoiSetEdgeEnd(edge, rSite, lSite, vb);
	    d3_geom_voronoiCells[lSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, lSite, rSite));
	    d3_geom_voronoiCells[rSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, rSite, lSite));
	    return edge;
	  }
	  function d3_geom_voronoiCreateBorderEdge(lSite, va, vb) {
	    var edge = new d3_geom_voronoiEdge(lSite, null);
	    edge.a = va;
	    edge.b = vb;
	    d3_geom_voronoiEdges.push(edge);
	    return edge;
	  }
	  function d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, vertex) {
	    if (!edge.a && !edge.b) {
	      edge.a = vertex;
	      edge.l = lSite;
	      edge.r = rSite;
	    } else if (edge.l === rSite) {
	      edge.b = vertex;
	    } else {
	      edge.a = vertex;
	    }
	  }
	  function d3_geom_voronoiHalfEdge(edge, lSite, rSite) {
	    var va = edge.a, vb = edge.b;
	    this.edge = edge;
	    this.site = lSite;
	    this.angle = rSite ? Math.atan2(rSite.y - lSite.y, rSite.x - lSite.x) : edge.l === lSite ? Math.atan2(vb.x - va.x, va.y - vb.y) : Math.atan2(va.x - vb.x, vb.y - va.y);
	  }
	  d3_geom_voronoiHalfEdge.prototype = {
	    start: function() {
	      return this.edge.l === this.site ? this.edge.a : this.edge.b;
	    },
	    end: function() {
	      return this.edge.l === this.site ? this.edge.b : this.edge.a;
	    }
	  };
	  function d3_geom_voronoiRedBlackTree() {
	    this._ = null;
	  }
	  function d3_geom_voronoiRedBlackNode(node) {
	    node.U = node.C = node.L = node.R = node.P = node.N = null;
	  }
	  d3_geom_voronoiRedBlackTree.prototype = {
	    insert: function(after, node) {
	      var parent, grandpa, uncle;
	      if (after) {
	        node.P = after;
	        node.N = after.N;
	        if (after.N) after.N.P = node;
	        after.N = node;
	        if (after.R) {
	          after = after.R;
	          while (after.L) after = after.L;
	          after.L = node;
	        } else {
	          after.R = node;
	        }
	        parent = after;
	      } else if (this._) {
	        after = d3_geom_voronoiRedBlackFirst(this._);
	        node.P = null;
	        node.N = after;
	        after.P = after.L = node;
	        parent = after;
	      } else {
	        node.P = node.N = null;
	        this._ = node;
	        parent = null;
	      }
	      node.L = node.R = null;
	      node.U = parent;
	      node.C = true;
	      after = node;
	      while (parent && parent.C) {
	        grandpa = parent.U;
	        if (parent === grandpa.L) {
	          uncle = grandpa.R;
	          if (uncle && uncle.C) {
	            parent.C = uncle.C = false;
	            grandpa.C = true;
	            after = grandpa;
	          } else {
	            if (after === parent.R) {
	              d3_geom_voronoiRedBlackRotateLeft(this, parent);
	              after = parent;
	              parent = after.U;
	            }
	            parent.C = false;
	            grandpa.C = true;
	            d3_geom_voronoiRedBlackRotateRight(this, grandpa);
	          }
	        } else {
	          uncle = grandpa.L;
	          if (uncle && uncle.C) {
	            parent.C = uncle.C = false;
	            grandpa.C = true;
	            after = grandpa;
	          } else {
	            if (after === parent.L) {
	              d3_geom_voronoiRedBlackRotateRight(this, parent);
	              after = parent;
	              parent = after.U;
	            }
	            parent.C = false;
	            grandpa.C = true;
	            d3_geom_voronoiRedBlackRotateLeft(this, grandpa);
	          }
	        }
	        parent = after.U;
	      }
	      this._.C = false;
	    },
	    remove: function(node) {
	      if (node.N) node.N.P = node.P;
	      if (node.P) node.P.N = node.N;
	      node.N = node.P = null;
	      var parent = node.U, sibling, left = node.L, right = node.R, next, red;
	      if (!left) next = right; else if (!right) next = left; else next = d3_geom_voronoiRedBlackFirst(right);
	      if (parent) {
	        if (parent.L === node) parent.L = next; else parent.R = next;
	      } else {
	        this._ = next;
	      }
	      if (left && right) {
	        red = next.C;
	        next.C = node.C;
	        next.L = left;
	        left.U = next;
	        if (next !== right) {
	          parent = next.U;
	          next.U = node.U;
	          node = next.R;
	          parent.L = node;
	          next.R = right;
	          right.U = next;
	        } else {
	          next.U = parent;
	          parent = next;
	          node = next.R;
	        }
	      } else {
	        red = node.C;
	        node = next;
	      }
	      if (node) node.U = parent;
	      if (red) return;
	      if (node && node.C) {
	        node.C = false;
	        return;
	      }
	      do {
	        if (node === this._) break;
	        if (node === parent.L) {
	          sibling = parent.R;
	          if (sibling.C) {
	            sibling.C = false;
	            parent.C = true;
	            d3_geom_voronoiRedBlackRotateLeft(this, parent);
	            sibling = parent.R;
	          }
	          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
	            if (!sibling.R || !sibling.R.C) {
	              sibling.L.C = false;
	              sibling.C = true;
	              d3_geom_voronoiRedBlackRotateRight(this, sibling);
	              sibling = parent.R;
	            }
	            sibling.C = parent.C;
	            parent.C = sibling.R.C = false;
	            d3_geom_voronoiRedBlackRotateLeft(this, parent);
	            node = this._;
	            break;
	          }
	        } else {
	          sibling = parent.L;
	          if (sibling.C) {
	            sibling.C = false;
	            parent.C = true;
	            d3_geom_voronoiRedBlackRotateRight(this, parent);
	            sibling = parent.L;
	          }
	          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
	            if (!sibling.L || !sibling.L.C) {
	              sibling.R.C = false;
	              sibling.C = true;
	              d3_geom_voronoiRedBlackRotateLeft(this, sibling);
	              sibling = parent.L;
	            }
	            sibling.C = parent.C;
	            parent.C = sibling.L.C = false;
	            d3_geom_voronoiRedBlackRotateRight(this, parent);
	            node = this._;
	            break;
	          }
	        }
	        sibling.C = true;
	        node = parent;
	        parent = parent.U;
	      } while (!node.C);
	      if (node) node.C = false;
	    }
	  };
	  function d3_geom_voronoiRedBlackRotateLeft(tree, node) {
	    var p = node, q = node.R, parent = p.U;
	    if (parent) {
	      if (parent.L === p) parent.L = q; else parent.R = q;
	    } else {
	      tree._ = q;
	    }
	    q.U = parent;
	    p.U = q;
	    p.R = q.L;
	    if (p.R) p.R.U = p;
	    q.L = p;
	  }
	  function d3_geom_voronoiRedBlackRotateRight(tree, node) {
	    var p = node, q = node.L, parent = p.U;
	    if (parent) {
	      if (parent.L === p) parent.L = q; else parent.R = q;
	    } else {
	      tree._ = q;
	    }
	    q.U = parent;
	    p.U = q;
	    p.L = q.R;
	    if (p.L) p.L.U = p;
	    q.R = p;
	  }
	  function d3_geom_voronoiRedBlackFirst(node) {
	    while (node.L) node = node.L;
	    return node;
	  }
	  function d3_geom_voronoi(sites, bbox) {
	    var site = sites.sort(d3_geom_voronoiVertexOrder).pop(), x0, y0, circle;
	    d3_geom_voronoiEdges = [];
	    d3_geom_voronoiCells = new Array(sites.length);
	    d3_geom_voronoiBeaches = new d3_geom_voronoiRedBlackTree();
	    d3_geom_voronoiCircles = new d3_geom_voronoiRedBlackTree();
	    while (true) {
	      circle = d3_geom_voronoiFirstCircle;
	      if (site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x)) {
	        if (site.x !== x0 || site.y !== y0) {
	          d3_geom_voronoiCells[site.i] = new d3_geom_voronoiCell(site);
	          d3_geom_voronoiAddBeach(site);
	          x0 = site.x, y0 = site.y;
	        }
	        site = sites.pop();
	      } else if (circle) {
	        d3_geom_voronoiRemoveBeach(circle.arc);
	      } else {
	        break;
	      }
	    }
	    if (bbox) d3_geom_voronoiClipEdges(bbox), d3_geom_voronoiCloseCells(bbox);
	    var diagram = {
	      cells: d3_geom_voronoiCells,
	      edges: d3_geom_voronoiEdges
	    };
	    d3_geom_voronoiBeaches = d3_geom_voronoiCircles = d3_geom_voronoiEdges = d3_geom_voronoiCells = null;
	    return diagram;
	  }
	  function d3_geom_voronoiVertexOrder(a, b) {
	    return b.y - a.y || b.x - a.x;
	  }
	  d3.geom.voronoi = function(points) {
	    var x = d3_geom_pointX, y = d3_geom_pointY, fx = x, fy = y, clipExtent = d3_geom_voronoiClipExtent;
	    if (points) return voronoi(points);
	    function voronoi(data) {
	      var polygons = new Array(data.length), x0 = clipExtent[0][0], y0 = clipExtent[0][1], x1 = clipExtent[1][0], y1 = clipExtent[1][1];
	      d3_geom_voronoi(sites(data), clipExtent).cells.forEach(function(cell, i) {
	        var edges = cell.edges, site = cell.site, polygon = polygons[i] = edges.length ? edges.map(function(e) {
	          var s = e.start();
	          return [ s.x, s.y ];
	        }) : site.x >= x0 && site.x <= x1 && site.y >= y0 && site.y <= y1 ? [ [ x0, y1 ], [ x1, y1 ], [ x1, y0 ], [ x0, y0 ] ] : [];
	        polygon.point = data[i];
	      });
	      return polygons;
	    }
	    function sites(data) {
	      return data.map(function(d, i) {
	        return {
	          x: Math.round(fx(d, i) / ε) * ε,
	          y: Math.round(fy(d, i) / ε) * ε,
	          i: i
	        };
	      });
	    }
	    voronoi.links = function(data) {
	      return d3_geom_voronoi(sites(data)).edges.filter(function(edge) {
	        return edge.l && edge.r;
	      }).map(function(edge) {
	        return {
	          source: data[edge.l.i],
	          target: data[edge.r.i]
	        };
	      });
	    };
	    voronoi.triangles = function(data) {
	      var triangles = [];
	      d3_geom_voronoi(sites(data)).cells.forEach(function(cell, i) {
	        var site = cell.site, edges = cell.edges.sort(d3_geom_voronoiHalfEdgeOrder), j = -1, m = edges.length, e0, s0, e1 = edges[m - 1].edge, s1 = e1.l === site ? e1.r : e1.l;
	        while (++j < m) {
	          e0 = e1;
	          s0 = s1;
	          e1 = edges[j].edge;
	          s1 = e1.l === site ? e1.r : e1.l;
	          if (i < s0.i && i < s1.i && d3_geom_voronoiTriangleArea(site, s0, s1) < 0) {
	            triangles.push([ data[i], data[s0.i], data[s1.i] ]);
	          }
	        }
	      });
	      return triangles;
	    };
	    voronoi.x = function(_) {
	      return arguments.length ? (fx = d3_functor(x = _), voronoi) : x;
	    };
	    voronoi.y = function(_) {
	      return arguments.length ? (fy = d3_functor(y = _), voronoi) : y;
	    };
	    voronoi.clipExtent = function(_) {
	      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent;
	      clipExtent = _ == null ? d3_geom_voronoiClipExtent : _;
	      return voronoi;
	    };
	    voronoi.size = function(_) {
	      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent && clipExtent[1];
	      return voronoi.clipExtent(_ && [ [ 0, 0 ], _ ]);
	    };
	    return voronoi;
	  };
	  var d3_geom_voronoiClipExtent = [ [ -1e6, -1e6 ], [ 1e6, 1e6 ] ];
	  function d3_geom_voronoiTriangleArea(a, b, c) {
	    return (a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y);
	  }
	  d3.geom.delaunay = function(vertices) {
	    return d3.geom.voronoi().triangles(vertices);
	  };
	  d3.geom.quadtree = function(points, x1, y1, x2, y2) {
	    var x = d3_geom_pointX, y = d3_geom_pointY, compat;
	    if (compat = arguments.length) {
	      x = d3_geom_quadtreeCompatX;
	      y = d3_geom_quadtreeCompatY;
	      if (compat === 3) {
	        y2 = y1;
	        x2 = x1;
	        y1 = x1 = 0;
	      }
	      return quadtree(points);
	    }
	    function quadtree(data) {
	      var d, fx = d3_functor(x), fy = d3_functor(y), xs, ys, i, n, x1_, y1_, x2_, y2_;
	      if (x1 != null) {
	        x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2;
	      } else {
	        x2_ = y2_ = -(x1_ = y1_ = Infinity);
	        xs = [], ys = [];
	        n = data.length;
	        if (compat) for (i = 0; i < n; ++i) {
	          d = data[i];
	          if (d.x < x1_) x1_ = d.x;
	          if (d.y < y1_) y1_ = d.y;
	          if (d.x > x2_) x2_ = d.x;
	          if (d.y > y2_) y2_ = d.y;
	          xs.push(d.x);
	          ys.push(d.y);
	        } else for (i = 0; i < n; ++i) {
	          var x_ = +fx(d = data[i], i), y_ = +fy(d, i);
	          if (x_ < x1_) x1_ = x_;
	          if (y_ < y1_) y1_ = y_;
	          if (x_ > x2_) x2_ = x_;
	          if (y_ > y2_) y2_ = y_;
	          xs.push(x_);
	          ys.push(y_);
	        }
	      }
	      var dx = x2_ - x1_, dy = y2_ - y1_;
	      if (dx > dy) y2_ = y1_ + dx; else x2_ = x1_ + dy;
	      function insert(n, d, x, y, x1, y1, x2, y2) {
	        if (isNaN(x) || isNaN(y)) return;
	        if (n.leaf) {
	          var nx = n.x, ny = n.y;
	          if (nx != null) {
	            if (abs(nx - x) + abs(ny - y) < .01) {
	              insertChild(n, d, x, y, x1, y1, x2, y2);
	            } else {
	              var nPoint = n.point;
	              n.x = n.y = n.point = null;
	              insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);
	              insertChild(n, d, x, y, x1, y1, x2, y2);
	            }
	          } else {
	            n.x = x, n.y = y, n.point = d;
	          }
	        } else {
	          insertChild(n, d, x, y, x1, y1, x2, y2);
	        }
	      }
	      function insertChild(n, d, x, y, x1, y1, x2, y2) {
	        var xm = (x1 + x2) * .5, ym = (y1 + y2) * .5, right = x >= xm, below = y >= ym, i = below << 1 | right;
	        n.leaf = false;
	        n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode());
	        if (right) x1 = xm; else x2 = xm;
	        if (below) y1 = ym; else y2 = ym;
	        insert(n, d, x, y, x1, y1, x2, y2);
	      }
	      var root = d3_geom_quadtreeNode();
	      root.add = function(d) {
	        insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_);
	      };
	      root.visit = function(f) {
	        d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_);
	      };
	      root.find = function(point) {
	        return d3_geom_quadtreeFind(root, point[0], point[1], x1_, y1_, x2_, y2_);
	      };
	      i = -1;
	      if (x1 == null) {
	        while (++i < n) {
	          insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_);
	        }
	        --i;
	      } else data.forEach(root.add);
	      xs = ys = data = d = null;
	      return root;
	    }
	    quadtree.x = function(_) {
	      return arguments.length ? (x = _, quadtree) : x;
	    };
	    quadtree.y = function(_) {
	      return arguments.length ? (y = _, quadtree) : y;
	    };
	    quadtree.extent = function(_) {
	      if (!arguments.length) return x1 == null ? null : [ [ x1, y1 ], [ x2, y2 ] ];
	      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], 
	      y2 = +_[1][1];
	      return quadtree;
	    };
	    quadtree.size = function(_) {
	      if (!arguments.length) return x1 == null ? null : [ x2 - x1, y2 - y1 ];
	      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = y1 = 0, x2 = +_[0], y2 = +_[1];
	      return quadtree;
	    };
	    return quadtree;
	  };
	  function d3_geom_quadtreeCompatX(d) {
	    return d.x;
	  }
	  function d3_geom_quadtreeCompatY(d) {
	    return d.y;
	  }
	  function d3_geom_quadtreeNode() {
	    return {
	      leaf: true,
	      nodes: [],
	      point: null,
	      x: null,
	      y: null
	    };
	  }
	  function d3_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {
	    if (!f(node, x1, y1, x2, y2)) {
	      var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, children = node.nodes;
	      if (children[0]) d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy);
	      if (children[1]) d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy);
	      if (children[2]) d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2);
	      if (children[3]) d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2);
	    }
	  }
	  function d3_geom_quadtreeFind(root, x, y, x0, y0, x3, y3) {
	    var minDistance2 = Infinity, closestPoint;
	    (function find(node, x1, y1, x2, y2) {
	      if (x1 > x3 || y1 > y3 || x2 < x0 || y2 < y0) return;
	      if (point = node.point) {
	        var point, dx = x - node.x, dy = y - node.y, distance2 = dx * dx + dy * dy;
	        if (distance2 < minDistance2) {
	          var distance = Math.sqrt(minDistance2 = distance2);
	          x0 = x - distance, y0 = y - distance;
	          x3 = x + distance, y3 = y + distance;
	          closestPoint = point;
	        }
	      }
	      var children = node.nodes, xm = (x1 + x2) * .5, ym = (y1 + y2) * .5, right = x >= xm, below = y >= ym;
	      for (var i = below << 1 | right, j = i + 4; i < j; ++i) {
	        if (node = children[i & 3]) switch (i & 3) {
	         case 0:
	          find(node, x1, y1, xm, ym);
	          break;

	         case 1:
	          find(node, xm, y1, x2, ym);
	          break;

	         case 2:
	          find(node, x1, ym, xm, y2);
	          break;

	         case 3:
	          find(node, xm, ym, x2, y2);
	          break;
	        }
	      }
	    })(root, x0, y0, x3, y3);
	    return closestPoint;
	  }
	  d3.interpolateRgb = d3_interpolateRgb;
	  function d3_interpolateRgb(a, b) {
	    a = d3.rgb(a);
	    b = d3.rgb(b);
	    var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab;
	    return function(t) {
	      return "#" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t));
	    };
	  }
	  d3.interpolateObject = d3_interpolateObject;
	  function d3_interpolateObject(a, b) {
	    var i = {}, c = {}, k;
	    for (k in a) {
	      if (k in b) {
	        i[k] = d3_interpolate(a[k], b[k]);
	      } else {
	        c[k] = a[k];
	      }
	    }
	    for (k in b) {
	      if (!(k in a)) {
	        c[k] = b[k];
	      }
	    }
	    return function(t) {
	      for (k in i) c[k] = i[k](t);
	      return c;
	    };
	  }
	  d3.interpolateNumber = d3_interpolateNumber;
	  function d3_interpolateNumber(a, b) {
	    a = +a, b = +b;
	    return function(t) {
	      return a * (1 - t) + b * t;
	    };
	  }
	  d3.interpolateString = d3_interpolateString;
	  function d3_interpolateString(a, b) {
	    var bi = d3_interpolate_numberA.lastIndex = d3_interpolate_numberB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
	    a = a + "", b = b + "";
	    while ((am = d3_interpolate_numberA.exec(a)) && (bm = d3_interpolate_numberB.exec(b))) {
	      if ((bs = bm.index) > bi) {
	        bs = b.slice(bi, bs);
	        if (s[i]) s[i] += bs; else s[++i] = bs;
	      }
	      if ((am = am[0]) === (bm = bm[0])) {
	        if (s[i]) s[i] += bm; else s[++i] = bm;
	      } else {
	        s[++i] = null;
	        q.push({
	          i: i,
	          x: d3_interpolateNumber(am, bm)
	        });
	      }
	      bi = d3_interpolate_numberB.lastIndex;
	    }
	    if (bi < b.length) {
	      bs = b.slice(bi);
	      if (s[i]) s[i] += bs; else s[++i] = bs;
	    }
	    return s.length < 2 ? q[0] ? (b = q[0].x, function(t) {
	      return b(t) + "";
	    }) : function() {
	      return b;
	    } : (b = q.length, function(t) {
	      for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
	      return s.join("");
	    });
	  }
	  var d3_interpolate_numberA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, d3_interpolate_numberB = new RegExp(d3_interpolate_numberA.source, "g");
	  d3.interpolate = d3_interpolate;
	  function d3_interpolate(a, b) {
	    var i = d3.interpolators.length, f;
	    while (--i >= 0 && !(f = d3.interpolators[i](a, b))) ;
	    return f;
	  }
	  d3.interpolators = [ function(a, b) {
	    var t = typeof b;
	    return (t === "string" ? d3_rgb_names.has(b.toLowerCase()) || /^(#|rgb\(|hsl\()/i.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_color ? d3_interpolateRgb : Array.isArray(b) ? d3_interpolateArray : t === "object" && isNaN(b) ? d3_interpolateObject : d3_interpolateNumber)(a, b);
	  } ];
	  d3.interpolateArray = d3_interpolateArray;
	  function d3_interpolateArray(a, b) {
	    var x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length), i;
	    for (i = 0; i < n0; ++i) x.push(d3_interpolate(a[i], b[i]));
	    for (;i < na; ++i) c[i] = a[i];
	    for (;i < nb; ++i) c[i] = b[i];
	    return function(t) {
	      for (i = 0; i < n0; ++i) c[i] = x[i](t);
	      return c;
	    };
	  }
	  var d3_ease_default = function() {
	    return d3_identity;
	  };
	  var d3_ease = d3.map({
	    linear: d3_ease_default,
	    poly: d3_ease_poly,
	    quad: function() {
	      return d3_ease_quad;
	    },
	    cubic: function() {
	      return d3_ease_cubic;
	    },
	    sin: function() {
	      return d3_ease_sin;
	    },
	    exp: function() {
	      return d3_ease_exp;
	    },
	    circle: function() {
	      return d3_ease_circle;
	    },
	    elastic: d3_ease_elastic,
	    back: d3_ease_back,
	    bounce: function() {
	      return d3_ease_bounce;
	    }
	  });
	  var d3_ease_mode = d3.map({
	    "in": d3_identity,
	    out: d3_ease_reverse,
	    "in-out": d3_ease_reflect,
	    "out-in": function(f) {
	      return d3_ease_reflect(d3_ease_reverse(f));
	    }
	  });
	  d3.ease = function(name) {
	    var i = name.indexOf("-"), t = i >= 0 ? name.slice(0, i) : name, m = i >= 0 ? name.slice(i + 1) : "in";
	    t = d3_ease.get(t) || d3_ease_default;
	    m = d3_ease_mode.get(m) || d3_identity;
	    return d3_ease_clamp(m(t.apply(null, d3_arraySlice.call(arguments, 1))));
	  };
	  function d3_ease_clamp(f) {
	    return function(t) {
	      return t <= 0 ? 0 : t >= 1 ? 1 : f(t);
	    };
	  }
	  function d3_ease_reverse(f) {
	    return function(t) {
	      return 1 - f(1 - t);
	    };
	  }
	  function d3_ease_reflect(f) {
	    return function(t) {
	      return .5 * (t < .5 ? f(2 * t) : 2 - f(2 - 2 * t));
	    };
	  }
	  function d3_ease_quad(t) {
	    return t * t;
	  }
	  function d3_ease_cubic(t) {
	    return t * t * t;
	  }
	  function d3_ease_cubicInOut(t) {
	    if (t <= 0) return 0;
	    if (t >= 1) return 1;
	    var t2 = t * t, t3 = t2 * t;
	    return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);
	  }
	  function d3_ease_poly(e) {
	    return function(t) {
	      return Math.pow(t, e);
	    };
	  }
	  function d3_ease_sin(t) {
	    return 1 - Math.cos(t * halfπ);
	  }
	  function d3_ease_exp(t) {
	    return Math.pow(2, 10 * (t - 1));
	  }
	  function d3_ease_circle(t) {
	    return 1 - Math.sqrt(1 - t * t);
	  }
	  function d3_ease_elastic(a, p) {
	    var s;
	    if (arguments.length < 2) p = .45;
	    if (arguments.length) s = p / τ * Math.asin(1 / a); else a = 1, s = p / 4;
	    return function(t) {
	      return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * τ / p);
	    };
	  }
	  function d3_ease_back(s) {
	    if (!s) s = 1.70158;
	    return function(t) {
	      return t * t * ((s + 1) * t - s);
	    };
	  }
	  function d3_ease_bounce(t) {
	    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
	  }
	  d3.interpolateHcl = d3_interpolateHcl;
	  function d3_interpolateHcl(a, b) {
	    a = d3.hcl(a);
	    b = d3.hcl(b);
	    var ah = a.h, ac = a.c, al = a.l, bh = b.h - ah, bc = b.c - ac, bl = b.l - al;
	    if (isNaN(bc)) bc = 0, ac = isNaN(ac) ? b.c : ac;
	    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
	    return function(t) {
	      return d3_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + "";
	    };
	  }
	  d3.interpolateHsl = d3_interpolateHsl;
	  function d3_interpolateHsl(a, b) {
	    a = d3.hsl(a);
	    b = d3.hsl(b);
	    var ah = a.h, as = a.s, al = a.l, bh = b.h - ah, bs = b.s - as, bl = b.l - al;
	    if (isNaN(bs)) bs = 0, as = isNaN(as) ? b.s : as;
	    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
	    return function(t) {
	      return d3_hsl_rgb(ah + bh * t, as + bs * t, al + bl * t) + "";
	    };
	  }
	  d3.interpolateLab = d3_interpolateLab;
	  function d3_interpolateLab(a, b) {
	    a = d3.lab(a);
	    b = d3.lab(b);
	    var al = a.l, aa = a.a, ab = a.b, bl = b.l - al, ba = b.a - aa, bb = b.b - ab;
	    return function(t) {
	      return d3_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + "";
	    };
	  }
	  d3.interpolateRound = d3_interpolateRound;
	  function d3_interpolateRound(a, b) {
	    b -= a;
	    return function(t) {
	      return Math.round(a + b * t);
	    };
	  }
	  d3.transform = function(string) {
	    var g = d3_document.createElementNS(d3.ns.prefix.svg, "g");
	    return (d3.transform = function(string) {
	      if (string != null) {
	        g.setAttribute("transform", string);
	        var t = g.transform.baseVal.consolidate();
	      }
	      return new d3_transform(t ? t.matrix : d3_transformIdentity);
	    })(string);
	  };
	  function d3_transform(m) {
	    var r0 = [ m.a, m.b ], r1 = [ m.c, m.d ], kx = d3_transformNormalize(r0), kz = d3_transformDot(r0, r1), ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0;
	    if (r0[0] * r1[1] < r1[0] * r0[1]) {
	      r0[0] *= -1;
	      r0[1] *= -1;
	      kx *= -1;
	      kz *= -1;
	    }
	    this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees;
	    this.translate = [ m.e, m.f ];
	    this.scale = [ kx, ky ];
	    this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0;
	  }
	  d3_transform.prototype.toString = function() {
	    return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")";
	  };
	  function d3_transformDot(a, b) {
	    return a[0] * b[0] + a[1] * b[1];
	  }
	  function d3_transformNormalize(a) {
	    var k = Math.sqrt(d3_transformDot(a, a));
	    if (k) {
	      a[0] /= k;
	      a[1] /= k;
	    }
	    return k;
	  }
	  function d3_transformCombine(a, b, k) {
	    a[0] += k * b[0];
	    a[1] += k * b[1];
	    return a;
	  }
	  var d3_transformIdentity = {
	    a: 1,
	    b: 0,
	    c: 0,
	    d: 1,
	    e: 0,
	    f: 0
	  };
	  d3.interpolateTransform = d3_interpolateTransform;
	  function d3_interpolateTransformPop(s) {
	    return s.length ? s.pop() + "," : "";
	  }
	  function d3_interpolateTranslate(ta, tb, s, q) {
	    if (ta[0] !== tb[0] || ta[1] !== tb[1]) {
	      var i = s.push("translate(", null, ",", null, ")");
	      q.push({
	        i: i - 4,
	        x: d3_interpolateNumber(ta[0], tb[0])
	      }, {
	        i: i - 2,
	        x: d3_interpolateNumber(ta[1], tb[1])
	      });
	    } else if (tb[0] || tb[1]) {
	      s.push("translate(" + tb + ")");
	    }
	  }
	  function d3_interpolateRotate(ra, rb, s, q) {
	    if (ra !== rb) {
	      if (ra - rb > 180) rb += 360; else if (rb - ra > 180) ra += 360;
	      q.push({
	        i: s.push(d3_interpolateTransformPop(s) + "rotate(", null, ")") - 2,
	        x: d3_interpolateNumber(ra, rb)
	      });
	    } else if (rb) {
	      s.push(d3_interpolateTransformPop(s) + "rotate(" + rb + ")");
	    }
	  }
	  function d3_interpolateSkew(wa, wb, s, q) {
	    if (wa !== wb) {
	      q.push({
	        i: s.push(d3_interpolateTransformPop(s) + "skewX(", null, ")") - 2,
	        x: d3_interpolateNumber(wa, wb)
	      });
	    } else if (wb) {
	      s.push(d3_interpolateTransformPop(s) + "skewX(" + wb + ")");
	    }
	  }
	  function d3_interpolateScale(ka, kb, s, q) {
	    if (ka[0] !== kb[0] || ka[1] !== kb[1]) {
	      var i = s.push(d3_interpolateTransformPop(s) + "scale(", null, ",", null, ")");
	      q.push({
	        i: i - 4,
	        x: d3_interpolateNumber(ka[0], kb[0])
	      }, {
	        i: i - 2,
	        x: d3_interpolateNumber(ka[1], kb[1])
	      });
	    } else if (kb[0] !== 1 || kb[1] !== 1) {
	      s.push(d3_interpolateTransformPop(s) + "scale(" + kb + ")");
	    }
	  }
	  function d3_interpolateTransform(a, b) {
	    var s = [], q = [];
	    a = d3.transform(a), b = d3.transform(b);
	    d3_interpolateTranslate(a.translate, b.translate, s, q);
	    d3_interpolateRotate(a.rotate, b.rotate, s, q);
	    d3_interpolateSkew(a.skew, b.skew, s, q);
	    d3_interpolateScale(a.scale, b.scale, s, q);
	    a = b = null;
	    return function(t) {
	      var i = -1, n = q.length, o;
	      while (++i < n) s[(o = q[i]).i] = o.x(t);
	      return s.join("");
	    };
	  }
	  function d3_uninterpolateNumber(a, b) {
	    b = (b -= a = +a) || 1 / b;
	    return function(x) {
	      return (x - a) / b;
	    };
	  }
	  function d3_uninterpolateClamp(a, b) {
	    b = (b -= a = +a) || 1 / b;
	    return function(x) {
	      return Math.max(0, Math.min(1, (x - a) / b));
	    };
	  }
	  d3.layout = {};
	  d3.layout.bundle = function() {
	    return function(links) {
	      var paths = [], i = -1, n = links.length;
	      while (++i < n) paths.push(d3_layout_bundlePath(links[i]));
	      return paths;
	    };
	  };
	  function d3_layout_bundlePath(link) {
	    var start = link.source, end = link.target, lca = d3_layout_bundleLeastCommonAncestor(start, end), points = [ start ];
	    while (start !== lca) {
	      start = start.parent;
	      points.push(start);
	    }
	    var k = points.length;
	    while (end !== lca) {
	      points.splice(k, 0, end);
	      end = end.parent;
	    }
	    return points;
	  }
	  function d3_layout_bundleAncestors(node) {
	    var ancestors = [], parent = node.parent;
	    while (parent != null) {
	      ancestors.push(node);
	      node = parent;
	      parent = parent.parent;
	    }
	    ancestors.push(node);
	    return ancestors;
	  }
	  function d3_layout_bundleLeastCommonAncestor(a, b) {
	    if (a === b) return a;
	    var aNodes = d3_layout_bundleAncestors(a), bNodes = d3_layout_bundleAncestors(b), aNode = aNodes.pop(), bNode = bNodes.pop(), sharedNode = null;
	    while (aNode === bNode) {
	      sharedNode = aNode;
	      aNode = aNodes.pop();
	      bNode = bNodes.pop();
	    }
	    return sharedNode;
	  }
	  d3.layout.chord = function() {
	    var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;
	    function relayout() {
	      var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;
	      chords = [];
	      groups = [];
	      k = 0, i = -1;
	      while (++i < n) {
	        x = 0, j = -1;
	        while (++j < n) {
	          x += matrix[i][j];
	        }
	        groupSums.push(x);
	        subgroupIndex.push(d3.range(n));
	        k += x;
	      }
	      if (sortGroups) {
	        groupIndex.sort(function(a, b) {
	          return sortGroups(groupSums[a], groupSums[b]);
	        });
	      }
	      if (sortSubgroups) {
	        subgroupIndex.forEach(function(d, i) {
	          d.sort(function(a, b) {
	            return sortSubgroups(matrix[i][a], matrix[i][b]);
	          });
	        });
	      }
	      k = (τ - padding * n) / k;
	      x = 0, i = -1;
	      while (++i < n) {
	        x0 = x, j = -1;
	        while (++j < n) {
	          var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;
	          subgroups[di + "-" + dj] = {
	            index: di,
	            subindex: dj,
	            startAngle: a0,
	            endAngle: a1,
	            value: v
	          };
	        }
	        groups[di] = {
	          index: di,
	          startAngle: x0,
	          endAngle: x,
	          value: groupSums[di]
	        };
	        x += padding;
	      }
	      i = -1;
	      while (++i < n) {
	        j = i - 1;
	        while (++j < n) {
	          var source = subgroups[i + "-" + j], target = subgroups[j + "-" + i];
	          if (source.value || target.value) {
	            chords.push(source.value < target.value ? {
	              source: target,
	              target: source
	            } : {
	              source: source,
	              target: target
	            });
	          }
	        }
	      }
	      if (sortChords) resort();
	    }
	    function resort() {
	      chords.sort(function(a, b) {
	        return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
	      });
	    }
	    chord.matrix = function(x) {
	      if (!arguments.length) return matrix;
	      n = (matrix = x) && matrix.length;
	      chords = groups = null;
	      return chord;
	    };
	    chord.padding = function(x) {
	      if (!arguments.length) return padding;
	      padding = x;
	      chords = groups = null;
	      return chord;
	    };
	    chord.sortGroups = function(x) {
	      if (!arguments.length) return sortGroups;
	      sortGroups = x;
	      chords = groups = null;
	      return chord;
	    };
	    chord.sortSubgroups = function(x) {
	      if (!arguments.length) return sortSubgroups;
	      sortSubgroups = x;
	      chords = null;
	      return chord;
	    };
	    chord.sortChords = function(x) {
	      if (!arguments.length) return sortChords;
	      sortChords = x;
	      if (chords) resort();
	      return chord;
	    };
	    chord.chords = function() {
	      if (!chords) relayout();
	      return chords;
	    };
	    chord.groups = function() {
	      if (!groups) relayout();
	      return groups;
	    };
	    return chord;
	  };
	  d3.layout.force = function() {
	    var force = {}, event = d3.dispatch("start", "tick", "end"), timer, size = [ 1, 1 ], drag, alpha, friction = .9, linkDistance = d3_layout_forceLinkDistance, linkStrength = d3_layout_forceLinkStrength, charge = -30, chargeDistance2 = d3_layout_forceChargeDistance2, gravity = .1, theta2 = .64, nodes = [], links = [], distances, strengths, charges;
	    function repulse(node) {
	      return function(quad, x1, _, x2) {
	        if (quad.point !== node) {
	          var dx = quad.cx - node.x, dy = quad.cy - node.y, dw = x2 - x1, dn = dx * dx + dy * dy;
	          if (dw * dw / theta2 < dn) {
	            if (dn < chargeDistance2) {
	              var k = quad.charge / dn;
	              node.px -= dx * k;
	              node.py -= dy * k;
	            }
	            return true;
	          }
	          if (quad.point && dn && dn < chargeDistance2) {
	            var k = quad.pointCharge / dn;
	            node.px -= dx * k;
	            node.py -= dy * k;
	          }
	        }
	        return !quad.charge;
	      };
	    }
	    force.tick = function() {
	      if ((alpha *= .99) < .005) {
	        timer = null;
	        event.end({
	          type: "end",
	          alpha: alpha = 0
	        });
	        return true;
	      }
	      var n = nodes.length, m = links.length, q, i, o, s, t, l, k, x, y;
	      for (i = 0; i < m; ++i) {
	        o = links[i];
	        s = o.source;
	        t = o.target;
	        x = t.x - s.x;
	        y = t.y - s.y;
	        if (l = x * x + y * y) {
	          l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;
	          x *= l;
	          y *= l;
	          t.x -= x * (k = s.weight + t.weight ? s.weight / (s.weight + t.weight) : .5);
	          t.y -= y * k;
	          s.x += x * (k = 1 - k);
	          s.y += y * k;
	        }
	      }
	      if (k = alpha * gravity) {
	        x = size[0] / 2;
	        y = size[1] / 2;
	        i = -1;
	        if (k) while (++i < n) {
	          o = nodes[i];
	          o.x += (x - o.x) * k;
	          o.y += (y - o.y) * k;
	        }
	      }
	      if (charge) {
	        d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges);
	        i = -1;
	        while (++i < n) {
	          if (!(o = nodes[i]).fixed) {
	            q.visit(repulse(o));
	          }
	        }
	      }
	      i = -1;
	      while (++i < n) {
	        o = nodes[i];
	        if (o.fixed) {
	          o.x = o.px;
	          o.y = o.py;
	        } else {
	          o.x -= (o.px - (o.px = o.x)) * friction;
	          o.y -= (o.py - (o.py = o.y)) * friction;
	        }
	      }
	      event.tick({
	        type: "tick",
	        alpha: alpha
	      });
	    };
	    force.nodes = function(x) {
	      if (!arguments.length) return nodes;
	      nodes = x;
	      return force;
	    };
	    force.links = function(x) {
	      if (!arguments.length) return links;
	      links = x;
	      return force;
	    };
	    force.size = function(x) {
	      if (!arguments.length) return size;
	      size = x;
	      return force;
	    };
	    force.linkDistance = function(x) {
	      if (!arguments.length) return linkDistance;
	      linkDistance = typeof x === "function" ? x : +x;
	      return force;
	    };
	    force.distance = force.linkDistance;
	    force.linkStrength = function(x) {
	      if (!arguments.length) return linkStrength;
	      linkStrength = typeof x === "function" ? x : +x;
	      return force;
	    };
	    force.friction = function(x) {
	      if (!arguments.length) return friction;
	      friction = +x;
	      return force;
	    };
	    force.charge = function(x) {
	      if (!arguments.length) return charge;
	      charge = typeof x === "function" ? x : +x;
	      return force;
	    };
	    force.chargeDistance = function(x) {
	      if (!arguments.length) return Math.sqrt(chargeDistance2);
	      chargeDistance2 = x * x;
	      return force;
	    };
	    force.gravity = function(x) {
	      if (!arguments.length) return gravity;
	      gravity = +x;
	      return force;
	    };
	    force.theta = function(x) {
	      if (!arguments.length) return Math.sqrt(theta2);
	      theta2 = x * x;
	      return force;
	    };
	    force.alpha = function(x) {
	      if (!arguments.length) return alpha;
	      x = +x;
	      if (alpha) {
	        if (x > 0) {
	          alpha = x;
	        } else {
	          timer.c = null, timer.t = NaN, timer = null;
	          event.end({
	            type: "end",
	            alpha: alpha = 0
	          });
	        }
	      } else if (x > 0) {
	        event.start({
	          type: "start",
	          alpha: alpha = x
	        });
	        timer = d3_timer(force.tick);
	      }
	      return force;
	    };
	    force.start = function() {
	      var i, n = nodes.length, m = links.length, w = size[0], h = size[1], neighbors, o;
	      for (i = 0; i < n; ++i) {
	        (o = nodes[i]).index = i;
	        o.weight = 0;
	      }
	      for (i = 0; i < m; ++i) {
	        o = links[i];
	        if (typeof o.source == "number") o.source = nodes[o.source];
	        if (typeof o.target == "number") o.target = nodes[o.target];
	        ++o.source.weight;
	        ++o.target.weight;
	      }
	      for (i = 0; i < n; ++i) {
	        o = nodes[i];
	        if (isNaN(o.x)) o.x = position("x", w);
	        if (isNaN(o.y)) o.y = position("y", h);
	        if (isNaN(o.px)) o.px = o.x;
	        if (isNaN(o.py)) o.py = o.y;
	      }
	      distances = [];
	      if (typeof linkDistance === "function") for (i = 0; i < m; ++i) distances[i] = +linkDistance.call(this, links[i], i); else for (i = 0; i < m; ++i) distances[i] = linkDistance;
	      strengths = [];
	      if (typeof linkStrength === "function") for (i = 0; i < m; ++i) strengths[i] = +linkStrength.call(this, links[i], i); else for (i = 0; i < m; ++i) strengths[i] = linkStrength;
	      charges = [];
	      if (typeof charge === "function") for (i = 0; i < n; ++i) charges[i] = +charge.call(this, nodes[i], i); else for (i = 0; i < n; ++i) charges[i] = charge;
	      function position(dimension, size) {
	        if (!neighbors) {
	          neighbors = new Array(n);
	          for (j = 0; j < n; ++j) {
	            neighbors[j] = [];
	          }
	          for (j = 0; j < m; ++j) {
	            var o = links[j];
	            neighbors[o.source.index].push(o.target);
	            neighbors[o.target.index].push(o.source);
	          }
	        }
	        var candidates = neighbors[i], j = -1, l = candidates.length, x;
	        while (++j < l) if (!isNaN(x = candidates[j][dimension])) return x;
	        return Math.random() * size;
	      }
	      return force.resume();
	    };
	    force.resume = function() {
	      return force.alpha(.1);
	    };
	    force.stop = function() {
	      return force.alpha(0);
	    };
	    force.drag = function() {
	      if (!drag) drag = d3.behavior.drag().origin(d3_identity).on("dragstart.force", d3_layout_forceDragstart).on("drag.force", dragmove).on("dragend.force", d3_layout_forceDragend);
	      if (!arguments.length) return drag;
	      this.on("mouseover.force", d3_layout_forceMouseover).on("mouseout.force", d3_layout_forceMouseout).call(drag);
	    };
	    function dragmove(d) {
	      d.px = d3.event.x, d.py = d3.event.y;
	      force.resume();
	    }
	    return d3.rebind(force, event, "on");
	  };
	  function d3_layout_forceDragstart(d) {
	    d.fixed |= 2;
	  }
	  function d3_layout_forceDragend(d) {
	    d.fixed &= ~6;
	  }
	  function d3_layout_forceMouseover(d) {
	    d.fixed |= 4;
	    d.px = d.x, d.py = d.y;
	  }
	  function d3_layout_forceMouseout(d) {
	    d.fixed &= ~4;
	  }
	  function d3_layout_forceAccumulate(quad, alpha, charges) {
	    var cx = 0, cy = 0;
	    quad.charge = 0;
	    if (!quad.leaf) {
	      var nodes = quad.nodes, n = nodes.length, i = -1, c;
	      while (++i < n) {
	        c = nodes[i];
	        if (c == null) continue;
	        d3_layout_forceAccumulate(c, alpha, charges);
	        quad.charge += c.charge;
	        cx += c.charge * c.cx;
	        cy += c.charge * c.cy;
	      }
	    }
	    if (quad.point) {
	      if (!quad.leaf) {
	        quad.point.x += Math.random() - .5;
	        quad.point.y += Math.random() - .5;
	      }
	      var k = alpha * charges[quad.point.index];
	      quad.charge += quad.pointCharge = k;
	      cx += k * quad.point.x;
	      cy += k * quad.point.y;
	    }
	    quad.cx = cx / quad.charge;
	    quad.cy = cy / quad.charge;
	  }
	  var d3_layout_forceLinkDistance = 20, d3_layout_forceLinkStrength = 1, d3_layout_forceChargeDistance2 = Infinity;
	  d3.layout.hierarchy = function() {
	    var sort = d3_layout_hierarchySort, children = d3_layout_hierarchyChildren, value = d3_layout_hierarchyValue;
	    function hierarchy(root) {
	      var stack = [ root ], nodes = [], node;
	      root.depth = 0;
	      while ((node = stack.pop()) != null) {
	        nodes.push(node);
	        if ((childs = children.call(hierarchy, node, node.depth)) && (n = childs.length)) {
	          var n, childs, child;
	          while (--n >= 0) {
	            stack.push(child = childs[n]);
	            child.parent = node;
	            child.depth = node.depth + 1;
	          }
	          if (value) node.value = 0;
	          node.children = childs;
	        } else {
	          if (value) node.value = +value.call(hierarchy, node, node.depth) || 0;
	          delete node.children;
	        }
	      }
	      d3_layout_hierarchyVisitAfter(root, function(node) {
	        var childs, parent;
	        if (sort && (childs = node.children)) childs.sort(sort);
	        if (value && (parent = node.parent)) parent.value += node.value;
	      });
	      return nodes;
	    }
	    hierarchy.sort = function(x) {
	      if (!arguments.length) return sort;
	      sort = x;
	      return hierarchy;
	    };
	    hierarchy.children = function(x) {
	      if (!arguments.length) return children;
	      children = x;
	      return hierarchy;
	    };
	    hierarchy.value = function(x) {
	      if (!arguments.length) return value;
	      value = x;
	      return hierarchy;
	    };
	    hierarchy.revalue = function(root) {
	      if (value) {
	        d3_layout_hierarchyVisitBefore(root, function(node) {
	          if (node.children) node.value = 0;
	        });
	        d3_layout_hierarchyVisitAfter(root, function(node) {
	          var parent;
	          if (!node.children) node.value = +value.call(hierarchy, node, node.depth) || 0;
	          if (parent = node.parent) parent.value += node.value;
	        });
	      }
	      return root;
	    };
	    return hierarchy;
	  };
	  function d3_layout_hierarchyRebind(object, hierarchy) {
	    d3.rebind(object, hierarchy, "sort", "children", "value");
	    object.nodes = object;
	    object.links = d3_layout_hierarchyLinks;
	    return object;
	  }
	  function d3_layout_hierarchyVisitBefore(node, callback) {
	    var nodes = [ node ];
	    while ((node = nodes.pop()) != null) {
	      callback(node);
	      if ((children = node.children) && (n = children.length)) {
	        var n, children;
	        while (--n >= 0) nodes.push(children[n]);
	      }
	    }
	  }
	  function d3_layout_hierarchyVisitAfter(node, callback) {
	    var nodes = [ node ], nodes2 = [];
	    while ((node = nodes.pop()) != null) {
	      nodes2.push(node);
	      if ((children = node.children) && (n = children.length)) {
	        var i = -1, n, children;
	        while (++i < n) nodes.push(children[i]);
	      }
	    }
	    while ((node = nodes2.pop()) != null) {
	      callback(node);
	    }
	  }
	  function d3_layout_hierarchyChildren(d) {
	    return d.children;
	  }
	  function d3_layout_hierarchyValue(d) {
	    return d.value;
	  }
	  function d3_layout_hierarchySort(a, b) {
	    return b.value - a.value;
	  }
	  function d3_layout_hierarchyLinks(nodes) {
	    return d3.merge(nodes.map(function(parent) {
	      return (parent.children || []).map(function(child) {
	        return {
	          source: parent,
	          target: child
	        };
	      });
	    }));
	  }
	  d3.layout.partition = function() {
	    var hierarchy = d3.layout.hierarchy(), size = [ 1, 1 ];
	    function position(node, x, dx, dy) {
	      var children = node.children;
	      node.x = x;
	      node.y = node.depth * dy;
	      node.dx = dx;
	      node.dy = dy;
	      if (children && (n = children.length)) {
	        var i = -1, n, c, d;
	        dx = node.value ? dx / node.value : 0;
	        while (++i < n) {
	          position(c = children[i], x, d = c.value * dx, dy);
	          x += d;
	        }
	      }
	    }
	    function depth(node) {
	      var children = node.children, d = 0;
	      if (children && (n = children.length)) {
	        var i = -1, n;
	        while (++i < n) d = Math.max(d, depth(children[i]));
	      }
	      return 1 + d;
	    }
	    function partition(d, i) {
	      var nodes = hierarchy.call(this, d, i);
	      position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));
	      return nodes;
	    }
	    partition.size = function(x) {
	      if (!arguments.length) return size;
	      size = x;
	      return partition;
	    };
	    return d3_layout_hierarchyRebind(partition, hierarchy);
	  };
	  d3.layout.pie = function() {
	    var value = Number, sort = d3_layout_pieSortByValue, startAngle = 0, endAngle = τ, padAngle = 0;
	    function pie(data) {
	      var n = data.length, values = data.map(function(d, i) {
	        return +value.call(pie, d, i);
	      }), a = +(typeof startAngle === "function" ? startAngle.apply(this, arguments) : startAngle), da = (typeof endAngle === "function" ? endAngle.apply(this, arguments) : endAngle) - a, p = Math.min(Math.abs(da) / n, +(typeof padAngle === "function" ? padAngle.apply(this, arguments) : padAngle)), pa = p * (da < 0 ? -1 : 1), sum = d3.sum(values), k = sum ? (da - n * pa) / sum : 0, index = d3.range(n), arcs = [], v;
	      if (sort != null) index.sort(sort === d3_layout_pieSortByValue ? function(i, j) {
	        return values[j] - values[i];
	      } : function(i, j) {
	        return sort(data[i], data[j]);
	      });
	      index.forEach(function(i) {
	        arcs[i] = {
	          data: data[i],
	          value: v = values[i],
	          startAngle: a,
	          endAngle: a += v * k + pa,
	          padAngle: p
	        };
	      });
	      return arcs;
	    }
	    pie.value = function(_) {
	      if (!arguments.length) return value;
	      value = _;
	      return pie;
	    };
	    pie.sort = function(_) {
	      if (!arguments.length) return sort;
	      sort = _;
	      return pie;
	    };
	    pie.startAngle = function(_) {
	      if (!arguments.length) return startAngle;
	      startAngle = _;
	      return pie;
	    };
	    pie.endAngle = function(_) {
	      if (!arguments.length) return endAngle;
	      endAngle = _;
	      return pie;
	    };
	    pie.padAngle = function(_) {
	      if (!arguments.length) return padAngle;
	      padAngle = _;
	      return pie;
	    };
	    return pie;
	  };
	  var d3_layout_pieSortByValue = {};
	  d3.layout.stack = function() {
	    var values = d3_identity, order = d3_layout_stackOrderDefault, offset = d3_layout_stackOffsetZero, out = d3_layout_stackOut, x = d3_layout_stackX, y = d3_layout_stackY;
	    function stack(data, index) {
	      if (!(n = data.length)) return data;
	      var series = data.map(function(d, i) {
	        return values.call(stack, d, i);
	      });
	      var points = series.map(function(d) {
	        return d.map(function(v, i) {
	          return [ x.call(stack, v, i), y.call(stack, v, i) ];
	        });
	      });
	      var orders = order.call(stack, points, index);
	      series = d3.permute(series, orders);
	      points = d3.permute(points, orders);
	      var offsets = offset.call(stack, points, index);
	      var m = series[0].length, n, i, j, o;
	      for (j = 0; j < m; ++j) {
	        out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);
	        for (i = 1; i < n; ++i) {
	          out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);
	        }
	      }
	      return data;
	    }
	    stack.values = function(x) {
	      if (!arguments.length) return values;
	      values = x;
	      return stack;
	    };
	    stack.order = function(x) {
	      if (!arguments.length) return order;
	      order = typeof x === "function" ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault;
	      return stack;
	    };
	    stack.offset = function(x) {
	      if (!arguments.length) return offset;
	      offset = typeof x === "function" ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero;
	      return stack;
	    };
	    stack.x = function(z) {
	      if (!arguments.length) return x;
	      x = z;
	      return stack;
	    };
	    stack.y = function(z) {
	      if (!arguments.length) return y;
	      y = z;
	      return stack;
	    };
	    stack.out = function(z) {
	      if (!arguments.length) return out;
	      out = z;
	      return stack;
	    };
	    return stack;
	  };
	  function d3_layout_stackX(d) {
	    return d.x;
	  }
	  function d3_layout_stackY(d) {
	    return d.y;
	  }
	  function d3_layout_stackOut(d, y0, y) {
	    d.y0 = y0;
	    d.y = y;
	  }
	  var d3_layout_stackOrders = d3.map({
	    "inside-out": function(data) {
	      var n = data.length, i, j, max = data.map(d3_layout_stackMaxIndex), sums = data.map(d3_layout_stackReduceSum), index = d3.range(n).sort(function(a, b) {
	        return max[a] - max[b];
	      }), top = 0, bottom = 0, tops = [], bottoms = [];
	      for (i = 0; i < n; ++i) {
	        j = index[i];
	        if (top < bottom) {
	          top += sums[j];
	          tops.push(j);
	        } else {
	          bottom += sums[j];
	          bottoms.push(j);
	        }
	      }
	      return bottoms.reverse().concat(tops);
	    },
	    reverse: function(data) {
	      return d3.range(data.length).reverse();
	    },
	    "default": d3_layout_stackOrderDefault
	  });
	  var d3_layout_stackOffsets = d3.map({
	    silhouette: function(data) {
	      var n = data.length, m = data[0].length, sums = [], max = 0, i, j, o, y0 = [];
	      for (j = 0; j < m; ++j) {
	        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
	        if (o > max) max = o;
	        sums.push(o);
	      }
	      for (j = 0; j < m; ++j) {
	        y0[j] = (max - sums[j]) / 2;
	      }
	      return y0;
	    },
	    wiggle: function(data) {
	      var n = data.length, x = data[0], m = x.length, i, j, k, s1, s2, s3, dx, o, o0, y0 = [];
	      y0[0] = o = o0 = 0;
	      for (j = 1; j < m; ++j) {
	        for (i = 0, s1 = 0; i < n; ++i) s1 += data[i][j][1];
	        for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; i < n; ++i) {
	          for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); k < i; ++k) {
	            s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;
	          }
	          s2 += s3 * data[i][j][1];
	        }
	        y0[j] = o -= s1 ? s2 / s1 * dx : 0;
	        if (o < o0) o0 = o;
	      }
	      for (j = 0; j < m; ++j) y0[j] -= o0;
	      return y0;
	    },
	    expand: function(data) {
	      var n = data.length, m = data[0].length, k = 1 / n, i, j, o, y0 = [];
	      for (j = 0; j < m; ++j) {
	        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
	        if (o) for (i = 0; i < n; i++) data[i][j][1] /= o; else for (i = 0; i < n; i++) data[i][j][1] = k;
	      }
	      for (j = 0; j < m; ++j) y0[j] = 0;
	      return y0;
	    },
	    zero: d3_layout_stackOffsetZero
	  });
	  function d3_layout_stackOrderDefault(data) {
	    return d3.range(data.length);
	  }
	  function d3_layout_stackOffsetZero(data) {
	    var j = -1, m = data[0].length, y0 = [];
	    while (++j < m) y0[j] = 0;
	    return y0;
	  }
	  function d3_layout_stackMaxIndex(array) {
	    var i = 1, j = 0, v = array[0][1], k, n = array.length;
	    for (;i < n; ++i) {
	      if ((k = array[i][1]) > v) {
	        j = i;
	        v = k;
	      }
	    }
	    return j;
	  }
	  function d3_layout_stackReduceSum(d) {
	    return d.reduce(d3_layout_stackSum, 0);
	  }
	  function d3_layout_stackSum(p, d) {
	    return p + d[1];
	  }
	  d3.layout.histogram = function() {
	    var frequency = true, valuer = Number, ranger = d3_layout_histogramRange, binner = d3_layout_histogramBinSturges;
	    function histogram(data, i) {
	      var bins = [], values = data.map(valuer, this), range = ranger.call(this, values, i), thresholds = binner.call(this, range, values, i), bin, i = -1, n = values.length, m = thresholds.length - 1, k = frequency ? 1 : 1 / n, x;
	      while (++i < m) {
	        bin = bins[i] = [];
	        bin.dx = thresholds[i + 1] - (bin.x = thresholds[i]);
	        bin.y = 0;
	      }
	      if (m > 0) {
	        i = -1;
	        while (++i < n) {
	          x = values[i];
	          if (x >= range[0] && x <= range[1]) {
	            bin = bins[d3.bisect(thresholds, x, 1, m) - 1];
	            bin.y += k;
	            bin.push(data[i]);
	          }
	        }
	      }
	      return bins;
	    }
	    histogram.value = function(x) {
	      if (!arguments.length) return valuer;
	      valuer = x;
	      return histogram;
	    };
	    histogram.range = function(x) {
	      if (!arguments.length) return ranger;
	      ranger = d3_functor(x);
	      return histogram;
	    };
	    histogram.bins = function(x) {
	      if (!arguments.length) return binner;
	      binner = typeof x === "number" ? function(range) {
	        return d3_layout_histogramBinFixed(range, x);
	      } : d3_functor(x);
	      return histogram;
	    };
	    histogram.frequency = function(x) {
	      if (!arguments.length) return frequency;
	      frequency = !!x;
	      return histogram;
	    };
	    return histogram;
	  };
	  function d3_layout_histogramBinSturges(range, values) {
	    return d3_layout_histogramBinFixed(range, Math.ceil(Math.log(values.length) / Math.LN2 + 1));
	  }
	  function d3_layout_histogramBinFixed(range, n) {
	    var x = -1, b = +range[0], m = (range[1] - b) / n, f = [];
	    while (++x <= n) f[x] = m * x + b;
	    return f;
	  }
	  function d3_layout_histogramRange(values) {
	    return [ d3.min(values), d3.max(values) ];
	  }
	  d3.layout.pack = function() {
	    var hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort), padding = 0, size = [ 1, 1 ], radius;
	    function pack(d, i) {
	      var nodes = hierarchy.call(this, d, i), root = nodes[0], w = size[0], h = size[1], r = radius == null ? Math.sqrt : typeof radius === "function" ? radius : function() {
	        return radius;
	      };
	      root.x = root.y = 0;
	      d3_layout_hierarchyVisitAfter(root, function(d) {
	        d.r = +r(d.value);
	      });
	      d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
	      if (padding) {
	        var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2;
	        d3_layout_hierarchyVisitAfter(root, function(d) {
	          d.r += dr;
	        });
	        d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
	        d3_layout_hierarchyVisitAfter(root, function(d) {
	          d.r -= dr;
	        });
	      }
	      d3_layout_packTransform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h));
	      return nodes;
	    }
	    pack.size = function(_) {
	      if (!arguments.length) return size;
	      size = _;
	      return pack;
	    };
	    pack.radius = function(_) {
	      if (!arguments.length) return radius;
	      radius = _ == null || typeof _ === "function" ? _ : +_;
	      return pack;
	    };
	    pack.padding = function(_) {
	      if (!arguments.length) return padding;
	      padding = +_;
	      return pack;
	    };
	    return d3_layout_hierarchyRebind(pack, hierarchy);
	  };
	  function d3_layout_packSort(a, b) {
	    return a.value - b.value;
	  }
	  function d3_layout_packInsert(a, b) {
	    var c = a._pack_next;
	    a._pack_next = b;
	    b._pack_prev = a;
	    b._pack_next = c;
	    c._pack_prev = b;
	  }
	  function d3_layout_packSplice(a, b) {
	    a._pack_next = b;
	    b._pack_prev = a;
	  }
	  function d3_layout_packIntersects(a, b) {
	    var dx = b.x - a.x, dy = b.y - a.y, dr = a.r + b.r;
	    return .999 * dr * dr > dx * dx + dy * dy;
	  }
	  function d3_layout_packSiblings(node) {
	    if (!(nodes = node.children) || !(n = nodes.length)) return;
	    var nodes, xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity, a, b, c, i, j, k, n;
	    function bound(node) {
	      xMin = Math.min(node.x - node.r, xMin);
	      xMax = Math.max(node.x + node.r, xMax);
	      yMin = Math.min(node.y - node.r, yMin);
	      yMax = Math.max(node.y + node.r, yMax);
	    }
	    nodes.forEach(d3_layout_packLink);
	    a = nodes[0];
	    a.x = -a.r;
	    a.y = 0;
	    bound(a);
	    if (n > 1) {
	      b = nodes[1];
	      b.x = b.r;
	      b.y = 0;
	      bound(b);
	      if (n > 2) {
	        c = nodes[2];
	        d3_layout_packPlace(a, b, c);
	        bound(c);
	        d3_layout_packInsert(a, c);
	        a._pack_prev = c;
	        d3_layout_packInsert(c, b);
	        b = a._pack_next;
	        for (i = 3; i < n; i++) {
	          d3_layout_packPlace(a, b, c = nodes[i]);
	          var isect = 0, s1 = 1, s2 = 1;
	          for (j = b._pack_next; j !== b; j = j._pack_next, s1++) {
	            if (d3_layout_packIntersects(j, c)) {
	              isect = 1;
	              break;
	            }
	          }
	          if (isect == 1) {
	            for (k = a._pack_prev; k !== j._pack_prev; k = k._pack_prev, s2++) {
	              if (d3_layout_packIntersects(k, c)) {
	                break;
	              }
	            }
	          }
	          if (isect) {
	            if (s1 < s2 || s1 == s2 && b.r < a.r) d3_layout_packSplice(a, b = j); else d3_layout_packSplice(a = k, b);
	            i--;
	          } else {
	            d3_layout_packInsert(a, c);
	            b = c;
	            bound(c);
	          }
	        }
	      }
	    }
	    var cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2, cr = 0;
	    for (i = 0; i < n; i++) {
	      c = nodes[i];
	      c.x -= cx;
	      c.y -= cy;
	      cr = Math.max(cr, c.r + Math.sqrt(c.x * c.x + c.y * c.y));
	    }
	    node.r = cr;
	    nodes.forEach(d3_layout_packUnlink);
	  }
	  function d3_layout_packLink(node) {
	    node._pack_next = node._pack_prev = node;
	  }
	  function d3_layout_packUnlink(node) {
	    delete node._pack_next;
	    delete node._pack_prev;
	  }
	  function d3_layout_packTransform(node, x, y, k) {
	    var children = node.children;
	    node.x = x += k * node.x;
	    node.y = y += k * node.y;
	    node.r *= k;
	    if (children) {
	      var i = -1, n = children.length;
	      while (++i < n) d3_layout_packTransform(children[i], x, y, k);
	    }
	  }
	  function d3_layout_packPlace(a, b, c) {
	    var db = a.r + c.r, dx = b.x - a.x, dy = b.y - a.y;
	    if (db && (dx || dy)) {
	      var da = b.r + c.r, dc = dx * dx + dy * dy;
	      da *= da;
	      db *= db;
	      var x = .5 + (db - da) / (2 * dc), y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
	      c.x = a.x + x * dx + y * dy;
	      c.y = a.y + x * dy - y * dx;
	    } else {
	      c.x = a.x + db;
	      c.y = a.y;
	    }
	  }
	  d3.layout.tree = function() {
	    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = null;
	    function tree(d, i) {
	      var nodes = hierarchy.call(this, d, i), root0 = nodes[0], root1 = wrapTree(root0);
	      d3_layout_hierarchyVisitAfter(root1, firstWalk), root1.parent.m = -root1.z;
	      d3_layout_hierarchyVisitBefore(root1, secondWalk);
	      if (nodeSize) d3_layout_hierarchyVisitBefore(root0, sizeNode); else {
	        var left = root0, right = root0, bottom = root0;
	        d3_layout_hierarchyVisitBefore(root0, function(node) {
	          if (node.x < left.x) left = node;
	          if (node.x > right.x) right = node;
	          if (node.depth > bottom.depth) bottom = node;
	        });
	        var tx = separation(left, right) / 2 - left.x, kx = size[0] / (right.x + separation(right, left) / 2 + tx), ky = size[1] / (bottom.depth || 1);
	        d3_layout_hierarchyVisitBefore(root0, function(node) {
	          node.x = (node.x + tx) * kx;
	          node.y = node.depth * ky;
	        });
	      }
	      return nodes;
	    }
	    function wrapTree(root0) {
	      var root1 = {
	        A: null,
	        children: [ root0 ]
	      }, queue = [ root1 ], node1;
	      while ((node1 = queue.pop()) != null) {
	        for (var children = node1.children, child, i = 0, n = children.length; i < n; ++i) {
	          queue.push((children[i] = child = {
	            _: children[i],
	            parent: node1,
	            children: (child = children[i].children) && child.slice() || [],
	            A: null,
	            a: null,
	            z: 0,
	            m: 0,
	            c: 0,
	            s: 0,
	            t: null,
	            i: i
	          }).a = child);
	        }
	      }
	      return root1.children[0];
	    }
	    function firstWalk(v) {
	      var children = v.children, siblings = v.parent.children, w = v.i ? siblings[v.i - 1] : null;
	      if (children.length) {
	        d3_layout_treeShift(v);
	        var midpoint = (children[0].z + children[children.length - 1].z) / 2;
	        if (w) {
	          v.z = w.z + separation(v._, w._);
	          v.m = v.z - midpoint;
	        } else {
	          v.z = midpoint;
	        }
	      } else if (w) {
	        v.z = w.z + separation(v._, w._);
	      }
	      v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
	    }
	    function secondWalk(v) {
	      v._.x = v.z + v.parent.m;
	      v.m += v.parent.m;
	    }
	    function apportion(v, w, ancestor) {
	      if (w) {
	        var vip = v, vop = v, vim = w, vom = vip.parent.children[0], sip = vip.m, sop = vop.m, sim = vim.m, som = vom.m, shift;
	        while (vim = d3_layout_treeRight(vim), vip = d3_layout_treeLeft(vip), vim && vip) {
	          vom = d3_layout_treeLeft(vom);
	          vop = d3_layout_treeRight(vop);
	          vop.a = v;
	          shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);
	          if (shift > 0) {
	            d3_layout_treeMove(d3_layout_treeAncestor(vim, v, ancestor), v, shift);
	            sip += shift;
	            sop += shift;
	          }
	          sim += vim.m;
	          sip += vip.m;
	          som += vom.m;
	          sop += vop.m;
	        }
	        if (vim && !d3_layout_treeRight(vop)) {
	          vop.t = vim;
	          vop.m += sim - sop;
	        }
	        if (vip && !d3_layout_treeLeft(vom)) {
	          vom.t = vip;
	          vom.m += sip - som;
	          ancestor = v;
	        }
	      }
	      return ancestor;
	    }
	    function sizeNode(node) {
	      node.x *= size[0];
	      node.y = node.depth * size[1];
	    }
	    tree.separation = function(x) {
	      if (!arguments.length) return separation;
	      separation = x;
	      return tree;
	    };
	    tree.size = function(x) {
	      if (!arguments.length) return nodeSize ? null : size;
	      nodeSize = (size = x) == null ? sizeNode : null;
	      return tree;
	    };
	    tree.nodeSize = function(x) {
	      if (!arguments.length) return nodeSize ? size : null;
	      nodeSize = (size = x) == null ? null : sizeNode;
	      return tree;
	    };
	    return d3_layout_hierarchyRebind(tree, hierarchy);
	  };
	  function d3_layout_treeSeparation(a, b) {
	    return a.parent == b.parent ? 1 : 2;
	  }
	  function d3_layout_treeLeft(v) {
	    var children = v.children;
	    return children.length ? children[0] : v.t;
	  }
	  function d3_layout_treeRight(v) {
	    var children = v.children, n;
	    return (n = children.length) ? children[n - 1] : v.t;
	  }
	  function d3_layout_treeMove(wm, wp, shift) {
	    var change = shift / (wp.i - wm.i);
	    wp.c -= change;
	    wp.s += shift;
	    wm.c += change;
	    wp.z += shift;
	    wp.m += shift;
	  }
	  function d3_layout_treeShift(v) {
	    var shift = 0, change = 0, children = v.children, i = children.length, w;
	    while (--i >= 0) {
	      w = children[i];
	      w.z += shift;
	      w.m += shift;
	      shift += w.s + (change += w.c);
	    }
	  }
	  function d3_layout_treeAncestor(vim, v, ancestor) {
	    return vim.a.parent === v.parent ? vim.a : ancestor;
	  }
	  d3.layout.cluster = function() {
	    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false;
	    function cluster(d, i) {
	      var nodes = hierarchy.call(this, d, i), root = nodes[0], previousNode, x = 0;
	      d3_layout_hierarchyVisitAfter(root, function(node) {
	        var children = node.children;
	        if (children && children.length) {
	          node.x = d3_layout_clusterX(children);
	          node.y = d3_layout_clusterY(children);
	        } else {
	          node.x = previousNode ? x += separation(node, previousNode) : 0;
	          node.y = 0;
	          previousNode = node;
	        }
	      });
	      var left = d3_layout_clusterLeft(root), right = d3_layout_clusterRight(root), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2;
	      d3_layout_hierarchyVisitAfter(root, nodeSize ? function(node) {
	        node.x = (node.x - root.x) * size[0];
	        node.y = (root.y - node.y) * size[1];
	      } : function(node) {
	        node.x = (node.x - x0) / (x1 - x0) * size[0];
	        node.y = (1 - (root.y ? node.y / root.y : 1)) * size[1];
	      });
	      return nodes;
	    }
	    cluster.separation = function(x) {
	      if (!arguments.length) return separation;
	      separation = x;
	      return cluster;
	    };
	    cluster.size = function(x) {
	      if (!arguments.length) return nodeSize ? null : size;
	      nodeSize = (size = x) == null;
	      return cluster;
	    };
	    cluster.nodeSize = function(x) {
	      if (!arguments.length) return nodeSize ? size : null;
	      nodeSize = (size = x) != null;
	      return cluster;
	    };
	    return d3_layout_hierarchyRebind(cluster, hierarchy);
	  };
	  function d3_layout_clusterY(children) {
	    return 1 + d3.max(children, function(child) {
	      return child.y;
	    });
	  }
	  function d3_layout_clusterX(children) {
	    return children.reduce(function(x, child) {
	      return x + child.x;
	    }, 0) / children.length;
	  }
	  function d3_layout_clusterLeft(node) {
	    var children = node.children;
	    return children && children.length ? d3_layout_clusterLeft(children[0]) : node;
	  }
	  function d3_layout_clusterRight(node) {
	    var children = node.children, n;
	    return children && (n = children.length) ? d3_layout_clusterRight(children[n - 1]) : node;
	  }
	  d3.layout.treemap = function() {
	    var hierarchy = d3.layout.hierarchy(), round = Math.round, size = [ 1, 1 ], padding = null, pad = d3_layout_treemapPadNull, sticky = false, stickies, mode = "squarify", ratio = .5 * (1 + Math.sqrt(5));
	    function scale(children, k) {
	      var i = -1, n = children.length, child, area;
	      while (++i < n) {
	        area = (child = children[i]).value * (k < 0 ? 0 : k);
	        child.area = isNaN(area) || area <= 0 ? 0 : area;
	      }
	    }
	    function squarify(node) {
	      var children = node.children;
	      if (children && children.length) {
	        var rect = pad(node), row = [], remaining = children.slice(), child, best = Infinity, score, u = mode === "slice" ? rect.dx : mode === "dice" ? rect.dy : mode === "slice-dice" ? node.depth & 1 ? rect.dy : rect.dx : Math.min(rect.dx, rect.dy), n;
	        scale(remaining, rect.dx * rect.dy / node.value);
	        row.area = 0;
	        while ((n = remaining.length) > 0) {
	          row.push(child = remaining[n - 1]);
	          row.area += child.area;
	          if (mode !== "squarify" || (score = worst(row, u)) <= best) {
	            remaining.pop();
	            best = score;
	          } else {
	            row.area -= row.pop().area;
	            position(row, u, rect, false);
	            u = Math.min(rect.dx, rect.dy);
	            row.length = row.area = 0;
	            best = Infinity;
	          }
	        }
	        if (row.length) {
	          position(row, u, rect, true);
	          row.length = row.area = 0;
	        }
	        children.forEach(squarify);
	      }
	    }
	    function stickify(node) {
	      var children = node.children;
	      if (children && children.length) {
	        var rect = pad(node), remaining = children.slice(), child, row = [];
	        scale(remaining, rect.dx * rect.dy / node.value);
	        row.area = 0;
	        while (child = remaining.pop()) {
	          row.push(child);
	          row.area += child.area;
	          if (child.z != null) {
	            position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length);
	            row.length = row.area = 0;
	          }
	        }
	        children.forEach(stickify);
	      }
	    }
	    function worst(row, u) {
	      var s = row.area, r, rmax = 0, rmin = Infinity, i = -1, n = row.length;
	      while (++i < n) {
	        if (!(r = row[i].area)) continue;
	        if (r < rmin) rmin = r;
	        if (r > rmax) rmax = r;
	      }
	      s *= s;
	      u *= u;
	      return s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : Infinity;
	    }
	    function position(row, u, rect, flush) {
	      var i = -1, n = row.length, x = rect.x, y = rect.y, v = u ? round(row.area / u) : 0, o;
	      if (u == rect.dx) {
	        if (flush || v > rect.dy) v = rect.dy;
	        while (++i < n) {
	          o = row[i];
	          o.x = x;
	          o.y = y;
	          o.dy = v;
	          x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0);
	        }
	        o.z = true;
	        o.dx += rect.x + rect.dx - x;
	        rect.y += v;
	        rect.dy -= v;
	      } else {
	        if (flush || v > rect.dx) v = rect.dx;
	        while (++i < n) {
	          o = row[i];
	          o.x = x;
	          o.y = y;
	          o.dx = v;
	          y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0);
	        }
	        o.z = false;
	        o.dy += rect.y + rect.dy - y;
	        rect.x += v;
	        rect.dx -= v;
	      }
	    }
	    function treemap(d) {
	      var nodes = stickies || hierarchy(d), root = nodes[0];
	      root.x = root.y = 0;
	      if (root.value) root.dx = size[0], root.dy = size[1]; else root.dx = root.dy = 0;
	      if (stickies) hierarchy.revalue(root);
	      scale([ root ], root.dx * root.dy / root.value);
	      (stickies ? stickify : squarify)(root);
	      if (sticky) stickies = nodes;
	      return nodes;
	    }
	    treemap.size = function(x) {
	      if (!arguments.length) return size;
	      size = x;
	      return treemap;
	    };
	    treemap.padding = function(x) {
	      if (!arguments.length) return padding;
	      function padFunction(node) {
	        var p = x.call(treemap, node, node.depth);
	        return p == null ? d3_layout_treemapPadNull(node) : d3_layout_treemapPad(node, typeof p === "number" ? [ p, p, p, p ] : p);
	      }
	      function padConstant(node) {
	        return d3_layout_treemapPad(node, x);
	      }
	      var type;
	      pad = (padding = x) == null ? d3_layout_treemapPadNull : (type = typeof x) === "function" ? padFunction : type === "number" ? (x = [ x, x, x, x ], 
	      padConstant) : padConstant;
	      return treemap;
	    };
	    treemap.round = function(x) {
	      if (!arguments.length) return round != Number;
	      round = x ? Math.round : Number;
	      return treemap;
	    };
	    treemap.sticky = function(x) {
	      if (!arguments.length) return sticky;
	      sticky = x;
	      stickies = null;
	      return treemap;
	    };
	    treemap.ratio = function(x) {
	      if (!arguments.length) return ratio;
	      ratio = x;
	      return treemap;
	    };
	    treemap.mode = function(x) {
	      if (!arguments.length) return mode;
	      mode = x + "";
	      return treemap;
	    };
	    return d3_layout_hierarchyRebind(treemap, hierarchy);
	  };
	  function d3_layout_treemapPadNull(node) {
	    return {
	      x: node.x,
	      y: node.y,
	      dx: node.dx,
	      dy: node.dy
	    };
	  }
	  function d3_layout_treemapPad(node, padding) {
	    var x = node.x + padding[3], y = node.y + padding[0], dx = node.dx - padding[1] - padding[3], dy = node.dy - padding[0] - padding[2];
	    if (dx < 0) {
	      x += dx / 2;
	      dx = 0;
	    }
	    if (dy < 0) {
	      y += dy / 2;
	      dy = 0;
	    }
	    return {
	      x: x,
	      y: y,
	      dx: dx,
	      dy: dy
	    };
	  }
	  d3.random = {
	    normal: function(µ, σ) {
	      var n = arguments.length;
	      if (n < 2) σ = 1;
	      if (n < 1) µ = 0;
	      return function() {
	        var x, y, r;
	        do {
	          x = Math.random() * 2 - 1;
	          y = Math.random() * 2 - 1;
	          r = x * x + y * y;
	        } while (!r || r > 1);
	        return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r);
	      };
	    },
	    logNormal: function() {
	      var random = d3.random.normal.apply(d3, arguments);
	      return function() {
	        return Math.exp(random());
	      };
	    },
	    bates: function(m) {
	      var random = d3.random.irwinHall(m);
	      return function() {
	        return random() / m;
	      };
	    },
	    irwinHall: function(m) {
	      return function() {
	        for (var s = 0, j = 0; j < m; j++) s += Math.random();
	        return s;
	      };
	    }
	  };
	  d3.scale = {};
	  function d3_scaleExtent(domain) {
	    var start = domain[0], stop = domain[domain.length - 1];
	    return start < stop ? [ start, stop ] : [ stop, start ];
	  }
	  function d3_scaleRange(scale) {
	    return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
	  }
	  function d3_scale_bilinear(domain, range, uninterpolate, interpolate) {
	    var u = uninterpolate(domain[0], domain[1]), i = interpolate(range[0], range[1]);
	    return function(x) {
	      return i(u(x));
	    };
	  }
	  function d3_scale_nice(domain, nice) {
	    var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], dx;
	    if (x1 < x0) {
	      dx = i0, i0 = i1, i1 = dx;
	      dx = x0, x0 = x1, x1 = dx;
	    }
	    domain[i0] = nice.floor(x0);
	    domain[i1] = nice.ceil(x1);
	    return domain;
	  }
	  function d3_scale_niceStep(step) {
	    return step ? {
	      floor: function(x) {
	        return Math.floor(x / step) * step;
	      },
	      ceil: function(x) {
	        return Math.ceil(x / step) * step;
	      }
	    } : d3_scale_niceIdentity;
	  }
	  var d3_scale_niceIdentity = {
	    floor: d3_identity,
	    ceil: d3_identity
	  };
	  function d3_scale_polylinear(domain, range, uninterpolate, interpolate) {
	    var u = [], i = [], j = 0, k = Math.min(domain.length, range.length) - 1;
	    if (domain[k] < domain[0]) {
	      domain = domain.slice().reverse();
	      range = range.slice().reverse();
	    }
	    while (++j <= k) {
	      u.push(uninterpolate(domain[j - 1], domain[j]));
	      i.push(interpolate(range[j - 1], range[j]));
	    }
	    return function(x) {
	      var j = d3.bisect(domain, x, 1, k) - 1;
	      return i[j](u[j](x));
	    };
	  }
	  d3.scale.linear = function() {
	    return d3_scale_linear([ 0, 1 ], [ 0, 1 ], d3_interpolate, false);
	  };
	  function d3_scale_linear(domain, range, interpolate, clamp) {
	    var output, input;
	    function rescale() {
	      var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear, uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber;
	      output = linear(domain, range, uninterpolate, interpolate);
	      input = linear(range, domain, uninterpolate, d3_interpolate);
	      return scale;
	    }
	    function scale(x) {
	      return output(x);
	    }
	    scale.invert = function(y) {
	      return input(y);
	    };
	    scale.domain = function(x) {
	      if (!arguments.length) return domain;
	      domain = x.map(Number);
	      return rescale();
	    };
	    scale.range = function(x) {
	      if (!arguments.length) return range;
	      range = x;
	      return rescale();
	    };
	    scale.rangeRound = function(x) {
	      return scale.range(x).interpolate(d3_interpolateRound);
	    };
	    scale.clamp = function(x) {
	      if (!arguments.length) return clamp;
	      clamp = x;
	      return rescale();
	    };
	    scale.interpolate = function(x) {
	      if (!arguments.length) return interpolate;
	      interpolate = x;
	      return rescale();
	    };
	    scale.ticks = function(m) {
	      return d3_scale_linearTicks(domain, m);
	    };
	    scale.tickFormat = function(m, format) {
	      return d3_scale_linearTickFormat(domain, m, format);
	    };
	    scale.nice = function(m) {
	      d3_scale_linearNice(domain, m);
	      return rescale();
	    };
	    scale.copy = function() {
	      return d3_scale_linear(domain, range, interpolate, clamp);
	    };
	    return rescale();
	  }
	  function d3_scale_linearRebind(scale, linear) {
	    return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp");
	  }
	  function d3_scale_linearNice(domain, m) {
	    d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));
	    d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));
	    return domain;
	  }
	  function d3_scale_linearTickRange(domain, m) {
	    if (m == null) m = 10;
	    var extent = d3_scaleExtent(domain), span = extent[1] - extent[0], step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)), err = m / span * step;
	    if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;
	    extent[0] = Math.ceil(extent[0] / step) * step;
	    extent[1] = Math.floor(extent[1] / step) * step + step * .5;
	    extent[2] = step;
	    return extent;
	  }
	  function d3_scale_linearTicks(domain, m) {
	    return d3.range.apply(d3, d3_scale_linearTickRange(domain, m));
	  }
	  function d3_scale_linearTickFormat(domain, m, format) {
	    var range = d3_scale_linearTickRange(domain, m);
	    if (format) {
	      var match = d3_format_re.exec(format);
	      match.shift();
	      if (match[8] === "s") {
	        var prefix = d3.formatPrefix(Math.max(abs(range[0]), abs(range[1])));
	        if (!match[7]) match[7] = "." + d3_scale_linearPrecision(prefix.scale(range[2]));
	        match[8] = "f";
	        format = d3.format(match.join(""));
	        return function(d) {
	          return format(prefix.scale(d)) + prefix.symbol;
	        };
	      }
	      if (!match[7]) match[7] = "." + d3_scale_linearFormatPrecision(match[8], range);
	      format = match.join("");
	    } else {
	      format = ",." + d3_scale_linearPrecision(range[2]) + "f";
	    }
	    return d3.format(format);
	  }
	  var d3_scale_linearFormatSignificant = {
	    s: 1,
	    g: 1,
	    p: 1,
	    r: 1,
	    e: 1
	  };
	  function d3_scale_linearPrecision(value) {
	    return -Math.floor(Math.log(value) / Math.LN10 + .01);
	  }
	  function d3_scale_linearFormatPrecision(type, range) {
	    var p = d3_scale_linearPrecision(range[2]);
	    return type in d3_scale_linearFormatSignificant ? Math.abs(p - d3_scale_linearPrecision(Math.max(abs(range[0]), abs(range[1])))) + +(type !== "e") : p - (type === "%") * 2;
	  }
	  d3.scale.log = function() {
	    return d3_scale_log(d3.scale.linear().domain([ 0, 1 ]), 10, true, [ 1, 10 ]);
	  };
	  function d3_scale_log(linear, base, positive, domain) {
	    function log(x) {
	      return (positive ? Math.log(x < 0 ? 0 : x) : -Math.log(x > 0 ? 0 : -x)) / Math.log(base);
	    }
	    function pow(x) {
	      return positive ? Math.pow(base, x) : -Math.pow(base, -x);
	    }
	    function scale(x) {
	      return linear(log(x));
	    }
	    scale.invert = function(x) {
	      return pow(linear.invert(x));
	    };
	    scale.domain = function(x) {
	      if (!arguments.length) return domain;
	      positive = x[0] >= 0;
	      linear.domain((domain = x.map(Number)).map(log));
	      return scale;
	    };
	    scale.base = function(_) {
	      if (!arguments.length) return base;
	      base = +_;
	      linear.domain(domain.map(log));
	      return scale;
	    };
	    scale.nice = function() {
	      var niced = d3_scale_nice(domain.map(log), positive ? Math : d3_scale_logNiceNegative);
	      linear.domain(niced);
	      domain = niced.map(pow);
	      return scale;
	    };
	    scale.ticks = function() {
	      var extent = d3_scaleExtent(domain), ticks = [], u = extent[0], v = extent[1], i = Math.floor(log(u)), j = Math.ceil(log(v)), n = base % 1 ? 2 : base;
	      if (isFinite(j - i)) {
	        if (positive) {
	          for (;i < j; i++) for (var k = 1; k < n; k++) ticks.push(pow(i) * k);
	          ticks.push(pow(i));
	        } else {
	          ticks.push(pow(i));
	          for (;i++ < j; ) for (var k = n - 1; k > 0; k--) ticks.push(pow(i) * k);
	        }
	        for (i = 0; ticks[i] < u; i++) {}
	        for (j = ticks.length; ticks[j - 1] > v; j--) {}
	        ticks = ticks.slice(i, j);
	      }
	      return ticks;
	    };
	    scale.tickFormat = function(n, format) {
	      if (!arguments.length) return d3_scale_logFormat;
	      if (arguments.length < 2) format = d3_scale_logFormat; else if (typeof format !== "function") format = d3.format(format);
	      var k = Math.max(1, base * n / scale.ticks().length);
	      return function(d) {
	        var i = d / pow(Math.round(log(d)));
	        if (i * base < base - .5) i *= base;
	        return i <= k ? format(d) : "";
	      };
	    };
	    scale.copy = function() {
	      return d3_scale_log(linear.copy(), base, positive, domain);
	    };
	    return d3_scale_linearRebind(scale, linear);
	  }
	  var d3_scale_logFormat = d3.format(".0e"), d3_scale_logNiceNegative = {
	    floor: function(x) {
	      return -Math.ceil(-x);
	    },
	    ceil: function(x) {
	      return -Math.floor(-x);
	    }
	  };
	  d3.scale.pow = function() {
	    return d3_scale_pow(d3.scale.linear(), 1, [ 0, 1 ]);
	  };
	  function d3_scale_pow(linear, exponent, domain) {
	    var powp = d3_scale_powPow(exponent), powb = d3_scale_powPow(1 / exponent);
	    function scale(x) {
	      return linear(powp(x));
	    }
	    scale.invert = function(x) {
	      return powb(linear.invert(x));
	    };
	    scale.domain = function(x) {
	      if (!arguments.length) return domain;
	      linear.domain((domain = x.map(Number)).map(powp));
	      return scale;
	    };
	    scale.ticks = function(m) {
	      return d3_scale_linearTicks(domain, m);
	    };
	    scale.tickFormat = function(m, format) {
	      return d3_scale_linearTickFormat(domain, m, format);
	    };
	    scale.nice = function(m) {
	      return scale.domain(d3_scale_linearNice(domain, m));
	    };
	    scale.exponent = function(x) {
	      if (!arguments.length) return exponent;
	      powp = d3_scale_powPow(exponent = x);
	      powb = d3_scale_powPow(1 / exponent);
	      linear.domain(domain.map(powp));
	      return scale;
	    };
	    scale.copy = function() {
	      return d3_scale_pow(linear.copy(), exponent, domain);
	    };
	    return d3_scale_linearRebind(scale, linear);
	  }
	  function d3_scale_powPow(e) {
	    return function(x) {
	      return x < 0 ? -Math.pow(-x, e) : Math.pow(x, e);
	    };
	  }
	  d3.scale.sqrt = function() {
	    return d3.scale.pow().exponent(.5);
	  };
	  d3.scale.ordinal = function() {
	    return d3_scale_ordinal([], {
	      t: "range",
	      a: [ [] ]
	    });
	  };
	  function d3_scale_ordinal(domain, ranger) {
	    var index, range, rangeBand;
	    function scale(x) {
	      return range[((index.get(x) || (ranger.t === "range" ? index.set(x, domain.push(x)) : NaN)) - 1) % range.length];
	    }
	    function steps(start, step) {
	      return d3.range(domain.length).map(function(i) {
	        return start + step * i;
	      });
	    }
	    scale.domain = function(x) {
	      if (!arguments.length) return domain;
	      domain = [];
	      index = new d3_Map();
	      var i = -1, n = x.length, xi;
	      while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi));
	      return scale[ranger.t].apply(scale, ranger.a);
	    };
	    scale.range = function(x) {
	      if (!arguments.length) return range;
	      range = x;
	      rangeBand = 0;
	      ranger = {
	        t: "range",
	        a: arguments
	      };
	      return scale;
	    };
	    scale.rangePoints = function(x, padding) {
	      if (arguments.length < 2) padding = 0;
	      var start = x[0], stop = x[1], step = domain.length < 2 ? (start = (start + stop) / 2, 
	      0) : (stop - start) / (domain.length - 1 + padding);
	      range = steps(start + step * padding / 2, step);
	      rangeBand = 0;
	      ranger = {
	        t: "rangePoints",
	        a: arguments
	      };
	      return scale;
	    };
	    scale.rangeRoundPoints = function(x, padding) {
	      if (arguments.length < 2) padding = 0;
	      var start = x[0], stop = x[1], step = domain.length < 2 ? (start = stop = Math.round((start + stop) / 2), 
	      0) : (stop - start) / (domain.length - 1 + padding) | 0;
	      range = steps(start + Math.round(step * padding / 2 + (stop - start - (domain.length - 1 + padding) * step) / 2), step);
	      rangeBand = 0;
	      ranger = {
	        t: "rangeRoundPoints",
	        a: arguments
	      };
	      return scale;
	    };
	    scale.rangeBands = function(x, padding, outerPadding) {
	      if (arguments.length < 2) padding = 0;
	      if (arguments.length < 3) outerPadding = padding;
	      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = (stop - start) / (domain.length - padding + 2 * outerPadding);
	      range = steps(start + step * outerPadding, step);
	      if (reverse) range.reverse();
	      rangeBand = step * (1 - padding);
	      ranger = {
	        t: "rangeBands",
	        a: arguments
	      };
	      return scale;
	    };
	    scale.rangeRoundBands = function(x, padding, outerPadding) {
	      if (arguments.length < 2) padding = 0;
	      if (arguments.length < 3) outerPadding = padding;
	      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding));
	      range = steps(start + Math.round((stop - start - (domain.length - padding) * step) / 2), step);
	      if (reverse) range.reverse();
	      rangeBand = Math.round(step * (1 - padding));
	      ranger = {
	        t: "rangeRoundBands",
	        a: arguments
	      };
	      return scale;
	    };
	    scale.rangeBand = function() {
	      return rangeBand;
	    };
	    scale.rangeExtent = function() {
	      return d3_scaleExtent(ranger.a[0]);
	    };
	    scale.copy = function() {
	      return d3_scale_ordinal(domain, ranger);
	    };
	    return scale.domain(domain);
	  }
	  d3.scale.category10 = function() {
	    return d3.scale.ordinal().range(d3_category10);
	  };
	  d3.scale.category20 = function() {
	    return d3.scale.ordinal().range(d3_category20);
	  };
	  d3.scale.category20b = function() {
	    return d3.scale.ordinal().range(d3_category20b);
	  };
	  d3.scale.category20c = function() {
	    return d3.scale.ordinal().range(d3_category20c);
	  };
	  var d3_category10 = [ 2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175 ].map(d3_rgbString);
	  var d3_category20 = [ 2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725 ].map(d3_rgbString);
	  var d3_category20b = [ 3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654 ].map(d3_rgbString);
	  var d3_category20c = [ 3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081 ].map(d3_rgbString);
	  d3.scale.quantile = function() {
	    return d3_scale_quantile([], []);
	  };
	  function d3_scale_quantile(domain, range) {
	    var thresholds;
	    function rescale() {
	      var k = 0, q = range.length;
	      thresholds = [];
	      while (++k < q) thresholds[k - 1] = d3.quantile(domain, k / q);
	      return scale;
	    }
	    function scale(x) {
	      if (!isNaN(x = +x)) return range[d3.bisect(thresholds, x)];
	    }
	    scale.domain = function(x) {
	      if (!arguments.length) return domain;
	      domain = x.map(d3_number).filter(d3_numeric).sort(d3_ascending);
	      return rescale();
	    };
	    scale.range = function(x) {
	      if (!arguments.length) return range;
	      range = x;
	      return rescale();
	    };
	    scale.quantiles = function() {
	      return thresholds;
	    };
	    scale.invertExtent = function(y) {
	      y = range.indexOf(y);
	      return y < 0 ? [ NaN, NaN ] : [ y > 0 ? thresholds[y - 1] : domain[0], y < thresholds.length ? thresholds[y] : domain[domain.length - 1] ];
	    };
	    scale.copy = function() {
	      return d3_scale_quantile(domain, range);
	    };
	    return rescale();
	  }
	  d3.scale.quantize = function() {
	    return d3_scale_quantize(0, 1, [ 0, 1 ]);
	  };
	  function d3_scale_quantize(x0, x1, range) {
	    var kx, i;
	    function scale(x) {
	      return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))];
	    }
	    function rescale() {
	      kx = range.length / (x1 - x0);
	      i = range.length - 1;
	      return scale;
	    }
	    scale.domain = function(x) {
	      if (!arguments.length) return [ x0, x1 ];
	      x0 = +x[0];
	      x1 = +x[x.length - 1];
	      return rescale();
	    };
	    scale.range = function(x) {
	      if (!arguments.length) return range;
	      range = x;
	      return rescale();
	    };
	    scale.invertExtent = function(y) {
	      y = range.indexOf(y);
	      y = y < 0 ? NaN : y / kx + x0;
	      return [ y, y + 1 / kx ];
	    };
	    scale.copy = function() {
	      return d3_scale_quantize(x0, x1, range);
	    };
	    return rescale();
	  }
	  d3.scale.threshold = function() {
	    return d3_scale_threshold([ .5 ], [ 0, 1 ]);
	  };
	  function d3_scale_threshold(domain, range) {
	    function scale(x) {
	      if (x <= x) return range[d3.bisect(domain, x)];
	    }
	    scale.domain = function(_) {
	      if (!arguments.length) return domain;
	      domain = _;
	      return scale;
	    };
	    scale.range = function(_) {
	      if (!arguments.length) return range;
	      range = _;
	      return scale;
	    };
	    scale.invertExtent = function(y) {
	      y = range.indexOf(y);
	      return [ domain[y - 1], domain[y] ];
	    };
	    scale.copy = function() {
	      return d3_scale_threshold(domain, range);
	    };
	    return scale;
	  }
	  d3.scale.identity = function() {
	    return d3_scale_identity([ 0, 1 ]);
	  };
	  function d3_scale_identity(domain) {
	    function identity(x) {
	      return +x;
	    }
	    identity.invert = identity;
	    identity.domain = identity.range = function(x) {
	      if (!arguments.length) return domain;
	      domain = x.map(identity);
	      return identity;
	    };
	    identity.ticks = function(m) {
	      return d3_scale_linearTicks(domain, m);
	    };
	    identity.tickFormat = function(m, format) {
	      return d3_scale_linearTickFormat(domain, m, format);
	    };
	    identity.copy = function() {
	      return d3_scale_identity(domain);
	    };
	    return identity;
	  }
	  d3.svg = {};
	  function d3_zero() {
	    return 0;
	  }
	  d3.svg.arc = function() {
	    var innerRadius = d3_svg_arcInnerRadius, outerRadius = d3_svg_arcOuterRadius, cornerRadius = d3_zero, padRadius = d3_svg_arcAuto, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle, padAngle = d3_svg_arcPadAngle;
	    function arc() {
	      var r0 = Math.max(0, +innerRadius.apply(this, arguments)), r1 = Math.max(0, +outerRadius.apply(this, arguments)), a0 = startAngle.apply(this, arguments) - halfπ, a1 = endAngle.apply(this, arguments) - halfπ, da = Math.abs(a1 - a0), cw = a0 > a1 ? 0 : 1;
	      if (r1 < r0) rc = r1, r1 = r0, r0 = rc;
	      if (da >= τε) return circleSegment(r1, cw) + (r0 ? circleSegment(r0, 1 - cw) : "") + "Z";
	      var rc, cr, rp, ap, p0 = 0, p1 = 0, x0, y0, x1, y1, x2, y2, x3, y3, path = [];
	      if (ap = (+padAngle.apply(this, arguments) || 0) / 2) {
	        rp = padRadius === d3_svg_arcAuto ? Math.sqrt(r0 * r0 + r1 * r1) : +padRadius.apply(this, arguments);
	        if (!cw) p1 *= -1;
	        if (r1) p1 = d3_asin(rp / r1 * Math.sin(ap));
	        if (r0) p0 = d3_asin(rp / r0 * Math.sin(ap));
	      }
	      if (r1) {
	        x0 = r1 * Math.cos(a0 + p1);
	        y0 = r1 * Math.sin(a0 + p1);
	        x1 = r1 * Math.cos(a1 - p1);
	        y1 = r1 * Math.sin(a1 - p1);
	        var l1 = Math.abs(a1 - a0 - 2 * p1) <= π ? 0 : 1;
	        if (p1 && d3_svg_arcSweep(x0, y0, x1, y1) === cw ^ l1) {
	          var h1 = (a0 + a1) / 2;
	          x0 = r1 * Math.cos(h1);
	          y0 = r1 * Math.sin(h1);
	          x1 = y1 = null;
	        }
	      } else {
	        x0 = y0 = 0;
	      }
	      if (r0) {
	        x2 = r0 * Math.cos(a1 - p0);
	        y2 = r0 * Math.sin(a1 - p0);
	        x3 = r0 * Math.cos(a0 + p0);
	        y3 = r0 * Math.sin(a0 + p0);
	        var l0 = Math.abs(a0 - a1 + 2 * p0) <= π ? 0 : 1;
	        if (p0 && d3_svg_arcSweep(x2, y2, x3, y3) === 1 - cw ^ l0) {
	          var h0 = (a0 + a1) / 2;
	          x2 = r0 * Math.cos(h0);
	          y2 = r0 * Math.sin(h0);
	          x3 = y3 = null;
	        }
	      } else {
	        x2 = y2 = 0;
	      }
	      if (da > ε && (rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments))) > .001) {
	        cr = r0 < r1 ^ cw ? 0 : 1;
	        var rc1 = rc, rc0 = rc;
	        if (da < π) {
	          var oc = x3 == null ? [ x2, y2 ] : x1 == null ? [ x0, y0 ] : d3_geom_polygonIntersect([ x0, y0 ], [ x3, y3 ], [ x1, y1 ], [ x2, y2 ]), ax = x0 - oc[0], ay = y0 - oc[1], bx = x1 - oc[0], by = y1 - oc[1], kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2), lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
	          rc0 = Math.min(rc, (r0 - lc) / (kc - 1));
	          rc1 = Math.min(rc, (r1 - lc) / (kc + 1));
	        }
	        if (x1 != null) {
	          var t30 = d3_svg_arcCornerTangents(x3 == null ? [ x2, y2 ] : [ x3, y3 ], [ x0, y0 ], r1, rc1, cw), t12 = d3_svg_arcCornerTangents([ x1, y1 ], [ x2, y2 ], r1, rc1, cw);
	          if (rc === rc1) {
	            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 0,", cr, " ", t30[1], "A", r1, ",", r1, " 0 ", 1 - cw ^ d3_svg_arcSweep(t30[1][0], t30[1][1], t12[1][0], t12[1][1]), ",", cw, " ", t12[1], "A", rc1, ",", rc1, " 0 0,", cr, " ", t12[0]);
	          } else {
	            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 1,", cr, " ", t12[0]);
	          }
	        } else {
	          path.push("M", x0, ",", y0);
	        }
	        if (x3 != null) {
	          var t03 = d3_svg_arcCornerTangents([ x0, y0 ], [ x3, y3 ], r0, -rc0, cw), t21 = d3_svg_arcCornerTangents([ x2, y2 ], x1 == null ? [ x0, y0 ] : [ x1, y1 ], r0, -rc0, cw);
	          if (rc === rc0) {
	            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t21[1], "A", r0, ",", r0, " 0 ", cw ^ d3_svg_arcSweep(t21[1][0], t21[1][1], t03[1][0], t03[1][1]), ",", 1 - cw, " ", t03[1], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
	          } else {
	            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
	          }
	        } else {
	          path.push("L", x2, ",", y2);
	        }
	      } else {
	        path.push("M", x0, ",", y0);
	        if (x1 != null) path.push("A", r1, ",", r1, " 0 ", l1, ",", cw, " ", x1, ",", y1);
	        path.push("L", x2, ",", y2);
	        if (x3 != null) path.push("A", r0, ",", r0, " 0 ", l0, ",", 1 - cw, " ", x3, ",", y3);
	      }
	      path.push("Z");
	      return path.join("");
	    }
	    function circleSegment(r1, cw) {
	      return "M0," + r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + -r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + r1;
	    }
	    arc.innerRadius = function(v) {
	      if (!arguments.length) return innerRadius;
	      innerRadius = d3_functor(v);
	      return arc;
	    };
	    arc.outerRadius = function(v) {
	      if (!arguments.length) return outerRadius;
	      outerRadius = d3_functor(v);
	      return arc;
	    };
	    arc.cornerRadius = function(v) {
	      if (!arguments.length) return cornerRadius;
	      cornerRadius = d3_functor(v);
	      return arc;
	    };
	    arc.padRadius = function(v) {
	      if (!arguments.length) return padRadius;
	      padRadius = v == d3_svg_arcAuto ? d3_svg_arcAuto : d3_functor(v);
	      return arc;
	    };
	    arc.startAngle = function(v) {
	      if (!arguments.length) return startAngle;
	      startAngle = d3_functor(v);
	      return arc;
	    };
	    arc.endAngle = function(v) {
	      if (!arguments.length) return endAngle;
	      endAngle = d3_functor(v);
	      return arc;
	    };
	    arc.padAngle = function(v) {
	      if (!arguments.length) return padAngle;
	      padAngle = d3_functor(v);
	      return arc;
	    };
	    arc.centroid = function() {
	      var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - halfπ;
	      return [ Math.cos(a) * r, Math.sin(a) * r ];
	    };
	    return arc;
	  };
	  var d3_svg_arcAuto = "auto";
	  function d3_svg_arcInnerRadius(d) {
	    return d.innerRadius;
	  }
	  function d3_svg_arcOuterRadius(d) {
	    return d.outerRadius;
	  }
	  function d3_svg_arcStartAngle(d) {
	    return d.startAngle;
	  }
	  function d3_svg_arcEndAngle(d) {
	    return d.endAngle;
	  }
	  function d3_svg_arcPadAngle(d) {
	    return d && d.padAngle;
	  }
	  function d3_svg_arcSweep(x0, y0, x1, y1) {
	    return (x0 - x1) * y0 - (y0 - y1) * x0 > 0 ? 0 : 1;
	  }
	  function d3_svg_arcCornerTangents(p0, p1, r1, rc, cw) {
	    var x01 = p0[0] - p1[0], y01 = p0[1] - p1[1], lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01), ox = lo * y01, oy = -lo * x01, x1 = p0[0] + ox, y1 = p0[1] + oy, x2 = p1[0] + ox, y2 = p1[1] + oy, x3 = (x1 + x2) / 2, y3 = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, d2 = dx * dx + dy * dy, r = r1 - rc, D = x1 * y2 - x2 * y1, d = (dy < 0 ? -1 : 1) * Math.sqrt(Math.max(0, r * r * d2 - D * D)), cx0 = (D * dy - dx * d) / d2, cy0 = (-D * dx - dy * d) / d2, cx1 = (D * dy + dx * d) / d2, cy1 = (-D * dx + dy * d) / d2, dx0 = cx0 - x3, dy0 = cy0 - y3, dx1 = cx1 - x3, dy1 = cy1 - y3;
	    if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;
	    return [ [ cx0 - ox, cy0 - oy ], [ cx0 * r1 / r, cy0 * r1 / r ] ];
	  }
	  function d3_svg_line(projection) {
	    var x = d3_geom_pointX, y = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, tension = .7;
	    function line(data) {
	      var segments = [], points = [], i = -1, n = data.length, d, fx = d3_functor(x), fy = d3_functor(y);
	      function segment() {
	        segments.push("M", interpolate(projection(points), tension));
	      }
	      while (++i < n) {
	        if (defined.call(this, d = data[i], i)) {
	          points.push([ +fx.call(this, d, i), +fy.call(this, d, i) ]);
	        } else if (points.length) {
	          segment();
	          points = [];
	        }
	      }
	      if (points.length) segment();
	      return segments.length ? segments.join("") : null;
	    }
	    line.x = function(_) {
	      if (!arguments.length) return x;
	      x = _;
	      return line;
	    };
	    line.y = function(_) {
	      if (!arguments.length) return y;
	      y = _;
	      return line;
	    };
	    line.defined = function(_) {
	      if (!arguments.length) return defined;
	      defined = _;
	      return line;
	    };
	    line.interpolate = function(_) {
	      if (!arguments.length) return interpolateKey;
	      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
	      return line;
	    };
	    line.tension = function(_) {
	      if (!arguments.length) return tension;
	      tension = _;
	      return line;
	    };
	    return line;
	  }
	  d3.svg.line = function() {
	    return d3_svg_line(d3_identity);
	  };
	  var d3_svg_lineInterpolators = d3.map({
	    linear: d3_svg_lineLinear,
	    "linear-closed": d3_svg_lineLinearClosed,
	    step: d3_svg_lineStep,
	    "step-before": d3_svg_lineStepBefore,
	    "step-after": d3_svg_lineStepAfter,
	    basis: d3_svg_lineBasis,
	    "basis-open": d3_svg_lineBasisOpen,
	    "basis-closed": d3_svg_lineBasisClosed,
	    bundle: d3_svg_lineBundle,
	    cardinal: d3_svg_lineCardinal,
	    "cardinal-open": d3_svg_lineCardinalOpen,
	    "cardinal-closed": d3_svg_lineCardinalClosed,
	    monotone: d3_svg_lineMonotone
	  });
	  d3_svg_lineInterpolators.forEach(function(key, value) {
	    value.key = key;
	    value.closed = /-closed$/.test(key);
	  });
	  function d3_svg_lineLinear(points) {
	    return points.length > 1 ? points.join("L") : points + "Z";
	  }
	  function d3_svg_lineLinearClosed(points) {
	    return points.join("L") + "Z";
	  }
	  function d3_svg_lineStep(points) {
	    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
	    while (++i < n) path.push("H", (p[0] + (p = points[i])[0]) / 2, "V", p[1]);
	    if (n > 1) path.push("H", p[0]);
	    return path.join("");
	  }
	  function d3_svg_lineStepBefore(points) {
	    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
	    while (++i < n) path.push("V", (p = points[i])[1], "H", p[0]);
	    return path.join("");
	  }
	  function d3_svg_lineStepAfter(points) {
	    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
	    while (++i < n) path.push("H", (p = points[i])[0], "V", p[1]);
	    return path.join("");
	  }
	  function d3_svg_lineCardinalOpen(points, tension) {
	    return points.length < 4 ? d3_svg_lineLinear(points) : points[1] + d3_svg_lineHermite(points.slice(1, -1), d3_svg_lineCardinalTangents(points, tension));
	  }
	  function d3_svg_lineCardinalClosed(points, tension) {
	    return points.length < 3 ? d3_svg_lineLinearClosed(points) : points[0] + d3_svg_lineHermite((points.push(points[0]), 
	    points), d3_svg_lineCardinalTangents([ points[points.length - 2] ].concat(points, [ points[1] ]), tension));
	  }
	  function d3_svg_lineCardinal(points, tension) {
	    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineCardinalTangents(points, tension));
	  }
	  function d3_svg_lineHermite(points, tangents) {
	    if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {
	      return d3_svg_lineLinear(points);
	    }
	    var quad = points.length != tangents.length, path = "", p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1;
	    if (quad) {
	      path += "Q" + (p[0] - t0[0] * 2 / 3) + "," + (p[1] - t0[1] * 2 / 3) + "," + p[0] + "," + p[1];
	      p0 = points[1];
	      pi = 2;
	    }
	    if (tangents.length > 1) {
	      t = tangents[1];
	      p = points[pi];
	      pi++;
	      path += "C" + (p0[0] + t0[0]) + "," + (p0[1] + t0[1]) + "," + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
	      for (var i = 2; i < tangents.length; i++, pi++) {
	        p = points[pi];
	        t = tangents[i];
	        path += "S" + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
	      }
	    }
	    if (quad) {
	      var lp = points[pi];
	      path += "Q" + (p[0] + t[0] * 2 / 3) + "," + (p[1] + t[1] * 2 / 3) + "," + lp[0] + "," + lp[1];
	    }
	    return path;
	  }
	  function d3_svg_lineCardinalTangents(points, tension) {
	    var tangents = [], a = (1 - tension) / 2, p0, p1 = points[0], p2 = points[1], i = 1, n = points.length;
	    while (++i < n) {
	      p0 = p1;
	      p1 = p2;
	      p2 = points[i];
	      tangents.push([ a * (p2[0] - p0[0]), a * (p2[1] - p0[1]) ]);
	    }
	    return tangents;
	  }
	  function d3_svg_lineBasis(points) {
	    if (points.length < 3) return d3_svg_lineLinear(points);
	    var i = 1, n = points.length, pi = points[0], x0 = pi[0], y0 = pi[1], px = [ x0, x0, x0, (pi = points[1])[0] ], py = [ y0, y0, y0, pi[1] ], path = [ x0, ",", y0, "L", d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
	    points.push(points[n - 1]);
	    while (++i <= n) {
	      pi = points[i];
	      px.shift();
	      px.push(pi[0]);
	      py.shift();
	      py.push(pi[1]);
	      d3_svg_lineBasisBezier(path, px, py);
	    }
	    points.pop();
	    path.push("L", pi);
	    return path.join("");
	  }
	  function d3_svg_lineBasisOpen(points) {
	    if (points.length < 4) return d3_svg_lineLinear(points);
	    var path = [], i = -1, n = points.length, pi, px = [ 0 ], py = [ 0 ];
	    while (++i < 3) {
	      pi = points[i];
	      px.push(pi[0]);
	      py.push(pi[1]);
	    }
	    path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px) + "," + d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));
	    --i;
	    while (++i < n) {
	      pi = points[i];
	      px.shift();
	      px.push(pi[0]);
	      py.shift();
	      py.push(pi[1]);
	      d3_svg_lineBasisBezier(path, px, py);
	    }
	    return path.join("");
	  }
	  function d3_svg_lineBasisClosed(points) {
	    var path, i = -1, n = points.length, m = n + 4, pi, px = [], py = [];
	    while (++i < 4) {
	      pi = points[i % n];
	      px.push(pi[0]);
	      py.push(pi[1]);
	    }
	    path = [ d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
	    --i;
	    while (++i < m) {
	      pi = points[i % n];
	      px.shift();
	      px.push(pi[0]);
	      py.shift();
	      py.push(pi[1]);
	      d3_svg_lineBasisBezier(path, px, py);
	    }
	    return path.join("");
	  }
	  function d3_svg_lineBundle(points, tension) {
	    var n = points.length - 1;
	    if (n) {
	      var x0 = points[0][0], y0 = points[0][1], dx = points[n][0] - x0, dy = points[n][1] - y0, i = -1, p, t;
	      while (++i <= n) {
	        p = points[i];
	        t = i / n;
	        p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);
	        p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);
	      }
	    }
	    return d3_svg_lineBasis(points);
	  }
	  function d3_svg_lineDot4(a, b) {
	    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
	  }
	  var d3_svg_lineBasisBezier1 = [ 0, 2 / 3, 1 / 3, 0 ], d3_svg_lineBasisBezier2 = [ 0, 1 / 3, 2 / 3, 0 ], d3_svg_lineBasisBezier3 = [ 0, 1 / 6, 2 / 3, 1 / 6 ];
	  function d3_svg_lineBasisBezier(path, x, y) {
	    path.push("C", d3_svg_lineDot4(d3_svg_lineBasisBezier1, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier1, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, y));
	  }
	  function d3_svg_lineSlope(p0, p1) {
	    return (p1[1] - p0[1]) / (p1[0] - p0[0]);
	  }
	  function d3_svg_lineFiniteDifferences(points) {
	    var i = 0, j = points.length - 1, m = [], p0 = points[0], p1 = points[1], d = m[0] = d3_svg_lineSlope(p0, p1);
	    while (++i < j) {
	      m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;
	    }
	    m[i] = d;
	    return m;
	  }
	  function d3_svg_lineMonotoneTangents(points) {
	    var tangents = [], d, a, b, s, m = d3_svg_lineFiniteDifferences(points), i = -1, j = points.length - 1;
	    while (++i < j) {
	      d = d3_svg_lineSlope(points[i], points[i + 1]);
	      if (abs(d) < ε) {
	        m[i] = m[i + 1] = 0;
	      } else {
	        a = m[i] / d;
	        b = m[i + 1] / d;
	        s = a * a + b * b;
	        if (s > 9) {
	          s = d * 3 / Math.sqrt(s);
	          m[i] = s * a;
	          m[i + 1] = s * b;
	        }
	      }
	    }
	    i = -1;
	    while (++i <= j) {
	      s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
	      tangents.push([ s || 0, m[i] * s || 0 ]);
	    }
	    return tangents;
	  }
	  function d3_svg_lineMonotone(points) {
	    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));
	  }
	  d3.svg.line.radial = function() {
	    var line = d3_svg_line(d3_svg_lineRadial);
	    line.radius = line.x, delete line.x;
	    line.angle = line.y, delete line.y;
	    return line;
	  };
	  function d3_svg_lineRadial(points) {
	    var point, i = -1, n = points.length, r, a;
	    while (++i < n) {
	      point = points[i];
	      r = point[0];
	      a = point[1] - halfπ;
	      point[0] = r * Math.cos(a);
	      point[1] = r * Math.sin(a);
	    }
	    return points;
	  }
	  function d3_svg_area(projection) {
	    var x0 = d3_geom_pointX, x1 = d3_geom_pointX, y0 = 0, y1 = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, interpolateReverse = interpolate, L = "L", tension = .7;
	    function area(data) {
	      var segments = [], points0 = [], points1 = [], i = -1, n = data.length, d, fx0 = d3_functor(x0), fy0 = d3_functor(y0), fx1 = x0 === x1 ? function() {
	        return x;
	      } : d3_functor(x1), fy1 = y0 === y1 ? function() {
	        return y;
	      } : d3_functor(y1), x, y;
	      function segment() {
	        segments.push("M", interpolate(projection(points1), tension), L, interpolateReverse(projection(points0.reverse()), tension), "Z");
	      }
	      while (++i < n) {
	        if (defined.call(this, d = data[i], i)) {
	          points0.push([ x = +fx0.call(this, d, i), y = +fy0.call(this, d, i) ]);
	          points1.push([ +fx1.call(this, d, i), +fy1.call(this, d, i) ]);
	        } else if (points0.length) {
	          segment();
	          points0 = [];
	          points1 = [];
	        }
	      }
	      if (points0.length) segment();
	      return segments.length ? segments.join("") : null;
	    }
	    area.x = function(_) {
	      if (!arguments.length) return x1;
	      x0 = x1 = _;
	      return area;
	    };
	    area.x0 = function(_) {
	      if (!arguments.length) return x0;
	      x0 = _;
	      return area;
	    };
	    area.x1 = function(_) {
	      if (!arguments.length) return x1;
	      x1 = _;
	      return area;
	    };
	    area.y = function(_) {
	      if (!arguments.length) return y1;
	      y0 = y1 = _;
	      return area;
	    };
	    area.y0 = function(_) {
	      if (!arguments.length) return y0;
	      y0 = _;
	      return area;
	    };
	    area.y1 = function(_) {
	      if (!arguments.length) return y1;
	      y1 = _;
	      return area;
	    };
	    area.defined = function(_) {
	      if (!arguments.length) return defined;
	      defined = _;
	      return area;
	    };
	    area.interpolate = function(_) {
	      if (!arguments.length) return interpolateKey;
	      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
	      interpolateReverse = interpolate.reverse || interpolate;
	      L = interpolate.closed ? "M" : "L";
	      return area;
	    };
	    area.tension = function(_) {
	      if (!arguments.length) return tension;
	      tension = _;
	      return area;
	    };
	    return area;
	  }
	  d3_svg_lineStepBefore.reverse = d3_svg_lineStepAfter;
	  d3_svg_lineStepAfter.reverse = d3_svg_lineStepBefore;
	  d3.svg.area = function() {
	    return d3_svg_area(d3_identity);
	  };
	  d3.svg.area.radial = function() {
	    var area = d3_svg_area(d3_svg_lineRadial);
	    area.radius = area.x, delete area.x;
	    area.innerRadius = area.x0, delete area.x0;
	    area.outerRadius = area.x1, delete area.x1;
	    area.angle = area.y, delete area.y;
	    area.startAngle = area.y0, delete area.y0;
	    area.endAngle = area.y1, delete area.y1;
	    return area;
	  };
	  d3.svg.chord = function() {
	    var source = d3_source, target = d3_target, radius = d3_svg_chordRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;
	    function chord(d, i) {
	      var s = subgroup(this, source, d, i), t = subgroup(this, target, d, i);
	      return "M" + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + "Z";
	    }
	    function subgroup(self, f, d, i) {
	      var subgroup = f.call(self, d, i), r = radius.call(self, subgroup, i), a0 = startAngle.call(self, subgroup, i) - halfπ, a1 = endAngle.call(self, subgroup, i) - halfπ;
	      return {
	        r: r,
	        a0: a0,
	        a1: a1,
	        p0: [ r * Math.cos(a0), r * Math.sin(a0) ],
	        p1: [ r * Math.cos(a1), r * Math.sin(a1) ]
	      };
	    }
	    function equals(a, b) {
	      return a.a0 == b.a0 && a.a1 == b.a1;
	    }
	    function arc(r, p, a) {
	      return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + p;
	    }
	    function curve(r0, p0, r1, p1) {
	      return "Q 0,0 " + p1;
	    }
	    chord.radius = function(v) {
	      if (!arguments.length) return radius;
	      radius = d3_functor(v);
	      return chord;
	    };
	    chord.source = function(v) {
	      if (!arguments.length) return source;
	      source = d3_functor(v);
	      return chord;
	    };
	    chord.target = function(v) {
	      if (!arguments.length) return target;
	      target = d3_functor(v);
	      return chord;
	    };
	    chord.startAngle = function(v) {
	      if (!arguments.length) return startAngle;
	      startAngle = d3_functor(v);
	      return chord;
	    };
	    chord.endAngle = function(v) {
	      if (!arguments.length) return endAngle;
	      endAngle = d3_functor(v);
	      return chord;
	    };
	    return chord;
	  };
	  function d3_svg_chordRadius(d) {
	    return d.radius;
	  }
	  d3.svg.diagonal = function() {
	    var source = d3_source, target = d3_target, projection = d3_svg_diagonalProjection;
	    function diagonal(d, i) {
	      var p0 = source.call(this, d, i), p3 = target.call(this, d, i), m = (p0.y + p3.y) / 2, p = [ p0, {
	        x: p0.x,
	        y: m
	      }, {
	        x: p3.x,
	        y: m
	      }, p3 ];
	      p = p.map(projection);
	      return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
	    }
	    diagonal.source = function(x) {
	      if (!arguments.length) return source;
	      source = d3_functor(x);
	      return diagonal;
	    };
	    diagonal.target = function(x) {
	      if (!arguments.length) return target;
	      target = d3_functor(x);
	      return diagonal;
	    };
	    diagonal.projection = function(x) {
	      if (!arguments.length) return projection;
	      projection = x;
	      return diagonal;
	    };
	    return diagonal;
	  };
	  function d3_svg_diagonalProjection(d) {
	    return [ d.x, d.y ];
	  }
	  d3.svg.diagonal.radial = function() {
	    var diagonal = d3.svg.diagonal(), projection = d3_svg_diagonalProjection, projection_ = diagonal.projection;
	    diagonal.projection = function(x) {
	      return arguments.length ? projection_(d3_svg_diagonalRadialProjection(projection = x)) : projection;
	    };
	    return diagonal;
	  };
	  function d3_svg_diagonalRadialProjection(projection) {
	    return function() {
	      var d = projection.apply(this, arguments), r = d[0], a = d[1] - halfπ;
	      return [ r * Math.cos(a), r * Math.sin(a) ];
	    };
	  }
	  d3.svg.symbol = function() {
	    var type = d3_svg_symbolType, size = d3_svg_symbolSize;
	    function symbol(d, i) {
	      return (d3_svg_symbols.get(type.call(this, d, i)) || d3_svg_symbolCircle)(size.call(this, d, i));
	    }
	    symbol.type = function(x) {
	      if (!arguments.length) return type;
	      type = d3_functor(x);
	      return symbol;
	    };
	    symbol.size = function(x) {
	      if (!arguments.length) return size;
	      size = d3_functor(x);
	      return symbol;
	    };
	    return symbol;
	  };
	  function d3_svg_symbolSize() {
	    return 64;
	  }
	  function d3_svg_symbolType() {
	    return "circle";
	  }
	  function d3_svg_symbolCircle(size) {
	    var r = Math.sqrt(size / π);
	    return "M0," + r + "A" + r + "," + r + " 0 1,1 0," + -r + "A" + r + "," + r + " 0 1,1 0," + r + "Z";
	  }
	  var d3_svg_symbols = d3.map({
	    circle: d3_svg_symbolCircle,
	    cross: function(size) {
	      var r = Math.sqrt(size / 5) / 2;
	      return "M" + -3 * r + "," + -r + "H" + -r + "V" + -3 * r + "H" + r + "V" + -r + "H" + 3 * r + "V" + r + "H" + r + "V" + 3 * r + "H" + -r + "V" + r + "H" + -3 * r + "Z";
	    },
	    diamond: function(size) {
	      var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)), rx = ry * d3_svg_symbolTan30;
	      return "M0," + -ry + "L" + rx + ",0" + " 0," + ry + " " + -rx + ",0" + "Z";
	    },
	    square: function(size) {
	      var r = Math.sqrt(size) / 2;
	      return "M" + -r + "," + -r + "L" + r + "," + -r + " " + r + "," + r + " " + -r + "," + r + "Z";
	    },
	    "triangle-down": function(size) {
	      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
	      return "M0," + ry + "L" + rx + "," + -ry + " " + -rx + "," + -ry + "Z";
	    },
	    "triangle-up": function(size) {
	      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
	      return "M0," + -ry + "L" + rx + "," + ry + " " + -rx + "," + ry + "Z";
	    }
	  });
	  d3.svg.symbolTypes = d3_svg_symbols.keys();
	  var d3_svg_symbolSqrt3 = Math.sqrt(3), d3_svg_symbolTan30 = Math.tan(30 * d3_radians);
	  d3_selectionPrototype.transition = function(name) {
	    var id = d3_transitionInheritId || ++d3_transitionId, ns = d3_transitionNamespace(name), subgroups = [], subgroup, node, transition = d3_transitionInherit || {
	      time: Date.now(),
	      ease: d3_ease_cubicInOut,
	      delay: 0,
	      duration: 250
	    };
	    for (var j = -1, m = this.length; ++j < m; ) {
	      subgroups.push(subgroup = []);
	      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
	        if (node = group[i]) d3_transitionNode(node, i, ns, id, transition);
	        subgroup.push(node);
	      }
	    }
	    return d3_transition(subgroups, ns, id);
	  };
	  d3_selectionPrototype.interrupt = function(name) {
	    return this.each(name == null ? d3_selection_interrupt : d3_selection_interruptNS(d3_transitionNamespace(name)));
	  };
	  var d3_selection_interrupt = d3_selection_interruptNS(d3_transitionNamespace());
	  function d3_selection_interruptNS(ns) {
	    return function() {
	      var lock, activeId, active;
	      if ((lock = this[ns]) && (active = lock[activeId = lock.active])) {
	        active.timer.c = null;
	        active.timer.t = NaN;
	        if (--lock.count) delete lock[activeId]; else delete this[ns];
	        lock.active += .5;
	        active.event && active.event.interrupt.call(this, this.__data__, active.index);
	      }
	    };
	  }
	  function d3_transition(groups, ns, id) {
	    d3_subclass(groups, d3_transitionPrototype);
	    groups.namespace = ns;
	    groups.id = id;
	    return groups;
	  }
	  var d3_transitionPrototype = [], d3_transitionId = 0, d3_transitionInheritId, d3_transitionInherit;
	  d3_transitionPrototype.call = d3_selectionPrototype.call;
	  d3_transitionPrototype.empty = d3_selectionPrototype.empty;
	  d3_transitionPrototype.node = d3_selectionPrototype.node;
	  d3_transitionPrototype.size = d3_selectionPrototype.size;
	  d3.transition = function(selection, name) {
	    return selection && selection.transition ? d3_transitionInheritId ? selection.transition(name) : selection : d3.selection().transition(selection);
	  };
	  d3.transition.prototype = d3_transitionPrototype;
	  d3_transitionPrototype.select = function(selector) {
	    var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnode, node;
	    selector = d3_selection_selector(selector);
	    for (var j = -1, m = this.length; ++j < m; ) {
	      subgroups.push(subgroup = []);
	      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
	        if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {
	          if ("__data__" in node) subnode.__data__ = node.__data__;
	          d3_transitionNode(subnode, i, ns, id, node[ns][id]);
	          subgroup.push(subnode);
	        } else {
	          subgroup.push(null);
	        }
	      }
	    }
	    return d3_transition(subgroups, ns, id);
	  };
	  d3_transitionPrototype.selectAll = function(selector) {
	    var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnodes, node, subnode, transition;
	    selector = d3_selection_selectorAll(selector);
	    for (var j = -1, m = this.length; ++j < m; ) {
	      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
	        if (node = group[i]) {
	          transition = node[ns][id];
	          subnodes = selector.call(node, node.__data__, i, j);
	          subgroups.push(subgroup = []);
	          for (var k = -1, o = subnodes.length; ++k < o; ) {
	            if (subnode = subnodes[k]) d3_transitionNode(subnode, k, ns, id, transition);
	            subgroup.push(subnode);
	          }
	        }
	      }
	    }
	    return d3_transition(subgroups, ns, id);
	  };
	  d3_transitionPrototype.filter = function(filter) {
	    var subgroups = [], subgroup, group, node;
	    if (typeof filter !== "function") filter = d3_selection_filter(filter);
	    for (var j = 0, m = this.length; j < m; j++) {
	      subgroups.push(subgroup = []);
	      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
	        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
	          subgroup.push(node);
	        }
	      }
	    }
	    return d3_transition(subgroups, this.namespace, this.id);
	  };
	  d3_transitionPrototype.tween = function(name, tween) {
	    var id = this.id, ns = this.namespace;
	    if (arguments.length < 2) return this.node()[ns][id].tween.get(name);
	    return d3_selection_each(this, tween == null ? function(node) {
	      node[ns][id].tween.remove(name);
	    } : function(node) {
	      node[ns][id].tween.set(name, tween);
	    });
	  };
	  function d3_transition_tween(groups, name, value, tween) {
	    var id = groups.id, ns = groups.namespace;
	    return d3_selection_each(groups, typeof value === "function" ? function(node, i, j) {
	      node[ns][id].tween.set(name, tween(value.call(node, node.__data__, i, j)));
	    } : (value = tween(value), function(node) {
	      node[ns][id].tween.set(name, value);
	    }));
	  }
	  d3_transitionPrototype.attr = function(nameNS, value) {
	    if (arguments.length < 2) {
	      for (value in nameNS) this.attr(value, nameNS[value]);
	      return this;
	    }
	    var interpolate = nameNS == "transform" ? d3_interpolateTransform : d3_interpolate, name = d3.ns.qualify(nameNS);
	    function attrNull() {
	      this.removeAttribute(name);
	    }
	    function attrNullNS() {
	      this.removeAttributeNS(name.space, name.local);
	    }
	    function attrTween(b) {
	      return b == null ? attrNull : (b += "", function() {
	        var a = this.getAttribute(name), i;
	        return a !== b && (i = interpolate(a, b), function(t) {
	          this.setAttribute(name, i(t));
	        });
	      });
	    }
	    function attrTweenNS(b) {
	      return b == null ? attrNullNS : (b += "", function() {
	        var a = this.getAttributeNS(name.space, name.local), i;
	        return a !== b && (i = interpolate(a, b), function(t) {
	          this.setAttributeNS(name.space, name.local, i(t));
	        });
	      });
	    }
	    return d3_transition_tween(this, "attr." + nameNS, value, name.local ? attrTweenNS : attrTween);
	  };
	  d3_transitionPrototype.attrTween = function(nameNS, tween) {
	    var name = d3.ns.qualify(nameNS);
	    function attrTween(d, i) {
	      var f = tween.call(this, d, i, this.getAttribute(name));
	      return f && function(t) {
	        this.setAttribute(name, f(t));
	      };
	    }
	    function attrTweenNS(d, i) {
	      var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local));
	      return f && function(t) {
	        this.setAttributeNS(name.space, name.local, f(t));
	      };
	    }
	    return this.tween("attr." + nameNS, name.local ? attrTweenNS : attrTween);
	  };
	  d3_transitionPrototype.style = function(name, value, priority) {
	    var n = arguments.length;
	    if (n < 3) {
	      if (typeof name !== "string") {
	        if (n < 2) value = "";
	        for (priority in name) this.style(priority, name[priority], value);
	        return this;
	      }
	      priority = "";
	    }
	    function styleNull() {
	      this.style.removeProperty(name);
	    }
	    function styleString(b) {
	      return b == null ? styleNull : (b += "", function() {
	        var a = d3_window(this).getComputedStyle(this, null).getPropertyValue(name), i;
	        return a !== b && (i = d3_interpolate(a, b), function(t) {
	          this.style.setProperty(name, i(t), priority);
	        });
	      });
	    }
	    return d3_transition_tween(this, "style." + name, value, styleString);
	  };
	  d3_transitionPrototype.styleTween = function(name, tween, priority) {
	    if (arguments.length < 3) priority = "";
	    function styleTween(d, i) {
	      var f = tween.call(this, d, i, d3_window(this).getComputedStyle(this, null).getPropertyValue(name));
	      return f && function(t) {
	        this.style.setProperty(name, f(t), priority);
	      };
	    }
	    return this.tween("style." + name, styleTween);
	  };
	  d3_transitionPrototype.text = function(value) {
	    return d3_transition_tween(this, "text", value, d3_transition_text);
	  };
	  function d3_transition_text(b) {
	    if (b == null) b = "";
	    return function() {
	      this.textContent = b;
	    };
	  }
	  d3_transitionPrototype.remove = function() {
	    var ns = this.namespace;
	    return this.each("end.transition", function() {
	      var p;
	      if (this[ns].count < 2 && (p = this.parentNode)) p.removeChild(this);
	    });
	  };
	  d3_transitionPrototype.ease = function(value) {
	    var id = this.id, ns = this.namespace;
	    if (arguments.length < 1) return this.node()[ns][id].ease;
	    if (typeof value !== "function") value = d3.ease.apply(d3, arguments);
	    return d3_selection_each(this, function(node) {
	      node[ns][id].ease = value;
	    });
	  };
	  d3_transitionPrototype.delay = function(value) {
	    var id = this.id, ns = this.namespace;
	    if (arguments.length < 1) return this.node()[ns][id].delay;
	    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
	      node[ns][id].delay = +value.call(node, node.__data__, i, j);
	    } : (value = +value, function(node) {
	      node[ns][id].delay = value;
	    }));
	  };
	  d3_transitionPrototype.duration = function(value) {
	    var id = this.id, ns = this.namespace;
	    if (arguments.length < 1) return this.node()[ns][id].duration;
	    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
	      node[ns][id].duration = Math.max(1, value.call(node, node.__data__, i, j));
	    } : (value = Math.max(1, value), function(node) {
	      node[ns][id].duration = value;
	    }));
	  };
	  d3_transitionPrototype.each = function(type, listener) {
	    var id = this.id, ns = this.namespace;
	    if (arguments.length < 2) {
	      var inherit = d3_transitionInherit, inheritId = d3_transitionInheritId;
	      try {
	        d3_transitionInheritId = id;
	        d3_selection_each(this, function(node, i, j) {
	          d3_transitionInherit = node[ns][id];
	          type.call(node, node.__data__, i, j);
	        });
	      } finally {
	        d3_transitionInherit = inherit;
	        d3_transitionInheritId = inheritId;
	      }
	    } else {
	      d3_selection_each(this, function(node) {
	        var transition = node[ns][id];
	        (transition.event || (transition.event = d3.dispatch("start", "end", "interrupt"))).on(type, listener);
	      });
	    }
	    return this;
	  };
	  d3_transitionPrototype.transition = function() {
	    var id0 = this.id, id1 = ++d3_transitionId, ns = this.namespace, subgroups = [], subgroup, group, node, transition;
	    for (var j = 0, m = this.length; j < m; j++) {
	      subgroups.push(subgroup = []);
	      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
	        if (node = group[i]) {
	          transition = node[ns][id0];
	          d3_transitionNode(node, i, ns, id1, {
	            time: transition.time,
	            ease: transition.ease,
	            delay: transition.delay + transition.duration,
	            duration: transition.duration
	          });
	        }
	        subgroup.push(node);
	      }
	    }
	    return d3_transition(subgroups, ns, id1);
	  };
	  function d3_transitionNamespace(name) {
	    return name == null ? "__transition__" : "__transition_" + name + "__";
	  }
	  function d3_transitionNode(node, i, ns, id, inherit) {
	    var lock = node[ns] || (node[ns] = {
	      active: 0,
	      count: 0
	    }), transition = lock[id], time, timer, duration, ease, tweens;
	    function schedule(elapsed) {
	      var delay = transition.delay;
	      timer.t = delay + time;
	      if (delay <= elapsed) return start(elapsed - delay);
	      timer.c = start;
	    }
	    function start(elapsed) {
	      var activeId = lock.active, active = lock[activeId];
	      if (active) {
	        active.timer.c = null;
	        active.timer.t = NaN;
	        --lock.count;
	        delete lock[activeId];
	        active.event && active.event.interrupt.call(node, node.__data__, active.index);
	      }
	      for (var cancelId in lock) {
	        if (+cancelId < id) {
	          var cancel = lock[cancelId];
	          cancel.timer.c = null;
	          cancel.timer.t = NaN;
	          --lock.count;
	          delete lock[cancelId];
	        }
	      }
	      timer.c = tick;
	      d3_timer(function() {
	        if (timer.c && tick(elapsed || 1)) {
	          timer.c = null;
	          timer.t = NaN;
	        }
	        return 1;
	      }, 0, time);
	      lock.active = id;
	      transition.event && transition.event.start.call(node, node.__data__, i);
	      tweens = [];
	      transition.tween.forEach(function(key, value) {
	        if (value = value.call(node, node.__data__, i)) {
	          tweens.push(value);
	        }
	      });
	      ease = transition.ease;
	      duration = transition.duration;
	    }
	    function tick(elapsed) {
	      var t = elapsed / duration, e = ease(t), n = tweens.length;
	      while (n > 0) {
	        tweens[--n].call(node, e);
	      }
	      if (t >= 1) {
	        transition.event && transition.event.end.call(node, node.__data__, i);
	        if (--lock.count) delete lock[id]; else delete node[ns];
	        return 1;
	      }
	    }
	    if (!transition) {
	      time = inherit.time;
	      timer = d3_timer(schedule, 0, time);
	      transition = lock[id] = {
	        tween: new d3_Map(),
	        time: time,
	        timer: timer,
	        delay: inherit.delay,
	        duration: inherit.duration,
	        ease: inherit.ease,
	        index: i
	      };
	      inherit = null;
	      ++lock.count;
	    }
	  }
	  d3.svg.axis = function() {
	    var scale = d3.scale.linear(), orient = d3_svg_axisDefaultOrient, innerTickSize = 6, outerTickSize = 6, tickPadding = 3, tickArguments_ = [ 10 ], tickValues = null, tickFormat_;
	    function axis(g) {
	      g.each(function() {
	        var g = d3.select(this);
	        var scale0 = this.__chart__ || scale, scale1 = this.__chart__ = scale.copy();
	        var ticks = tickValues == null ? scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain() : tickValues, tickFormat = tickFormat_ == null ? scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity : tickFormat_, tick = g.selectAll(".tick").data(ticks, scale1), tickEnter = tick.enter().insert("g", ".domain").attr("class", "tick").style("opacity", ε), tickExit = d3.transition(tick.exit()).style("opacity", ε).remove(), tickUpdate = d3.transition(tick.order()).style("opacity", 1), tickSpacing = Math.max(innerTickSize, 0) + tickPadding, tickTransform;
	        var range = d3_scaleRange(scale1), path = g.selectAll(".domain").data([ 0 ]), pathUpdate = (path.enter().append("path").attr("class", "domain"), 
	        d3.transition(path));
	        tickEnter.append("line");
	        tickEnter.append("text");
	        var lineEnter = tickEnter.select("line"), lineUpdate = tickUpdate.select("line"), text = tick.select("text").text(tickFormat), textEnter = tickEnter.select("text"), textUpdate = tickUpdate.select("text"), sign = orient === "top" || orient === "left" ? -1 : 1, x1, x2, y1, y2;
	        if (orient === "bottom" || orient === "top") {
	          tickTransform = d3_svg_axisX, x1 = "x", y1 = "y", x2 = "x2", y2 = "y2";
	          text.attr("dy", sign < 0 ? "0em" : ".71em").style("text-anchor", "middle");
	          pathUpdate.attr("d", "M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize);
	        } else {
	          tickTransform = d3_svg_axisY, x1 = "y", y1 = "x", x2 = "y2", y2 = "x2";
	          text.attr("dy", ".32em").style("text-anchor", sign < 0 ? "end" : "start");
	          pathUpdate.attr("d", "M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize);
	        }
	        lineEnter.attr(y2, sign * innerTickSize);
	        textEnter.attr(y1, sign * tickSpacing);
	        lineUpdate.attr(x2, 0).attr(y2, sign * innerTickSize);
	        textUpdate.attr(x1, 0).attr(y1, sign * tickSpacing);
	        if (scale1.rangeBand) {
	          var x = scale1, dx = x.rangeBand() / 2;
	          scale0 = scale1 = function(d) {
	            return x(d) + dx;
	          };
	        } else if (scale0.rangeBand) {
	          scale0 = scale1;
	        } else {
	          tickExit.call(tickTransform, scale1, scale0);
	        }
	        tickEnter.call(tickTransform, scale0, scale1);
	        tickUpdate.call(tickTransform, scale1, scale1);
	      });
	    }
	    axis.scale = function(x) {
	      if (!arguments.length) return scale;
	      scale = x;
	      return axis;
	    };
	    axis.orient = function(x) {
	      if (!arguments.length) return orient;
	      orient = x in d3_svg_axisOrients ? x + "" : d3_svg_axisDefaultOrient;
	      return axis;
	    };
	    axis.ticks = function() {
	      if (!arguments.length) return tickArguments_;
	      tickArguments_ = d3_array(arguments);
	      return axis;
	    };
	    axis.tickValues = function(x) {
	      if (!arguments.length) return tickValues;
	      tickValues = x;
	      return axis;
	    };
	    axis.tickFormat = function(x) {
	      if (!arguments.length) return tickFormat_;
	      tickFormat_ = x;
	      return axis;
	    };
	    axis.tickSize = function(x) {
	      var n = arguments.length;
	      if (!n) return innerTickSize;
	      innerTickSize = +x;
	      outerTickSize = +arguments[n - 1];
	      return axis;
	    };
	    axis.innerTickSize = function(x) {
	      if (!arguments.length) return innerTickSize;
	      innerTickSize = +x;
	      return axis;
	    };
	    axis.outerTickSize = function(x) {
	      if (!arguments.length) return outerTickSize;
	      outerTickSize = +x;
	      return axis;
	    };
	    axis.tickPadding = function(x) {
	      if (!arguments.length) return tickPadding;
	      tickPadding = +x;
	      return axis;
	    };
	    axis.tickSubdivide = function() {
	      return arguments.length && axis;
	    };
	    return axis;
	  };
	  var d3_svg_axisDefaultOrient = "bottom", d3_svg_axisOrients = {
	    top: 1,
	    right: 1,
	    bottom: 1,
	    left: 1
	  };
	  function d3_svg_axisX(selection, x0, x1) {
	    selection.attr("transform", function(d) {
	      var v0 = x0(d);
	      return "translate(" + (isFinite(v0) ? v0 : x1(d)) + ",0)";
	    });
	  }
	  function d3_svg_axisY(selection, y0, y1) {
	    selection.attr("transform", function(d) {
	      var v0 = y0(d);
	      return "translate(0," + (isFinite(v0) ? v0 : y1(d)) + ")";
	    });
	  }
	  d3.svg.brush = function() {
	    var event = d3_eventDispatch(brush, "brushstart", "brush", "brushend"), x = null, y = null, xExtent = [ 0, 0 ], yExtent = [ 0, 0 ], xExtentDomain, yExtentDomain, xClamp = true, yClamp = true, resizes = d3_svg_brushResizes[0];
	    function brush(g) {
	      g.each(function() {
	        var g = d3.select(this).style("pointer-events", "all").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)").on("mousedown.brush", brushstart).on("touchstart.brush", brushstart);
	        var background = g.selectAll(".background").data([ 0 ]);
	        background.enter().append("rect").attr("class", "background").style("visibility", "hidden").style("cursor", "crosshair");
	        g.selectAll(".extent").data([ 0 ]).enter().append("rect").attr("class", "extent").style("cursor", "move");
	        var resize = g.selectAll(".resize").data(resizes, d3_identity);
	        resize.exit().remove();
	        resize.enter().append("g").attr("class", function(d) {
	          return "resize " + d;
	        }).style("cursor", function(d) {
	          return d3_svg_brushCursor[d];
	        }).append("rect").attr("x", function(d) {
	          return /[ew]$/.test(d) ? -3 : null;
	        }).attr("y", function(d) {
	          return /^[ns]/.test(d) ? -3 : null;
	        }).attr("width", 6).attr("height", 6).style("visibility", "hidden");
	        resize.style("display", brush.empty() ? "none" : null);
	        var gUpdate = d3.transition(g), backgroundUpdate = d3.transition(background), range;
	        if (x) {
	          range = d3_scaleRange(x);
	          backgroundUpdate.attr("x", range[0]).attr("width", range[1] - range[0]);
	          redrawX(gUpdate);
	        }
	        if (y) {
	          range = d3_scaleRange(y);
	          backgroundUpdate.attr("y", range[0]).attr("height", range[1] - range[0]);
	          redrawY(gUpdate);
	        }
	        redraw(gUpdate);
	      });
	    }
	    brush.event = function(g) {
	      g.each(function() {
	        var event_ = event.of(this, arguments), extent1 = {
	          x: xExtent,
	          y: yExtent,
	          i: xExtentDomain,
	          j: yExtentDomain
	        }, extent0 = this.__chart__ || extent1;
	        this.__chart__ = extent1;
	        if (d3_transitionInheritId) {
	          d3.select(this).transition().each("start.brush", function() {
	            xExtentDomain = extent0.i;
	            yExtentDomain = extent0.j;
	            xExtent = extent0.x;
	            yExtent = extent0.y;
	            event_({
	              type: "brushstart"
	            });
	          }).tween("brush:brush", function() {
	            var xi = d3_interpolateArray(xExtent, extent1.x), yi = d3_interpolateArray(yExtent, extent1.y);
	            xExtentDomain = yExtentDomain = null;
	            return function(t) {
	              xExtent = extent1.x = xi(t);
	              yExtent = extent1.y = yi(t);
	              event_({
	                type: "brush",
	                mode: "resize"
	              });
	            };
	          }).each("end.brush", function() {
	            xExtentDomain = extent1.i;
	            yExtentDomain = extent1.j;
	            event_({
	              type: "brush",
	              mode: "resize"
	            });
	            event_({
	              type: "brushend"
	            });
	          });
	        } else {
	          event_({
	            type: "brushstart"
	          });
	          event_({
	            type: "brush",
	            mode: "resize"
	          });
	          event_({
	            type: "brushend"
	          });
	        }
	      });
	    };
	    function redraw(g) {
	      g.selectAll(".resize").attr("transform", function(d) {
	        return "translate(" + xExtent[+/e$/.test(d)] + "," + yExtent[+/^s/.test(d)] + ")";
	      });
	    }
	    function redrawX(g) {
	      g.select(".extent").attr("x", xExtent[0]);
	      g.selectAll(".extent,.n>rect,.s>rect").attr("width", xExtent[1] - xExtent[0]);
	    }
	    function redrawY(g) {
	      g.select(".extent").attr("y", yExtent[0]);
	      g.selectAll(".extent,.e>rect,.w>rect").attr("height", yExtent[1] - yExtent[0]);
	    }
	    function brushstart() {
	      var target = this, eventTarget = d3.select(d3.event.target), event_ = event.of(target, arguments), g = d3.select(target), resizing = eventTarget.datum(), resizingX = !/^(n|s)$/.test(resizing) && x, resizingY = !/^(e|w)$/.test(resizing) && y, dragging = eventTarget.classed("extent"), dragRestore = d3_event_dragSuppress(target), center, origin = d3.mouse(target), offset;
	      var w = d3.select(d3_window(target)).on("keydown.brush", keydown).on("keyup.brush", keyup);
	      if (d3.event.changedTouches) {
	        w.on("touchmove.brush", brushmove).on("touchend.brush", brushend);
	      } else {
	        w.on("mousemove.brush", brushmove).on("mouseup.brush", brushend);
	      }
	      g.interrupt().selectAll("*").interrupt();
	      if (dragging) {
	        origin[0] = xExtent[0] - origin[0];
	        origin[1] = yExtent[0] - origin[1];
	      } else if (resizing) {
	        var ex = +/w$/.test(resizing), ey = +/^n/.test(resizing);
	        offset = [ xExtent[1 - ex] - origin[0], yExtent[1 - ey] - origin[1] ];
	        origin[0] = xExtent[ex];
	        origin[1] = yExtent[ey];
	      } else if (d3.event.altKey) center = origin.slice();
	      g.style("pointer-events", "none").selectAll(".resize").style("display", null);
	      d3.select("body").style("cursor", eventTarget.style("cursor"));
	      event_({
	        type: "brushstart"
	      });
	      brushmove();
	      function keydown() {
	        if (d3.event.keyCode == 32) {
	          if (!dragging) {
	            center = null;
	            origin[0] -= xExtent[1];
	            origin[1] -= yExtent[1];
	            dragging = 2;
	          }
	          d3_eventPreventDefault();
	        }
	      }
	      function keyup() {
	        if (d3.event.keyCode == 32 && dragging == 2) {
	          origin[0] += xExtent[1];
	          origin[1] += yExtent[1];
	          dragging = 0;
	          d3_eventPreventDefault();
	        }
	      }
	      function brushmove() {
	        var point = d3.mouse(target), moved = false;
	        if (offset) {
	          point[0] += offset[0];
	          point[1] += offset[1];
	        }
	        if (!dragging) {
	          if (d3.event.altKey) {
	            if (!center) center = [ (xExtent[0] + xExtent[1]) / 2, (yExtent[0] + yExtent[1]) / 2 ];
	            origin[0] = xExtent[+(point[0] < center[0])];
	            origin[1] = yExtent[+(point[1] < center[1])];
	          } else center = null;
	        }
	        if (resizingX && move1(point, x, 0)) {
	          redrawX(g);
	          moved = true;
	        }
	        if (resizingY && move1(point, y, 1)) {
	          redrawY(g);
	          moved = true;
	        }
	        if (moved) {
	          redraw(g);
	          event_({
	            type: "brush",
	            mode: dragging ? "move" : "resize"
	          });
	        }
	      }
	      function move1(point, scale, i) {
	        var range = d3_scaleRange(scale), r0 = range[0], r1 = range[1], position = origin[i], extent = i ? yExtent : xExtent, size = extent[1] - extent[0], min, max;
	        if (dragging) {
	          r0 -= position;
	          r1 -= size + position;
	        }
	        min = (i ? yClamp : xClamp) ? Math.max(r0, Math.min(r1, point[i])) : point[i];
	        if (dragging) {
	          max = (min += position) + size;
	        } else {
	          if (center) position = Math.max(r0, Math.min(r1, 2 * center[i] - min));
	          if (position < min) {
	            max = min;
	            min = position;
	          } else {
	            max = position;
	          }
	        }
	        if (extent[0] != min || extent[1] != max) {
	          if (i) yExtentDomain = null; else xExtentDomain = null;
	          extent[0] = min;
	          extent[1] = max;
	          return true;
	        }
	      }
	      function brushend() {
	        brushmove();
	        g.style("pointer-events", "all").selectAll(".resize").style("display", brush.empty() ? "none" : null);
	        d3.select("body").style("cursor", null);
	        w.on("mousemove.brush", null).on("mouseup.brush", null).on("touchmove.brush", null).on("touchend.brush", null).on("keydown.brush", null).on("keyup.brush", null);
	        dragRestore();
	        event_({
	          type: "brushend"
	        });
	      }
	    }
	    brush.x = function(z) {
	      if (!arguments.length) return x;
	      x = z;
	      resizes = d3_svg_brushResizes[!x << 1 | !y];
	      return brush;
	    };
	    brush.y = function(z) {
	      if (!arguments.length) return y;
	      y = z;
	      resizes = d3_svg_brushResizes[!x << 1 | !y];
	      return brush;
	    };
	    brush.clamp = function(z) {
	      if (!arguments.length) return x && y ? [ xClamp, yClamp ] : x ? xClamp : y ? yClamp : null;
	      if (x && y) xClamp = !!z[0], yClamp = !!z[1]; else if (x) xClamp = !!z; else if (y) yClamp = !!z;
	      return brush;
	    };
	    brush.extent = function(z) {
	      var x0, x1, y0, y1, t;
	      if (!arguments.length) {
	        if (x) {
	          if (xExtentDomain) {
	            x0 = xExtentDomain[0], x1 = xExtentDomain[1];
	          } else {
	            x0 = xExtent[0], x1 = xExtent[1];
	            if (x.invert) x0 = x.invert(x0), x1 = x.invert(x1);
	            if (x1 < x0) t = x0, x0 = x1, x1 = t;
	          }
	        }
	        if (y) {
	          if (yExtentDomain) {
	            y0 = yExtentDomain[0], y1 = yExtentDomain[1];
	          } else {
	            y0 = yExtent[0], y1 = yExtent[1];
	            if (y.invert) y0 = y.invert(y0), y1 = y.invert(y1);
	            if (y1 < y0) t = y0, y0 = y1, y1 = t;
	          }
	        }
	        return x && y ? [ [ x0, y0 ], [ x1, y1 ] ] : x ? [ x0, x1 ] : y && [ y0, y1 ];
	      }
	      if (x) {
	        x0 = z[0], x1 = z[1];
	        if (y) x0 = x0[0], x1 = x1[0];
	        xExtentDomain = [ x0, x1 ];
	        if (x.invert) x0 = x(x0), x1 = x(x1);
	        if (x1 < x0) t = x0, x0 = x1, x1 = t;
	        if (x0 != xExtent[0] || x1 != xExtent[1]) xExtent = [ x0, x1 ];
	      }
	      if (y) {
	        y0 = z[0], y1 = z[1];
	        if (x) y0 = y0[1], y1 = y1[1];
	        yExtentDomain = [ y0, y1 ];
	        if (y.invert) y0 = y(y0), y1 = y(y1);
	        if (y1 < y0) t = y0, y0 = y1, y1 = t;
	        if (y0 != yExtent[0] || y1 != yExtent[1]) yExtent = [ y0, y1 ];
	      }
	      return brush;
	    };
	    brush.clear = function() {
	      if (!brush.empty()) {
	        xExtent = [ 0, 0 ], yExtent = [ 0, 0 ];
	        xExtentDomain = yExtentDomain = null;
	      }
	      return brush;
	    };
	    brush.empty = function() {
	      return !!x && xExtent[0] == xExtent[1] || !!y && yExtent[0] == yExtent[1];
	    };
	    return d3.rebind(brush, event, "on");
	  };
	  var d3_svg_brushCursor = {
	    n: "ns-resize",
	    e: "ew-resize",
	    s: "ns-resize",
	    w: "ew-resize",
	    nw: "nwse-resize",
	    ne: "nesw-resize",
	    se: "nwse-resize",
	    sw: "nesw-resize"
	  };
	  var d3_svg_brushResizes = [ [ "n", "e", "s", "w", "nw", "ne", "se", "sw" ], [ "e", "w" ], [ "n", "s" ], [] ];
	  var d3_time_format = d3_time.format = d3_locale_enUS.timeFormat;
	  var d3_time_formatUtc = d3_time_format.utc;
	  var d3_time_formatIso = d3_time_formatUtc("%Y-%m-%dT%H:%M:%S.%LZ");
	  d3_time_format.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z") ? d3_time_formatIsoNative : d3_time_formatIso;
	  function d3_time_formatIsoNative(date) {
	    return date.toISOString();
	  }
	  d3_time_formatIsoNative.parse = function(string) {
	    var date = new Date(string);
	    return isNaN(date) ? null : date;
	  };
	  d3_time_formatIsoNative.toString = d3_time_formatIso.toString;
	  d3_time.second = d3_time_interval(function(date) {
	    return new d3_date(Math.floor(date / 1e3) * 1e3);
	  }, function(date, offset) {
	    date.setTime(date.getTime() + Math.floor(offset) * 1e3);
	  }, function(date) {
	    return date.getSeconds();
	  });
	  d3_time.seconds = d3_time.second.range;
	  d3_time.seconds.utc = d3_time.second.utc.range;
	  d3_time.minute = d3_time_interval(function(date) {
	    return new d3_date(Math.floor(date / 6e4) * 6e4);
	  }, function(date, offset) {
	    date.setTime(date.getTime() + Math.floor(offset) * 6e4);
	  }, function(date) {
	    return date.getMinutes();
	  });
	  d3_time.minutes = d3_time.minute.range;
	  d3_time.minutes.utc = d3_time.minute.utc.range;
	  d3_time.hour = d3_time_interval(function(date) {
	    var timezone = date.getTimezoneOffset() / 60;
	    return new d3_date((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);
	  }, function(date, offset) {
	    date.setTime(date.getTime() + Math.floor(offset) * 36e5);
	  }, function(date) {
	    return date.getHours();
	  });
	  d3_time.hours = d3_time.hour.range;
	  d3_time.hours.utc = d3_time.hour.utc.range;
	  d3_time.month = d3_time_interval(function(date) {
	    date = d3_time.day(date);
	    date.setDate(1);
	    return date;
	  }, function(date, offset) {
	    date.setMonth(date.getMonth() + offset);
	  }, function(date) {
	    return date.getMonth();
	  });
	  d3_time.months = d3_time.month.range;
	  d3_time.months.utc = d3_time.month.utc.range;
	  function d3_time_scale(linear, methods, format) {
	    function scale(x) {
	      return linear(x);
	    }
	    scale.invert = function(x) {
	      return d3_time_scaleDate(linear.invert(x));
	    };
	    scale.domain = function(x) {
	      if (!arguments.length) return linear.domain().map(d3_time_scaleDate);
	      linear.domain(x);
	      return scale;
	    };
	    function tickMethod(extent, count) {
	      var span = extent[1] - extent[0], target = span / count, i = d3.bisect(d3_time_scaleSteps, target);
	      return i == d3_time_scaleSteps.length ? [ methods.year, d3_scale_linearTickRange(extent.map(function(d) {
	        return d / 31536e6;
	      }), count)[2] ] : !i ? [ d3_time_scaleMilliseconds, d3_scale_linearTickRange(extent, count)[2] ] : methods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target ? i - 1 : i];
	    }
	    scale.nice = function(interval, skip) {
	      var domain = scale.domain(), extent = d3_scaleExtent(domain), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" && tickMethod(extent, interval);
	      if (method) interval = method[0], skip = method[1];
	      function skipped(date) {
	        return !isNaN(date) && !interval.range(date, d3_time_scaleDate(+date + 1), skip).length;
	      }
	      return scale.domain(d3_scale_nice(domain, skip > 1 ? {
	        floor: function(date) {
	          while (skipped(date = interval.floor(date))) date = d3_time_scaleDate(date - 1);
	          return date;
	        },
	        ceil: function(date) {
	          while (skipped(date = interval.ceil(date))) date = d3_time_scaleDate(+date + 1);
	          return date;
	        }
	      } : interval));
	    };
	    scale.ticks = function(interval, skip) {
	      var extent = d3_scaleExtent(scale.domain()), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" ? tickMethod(extent, interval) : !interval.range && [ {
	        range: interval
	      }, skip ];
	      if (method) interval = method[0], skip = method[1];
	      return interval.range(extent[0], d3_time_scaleDate(+extent[1] + 1), skip < 1 ? 1 : skip);
	    };
	    scale.tickFormat = function() {
	      return format;
	    };
	    scale.copy = function() {
	      return d3_time_scale(linear.copy(), methods, format);
	    };
	    return d3_scale_linearRebind(scale, linear);
	  }
	  function d3_time_scaleDate(t) {
	    return new Date(t);
	  }
	  var d3_time_scaleSteps = [ 1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6 ];
	  var d3_time_scaleLocalMethods = [ [ d3_time.second, 1 ], [ d3_time.second, 5 ], [ d3_time.second, 15 ], [ d3_time.second, 30 ], [ d3_time.minute, 1 ], [ d3_time.minute, 5 ], [ d3_time.minute, 15 ], [ d3_time.minute, 30 ], [ d3_time.hour, 1 ], [ d3_time.hour, 3 ], [ d3_time.hour, 6 ], [ d3_time.hour, 12 ], [ d3_time.day, 1 ], [ d3_time.day, 2 ], [ d3_time.week, 1 ], [ d3_time.month, 1 ], [ d3_time.month, 3 ], [ d3_time.year, 1 ] ];
	  var d3_time_scaleLocalFormat = d3_time_format.multi([ [ ".%L", function(d) {
	    return d.getMilliseconds();
	  } ], [ ":%S", function(d) {
	    return d.getSeconds();
	  } ], [ "%I:%M", function(d) {
	    return d.getMinutes();
	  } ], [ "%I %p", function(d) {
	    return d.getHours();
	  } ], [ "%a %d", function(d) {
	    return d.getDay() && d.getDate() != 1;
	  } ], [ "%b %d", function(d) {
	    return d.getDate() != 1;
	  } ], [ "%B", function(d) {
	    return d.getMonth();
	  } ], [ "%Y", d3_true ] ]);
	  var d3_time_scaleMilliseconds = {
	    range: function(start, stop, step) {
	      return d3.range(Math.ceil(start / step) * step, +stop, step).map(d3_time_scaleDate);
	    },
	    floor: d3_identity,
	    ceil: d3_identity
	  };
	  d3_time_scaleLocalMethods.year = d3_time.year;
	  d3_time.scale = function() {
	    return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat);
	  };
	  var d3_time_scaleUtcMethods = d3_time_scaleLocalMethods.map(function(m) {
	    return [ m[0].utc, m[1] ];
	  });
	  var d3_time_scaleUtcFormat = d3_time_formatUtc.multi([ [ ".%L", function(d) {
	    return d.getUTCMilliseconds();
	  } ], [ ":%S", function(d) {
	    return d.getUTCSeconds();
	  } ], [ "%I:%M", function(d) {
	    return d.getUTCMinutes();
	  } ], [ "%I %p", function(d) {
	    return d.getUTCHours();
	  } ], [ "%a %d", function(d) {
	    return d.getUTCDay() && d.getUTCDate() != 1;
	  } ], [ "%b %d", function(d) {
	    return d.getUTCDate() != 1;
	  } ], [ "%B", function(d) {
	    return d.getUTCMonth();
	  } ], [ "%Y", d3_true ] ]);
	  d3_time_scaleUtcMethods.year = d3_time.year.utc;
	  d3_time.scale.utc = function() {
	    return d3_time_scale(d3.scale.linear(), d3_time_scaleUtcMethods, d3_time_scaleUtcFormat);
	  };
	  d3.text = d3_xhrType(function(request) {
	    return request.responseText;
	  });
	  d3.json = function(url, callback) {
	    return d3_xhr(url, "application/json", d3_json, callback);
	  };
	  function d3_json(request) {
	    return JSON.parse(request.responseText);
	  }
	  d3.html = function(url, callback) {
	    return d3_xhr(url, "text/html", d3_html, callback);
	  };
	  function d3_html(request) {
	    var range = d3_document.createRange();
	    range.selectNode(d3_document.body);
	    return range.createContextualFragment(request.responseText);
	  }
	  d3.xml = d3_xhrType(function(request) {
	    return request.responseXML;
	  });
	  if (true) this.d3 = d3, !(__WEBPACK_AMD_DEFINE_FACTORY__ = (d3), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); else if (typeof module === "object" && module.exports) module.exports = d3; else this.d3 = d3;
	}();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	!function(n,t){ true?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.fornac=t():n.fornac=t()}(this,function(){return function(n){function t(r){if(e[r])return e[r].exports;var i=e[r]={exports:{},id:r,loaded:!1};return n[r].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var e={};return t.m=n,t.c=e,t.p="",t(0)}([function(n,t,e){"use strict";function a(n){return n&&n.__esModule?n:{"default":n}}function o(n,t){function e(n){return Math.sqrt(n[0]*n[0]+n[1]*n[1])}function a(n){var t=n,r=n.prevNode,i=6;if(null!==r&&n.linked){var a=[-(t.x-r.x),-(t.y-r.y)];a=[a[0]/e(a),a[1]/e(a)];var o=[-a[1],a[0]],u=[n.radius*a[0],n.radius*a[1]],l="M"+(u[0]+i*(a[0]+o[0])/2)+","+(u[1]+i*(a[1]+o[1])/2)+"L"+u[0]+","+u[1]+"L"+(u[0]+i*(a[0]-o[0])/2)+","+(u[1]+i*(a[1]-o[1])/2);s["default"].select(this).attr("d",l)}}function o(n){return"basepair"==n.linkType||"backbone"==n.linkType||"pseudoknot"==n.linkType||"label_link"==n.linkType||"external"==n.linkType||"chain_chain"==n.linkType}function u(n,t,e){return n.hasOwnProperty(t.num)?(val=parseFloat(n[t.num]),isNaN(val)?n[t.num]:e(val)):"white"}function f(){}function h(){A&&(mpos=s["default"].mouse(O.node()),j.attr("x1",A.x).attr("y1",A.y).attr("x2",mpos[0]).attr("y2",mpos[1]))}function p(){A&&j.attr("class","drag_line_hidden"),v()}function g(){var n=D.selectAll("g.gnode").selectAll(".outline_node");n.each(function(n){n.selected=!1,n.previouslySelected=!1}),n.classed("selected",!1)}function d(){O.attr("transform","translate("+s["default"].event.translate+") scale("+s["default"].event.scale+")")}function v(){A=null,L=null,S=null}function m(n){var t=D.selectAll("g.gnode");return I?t.filter(function(n){return n.selected}):t.filter(function(n){return n.selected})}function y(n){if(s["default"].event.sourceEvent.stopPropagation(),!n.selected&&!I){var t=D.selectAll("g.gnode").selectAll(".outline_node");t.classed("selected",function(n){return n.selected=_.options.applyForce&&(n.previouslySelected=!1)})}s["default"].select(this).select(".outline_node").classed("selected",function(t){return n.previouslySelected=n.selected,n.selected=_.options.applyForce&&!0});var e=m(n);e.each(function(n){n.fixed|=2})}function x(n){var t=m(n);t.each(function(n){n.x+=s["default"].event.dx,n.y+=s["default"].event.dy,n.px+=s["default"].event.dx,n.py+=s["default"].event.dy}),_.resumeForce(),s["default"].event.sourceEvent.preventDefault()}function k(n){var t=m(n);t.each(function(n){n.fixed&=-7})}function M(n){var t=n.radius+16,e=n.x-t,r=n.x+t,i=n.y-t,a=n.y+t;return function(t,o,u,s,l){if(t.point&&t.point!==n){var c=n.x-t.point.x,f=n.y-t.point.y,h=Math.sqrt(c*c+f*f),p=n.radius+t.point.radius;p>h&&(h=(h-p)/h*.1,n.x-=c*=h,n.y-=f*=h,t.point.x+=c,t.point.y+=f)}return o>r||e>s||u>a||i>l}}function b(){if(!_.deaf&&!F){switch(s["default"].event.keyCode){case 16:F=!0;break;case 17:I=!0;break;case 67:_.centerView()}(F||I)&&(P.call(_.zoomer).on("mousedown.zoom",null).on("touchstart.zoom",null).on("touchmove.zoom",null).on("touchend.zoom",null),O.selectAll("g.gnode").on("mousedown.drag",null)),I&&(R.select(".background").style("cursor","crosshair"),R.call(_.brusher))}}function w(){F=!1,I=!1,R.call(_.brusher).on("mousedown.brush",null).on("touchstart.brush",null).on("touchmove.brush",null).on("touchend.brush",null),R.select(".background").style("cursor","auto"),P.call(_.zoomer),O.selectAll("g.gnode").call(B)}var _=this;if(_.options={displayAllLinks:!1,labelInterval:10,applyForce:!0,initialSize:null,allowPanningAndZooming:!0,transitionDuration:500,resizeSvgOnResize:!0},arguments.length>1)for(var N in t)_.options.hasOwnProperty(N)&&(_.options[N]=t[N]);null!==_.options.initialSize?(_.options.svgW=_.options.initialSize[0],_.options.svgH=_.options.initialSize[1]):(_.options.svgW=800,_.options.svgH=800);var S=(s["default"].scale.category20(),null),A=null,L=null,E=s["default"].scale.linear().domain([0,_.options.svgW]).range([0,_.options.svgW]),T=s["default"].scale.linear().domain([0,_.options.svgH]).range([0,_.options.svgH]),C=_.graph={nodes:[],links:[]};_.linkStrengths={pseudoknot:0,proteinChain:0,chainChain:0,intermolecule:10,external:0,other:10},_.displayParameters={displayBackground:"true",displayNumbering:"true",displayNodeOutline:"true",displayNodeLabel:"true",displayLinks:"true",displayPseudoknotLinks:"true",displayProteinLinks:"true"},_.colorScheme="structure",_.customColors={},_.animation=_.options.applyForce,_.deaf=!1,_.rnas={},_.extraLinks=[],Array.prototype.equals=function(n){if(!n)return!1;if(this.length!=n.length)return!1;for(var t=0,e=this.length;e>t;t++)if(this[t]instanceof Array&&n[t]instanceof Array){if(!this[t].equals(n[t]))return!1}else if(this[t]!=n[t])return!1;return!0},_.createInitialLayout=function(n,t){var e={sequence:"",name:"empty",positions:[],labelInterval:_.options.labelInterval,avoidOthers:!0,uids:[],circularizeExternal:!0};if(2==arguments.length)for(var r in t)e.hasOwnProperty(r)&&(e[r]=t[r]);var i=new l.RNAGraph(e.sequence,n,e.name);i.circularizeExternal=e.circularizeExternal;var a=i.recalculateElements();return 0===e.positions.length&&(e.positions=(0,c.simpleXyCoordinates)(a.pairtable)),a=a.elementsToJson().addUids(e.uids).addPositions("nucleotide",e.positions).addLabels(1,e.labelInterval).reinforceStems().reinforceLoops().connectFakeNodes().reassignLinkUids().breakNodesToFakeNodes()},_.addRNA=function(n,t){var e=_.createInitialLayout(n,t);if(1===arguments.length&&(t={}),"extraLinks"in t){var r=_.addExternalLinks(e,t.extraLinks);_.extraLinks=_.extraLinks.concat(r)}return"avoidOthers"in t?_.addRNAJSON(e,t.avoidOthers):_.addRNAJSON(e,!0),e},_.addExternalLinks=function(n,t){for(var e=[],r=0;r<t.length;r++){var i={linkType:"external",value:1,uid:generateUUID(),source:null,target:null};if("[object Array]"===Object.prototype.toString.call(t[r][0])){for(var a=0;a<n.nodes.length;a++)if("nucs"in n.nodes[a]&&n.nodes[a].nucs.equals(t[r][0])){i.source=n.nodes[a];break}}else for(var a=0;a<n.nodes.length;a++)n.nodes[a].num==t[r][0]&&(i.source=n.nodes[a]);if("[object Array]"===Object.prototype.toString.call(t[r][1]))for(var a=0;a<n.nodes.length;a++)"nucs"in n.nodes[a]&&n.nodes[a].nucs.equals(t[r][1])&&(i.target=n.nodes[a]);else for(var a=0;a<n.nodes.length;a++)n.nodes[a].num==t[r][1]&&(i.target=n.nodes[a]);null!=i.source&&null!=i.target?e.push(i):console.log("ERROR: source or target of new link not found:",i,t[r])}return e},_.addRNAJSON=function(n,t){var e,r;return t&&(e=_.graph.nodes.length>0?s["default"].max(_.graph.nodes.map(function(n){return n.x})):0,r=s["default"].min(n.nodes.map(function(n){return n.x})),n.nodes.forEach(function(n){n.x+=e-r+20,n.px+=e-r})),n.nodes.forEach(function(t){t.rna=n}),_.rnas[n.uid]=n,_.recalculateGraph(),_.update(),_.centerView(),n},_.transitionRNA=function(n,t){function e(n,t){0===n.size()&&setTimeout(t,i);var e=0;n.each(function(){++e}).each("end",function(){--e||t.apply(this,arguments)})}function r(){_.createNewLinks(f.enter());_.graph.links=f.data(),_.updateStyle(),"undefined"!=typeof t&&t()}var i=_.options.transitionDuration,u=_.graph.nodes.filter(function(n){return"nucleotide"==n.nodeType}).map(function(n){return n.uid}),s={uids:u},l=_.createInitialLayout(n,s),c=D.selectAll("g.gnode").data(l.nodes,V),i=_.options.transitionDuration;0===i?c.attr("transform",function(n){return"translate("+[n.x,n.y]+")"}):c.transition().attr("transform",function(n){return"translate("+[n.x,n.y]+")"}).duration(i);var f=U.selectAll("line.link").data(l.links.filter(o),H),h=_.createNewNodes(c.enter()).attr("transform",function(n){return"undefined"!=typeof n.x&&"undefined"!=typeof n.y?"translate("+[0,0]+")":""});if(0===i?c.exit().remove():c.exit().transition().attr("transform",function(n){return"undefined"!=typeof n.x&&"undefined"!=typeof n.y?"translate("+[0,0]+")":""}),c.select("path").each(a),_.graph.nodes=c.data(),_.updateStyle(),_.centerView(i),f.exit().remove(),0===i){f.attr("x1",function(n){return n.source.x}).attr("y1",function(n){return n.source.y}).attr("x2",function(n){return n.target.x}).attr("y2",function(n){return n.target.y});_.createNewLinks(f.enter());_.graph.links=f.data(),_.updateStyle()}else f.transition().attr("x1",function(n){return n.source.x}).attr("y1",function(n){return n.source.y}).attr("x2",function(n){return n.target.x}).attr("y2",function(n){return n.target.y}).duration(i).call(e,r);0===i?h.attr("transform",function(n){return"undefined"!=typeof n.x&&"undefined"!=typeof n.y?"translate("+[n.x,n.y]+")":""}):h.transition().attr("transform",function(n){return"undefined"!=typeof n.x&&"undefined"!=typeof n.y?"translate("+[n.x,n.y]+")":""})},_.recalculateGraph=function(){_.graph.nodes=[],_.graph.links=[];for(var n in _.rnas)_.graph.nodes=_.graph.nodes.concat(_.rnas[n].nodes),_.graph.links=_.graph.links.concat(_.rnas[n].links);for(var t={},e=0;e<_.graph.nodes.length;e++)t[_.graph.nodes[e].uid]=_.graph.nodes[e];for(_.graph.links.forEach(function(n){n.source=t[n.source.uid],n.target=t[n.target.uid]}),e=0;e<_.extraLinks.length;e++){if(_.extraLinks[e].target.uid in t||console.log("not there:",_.extraLinks[e]),_.extraLinks[e].source=t[_.extraLinks[e].source.uid],_.extraLinks[e].target=t[_.extraLinks[e].target.uid],"intermolecule"==_.extraLinks[e].linkType){fakeLinks=_.graph.links.filter(function(n){return(n.source==_.extraLinks[e].source||n.source==_.extraLinks[e].target||n.target==_.extraLinks[e].source||n.target==_.extraLinks[e].source)&&"fake"==n.linkType});for(var r=0;r<fakeLinks.length;r++){var i=_.graph.links.indexOf(fakeLinks[r]);_.graph.links.splice(i,1)}}C.links.push(_.extraLinks[e])}},_.addNodes=function(n){n.links.forEach(function(t){"number"==typeof t.source&&(t.source=n.nodes[t.source]),"number"==typeof t.target&&(t.target=n.nodes[t.target])}),_.graph.nodes.length>0?(maxX=s["default"].max(_.graph.nodes.map(function(n){return n.x})),maxY=s["default"].max(_.graph.nodes.map(function(n){return n.y}))):(maxX=0,maxY=0),n.nodes.forEach(function(n){n.rna.uid in _.rnas||(_.rnas[n.rna.uid]=n.rna),n.x+=maxX,n.px+=maxX}),r=new l.RNAGraph("",""),r.nodes=n.nodes,r.links=n.links,_.recalculateGraph(),_.update(),_.centerView()},_.addCustomColors=function(n){_.customColors=n},_.clearNodes=function(){_.graph.nodes=[],_.graph.links=[],_.rnas={},_.extraLinks=[],_.update()},_.toJSON=function(){var n={rnas:_.rnas,extraLinks:_.extraLinks},t=JSON.stringify(n,function(n,t){return"rna"==n?void 0:t},"	");return t},_.fromJSON=function(n){var t,e;try{var i=JSON.parse(n);t=i.rnas,e=i.extraLinks}catch(a){throw a}for(var o in t)"rna"==t[o].type?(r=new l.RNAGraph,r.seq=t[o].seq,r.dotbracket=t[o].dotbracket,r.circular=t[o].circular,r.pairtable=t[o].pairtable,r.uid=t[o].uid,r.structName=t[o].structName,r.nodes=t[o].nodes,r.links=t[o].links,r.rnaLength=t[o].rnaLength,r.elements=t[o].elements,r.nucsToNodes=t[o].nucsToNodes,r.pseudoknotPairs=t[o].pseudoknotPairs):(r=new ProteinGraph,r.size=t[o].size,r.nodes=t[o].nodes,r.uid=t[o].uid),_.addRNAJSON(r,!1);e.forEach(function(n){_.extraLinks.push(n)}),_.recalculateGraph(),_.update()},_.setSize=function(){if(null==_.options.initialSize){var t=s["default"].select(n).node().offsetHeight,e=s["default"].select(n).node().offsetWidth;_.options.svgW=e,_.options.svgH=t,E.range([0,e]).domain([0,e]),T.range([0,t]).domain([0,t]),_.zoomer.x(E).y(T),_.brusher.x(E).y(T),_.centerView(),_.options.resizeSvgOnResize&&(q.attr("width",e).attr("height",t),z.attr("width",e).attr("height",t))}},_.setOutlineColor=function(n){var t=D.selectAll("g.gnode").select("[node_type=nucleotide]");t.style("fill",n)},_.changeColorScheme=function(n){var t=D.selectAll("[node_type=protein]");t.classed("protein",!0).attr("r",function(n){return n.radius});var e=(D.selectAll("g.gnode"),D.selectAll("g.gnode").selectAll("circle"),D.selectAll("g.gnode").select("[node_type=nucleotide]"));if(_.colorScheme=n,"sequence"==n){var r=s["default"].scale.ordinal().range(["#dbdb8d","#98df8a","#ff9896","#aec7e8","#aec7e8"]).domain(["A","C","G","U","T"]);e.style("fill",function(n){return r(n.name)})}else if("structure"==n){var r=s["default"].scale.category10().domain(["s","m","i","e","t","h","x"]).range(["lightgreen","#ff9896","#dbdb8d","lightsalmon","lightcyan","lightblue","transparent"]);e.style("fill",function(n){return r(n.elemType)})}else if("positions"==n)e.style("fill",function(n){var t=s["default"].scale.linear().range(["#98df8a","#dbdb8d","#ff9896"]).interpolate(s["default"].interpolateLab).domain([1,1+(n.rna.rnaLength-1)/2,n.rna.rnaLength]);return t(n.num)});else if("custom"==n){var r=s["default"].scale.linear().interpolate(s["default"].interpolateLab).domain(_.customColors.domain).range(_.customColors.range);e.style("fill",function(n){return"undefined"==typeof _.customColors?"white":_.customColors.colorValues.hasOwnProperty(n.structName)&&_.customColors.colorValues[n.structName].hasOwnProperty(n.num)?(moleculeColors=_.customColors.colorValues[n.structName],u(moleculeColors,n,r)):_.customColors.colorValues.hasOwnProperty("")?(moleculeColors=_.customColors.colorValues[""],u(moleculeColors,n,r)):"white"})}},window.addEventListener("resize",_.setSize,!1),_.zoomer=s["default"].behavior.zoom().scaleExtent([.1,10]).x(E).y(T).on("zoomstart",g).on("zoom",d),s["default"].select(n).select("svg").remove();var z=s["default"].select(n).attr("tabindex",1).on("keydown.brush",b).on("keyup.brush",w).each(function(){this.focus()}).append("svg:svg").attr("width",_.options.svgW).attr("height",_.options.svgH).attr("id","plotting-area");_.options.svg=z;var P=z.append("svg:g").on("mousemove",h).on("mousedown",f).on("mouseup",p);_.options.allowPanningAndZooming&&P.call(_.zoomer);var q=P.append("svg:rect").attr("width",_.options.svgW).attr("height",_.options.svgH).attr("fill","white").attr("stroke","grey").attr("stroke-width",1).attr("id","zrect"),R=P.append("g").datum(function(){return{selected:!1,previouslySelected:!1}}).attr("class","brush"),O=P.append("svg:g"),U=O.append("svg:g"),D=O.append("svg:g");_.brusher=s["default"].svg.brush().x(E).y(T).on("brushstart",function(n){var t=D.selectAll("g.gnode").selectAll(".outline_node");t.each(function(n){n.previouslySelected=I&&n.selected})}).on("brush",function(){var n=D.selectAll("g.gnode").selectAll(".outline_node"),t=s["default"].event.target.extent();n.classed("selected",function(n){return n.selected=_.options.applyForce&&n.previouslySelected^(t[0][0]<=n.x&&n.x<t[1][0]&&t[0][1]<=n.y&&n.y<t[1][1])})}).on("brushend",function(){s["default"].event.target.clear(),s["default"].select(this).call(s["default"].event.target)}),R.call(_.brusher).on("mousedown.brush",null).on("touchstart.brush",null).on("touchmove.brush",null).on("touchend.brush",null),R.select(".background").style("cursor","auto"),_.getBoundingBoxTransform=function(){if(0===_.graph.nodes.length)return{translate:[0,0],scale:1};var n=s["default"].min(_.graph.nodes.map(function(n){return n.x})),t=s["default"].min(_.graph.nodes.map(function(n){return n.y})),e=s["default"].max(_.graph.nodes.map(function(n){return n.x})),r=s["default"].max(_.graph.nodes.map(function(n){return n.y})),i=e-n,a=r-t,o=_.options.svgW/(i+1),u=_.options.svgH/(a+1),l=.8*Math.min(o,u),c=i*l,f=a*l,h=-n*l+(_.options.svgW-c)/2,p=-t*l+(_.options.svgH-f)/2;return{translate:[h,p],scale:l}},_.centerView=function(n){0===arguments.length&&(n=0);var t=_.getBoundingBoxTransform();null!==t&&(O.transition().attr("transform","translate("+t.translate+") scale("+t.scale+")").duration(n),_.zoomer.translate(t.translate),_.zoomer.scale(t.scale))},_.force=s["default"].layout.force().charge(function(n){return"middle"==n.nodeType,-30}).chargeDistance(300).friction(.35).linkDistance(function(n){return 15*n.value}).linkStrength(function(n){return n.linkType in _.linkStrengths?_.linkStrengths[n.linkType]:_.linkStrengths.other}).gravity(0).nodes(_.graph.nodes).links(_.graph.links).chargeDistance(110).size([_.options.svgW,_.options.svgH]);var j=O.append("line").attr("class","drag_line").attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",0),F=!1,I=!1;_.resumeForce=function(){_.animation&&_.force.resume()};var B=s["default"].behavior.drag().on("dragstart",y).on("drag",x).on("dragend",k);s["default"].select(n).on("keydown",b).on("keyup",w).on("contextmenu",function(){s["default"].event.preventDefault()});var H=function(n){return n.uid},V=function(n){var t=n.uid;return t},Y=function(n){var t=n.getPositions("nucleotide"),e=n.getPositions("label"),r=n.getUids();n.recalculateElements().elementsToJson().addPseudoknots().addPositions("nucleotide",t).addUids(r).addLabels(1,_.options.labelInterval).addPositions("label",e).reinforceStems().reinforceLoops().updateLinkUids()},J=function(n){if(index=_.graph.links.indexOf(n),index>-1){if(n.source.rna==n.target.rna){var t=n.source.rna;t.addPseudoknots(),t.pairtable[n.source.num]=0,t.pairtable[n.target.num]=0,Y(t)}else extraLinkIndex=_.extraLinks.indexOf(n),_.extraLinks.splice(extraLinkIndex,1);_.recalculateGraph()}_.update()},G=function(n){if(F){var t={backbone:!0,fake:!0,fake_fake:!0,label_link:!0};n.linkType in t||J(n)}};_.addLink=function(n){n.source.rna==n.target.rna?(r=n.source.rna,r.pairtable[n.source.num]=n.target.num,r.pairtable[n.target.num]=n.source.num,Y(r)):(n.linkType="intermolecule",_.extraLinks.push(n)),_.recalculateGraph(),_.update()};var Z=function(n){if(!s["default"].event.defaultPrevented){if(!I){var t=D.selectAll("g.gnode").selectAll(".outline_node");t.classed("selected",function(n){return n.selected=_.options.applyForce&&(n.previouslySelected=!1)})}s["default"].select(this).select("circle").classed("selected",n.selected=_.options.applyForce&&!n.previouslySelected)}},X=function(n){if(A){if(L=n,L==A)return void v();var t={source:A,target:L,linkType:"basepair",value:1,uid:generateUUID()};for(i=0;i<_.graph.links.length;i++){if(!(_.graph.links[i].source!=A&&_.graph.links[i].target!=A&&_.graph.links[i].source!=L&&_.graph.links[i].target!=L||"basepair"!=_.graph.links[i].linkType&&"pseudoknot"!=_.graph.links[i].linkType))return;if((_.graph.links[i].source==L&&_.graph.links[i].target==A||_.graph.links[i].source==A&&_.graph.links[i].target==L)&&"backbone"==_.graph.links[i].linkType)return}if("middle"==L.nodeType||"middle"==A.nodeType||"label"==L.nodeType||"label"==A.nodeType)return;_.addLink(t)}},W=function(n){if(!n.selected&&!I){var t=D.selectAll("g.gnode").selectAll(".outline_node");t.classed("selected",function(n){return n.selected=n.previouslySelected=!1})}s["default"].select(this).classed("selected",function(t){return n.previouslySelected=n.selected,n.selected=_.options.applyForce&&!0}),F&&(A=n,j.attr("class","drag_line").attr("x1",A.x).attr("y1",A.y).attr("x2",A.x).attr("y2",A.y))};_.startAnimation=function(){_.animation=!0,O.selectAll("g.gnode").call(B),_.force.start()},_.stopAnimation=function(){_.animation=!1,O.selectAll("g.gnode").on("mousedown.drag",null),_.force.stop()},_.setFriction=function(n){_.force.friction(n),_.resumeForce()},_.setCharge=function(n){_.force.charge(n),_.resumeForce()},_.setGravity=function(n){_.force.gravity(n),_.resumeForce()},_.setPseudoknotStrength=function(n){_.linkStrengths.pseudoknot=n,_.update()},_.displayBackground=function(n){_.displayParameters.displayBackground=n,_.updateStyle()},_.displayNumbering=function(n){_.displayParameters.displayNumbering=n,_.updateStyle()},_.displayNodeOutline=function(n){_.displayParameters.displayNodeOutline=n,_.updateStyle()},_.displayNodeLabel=function(n){_.displayParameters.displayNodeLabel=n,_.updateStyle()},_.displayLinks=function(n){_.displayParameters.displayLinks=n,_.updateStyle()},_.displayPseudoknotLinks=function(n){_.displayParameters.displayPseudoknotLinks=n,_.updateStyle()},_.displayProteinLinks=function(n){_.displayParameters.displayProteinLinks=n,_.updateStyle()},_.updateStyle=function(){q.classed("transparent",!_.displayParameters.displayBackground),D.selectAll("[node_type=label]").classed("transparent",!_.displayParameters.displayNumbering),D.selectAll("[label_type=label]").classed("transparent",!_.displayParameters.displayNumbering),U.selectAll("[linkType=label_link]").classed("transparent",!_.displayParameters.displayNumbering),z.selectAll("circle").classed("hidden_outline",!_.displayParameters.displayNodeOutline),D.selectAll("[label_type=nucleotide]").classed("transparent",!_.displayParameters.displayNodeLabel),z.selectAll("[link_type=real],[link_type=basepair],[link_type=backbone],[link_type=pseudoknot],[link_type=protein_chain],[link_type=chain_chain],[link_type=external]").classed("transparent",!_.displayParameters.displayLinks),z.selectAll("[link_type=pseudoknot]").classed("transparent",!_.displayParameters.displayPseudoknotLinks),z.selectAll("[link_type=protein_chain]").classed("transparent",!_.displayParameters.displayProteinLinks),U.selectAll("[link_type=fake]").classed("transparent",!_.options.displayAllLinks),U.selectAll("[link_type=fake_fake]").classed("transparent",!_.options.displayAllLinks)},_.createNewLinks=function(n){var t=n.append("svg:line");return t.append("svg:title").text(H),t.classed("link",!0).attr("x1",function(n){return n.source.x}).attr("y1",function(n){return n.source.y}).attr("x2",function(n){return n.target.x}).attr("y2",function(n){return n.target.y}).attr("link_type",function(n){return n.linkType}).attr("class",function(n){return s["default"].select(this).attr("class")+" "+n.linkType}).attr("pointer-events",function(n){return"fake"==n.linkType?"none":"all"}),t},_.createNewNodes=function(n){n=n.append("g").classed("noselect",!0).classed("gnode",!0).attr("struct_name",function(n){return n.structName}).attr("transform",function(n){return"undefined"!=typeof n.x&&"undefined"!=typeof n.y?"translate("+[n.x,n.y]+")":""}).each(function(n){n.selected=n.previouslySelected=!1}),n.call(B).on("mousedown",W).on("mousedrag",function(n){}).on("mouseup",X).attr("num",function(n){return"n"+n.num}).attr("rnum",function(n){return"n"+(n.rna.rnaLength-n.num+1)}).on("click",Z).transition().duration(750).ease("elastic");var t=n.filter(function(n){return"label"==n.nodeType||"protein"==n.nodeType}),e=n.filter(function(n){return"nucleotide"==n.nodeType});t.append("svg:circle").attr("class","outline_node").attr("r",function(n){return n.radius+1}),e.append("svg:circle").attr("class","outline_node").attr("r",function(n){return n.radius+1}),t.append("svg:circle").attr("class","node").classed("label",function(n){return"label"==n.nodeType}).attr("r",function(n){return"middle"==n.nodeType?0:n.radius}).attr("node_type",function(n){return n.nodeType}).attr("node_num",function(n){return n.num}),e.append("svg:circle").attr("class","node").attr("node_type",function(n){return n.nodeType}).attr("node_num",function(n){return n.num}).attr("r",function(n){return n.radius}).append("svg:title").text(function(n){return"nucleotide"==n.nodeType?n.structName+":"+n.num:""}),e.append("svg:path").attr("class","node").attr("node_type",function(n){return n.nodeType}).attr("node_num",function(n){return n.num}).append("svg:title").text(function(n){return"nucleotide"==n.nodeType?n.structName+":"+n.num:""});var r=n.append("text").text(function(n){return n.name}).attr("text-anchor","middle").attr("font-size",8).attr("font-weight","bold").attr("y",2.5).attr("class","node-label").attr("label_type",function(n){return n.nodeType});return r.append("svg:title").text(function(n){return"nucleotide"==n.nodeType?n.structName+":"+n.num:""}),n};_.update=function(){_.force.nodes(_.graph.nodes).links(_.graph.links),_.animation&&_.force.start();var n=U.selectAll("line.link").data(_.graph.links.filter(o),H);n.attr("class","").classed("link",!0).attr("link_type",function(n){return n.linkType}).attr("class",function(n){return s["default"].select(this).attr("class")+" "+n.linkType});var t=n.enter();_.createNewLinks(t),n.exit().remove();var e=[0,1,2,3,4,5,6,7,8,9],r=(s["default"].scale.category10().domain(e),D.selectAll("g.gnode").data(_.graph.nodes,V)),i=r.enter();_.createNewNodes(i),r.exit().remove();var u,l=_.graph.nodes.filter(function(n){return"nucleotide"==n.nodeType||"label"==n.nodeType});u=_.displayFakeLinks?n:U.selectAll("[link_type=real],[link_type=pseudoknot],[link_type=protein_chain],[link_type=chain_chain],[link_type=label_link],[link_type=backbone],[link_type=basepair],[link_type=intermolecule],[link_type=external]");r.selectAll("path").each(a),u.on("click",G),_.force.on("tick",function(){for(var n=s["default"].geom.quadtree(l),t=0,e=l.length;++t<e;)n.visit(M(l[t]));u.attr("x1",function(n){return n.source.x}).attr("y1",function(n){return n.source.y}).attr("x2",function(n){return n.target.x}).attr("y2",function(n){return n.target.y}),r.attr("transform",function(n){return"translate("+[n.x,n.y]+")"}),r.select("path").each(a)}),_.changeColorScheme(_.colorScheme),_.animation&&_.force.start(),_.updateStyle()},_.setSize()}Object.defineProperty(t,"__esModule",{value:!0}),t.FornaContainer=o;var u=e(1),s=a(u);e(2);var l=e(6),c=e(8);e(9)},function(n,t,e){var r,i;!function(){function a(n){return n&&(n.ownerDocument||n.document||n).documentElement}function o(n){return n&&(n.ownerDocument&&n.ownerDocument.defaultView||n.document&&n||n.defaultView)}function u(n,t){return t>n?-1:n>t?1:n>=t?0:NaN}function s(n){return null===n?NaN:+n}function l(n){return!isNaN(n)}function c(n){return{left:function(t,e,r,i){for(arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);i>r;){var a=r+i>>>1;n(t[a],e)<0?r=a+1:i=a}return r},right:function(t,e,r,i){for(arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);i>r;){var a=r+i>>>1;n(t[a],e)>0?i=a:r=a+1}return r}}}function f(n){return n.length}function h(n){for(var t=1;n*t%1;)t*=10;return t}function p(n,t){for(var e in t)Object.defineProperty(n.prototype,e,{value:t[e],enumerable:!1})}function g(){this._=Object.create(null)}function d(n){return(n+="")===So||n[0]===Ao?Ao+n:n}function v(n){return(n+="")[0]===Ao?n.slice(1):n}function m(n){return d(n)in this._}function y(n){return(n=d(n))in this._&&delete this._[n]}function x(){var n=[];for(var t in this._)n.push(v(t));return n}function k(){var n=0;for(var t in this._)++n;return n}function M(){for(var n in this._)return!1;return!0}function b(){this._=Object.create(null)}function w(n){return n}function _(n,t,e){return function(){var r=e.apply(t,arguments);return r===t?n:r}}function N(n,t){if(t in n)return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(var e=0,r=Lo.length;r>e;++e){var i=Lo[e]+t;if(i in n)return i}}function S(){}function A(){}function L(n){function t(){for(var t,r=e,i=-1,a=r.length;++i<a;)(t=r[i].on)&&t.apply(this,arguments);return n}var e=[],r=new g;return t.on=function(t,i){var a,o=r.get(t);return arguments.length<2?o&&o.on:(o&&(o.on=null,e=e.slice(0,a=e.indexOf(o)).concat(e.slice(a+1)),r.remove(t)),i&&e.push(r.set(t,{on:i})),n)},t}function E(){ho.event.preventDefault()}function T(){for(var n,t=ho.event;n=t.sourceEvent;)t=n;return t}function C(n){for(var t=new A,e=0,r=arguments.length;++e<r;)t[arguments[e]]=L(t);return t.of=function(e,r){return function(i){try{var a=i.sourceEvent=ho.event;i.target=n,ho.event=i,t[i.type].apply(e,r)}finally{ho.event=a}}},t}function z(n){return To(n,qo),n}function P(n){return"function"==typeof n?n:function(){return Co(n,this)}}function q(n){return"function"==typeof n?n:function(){return zo(n,this)}}function R(n,t){function e(){this.removeAttribute(n)}function r(){this.removeAttributeNS(n.space,n.local)}function i(){this.setAttribute(n,t)}function a(){this.setAttributeNS(n.space,n.local,t)}function o(){var e=t.apply(this,arguments);null==e?this.removeAttribute(n):this.setAttribute(n,e)}function u(){var e=t.apply(this,arguments);null==e?this.removeAttributeNS(n.space,n.local):this.setAttributeNS(n.space,n.local,e)}return n=ho.ns.qualify(n),null==t?n.local?r:e:"function"==typeof t?n.local?u:o:n.local?a:i}function O(n){return n.trim().replace(/\s+/g," ")}function U(n){return new RegExp("(?:^|\\s+)"+ho.requote(n)+"(?:\\s+|$)","g")}function D(n){return(n+"").trim().split(/^|\s+/)}function j(n,t){function e(){for(var e=-1;++e<i;)n[e](this,t)}function r(){for(var e=-1,r=t.apply(this,arguments);++e<i;)n[e](this,r)}n=D(n).map(F);var i=n.length;return"function"==typeof t?r:e}function F(n){var t=U(n);return function(e,r){if(i=e.classList)return r?i.add(n):i.remove(n);var i=e.getAttribute("class")||"";r?(t.lastIndex=0,t.test(i)||e.setAttribute("class",O(i+" "+n))):e.setAttribute("class",O(i.replace(t," ")))}}function I(n,t,e){function r(){this.style.removeProperty(n)}function i(){this.style.setProperty(n,t,e)}function a(){var r=t.apply(this,arguments);null==r?this.style.removeProperty(n):this.style.setProperty(n,r,e)}return null==t?r:"function"==typeof t?a:i}function B(n,t){function e(){delete this[n]}function r(){this[n]=t}function i(){var e=t.apply(this,arguments);null==e?delete this[n]:this[n]=e}return null==t?e:"function"==typeof t?i:r}function H(n){function t(){var t=this.ownerDocument,e=this.namespaceURI;return e?t.createElementNS(e,n):t.createElement(n)}function e(){return this.ownerDocument.createElementNS(n.space,n.local)}return"function"==typeof n?n:(n=ho.ns.qualify(n)).local?e:t}function V(){var n=this.parentNode;n&&n.removeChild(this)}function Y(n){return{__data__:n}}function J(n){return function(){return Po(this,n)}}function G(n){return arguments.length||(n=u),function(t,e){return t&&e?n(t.__data__,e.__data__):!t-!e}}function Z(n,t){for(var e=0,r=n.length;r>e;e++)for(var i,a=n[e],o=0,u=a.length;u>o;o++)(i=a[o])&&t(i,o,e);return n}function X(n){return To(n,Oo),n}function W(n){var t,e;return function(r,i,a){var o,u=n[a].update,s=u.length;for(a!=e&&(e=a,t=0),i>=t&&(t=i+1);!(o=u[t])&&++t<s;);return o}}function $(n,t,e){function r(){var t=this[o];t&&(this.removeEventListener(n,t,t.$),delete this[o])}function i(){var i=s(t,go(arguments));r.call(this),this.addEventListener(n,this[o]=i,i.$=e),i._=t}function a(){var t,e=new RegExp("^__on([^.]+)"+ho.requote(n)+"$");for(var r in this)if(t=r.match(e)){var i=this[r];this.removeEventListener(t[1],i,i.$),delete this[r]}}var o="__on"+n,u=n.indexOf("."),s=K;u>0&&(n=n.slice(0,u));var l=Uo.get(n);return l&&(n=l,s=Q),u?t?i:r:t?S:a}function K(n,t){return function(e){var r=ho.event;ho.event=e,t[0]=this.__data__;try{n.apply(this,t)}finally{ho.event=r}}}function Q(n,t){var e=K(n,t);return function(n){var t=this,r=n.relatedTarget;r&&(r===t||8&r.compareDocumentPosition(t))||e.call(t,n)}}function nn(n){var t=".dragsuppress-"+ ++jo,e="click"+t,r=ho.select(o(n)).on("touchmove"+t,E).on("dragstart"+t,E).on("selectstart"+t,E);if(null==Do&&(Do="onselectstart"in n?!1:N(n.style,"userSelect")),Do){var i=a(n).style,u=i[Do];i[Do]="none"}return function(n){if(r.on(t,null),Do&&(i[Do]=u),n){var a=function(){r.on(e,null)};r.on(e,function(){E(),a()},!0),setTimeout(a,0)}}}function tn(n,t){t.changedTouches&&(t=t.changedTouches[0]);var e=n.ownerSVGElement||n;if(e.createSVGPoint){var r=e.createSVGPoint();if(0>Fo){var i=o(n);if(i.scrollX||i.scrollY){e=ho.select("body").append("svg").style({position:"absolute",top:0,left:0,margin:0,padding:0,border:"none"},"important");var a=e[0][0].getScreenCTM();Fo=!(a.f||a.e),e.remove()}}return Fo?(r.x=t.pageX,r.y=t.pageY):(r.x=t.clientX,r.y=t.clientY),r=r.matrixTransform(n.getScreenCTM().inverse()),[r.x,r.y]}var u=n.getBoundingClientRect();return[t.clientX-u.left-n.clientLeft,t.clientY-u.top-n.clientTop]}function en(){return ho.event.changedTouches[0].identifier}function rn(n){return n>0?1:0>n?-1:0}function an(n,t,e){return(t[0]-n[0])*(e[1]-n[1])-(t[1]-n[1])*(e[0]-n[0])}function on(n){return n>1?0:-1>n?Ho:Math.acos(n)}function un(n){return n>1?Jo:-1>n?-Jo:Math.asin(n)}function sn(n){return((n=Math.exp(n))-1/n)/2}function ln(n){return((n=Math.exp(n))+1/n)/2}function cn(n){return((n=Math.exp(2*n))-1)/(n+1)}function fn(n){return(n=Math.sin(n/2))*n}function hn(){}function pn(n,t,e){return this instanceof pn?(this.h=+n,this.s=+t,void(this.l=+e)):arguments.length<2?n instanceof pn?new pn(n.h,n.s,n.l):An(""+n,Ln,pn):new pn(n,t,e)}function gn(n,t,e){function r(n){return n>360?n-=360:0>n&&(n+=360),60>n?a+(o-a)*n/60:180>n?o:240>n?a+(o-a)*(240-n)/60:a}function i(n){return Math.round(255*r(n))}var a,o;return n=isNaN(n)?0:(n%=360)<0?n+360:n,
	t=isNaN(t)?0:0>t?0:t>1?1:t,e=0>e?0:e>1?1:e,o=.5>=e?e*(1+t):e+t-e*t,a=2*e-o,new wn(i(n+120),i(n),i(n-120))}function dn(n,t,e){return this instanceof dn?(this.h=+n,this.c=+t,void(this.l=+e)):arguments.length<2?n instanceof dn?new dn(n.h,n.c,n.l):n instanceof mn?xn(n.l,n.a,n.b):xn((n=En((n=ho.rgb(n)).r,n.g,n.b)).l,n.a,n.b):new dn(n,t,e)}function vn(n,t,e){return isNaN(n)&&(n=0),isNaN(t)&&(t=0),new mn(e,Math.cos(n*=Go)*t,Math.sin(n)*t)}function mn(n,t,e){return this instanceof mn?(this.l=+n,this.a=+t,void(this.b=+e)):arguments.length<2?n instanceof mn?new mn(n.l,n.a,n.b):n instanceof dn?vn(n.h,n.c,n.l):En((n=wn(n)).r,n.g,n.b):new mn(n,t,e)}function yn(n,t,e){var r=(n+16)/116,i=r+t/500,a=r-e/200;return i=kn(i)*iu,r=kn(r)*au,a=kn(a)*ou,new wn(bn(3.2404542*i-1.5371385*r-.4985314*a),bn(-.969266*i+1.8760108*r+.041556*a),bn(.0556434*i-.2040259*r+1.0572252*a))}function xn(n,t,e){return n>0?new dn(Math.atan2(e,t)*Zo,Math.sqrt(t*t+e*e),n):new dn(NaN,NaN,n)}function kn(n){return n>.206893034?n*n*n:(n-4/29)/7.787037}function Mn(n){return n>.008856?Math.pow(n,1/3):7.787037*n+4/29}function bn(n){return Math.round(255*(.00304>=n?12.92*n:1.055*Math.pow(n,1/2.4)-.055))}function wn(n,t,e){return this instanceof wn?(this.r=~~n,this.g=~~t,void(this.b=~~e)):arguments.length<2?n instanceof wn?new wn(n.r,n.g,n.b):An(""+n,wn,gn):new wn(n,t,e)}function _n(n){return new wn(n>>16,n>>8&255,255&n)}function Nn(n){return _n(n)+""}function Sn(n){return 16>n?"0"+Math.max(0,n).toString(16):Math.min(255,n).toString(16)}function An(n,t,e){var r,i,a,o=0,u=0,s=0;if(r=/([a-z]+)\((.*)\)/.exec(n=n.toLowerCase()))switch(i=r[2].split(","),r[1]){case"hsl":return e(parseFloat(i[0]),parseFloat(i[1])/100,parseFloat(i[2])/100);case"rgb":return t(Cn(i[0]),Cn(i[1]),Cn(i[2]))}return(a=lu.get(n))?t(a.r,a.g,a.b):(null==n||"#"!==n.charAt(0)||isNaN(a=parseInt(n.slice(1),16))||(4===n.length?(o=(3840&a)>>4,o=o>>4|o,u=240&a,u=u>>4|u,s=15&a,s=s<<4|s):7===n.length&&(o=(16711680&a)>>16,u=(65280&a)>>8,s=255&a)),t(o,u,s))}function Ln(n,t,e){var r,i,a=Math.min(n/=255,t/=255,e/=255),o=Math.max(n,t,e),u=o-a,s=(o+a)/2;return u?(i=.5>s?u/(o+a):u/(2-o-a),r=n==o?(t-e)/u+(e>t?6:0):t==o?(e-n)/u+2:(n-t)/u+4,r*=60):(r=NaN,i=s>0&&1>s?0:r),new pn(r,i,s)}function En(n,t,e){n=Tn(n),t=Tn(t),e=Tn(e);var r=Mn((.4124564*n+.3575761*t+.1804375*e)/iu),i=Mn((.2126729*n+.7151522*t+.072175*e)/au),a=Mn((.0193339*n+.119192*t+.9503041*e)/ou);return mn(116*i-16,500*(r-i),200*(i-a))}function Tn(n){return(n/=255)<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)}function Cn(n){var t=parseFloat(n);return"%"===n.charAt(n.length-1)?Math.round(2.55*t):t}function zn(n){return"function"==typeof n?n:function(){return n}}function Pn(n){return function(t,e,r){return 2===arguments.length&&"function"==typeof e&&(r=e,e=null),qn(t,e,n,r)}}function qn(n,t,e,r){function i(){var n,t=s.status;if(!t&&On(s)||t>=200&&300>t||304===t){try{n=e.call(a,s)}catch(r){return void o.error.call(a,r)}o.load.call(a,n)}else o.error.call(a,s)}var a={},o=ho.dispatch("beforesend","progress","load","error"),u={},s=new XMLHttpRequest,l=null;return!this.XDomainRequest||"withCredentials"in s||!/^(http(s)?:)?\/\//.test(n)||(s=new XDomainRequest),"onload"in s?s.onload=s.onerror=i:s.onreadystatechange=function(){s.readyState>3&&i()},s.onprogress=function(n){var t=ho.event;ho.event=n;try{o.progress.call(a,s)}finally{ho.event=t}},a.header=function(n,t){return n=(n+"").toLowerCase(),arguments.length<2?u[n]:(null==t?delete u[n]:u[n]=t+"",a)},a.mimeType=function(n){return arguments.length?(t=null==n?null:n+"",a):t},a.responseType=function(n){return arguments.length?(l=n,a):l},a.response=function(n){return e=n,a},["get","post"].forEach(function(n){a[n]=function(){return a.send.apply(a,[n].concat(go(arguments)))}}),a.send=function(e,r,i){if(2===arguments.length&&"function"==typeof r&&(i=r,r=null),s.open(e,n,!0),null==t||"accept"in u||(u.accept=t+",*/*"),s.setRequestHeader)for(var c in u)s.setRequestHeader(c,u[c]);return null!=t&&s.overrideMimeType&&s.overrideMimeType(t),null!=l&&(s.responseType=l),null!=i&&a.on("error",i).on("load",function(n){i(null,n)}),o.beforesend.call(a,s),s.send(null==r?null:r),a},a.abort=function(){return s.abort(),a},ho.rebind(a,o,"on"),null==r?a:a.get(Rn(r))}function Rn(n){return 1===n.length?function(t,e){n(null==t?e:null)}:n}function On(n){var t=n.responseType;return t&&"text"!==t?n.response:n.responseText}function Un(n,t,e){var r=arguments.length;2>r&&(t=0),3>r&&(e=Date.now());var i=e+t,a={c:n,t:i,n:null};return fu?fu.n=a:cu=a,fu=a,hu||(pu=clearTimeout(pu),hu=1,gu(Dn)),a}function Dn(){var n=jn(),t=Fn()-n;t>24?(isFinite(t)&&(clearTimeout(pu),pu=setTimeout(Dn,t)),hu=0):(hu=1,gu(Dn))}function jn(){for(var n=Date.now(),t=cu;t;)n>=t.t&&t.c(n-t.t)&&(t.c=null),t=t.n;return n}function Fn(){for(var n,t=cu,e=1/0;t;)t.c?(t.t<e&&(e=t.t),t=(n=t).n):t=n?n.n=t.n:cu=t.n;return fu=n,e}function In(n,t){return t-(n?Math.ceil(Math.log(n)/Math.LN10):1)}function Bn(n,t){var e=Math.pow(10,3*No(8-t));return{scale:t>8?function(n){return n/e}:function(n){return n*e},symbol:n}}function Hn(n){var t=n.decimal,e=n.thousands,r=n.grouping,i=n.currency,a=r&&e?function(n,t){for(var i=n.length,a=[],o=0,u=r[0],s=0;i>0&&u>0&&(s+u+1>t&&(u=Math.max(1,t-s)),a.push(n.substring(i-=u,i+u)),!((s+=u+1)>t));)u=r[o=(o+1)%r.length];return a.reverse().join(e)}:w;return function(n){var e=vu.exec(n),r=e[1]||" ",o=e[2]||">",u=e[3]||"-",s=e[4]||"",l=e[5],c=+e[6],f=e[7],h=e[8],p=e[9],g=1,d="",v="",m=!1,y=!0;switch(h&&(h=+h.substring(1)),(l||"0"===r&&"="===o)&&(l=r="0",o="="),p){case"n":f=!0,p="g";break;case"%":g=100,v="%",p="f";break;case"p":g=100,v="%",p="r";break;case"b":case"o":case"x":case"X":"#"===s&&(d="0"+p.toLowerCase());case"c":y=!1;case"d":m=!0,h=0;break;case"s":g=-1,p="r"}"$"===s&&(d=i[0],v=i[1]),"r"!=p||h||(p="g"),null!=h&&("g"==p?h=Math.max(1,Math.min(21,h)):("e"==p||"f"==p)&&(h=Math.max(0,Math.min(20,h)))),p=mu.get(p)||Vn;var x=l&&f;return function(n){var e=v;if(m&&n%1)return"";var i=0>n||0===n&&0>1/n?(n=-n,"-"):"-"===u?"":u;if(0>g){var s=ho.formatPrefix(n,h);n=s.scale(n),e=s.symbol+v}else n*=g;n=p(n,h);var k,M,b=n.lastIndexOf(".");if(0>b){var w=y?n.lastIndexOf("e"):-1;0>w?(k=n,M=""):(k=n.substring(0,w),M=n.substring(w))}else k=n.substring(0,b),M=t+n.substring(b+1);!l&&f&&(k=a(k,1/0));var _=d.length+k.length+M.length+(x?0:i.length),N=c>_?new Array(_=c-_+1).join(r):"";return x&&(k=a(N+k,N.length?c-M.length:1/0)),i+=d,n=k+M,("<"===o?i+n+N:">"===o?N+i+n:"^"===o?N.substring(0,_>>=1)+i+n+N.substring(_):i+(x?n:N+n))+e}}}function Vn(n){return n+""}function Yn(){this._=new Date(arguments.length>1?Date.UTC.apply(this,arguments):arguments[0])}function Jn(n,t,e){function r(t){var e=n(t),r=a(e,1);return r-t>t-e?e:r}function i(e){return t(e=n(new xu(e-1)),1),e}function a(n,e){return t(n=new xu(+n),e),n}function o(n,r,a){var o=i(n),u=[];if(a>1)for(;r>o;)e(o)%a||u.push(new Date(+o)),t(o,1);else for(;r>o;)u.push(new Date(+o)),t(o,1);return u}function u(n,t,e){try{xu=Yn;var r=new Yn;return r._=n,o(r,t,e)}finally{xu=Date}}n.floor=n,n.round=r,n.ceil=i,n.offset=a,n.range=o;var s=n.utc=Gn(n);return s.floor=s,s.round=Gn(r),s.ceil=Gn(i),s.offset=Gn(a),s.range=u,n}function Gn(n){return function(t,e){try{xu=Yn;var r=new Yn;return r._=t,n(r,e)._}finally{xu=Date}}}function Zn(n){function t(n){function t(t){for(var e,i,a,o=[],u=-1,s=0;++u<r;)37===n.charCodeAt(u)&&(o.push(n.slice(s,u)),null!=(i=Mu[e=n.charAt(++u)])&&(e=n.charAt(++u)),(a=L[e])&&(e=a(t,null==i?"e"===e?" ":"0":i)),o.push(e),s=u+1);return o.push(n.slice(s,u)),o.join("")}var r=n.length;return t.parse=function(t){var r={y:1900,m:0,d:1,H:0,M:0,S:0,L:0,Z:null},i=e(r,n,t,0);if(i!=t.length)return null;"p"in r&&(r.H=r.H%12+12*r.p);var a=null!=r.Z&&xu!==Yn,o=new(a?Yn:xu);return"j"in r?o.setFullYear(r.y,0,r.j):"W"in r||"U"in r?("w"in r||(r.w="W"in r?1:0),o.setFullYear(r.y,0,1),o.setFullYear(r.y,0,"W"in r?(r.w+6)%7+7*r.W-(o.getDay()+5)%7:r.w+7*r.U-(o.getDay()+6)%7)):o.setFullYear(r.y,r.m,r.d),o.setHours(r.H+(r.Z/100|0),r.M+r.Z%100,r.S,r.L),a?o._:o},t.toString=function(){return n},t}function e(n,t,e,r){for(var i,a,o,u=0,s=t.length,l=e.length;s>u;){if(r>=l)return-1;if(i=t.charCodeAt(u++),37===i){if(o=t.charAt(u++),a=E[o in Mu?t.charAt(u++):o],!a||(r=a(n,e,r))<0)return-1}else if(i!=e.charCodeAt(r++))return-1}return r}function r(n,t,e){b.lastIndex=0;var r=b.exec(t.slice(e));return r?(n.w=w.get(r[0].toLowerCase()),e+r[0].length):-1}function i(n,t,e){k.lastIndex=0;var r=k.exec(t.slice(e));return r?(n.w=M.get(r[0].toLowerCase()),e+r[0].length):-1}function a(n,t,e){S.lastIndex=0;var r=S.exec(t.slice(e));return r?(n.m=A.get(r[0].toLowerCase()),e+r[0].length):-1}function o(n,t,e){_.lastIndex=0;var r=_.exec(t.slice(e));return r?(n.m=N.get(r[0].toLowerCase()),e+r[0].length):-1}function u(n,t,r){return e(n,L.c.toString(),t,r)}function s(n,t,r){return e(n,L.x.toString(),t,r)}function l(n,t,r){return e(n,L.X.toString(),t,r)}function c(n,t,e){var r=x.get(t.slice(e,e+=2).toLowerCase());return null==r?-1:(n.p=r,e)}var f=n.dateTime,h=n.date,p=n.time,g=n.periods,d=n.days,v=n.shortDays,m=n.months,y=n.shortMonths;t.utc=function(n){function e(n){try{xu=Yn;var t=new xu;return t._=n,r(t)}finally{xu=Date}}var r=t(n);return e.parse=function(n){try{xu=Yn;var t=r.parse(n);return t&&t._}finally{xu=Date}},e.toString=r.toString,e},t.multi=t.utc.multi=gt;var x=ho.map(),k=Wn(d),M=$n(d),b=Wn(v),w=$n(v),_=Wn(m),N=$n(m),S=Wn(y),A=$n(y);g.forEach(function(n,t){x.set(n.toLowerCase(),t)});var L={a:function(n){return v[n.getDay()]},A:function(n){return d[n.getDay()]},b:function(n){return y[n.getMonth()]},B:function(n){return m[n.getMonth()]},c:t(f),d:function(n,t){return Xn(n.getDate(),t,2)},e:function(n,t){return Xn(n.getDate(),t,2)},H:function(n,t){return Xn(n.getHours(),t,2)},I:function(n,t){return Xn(n.getHours()%12||12,t,2)},j:function(n,t){return Xn(1+yu.dayOfYear(n),t,3)},L:function(n,t){return Xn(n.getMilliseconds(),t,3)},m:function(n,t){return Xn(n.getMonth()+1,t,2)},M:function(n,t){return Xn(n.getMinutes(),t,2)},p:function(n){return g[+(n.getHours()>=12)]},S:function(n,t){return Xn(n.getSeconds(),t,2)},U:function(n,t){return Xn(yu.sundayOfYear(n),t,2)},w:function(n){return n.getDay()},W:function(n,t){return Xn(yu.mondayOfYear(n),t,2)},x:t(h),X:t(p),y:function(n,t){return Xn(n.getFullYear()%100,t,2)},Y:function(n,t){return Xn(n.getFullYear()%1e4,t,4)},Z:ht,"%":function(){return"%"}},E={a:r,A:i,b:a,B:o,c:u,d:ot,e:ot,H:st,I:st,j:ut,L:ft,m:at,M:lt,p:c,S:ct,U:Qn,w:Kn,W:nt,x:s,X:l,y:et,Y:tt,Z:rt,"%":pt};return t}function Xn(n,t,e){var r=0>n?"-":"",i=(r?-n:n)+"",a=i.length;return r+(e>a?new Array(e-a+1).join(t)+i:i)}function Wn(n){return new RegExp("^(?:"+n.map(ho.requote).join("|")+")","i")}function $n(n){for(var t=new g,e=-1,r=n.length;++e<r;)t.set(n[e].toLowerCase(),e);return t}function Kn(n,t,e){bu.lastIndex=0;var r=bu.exec(t.slice(e,e+1));return r?(n.w=+r[0],e+r[0].length):-1}function Qn(n,t,e){bu.lastIndex=0;var r=bu.exec(t.slice(e));return r?(n.U=+r[0],e+r[0].length):-1}function nt(n,t,e){bu.lastIndex=0;var r=bu.exec(t.slice(e));return r?(n.W=+r[0],e+r[0].length):-1}function tt(n,t,e){bu.lastIndex=0;var r=bu.exec(t.slice(e,e+4));return r?(n.y=+r[0],e+r[0].length):-1}function et(n,t,e){bu.lastIndex=0;var r=bu.exec(t.slice(e,e+2));return r?(n.y=it(+r[0]),e+r[0].length):-1}function rt(n,t,e){return/^[+-]\d{4}$/.test(t=t.slice(e,e+5))?(n.Z=-t,e+5):-1}function it(n){return n+(n>68?1900:2e3)}function at(n,t,e){bu.lastIndex=0;var r=bu.exec(t.slice(e,e+2));return r?(n.m=r[0]-1,e+r[0].length):-1}function ot(n,t,e){bu.lastIndex=0;var r=bu.exec(t.slice(e,e+2));return r?(n.d=+r[0],e+r[0].length):-1}function ut(n,t,e){bu.lastIndex=0;var r=bu.exec(t.slice(e,e+3));return r?(n.j=+r[0],e+r[0].length):-1}function st(n,t,e){bu.lastIndex=0;var r=bu.exec(t.slice(e,e+2));return r?(n.H=+r[0],e+r[0].length):-1}function lt(n,t,e){bu.lastIndex=0;var r=bu.exec(t.slice(e,e+2));return r?(n.M=+r[0],e+r[0].length):-1}function ct(n,t,e){bu.lastIndex=0;var r=bu.exec(t.slice(e,e+2));return r?(n.S=+r[0],e+r[0].length):-1}function ft(n,t,e){bu.lastIndex=0;var r=bu.exec(t.slice(e,e+3));return r?(n.L=+r[0],e+r[0].length):-1}function ht(n){var t=n.getTimezoneOffset(),e=t>0?"-":"+",r=No(t)/60|0,i=No(t)%60;return e+Xn(r,"0",2)+Xn(i,"0",2)}function pt(n,t,e){wu.lastIndex=0;var r=wu.exec(t.slice(e,e+1));return r?e+r[0].length:-1}function gt(n){for(var t=n.length,e=-1;++e<t;)n[e][0]=this(n[e][0]);return function(t){for(var e=0,r=n[e];!r[1](t);)r=n[++e];return r[0](t)}}function dt(){}function vt(n,t,e){var r=e.s=n+t,i=r-n,a=r-i;e.t=n-a+(t-i)}function mt(n,t){n&&Au.hasOwnProperty(n.type)&&Au[n.type](n,t)}function yt(n,t,e){var r,i=-1,a=n.length-e;for(t.lineStart();++i<a;)r=n[i],t.point(r[0],r[1],r[2]);t.lineEnd()}function xt(n,t){var e=-1,r=n.length;for(t.polygonStart();++e<r;)yt(n[e],t,1);t.polygonEnd()}function kt(){function n(n,t){n*=Go,t=t*Go/2+Ho/4;var e=n-r,o=e>=0?1:-1,u=o*e,s=Math.cos(t),l=Math.sin(t),c=a*l,f=i*s+c*Math.cos(u),h=c*o*Math.sin(u);Eu.add(Math.atan2(h,f)),r=n,i=s,a=l}var t,e,r,i,a;Tu.point=function(o,u){Tu.point=n,r=(t=o)*Go,i=Math.cos(u=(e=u)*Go/2+Ho/4),a=Math.sin(u)},Tu.lineEnd=function(){n(t,e)}}function Mt(n){var t=n[0],e=n[1],r=Math.cos(e);return[r*Math.cos(t),r*Math.sin(t),Math.sin(e)]}function bt(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function wt(n,t){return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}function _t(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function Nt(n,t){return[n[0]*t,n[1]*t,n[2]*t]}function St(n){var t=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);n[0]/=t,n[1]/=t,n[2]/=t}function At(n){return[Math.atan2(n[1],n[0]),un(n[2])]}function Lt(n,t){return No(n[0]-t[0])<Io&&No(n[1]-t[1])<Io}function Et(n,t){n*=Go;var e=Math.cos(t*=Go);Tt(e*Math.cos(n),e*Math.sin(n),Math.sin(t))}function Tt(n,t,e){++Cu,Pu+=(n-Pu)/Cu,qu+=(t-qu)/Cu,Ru+=(e-Ru)/Cu}function Ct(){function n(n,i){n*=Go;var a=Math.cos(i*=Go),o=a*Math.cos(n),u=a*Math.sin(n),s=Math.sin(i),l=Math.atan2(Math.sqrt((l=e*s-r*u)*l+(l=r*o-t*s)*l+(l=t*u-e*o)*l),t*o+e*u+r*s);zu+=l,Ou+=l*(t+(t=o)),Uu+=l*(e+(e=u)),Du+=l*(r+(r=s)),Tt(t,e,r)}var t,e,r;Bu.point=function(i,a){i*=Go;var o=Math.cos(a*=Go);t=o*Math.cos(i),e=o*Math.sin(i),r=Math.sin(a),Bu.point=n,Tt(t,e,r)}}function zt(){Bu.point=Et}function Pt(){function n(n,t){n*=Go;var e=Math.cos(t*=Go),o=e*Math.cos(n),u=e*Math.sin(n),s=Math.sin(t),l=i*s-a*u,c=a*o-r*s,f=r*u-i*o,h=Math.sqrt(l*l+c*c+f*f),p=r*o+i*u+a*s,g=h&&-on(p)/h,d=Math.atan2(h,p);ju+=g*l,Fu+=g*c,Iu+=g*f,zu+=d,Ou+=d*(r+(r=o)),Uu+=d*(i+(i=u)),Du+=d*(a+(a=s)),Tt(r,i,a)}var t,e,r,i,a;Bu.point=function(o,u){t=o,e=u,Bu.point=n,o*=Go;var s=Math.cos(u*=Go);r=s*Math.cos(o),i=s*Math.sin(o),a=Math.sin(u),Tt(r,i,a)},Bu.lineEnd=function(){n(t,e),Bu.lineEnd=zt,Bu.point=Et}}function qt(n,t){function e(e,r){return e=n(e,r),t(e[0],e[1])}return n.invert&&t.invert&&(e.invert=function(e,r){return e=t.invert(e,r),e&&n.invert(e[0],e[1])}),e}function Rt(){return!0}function Ot(n,t,e,r,i){var a=[],o=[];if(n.forEach(function(n){if(!((t=n.length-1)<=0)){var t,e=n[0],r=n[t];if(Lt(e,r)){i.lineStart();for(var u=0;t>u;++u)i.point((e=n[u])[0],e[1]);return void i.lineEnd()}var s=new Dt(e,n,null,!0),l=new Dt(e,null,s,!1);s.o=l,a.push(s),o.push(l),s=new Dt(r,n,null,!1),l=new Dt(r,null,s,!0),s.o=l,a.push(s),o.push(l)}}),o.sort(t),Ut(a),Ut(o),a.length){for(var u=0,s=e,l=o.length;l>u;++u)o[u].e=s=!s;for(var c,f,h=a[0];;){for(var p=h,g=!0;p.v;)if((p=p.n)===h)return;c=p.z,i.lineStart();do{if(p.v=p.o.v=!0,p.e){if(g)for(var u=0,l=c.length;l>u;++u)i.point((f=c[u])[0],f[1]);else r(p.x,p.n.x,1,i);p=p.n}else{if(g){c=p.p.z;for(var u=c.length-1;u>=0;--u)i.point((f=c[u])[0],f[1])}else r(p.x,p.p.x,-1,i);p=p.p}p=p.o,c=p.z,g=!g}while(!p.v);i.lineEnd()}}}function Ut(n){if(t=n.length){for(var t,e,r=0,i=n[0];++r<t;)i.n=e=n[r],e.p=i,i=e;i.n=e=n[0],e.p=i}}function Dt(n,t,e,r){this.x=n,this.z=t,this.o=e,this.e=r,this.v=!1,this.n=this.p=null}function jt(n,t,e,r){return function(i,a){function o(t,e){var r=i(t,e);n(t=r[0],e=r[1])&&a.point(t,e)}function u(n,t){var e=i(n,t);v.point(e[0],e[1])}function s(){y.point=u,v.lineStart()}function l(){y.point=o,v.lineEnd()}function c(n,t){d.push([n,t]);var e=i(n,t);k.point(e[0],e[1])}function f(){k.lineStart(),d=[]}function h(){c(d[0][0],d[0][1]),k.lineEnd();var n,t=k.clean(),e=x.buffer(),r=e.length;if(d.pop(),g.push(d),d=null,r)if(1&t){n=e[0];var i,r=n.length-1,o=-1;if(r>0){for(M||(a.polygonStart(),M=!0),a.lineStart();++o<r;)a.point((i=n[o])[0],i[1]);a.lineEnd()}}else r>1&&2&t&&e.push(e.pop().concat(e.shift())),p.push(e.filter(Ft))}var p,g,d,v=t(a),m=i.invert(r[0],r[1]),y={point:o,lineStart:s,lineEnd:l,polygonStart:function(){y.point=c,y.lineStart=f,y.lineEnd=h,p=[],g=[]},polygonEnd:function(){y.point=o,y.lineStart=s,y.lineEnd=l,p=ho.merge(p);var n=Jt(m,g);p.length?(M||(a.polygonStart(),M=!0),Ot(p,Bt,n,e,a)):n&&(M||(a.polygonStart(),M=!0),a.lineStart(),e(null,null,1,a),a.lineEnd()),M&&(a.polygonEnd(),M=!1),p=g=null},sphere:function(){a.polygonStart(),a.lineStart(),e(null,null,1,a),a.lineEnd(),a.polygonEnd()}},x=It(),k=t(x),M=!1;return y}}function Ft(n){return n.length>1}function It(){var n,t=[];return{lineStart:function(){t.push(n=[])},point:function(t,e){n.push([t,e])},lineEnd:S,buffer:function(){var e=t;return t=[],n=null,e},rejoin:function(){t.length>1&&t.push(t.pop().concat(t.shift()))}}}function Bt(n,t){return((n=n.x)[0]<0?n[1]-Jo-Io:Jo-n[1])-((t=t.x)[0]<0?t[1]-Jo-Io:Jo-t[1])}function Ht(n){var t,e=NaN,r=NaN,i=NaN;return{lineStart:function(){n.lineStart(),t=1},point:function(a,o){var u=a>0?Ho:-Ho,s=No(a-e);No(s-Ho)<Io?(n.point(e,r=(r+o)/2>0?Jo:-Jo),n.point(i,r),n.lineEnd(),n.lineStart(),n.point(u,r),n.point(a,r),t=0):i!==u&&s>=Ho&&(No(e-i)<Io&&(e-=i*Io),No(a-u)<Io&&(a-=u*Io),r=Vt(e,r,a,o),n.point(i,r),n.lineEnd(),n.lineStart(),n.point(u,r),t=0),n.point(e=a,r=o),i=u},lineEnd:function(){n.lineEnd(),e=r=NaN},clean:function(){return 2-t}}}function Vt(n,t,e,r){var i,a,o=Math.sin(n-e);return No(o)>Io?Math.atan((Math.sin(t)*(a=Math.cos(r))*Math.sin(e)-Math.sin(r)*(i=Math.cos(t))*Math.sin(n))/(i*a*o)):(t+r)/2}function Yt(n,t,e,r){var i;if(null==n)i=e*Jo,r.point(-Ho,i),r.point(0,i),r.point(Ho,i),r.point(Ho,0),r.point(Ho,-i),r.point(0,-i),r.point(-Ho,-i),r.point(-Ho,0),r.point(-Ho,i);else if(No(n[0]-t[0])>Io){var a=n[0]<t[0]?Ho:-Ho;i=e*a/2,r.point(-a,i),r.point(0,i),r.point(a,i)}else r.point(t[0],t[1])}function Jt(n,t){var e=n[0],r=n[1],i=[Math.sin(e),-Math.cos(e),0],a=0,o=0;Eu.reset();for(var u=0,s=t.length;s>u;++u){var l=t[u],c=l.length;if(c)for(var f=l[0],h=f[0],p=f[1]/2+Ho/4,g=Math.sin(p),d=Math.cos(p),v=1;;){v===c&&(v=0),n=l[v];var m=n[0],y=n[1]/2+Ho/4,x=Math.sin(y),k=Math.cos(y),M=m-h,b=M>=0?1:-1,w=b*M,_=w>Ho,N=g*x;if(Eu.add(Math.atan2(N*b*Math.sin(w),d*k+N*Math.cos(w))),a+=_?M+b*Vo:M,_^h>=e^m>=e){var S=wt(Mt(f),Mt(n));St(S);var A=wt(i,S);St(A);var L=(_^M>=0?-1:1)*un(A[2]);(r>L||r===L&&(S[0]||S[1]))&&(o+=_^M>=0?1:-1)}if(!v++)break;h=m,g=x,d=k,f=n}}return(-Io>a||Io>a&&0>Eu)^1&o}function Gt(n){function t(n,t){return Math.cos(n)*Math.cos(t)>a}function e(n){var e,a,s,l,c;return{lineStart:function(){l=s=!1,c=1},point:function(f,h){var p,g=[f,h],d=t(f,h),v=o?d?0:i(f,h):d?i(f+(0>f?Ho:-Ho),h):0;if(!e&&(l=s=d)&&n.lineStart(),d!==s&&(p=r(e,g),(Lt(e,p)||Lt(g,p))&&(g[0]+=Io,g[1]+=Io,d=t(g[0],g[1]))),d!==s)c=0,d?(n.lineStart(),p=r(g,e),n.point(p[0],p[1])):(p=r(e,g),n.point(p[0],p[1]),n.lineEnd()),e=p;else if(u&&e&&o^d){var m;v&a||!(m=r(g,e,!0))||(c=0,o?(n.lineStart(),n.point(m[0][0],m[0][1]),n.point(m[1][0],m[1][1]),n.lineEnd()):(n.point(m[1][0],m[1][1]),n.lineEnd(),n.lineStart(),n.point(m[0][0],m[0][1])))}!d||e&&Lt(e,g)||n.point(g[0],g[1]),e=g,s=d,a=v},lineEnd:function(){s&&n.lineEnd(),e=null},clean:function(){return c|(l&&s)<<1}}}function r(n,t,e){var r=Mt(n),i=Mt(t),o=[1,0,0],u=wt(r,i),s=bt(u,u),l=u[0],c=s-l*l;if(!c)return!e&&n;var f=a*s/c,h=-a*l/c,p=wt(o,u),g=Nt(o,f),d=Nt(u,h);_t(g,d);var v=p,m=bt(g,v),y=bt(v,v),x=m*m-y*(bt(g,g)-1);if(!(0>x)){var k=Math.sqrt(x),M=Nt(v,(-m-k)/y);if(_t(M,g),M=At(M),!e)return M;var b,w=n[0],_=t[0],N=n[1],S=t[1];w>_&&(b=w,w=_,_=b);var A=_-w,L=No(A-Ho)<Io,E=L||Io>A;if(!L&&N>S&&(b=N,N=S,S=b),E?L?N+S>0^M[1]<(No(M[0]-w)<Io?N:S):N<=M[1]&&M[1]<=S:A>Ho^(w<=M[0]&&M[0]<=_)){var T=Nt(v,(-m+k)/y);return _t(T,g),[M,At(T)]}}}function i(t,e){var r=o?n:Ho-n,i=0;return-r>t?i|=1:t>r&&(i|=2),-r>e?i|=4:e>r&&(i|=8),i}var a=Math.cos(n),o=a>0,u=No(a)>Io,s=ke(n,6*Go);return jt(t,e,s,o?[0,-n]:[-Ho,n-Ho])}function Zt(n,t,e,r){return function(i){var a,o=i.a,u=i.b,s=o.x,l=o.y,c=u.x,f=u.y,h=0,p=1,g=c-s,d=f-l;if(a=n-s,g||!(a>0)){if(a/=g,0>g){if(h>a)return;p>a&&(p=a)}else if(g>0){if(a>p)return;a>h&&(h=a)}if(a=e-s,g||!(0>a)){if(a/=g,0>g){if(a>p)return;a>h&&(h=a)}else if(g>0){if(h>a)return;p>a&&(p=a)}if(a=t-l,d||!(a>0)){if(a/=d,0>d){if(h>a)return;p>a&&(p=a)}else if(d>0){if(a>p)return;a>h&&(h=a)}if(a=r-l,d||!(0>a)){if(a/=d,0>d){if(a>p)return;a>h&&(h=a)}else if(d>0){if(h>a)return;p>a&&(p=a)}return h>0&&(i.a={x:s+h*g,y:l+h*d}),1>p&&(i.b={x:s+p*g,y:l+p*d}),i}}}}}}function Xt(n,t,e,r){function i(r,i){return No(r[0]-n)<Io?i>0?0:3:No(r[0]-e)<Io?i>0?2:1:No(r[1]-t)<Io?i>0?1:0:i>0?3:2}function a(n,t){return o(n.x,t.x)}function o(n,t){var e=i(n,1),r=i(t,1);return e!==r?e-r:0===e?t[1]-n[1]:1===e?n[0]-t[0]:2===e?n[1]-t[1]:t[0]-n[0]}return function(u){function s(n){for(var t=0,e=v.length,r=n[1],i=0;e>i;++i)for(var a,o=1,u=v[i],s=u.length,l=u[0];s>o;++o)a=u[o],l[1]<=r?a[1]>r&&an(l,a,n)>0&&++t:a[1]<=r&&an(l,a,n)<0&&--t,l=a;return 0!==t}function l(a,u,s,l){var c=0,f=0;if(null==a||(c=i(a,s))!==(f=i(u,s))||o(a,u)<0^s>0){do l.point(0===c||3===c?n:e,c>1?r:t);while((c=(c+s+4)%4)!==f)}else l.point(u[0],u[1])}function c(i,a){return i>=n&&e>=i&&a>=t&&r>=a}function f(n,t){c(n,t)&&u.point(n,t)}function h(){E.point=g,v&&v.push(m=[]),_=!0,w=!1,M=b=NaN}function p(){d&&(g(y,x),k&&w&&A.rejoin(),d.push(A.buffer())),E.point=f,w&&u.lineEnd()}function g(n,t){n=Math.max(-Vu,Math.min(Vu,n)),t=Math.max(-Vu,Math.min(Vu,t));var e=c(n,t);if(v&&m.push([n,t]),_)y=n,x=t,k=e,_=!1,e&&(u.lineStart(),u.point(n,t));else if(e&&w)u.point(n,t);else{var r={a:{x:M,y:b},b:{x:n,y:t}};L(r)?(w||(u.lineStart(),u.point(r.a.x,r.a.y)),u.point(r.b.x,r.b.y),e||u.lineEnd(),N=!1):e&&(u.lineStart(),u.point(n,t),N=!1)}M=n,b=t,w=e}var d,v,m,y,x,k,M,b,w,_,N,S=u,A=It(),L=Zt(n,t,e,r),E={point:f,lineStart:h,lineEnd:p,polygonStart:function(){u=A,d=[],v=[],N=!0},polygonEnd:function(){u=S,d=ho.merge(d);var t=s([n,r]),e=N&&t,i=d.length;(e||i)&&(u.polygonStart(),e&&(u.lineStart(),l(null,null,1,u),u.lineEnd()),i&&Ot(d,a,t,l,u),u.polygonEnd()),d=v=m=null}};return E}}function Wt(n){var t=0,e=Ho/3,r=he(n),i=r(t,e);return i.parallels=function(n){return arguments.length?r(t=n[0]*Ho/180,e=n[1]*Ho/180):[t/Ho*180,e/Ho*180]},i}function $t(n,t){function e(n,t){var e=Math.sqrt(a-2*i*Math.sin(t))/i;return[e*Math.sin(n*=i),o-e*Math.cos(n)]}var r=Math.sin(n),i=(r+Math.sin(t))/2,a=1+r*(2*i-r),o=Math.sqrt(a)/i;return e.invert=function(n,t){var e=o-t;return[Math.atan2(n,e)/i,un((a-(n*n+e*e)*i*i)/(2*i))]},e}function Kt(){function n(n,t){Ju+=i*n-r*t,r=n,i=t}var t,e,r,i;$u.point=function(a,o){$u.point=n,t=r=a,e=i=o},$u.lineEnd=function(){n(t,e)}}function Qt(n,t){Gu>n&&(Gu=n),n>Xu&&(Xu=n),Zu>t&&(Zu=t),t>Wu&&(Wu=t)}function ne(){function n(n,t){o.push("M",n,",",t,a)}function t(n,t){o.push("M",n,",",t),u.point=e}function e(n,t){o.push("L",n,",",t)}function r(){u.point=n}function i(){o.push("Z")}var a=te(4.5),o=[],u={point:n,lineStart:function(){u.point=t},lineEnd:r,polygonStart:function(){u.lineEnd=i},polygonEnd:function(){u.lineEnd=r,u.point=n},pointRadius:function(n){return a=te(n),u},result:function(){if(o.length){var n=o.join("");return o=[],n}}};return u}function te(n){return"m0,"+n+"a"+n+","+n+" 0 1,1 0,"+-2*n+"a"+n+","+n+" 0 1,1 0,"+2*n+"z"}function ee(n,t){Pu+=n,qu+=t,++Ru}function re(){function n(n,r){var i=n-t,a=r-e,o=Math.sqrt(i*i+a*a);Ou+=o*(t+n)/2,Uu+=o*(e+r)/2,Du+=o,ee(t=n,e=r)}var t,e;Qu.point=function(r,i){Qu.point=n,ee(t=r,e=i)}}function ie(){Qu.point=ee}function ae(){function n(n,t){var e=n-r,a=t-i,o=Math.sqrt(e*e+a*a);Ou+=o*(r+n)/2,Uu+=o*(i+t)/2,Du+=o,o=i*n-r*t,ju+=o*(r+n),Fu+=o*(i+t),Iu+=3*o,ee(r=n,i=t)}var t,e,r,i;Qu.point=function(a,o){Qu.point=n,ee(t=r=a,e=i=o)},Qu.lineEnd=function(){n(t,e)}}function oe(n){function t(t,e){n.moveTo(t+o,e),n.arc(t,e,o,0,Vo)}function e(t,e){n.moveTo(t,e),u.point=r}function r(t,e){n.lineTo(t,e)}function i(){u.point=t}function a(){n.closePath()}var o=4.5,u={point:t,lineStart:function(){u.point=e},lineEnd:i,polygonStart:function(){u.lineEnd=a},polygonEnd:function(){u.lineEnd=i,u.point=t},pointRadius:function(n){return o=n,u},result:S};return u}function ue(n){function t(n){return(u?r:e)(n)}function e(t){return ce(t,function(e,r){e=n(e,r),t.point(e[0],e[1])})}function r(t){function e(e,r){e=n(e,r),t.point(e[0],e[1])}function r(){x=NaN,_.point=a,t.lineStart()}function a(e,r){var a=Mt([e,r]),o=n(e,r);i(x,k,y,M,b,w,x=o[0],k=o[1],y=e,M=a[0],b=a[1],w=a[2],u,t),t.point(x,k)}function o(){_.point=e,t.lineEnd()}function s(){r(),_.point=l,_.lineEnd=c}function l(n,t){a(f=n,h=t),p=x,g=k,d=M,v=b,m=w,_.point=a}function c(){i(x,k,y,M,b,w,p,g,f,d,v,m,u,t),_.lineEnd=o,o()}var f,h,p,g,d,v,m,y,x,k,M,b,w,_={point:e,lineStart:r,lineEnd:o,polygonStart:function(){t.polygonStart(),_.lineStart=s},polygonEnd:function(){t.polygonEnd(),_.lineStart=r}};return _}function i(t,e,r,u,s,l,c,f,h,p,g,d,v,m){var y=c-t,x=f-e,k=y*y+x*x;if(k>4*a&&v--){var M=u+p,b=s+g,w=l+d,_=Math.sqrt(M*M+b*b+w*w),N=Math.asin(w/=_),S=No(No(w)-1)<Io||No(r-h)<Io?(r+h)/2:Math.atan2(b,M),A=n(S,N),L=A[0],E=A[1],T=L-t,C=E-e,z=x*T-y*C;(z*z/k>a||No((y*T+x*C)/k-.5)>.3||o>u*p+s*g+l*d)&&(i(t,e,r,u,s,l,L,E,S,M/=_,b/=_,w,v,m),m.point(L,E),i(L,E,S,M,b,w,c,f,h,p,g,d,v,m))}}var a=.5,o=Math.cos(30*Go),u=16;return t.precision=function(n){return arguments.length?(u=(a=n*n)>0&&16,t):Math.sqrt(a)},t}function se(n){var t=ue(function(t,e){return n([t*Zo,e*Zo])});return function(n){return pe(t(n))}}function le(n){this.stream=n}function ce(n,t){return{point:t,sphere:function(){n.sphere()},lineStart:function(){n.lineStart()},lineEnd:function(){n.lineEnd()},polygonStart:function(){n.polygonStart()},polygonEnd:function(){n.polygonEnd()}}}function fe(n){return he(function(){return n})()}function he(n){function t(n){return n=u(n[0]*Go,n[1]*Go),[n[0]*h+s,l-n[1]*h]}function e(n){return n=u.invert((n[0]-s)/h,(l-n[1])/h),n&&[n[0]*Zo,n[1]*Zo]}function r(){u=qt(o=ve(m,y,x),a);var n=a(d,v);return s=p-n[0]*h,l=g+n[1]*h,i()}function i(){return c&&(c.valid=!1,c=null),t}var a,o,u,s,l,c,f=ue(function(n,t){return n=a(n,t),[n[0]*h+s,l-n[1]*h]}),h=150,p=480,g=250,d=0,v=0,m=0,y=0,x=0,k=Hu,M=w,b=null,_=null;return t.stream=function(n){return c&&(c.valid=!1),c=pe(k(o,f(M(n)))),c.valid=!0,c},t.clipAngle=function(n){return arguments.length?(k=null==n?(b=n,Hu):Gt((b=+n)*Go),i()):b},t.clipExtent=function(n){return arguments.length?(_=n,M=n?Xt(n[0][0],n[0][1],n[1][0],n[1][1]):w,i()):_},t.scale=function(n){return arguments.length?(h=+n,r()):h},t.translate=function(n){return arguments.length?(p=+n[0],g=+n[1],r()):[p,g]},t.center=function(n){return arguments.length?(d=n[0]%360*Go,v=n[1]%360*Go,r()):[d*Zo,v*Zo]},t.rotate=function(n){return arguments.length?(m=n[0]%360*Go,y=n[1]%360*Go,x=n.length>2?n[2]%360*Go:0,r()):[m*Zo,y*Zo,x*Zo]},ho.rebind(t,f,"precision"),function(){return a=n.apply(this,arguments),t.invert=a.invert&&e,r()}}function pe(n){return ce(n,function(t,e){n.point(t*Go,e*Go)})}function ge(n,t){return[n,t]}function de(n,t){return[n>Ho?n-Vo:-Ho>n?n+Vo:n,t]}function ve(n,t,e){return n?t||e?qt(ye(n),xe(t,e)):ye(n):t||e?xe(t,e):de}function me(n){return function(t,e){return t+=n,[t>Ho?t-Vo:-Ho>t?t+Vo:t,e]}}function ye(n){var t=me(n);return t.invert=me(-n),t}function xe(n,t){function e(n,t){var e=Math.cos(t),u=Math.cos(n)*e,s=Math.sin(n)*e,l=Math.sin(t),c=l*r+u*i;return[Math.atan2(s*a-c*o,u*r-l*i),un(c*a+s*o)]}var r=Math.cos(n),i=Math.sin(n),a=Math.cos(t),o=Math.sin(t);return e.invert=function(n,t){var e=Math.cos(t),u=Math.cos(n)*e,s=Math.sin(n)*e,l=Math.sin(t),c=l*a-s*o;return[Math.atan2(s*a+l*o,u*r+c*i),un(c*r-u*i)]},e}function ke(n,t){var e=Math.cos(n),r=Math.sin(n);return function(i,a,o,u){var s=o*t;null!=i?(i=Me(e,i),a=Me(e,a),(o>0?a>i:i>a)&&(i+=o*Vo)):(i=n+o*Vo,a=n-.5*s);for(var l,c=i;o>0?c>a:a>c;c-=s)u.point((l=At([e,-r*Math.cos(c),-r*Math.sin(c)]))[0],l[1])}}function Me(n,t){var e=Mt(t);e[0]-=n,St(e);var r=on(-e[1]);return((-e[2]<0?-r:r)+2*Math.PI-Io)%(2*Math.PI)}function be(n,t,e){var r=ho.range(n,t-Io,e).concat(t);return function(n){return r.map(function(t){return[n,t]})}}function we(n,t,e){var r=ho.range(n,t-Io,e).concat(t);return function(n){return r.map(function(t){return[t,n]})}}function _e(n){return n.source}function Ne(n){return n.target}function Se(n,t,e,r){var i=Math.cos(t),a=Math.sin(t),o=Math.cos(r),u=Math.sin(r),s=i*Math.cos(n),l=i*Math.sin(n),c=o*Math.cos(e),f=o*Math.sin(e),h=2*Math.asin(Math.sqrt(fn(r-t)+i*o*fn(e-n))),p=1/Math.sin(h),g=h?function(n){var t=Math.sin(n*=h)*p,e=Math.sin(h-n)*p,r=e*s+t*c,i=e*l+t*f,o=e*a+t*u;return[Math.atan2(i,r)*Zo,Math.atan2(o,Math.sqrt(r*r+i*i))*Zo]}:function(){return[n*Zo,t*Zo]};return g.distance=h,g}function Ae(){function n(n,i){var a=Math.sin(i*=Go),o=Math.cos(i),u=No((n*=Go)-t),s=Math.cos(u);ns+=Math.atan2(Math.sqrt((u=o*Math.sin(u))*u+(u=r*a-e*o*s)*u),e*a+r*o*s),t=n,e=a,r=o}var t,e,r;ts.point=function(i,a){t=i*Go,e=Math.sin(a*=Go),r=Math.cos(a),ts.point=n},ts.lineEnd=function(){ts.point=ts.lineEnd=S}}function Le(n,t){function e(t,e){var r=Math.cos(t),i=Math.cos(e),a=n(r*i);return[a*i*Math.sin(t),a*Math.sin(e)]}return e.invert=function(n,e){var r=Math.sqrt(n*n+e*e),i=t(r),a=Math.sin(i),o=Math.cos(i);return[Math.atan2(n*a,r*o),Math.asin(r&&e*a/r)]},e}function Ee(n,t){function e(n,t){o>0?-Jo+Io>t&&(t=-Jo+Io):t>Jo-Io&&(t=Jo-Io);var e=o/Math.pow(i(t),a);return[e*Math.sin(a*n),o-e*Math.cos(a*n)]}var r=Math.cos(n),i=function(n){return Math.tan(Ho/4+n/2)},a=n===t?Math.sin(n):Math.log(r/Math.cos(t))/Math.log(i(t)/i(n)),o=r*Math.pow(i(n),a)/a;return a?(e.invert=function(n,t){var e=o-t,r=rn(a)*Math.sqrt(n*n+e*e);return[Math.atan2(n,e)/a,2*Math.atan(Math.pow(o/r,1/a))-Jo]},e):Ce}function Te(n,t){function e(n,t){var e=a-t;return[e*Math.sin(i*n),a-e*Math.cos(i*n)]}var r=Math.cos(n),i=n===t?Math.sin(n):(r-Math.cos(t))/(t-n),a=r/i+n;return No(i)<Io?ge:(e.invert=function(n,t){var e=a-t;return[Math.atan2(n,e)/i,a-rn(i)*Math.sqrt(n*n+e*e)]},e)}function Ce(n,t){return[n,Math.log(Math.tan(Ho/4+t/2))]}function ze(n){var t,e=fe(n),r=e.scale,i=e.translate,a=e.clipExtent;return e.scale=function(){var n=r.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.translate=function(){var n=i.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.clipExtent=function(n){var o=a.apply(e,arguments);if(o===e){if(t=null==n){var u=Ho*r(),s=i();a([[s[0]-u,s[1]-u],[s[0]+u,s[1]+u]])}}else t&&(o=null);return o},e.clipExtent(null)}function Pe(n,t){return[Math.log(Math.tan(Ho/4+t/2)),-n]}function qe(n){return n[0]}function Re(n){return n[1]}function Oe(n){for(var t=n.length,e=[0,1],r=2,i=2;t>i;i++){for(;r>1&&an(n[e[r-2]],n[e[r-1]],n[i])<=0;)--r;e[r++]=i}return e.slice(0,r)}function Ue(n,t){return n[0]-t[0]||n[1]-t[1]}function De(n,t,e){return(e[0]-t[0])*(n[1]-t[1])<(e[1]-t[1])*(n[0]-t[0])}function je(n,t,e,r){var i=n[0],a=e[0],o=t[0]-i,u=r[0]-a,s=n[1],l=e[1],c=t[1]-s,f=r[1]-l,h=(u*(s-l)-f*(i-a))/(f*o-u*c);return[i+h*o,s+h*c]}function Fe(n){var t=n[0],e=n[n.length-1];return!(t[0]-e[0]||t[1]-e[1])}function Ie(){sr(this),this.edge=this.site=this.circle=null}function Be(n){var t=ps.pop()||new Ie;return t.site=n,t}function He(n){Qe(n),cs.remove(n),ps.push(n),sr(n)}function Ve(n){var t=n.circle,e=t.x,r=t.cy,i={x:e,y:r},a=n.P,o=n.N,u=[n];He(n);for(var s=a;s.circle&&No(e-s.circle.x)<Io&&No(r-s.circle.cy)<Io;)a=s.P,u.unshift(s),He(s),s=a;u.unshift(s),Qe(s);for(var l=o;l.circle&&No(e-l.circle.x)<Io&&No(r-l.circle.cy)<Io;)o=l.N,u.push(l),He(l),l=o;u.push(l),Qe(l);var c,f=u.length;for(c=1;f>c;++c)l=u[c],s=u[c-1],ar(l.edge,s.site,l.site,i);s=u[0],l=u[f-1],l.edge=rr(s.site,l.site,null,i),Ke(s),Ke(l)}function Ye(n){for(var t,e,r,i,a=n.x,o=n.y,u=cs._;u;)if(r=Je(u,o)-a,r>Io)u=u.L;else{if(i=a-Ge(u,o),!(i>Io)){r>-Io?(t=u.P,e=u):i>-Io?(t=u,e=u.N):t=e=u;break}if(!u.R){t=u;
	break}u=u.R}var s=Be(n);if(cs.insert(t,s),t||e){if(t===e)return Qe(t),e=Be(t.site),cs.insert(s,e),s.edge=e.edge=rr(t.site,s.site),Ke(t),void Ke(e);if(!e)return void(s.edge=rr(t.site,s.site));Qe(t),Qe(e);var l=t.site,c=l.x,f=l.y,h=n.x-c,p=n.y-f,g=e.site,d=g.x-c,v=g.y-f,m=2*(h*v-p*d),y=h*h+p*p,x=d*d+v*v,k={x:(v*y-p*x)/m+c,y:(h*x-d*y)/m+f};ar(e.edge,l,g,k),s.edge=rr(l,n,null,k),e.edge=rr(n,g,null,k),Ke(t),Ke(e)}}function Je(n,t){var e=n.site,r=e.x,i=e.y,a=i-t;if(!a)return r;var o=n.P;if(!o)return-(1/0);e=o.site;var u=e.x,s=e.y,l=s-t;if(!l)return u;var c=u-r,f=1/a-1/l,h=c/l;return f?(-h+Math.sqrt(h*h-2*f*(c*c/(-2*l)-s+l/2+i-a/2)))/f+r:(r+u)/2}function Ge(n,t){var e=n.N;if(e)return Je(e,t);var r=n.site;return r.y===t?r.x:1/0}function Ze(n){this.site=n,this.edges=[]}function Xe(n){for(var t,e,r,i,a,o,u,s,l,c,f=n[0][0],h=n[1][0],p=n[0][1],g=n[1][1],d=ls,v=d.length;v--;)if(a=d[v],a&&a.prepare())for(u=a.edges,s=u.length,o=0;s>o;)c=u[o].end(),r=c.x,i=c.y,l=u[++o%s].start(),t=l.x,e=l.y,(No(r-t)>Io||No(i-e)>Io)&&(u.splice(o,0,new or(ir(a.site,c,No(r-f)<Io&&g-i>Io?{x:f,y:No(t-f)<Io?e:g}:No(i-g)<Io&&h-r>Io?{x:No(e-g)<Io?t:h,y:g}:No(r-h)<Io&&i-p>Io?{x:h,y:No(t-h)<Io?e:p}:No(i-p)<Io&&r-f>Io?{x:No(e-p)<Io?t:f,y:p}:null),a.site,null)),++s)}function We(n,t){return t.angle-n.angle}function $e(){sr(this),this.x=this.y=this.arc=this.site=this.cy=null}function Ke(n){var t=n.P,e=n.N;if(t&&e){var r=t.site,i=n.site,a=e.site;if(r!==a){var o=i.x,u=i.y,s=r.x-o,l=r.y-u,c=a.x-o,f=a.y-u,h=2*(s*f-l*c);if(!(h>=-Bo)){var p=s*s+l*l,g=c*c+f*f,d=(f*p-l*g)/h,v=(s*g-c*p)/h,f=v+u,m=gs.pop()||new $e;m.arc=n,m.site=i,m.x=d+o,m.y=f+Math.sqrt(d*d+v*v),m.cy=f,n.circle=m;for(var y=null,x=hs._;x;)if(m.y<x.y||m.y===x.y&&m.x<=x.x){if(!x.L){y=x.P;break}x=x.L}else{if(!x.R){y=x;break}x=x.R}hs.insert(y,m),y||(fs=m)}}}}function Qe(n){var t=n.circle;t&&(t.P||(fs=t.N),hs.remove(t),gs.push(t),sr(t),n.circle=null)}function nr(n){for(var t,e=ss,r=Zt(n[0][0],n[0][1],n[1][0],n[1][1]),i=e.length;i--;)t=e[i],(!tr(t,n)||!r(t)||No(t.a.x-t.b.x)<Io&&No(t.a.y-t.b.y)<Io)&&(t.a=t.b=null,e.splice(i,1))}function tr(n,t){var e=n.b;if(e)return!0;var r,i,a=n.a,o=t[0][0],u=t[1][0],s=t[0][1],l=t[1][1],c=n.l,f=n.r,h=c.x,p=c.y,g=f.x,d=f.y,v=(h+g)/2,m=(p+d)/2;if(d===p){if(o>v||v>=u)return;if(h>g){if(a){if(a.y>=l)return}else a={x:v,y:s};e={x:v,y:l}}else{if(a){if(a.y<s)return}else a={x:v,y:l};e={x:v,y:s}}}else if(r=(h-g)/(d-p),i=m-r*v,-1>r||r>1)if(h>g){if(a){if(a.y>=l)return}else a={x:(s-i)/r,y:s};e={x:(l-i)/r,y:l}}else{if(a){if(a.y<s)return}else a={x:(l-i)/r,y:l};e={x:(s-i)/r,y:s}}else if(d>p){if(a){if(a.x>=u)return}else a={x:o,y:r*o+i};e={x:u,y:r*u+i}}else{if(a){if(a.x<o)return}else a={x:u,y:r*u+i};e={x:o,y:r*o+i}}return n.a=a,n.b=e,!0}function er(n,t){this.l=n,this.r=t,this.a=this.b=null}function rr(n,t,e,r){var i=new er(n,t);return ss.push(i),e&&ar(i,n,t,e),r&&ar(i,t,n,r),ls[n.i].edges.push(new or(i,n,t)),ls[t.i].edges.push(new or(i,t,n)),i}function ir(n,t,e){var r=new er(n,null);return r.a=t,r.b=e,ss.push(r),r}function ar(n,t,e,r){n.a||n.b?n.l===e?n.b=r:n.a=r:(n.a=r,n.l=t,n.r=e)}function or(n,t,e){var r=n.a,i=n.b;this.edge=n,this.site=t,this.angle=e?Math.atan2(e.y-t.y,e.x-t.x):n.l===t?Math.atan2(i.x-r.x,r.y-i.y):Math.atan2(r.x-i.x,i.y-r.y)}function ur(){this._=null}function sr(n){n.U=n.C=n.L=n.R=n.P=n.N=null}function lr(n,t){var e=t,r=t.R,i=e.U;i?i.L===e?i.L=r:i.R=r:n._=r,r.U=i,e.U=r,e.R=r.L,e.R&&(e.R.U=e),r.L=e}function cr(n,t){var e=t,r=t.L,i=e.U;i?i.L===e?i.L=r:i.R=r:n._=r,r.U=i,e.U=r,e.L=r.R,e.L&&(e.L.U=e),r.R=e}function fr(n){for(;n.L;)n=n.L;return n}function hr(n,t){var e,r,i,a=n.sort(pr).pop();for(ss=[],ls=new Array(n.length),cs=new ur,hs=new ur;;)if(i=fs,a&&(!i||a.y<i.y||a.y===i.y&&a.x<i.x))(a.x!==e||a.y!==r)&&(ls[a.i]=new Ze(a),Ye(a),e=a.x,r=a.y),a=n.pop();else{if(!i)break;Ve(i.arc)}t&&(nr(t),Xe(t));var o={cells:ls,edges:ss};return cs=hs=ss=ls=null,o}function pr(n,t){return t.y-n.y||t.x-n.x}function gr(n,t,e){return(n.x-e.x)*(t.y-n.y)-(n.x-t.x)*(e.y-n.y)}function dr(n){return n.x}function vr(n){return n.y}function mr(){return{leaf:!0,nodes:[],point:null,x:null,y:null}}function yr(n,t,e,r,i,a){if(!n(t,e,r,i,a)){var o=.5*(e+i),u=.5*(r+a),s=t.nodes;s[0]&&yr(n,s[0],e,r,o,u),s[1]&&yr(n,s[1],o,r,i,u),s[2]&&yr(n,s[2],e,u,o,a),s[3]&&yr(n,s[3],o,u,i,a)}}function xr(n,t,e,r,i,a,o){var u,s=1/0;return function l(n,c,f,h,p){if(!(c>a||f>o||r>h||i>p)){if(g=n.point){var g,d=t-n.x,v=e-n.y,m=d*d+v*v;if(s>m){var y=Math.sqrt(s=m);r=t-y,i=e-y,a=t+y,o=e+y,u=g}}for(var x=n.nodes,k=.5*(c+h),M=.5*(f+p),b=t>=k,w=e>=M,_=w<<1|b,N=_+4;N>_;++_)if(n=x[3&_])switch(3&_){case 0:l(n,c,f,k,M);break;case 1:l(n,k,f,h,M);break;case 2:l(n,c,M,k,p);break;case 3:l(n,k,M,h,p)}}}(n,r,i,a,o),u}function kr(n,t){n=ho.rgb(n),t=ho.rgb(t);var e=n.r,r=n.g,i=n.b,a=t.r-e,o=t.g-r,u=t.b-i;return function(n){return"#"+Sn(Math.round(e+a*n))+Sn(Math.round(r+o*n))+Sn(Math.round(i+u*n))}}function Mr(n,t){var e,r={},i={};for(e in n)e in t?r[e]=_r(n[e],t[e]):i[e]=n[e];for(e in t)e in n||(i[e]=t[e]);return function(n){for(e in r)i[e]=r[e](n);return i}}function br(n,t){return n=+n,t=+t,function(e){return n*(1-e)+t*e}}function wr(n,t){var e,r,i,a=vs.lastIndex=ms.lastIndex=0,o=-1,u=[],s=[];for(n+="",t+="";(e=vs.exec(n))&&(r=ms.exec(t));)(i=r.index)>a&&(i=t.slice(a,i),u[o]?u[o]+=i:u[++o]=i),(e=e[0])===(r=r[0])?u[o]?u[o]+=r:u[++o]=r:(u[++o]=null,s.push({i:o,x:br(e,r)})),a=ms.lastIndex;return a<t.length&&(i=t.slice(a),u[o]?u[o]+=i:u[++o]=i),u.length<2?s[0]?(t=s[0].x,function(n){return t(n)+""}):function(){return t}:(t=s.length,function(n){for(var e,r=0;t>r;++r)u[(e=s[r]).i]=e.x(n);return u.join("")})}function _r(n,t){for(var e,r=ho.interpolators.length;--r>=0&&!(e=ho.interpolators[r](n,t)););return e}function Nr(n,t){var e,r=[],i=[],a=n.length,o=t.length,u=Math.min(n.length,t.length);for(e=0;u>e;++e)r.push(_r(n[e],t[e]));for(;a>e;++e)i[e]=n[e];for(;o>e;++e)i[e]=t[e];return function(n){for(e=0;u>e;++e)i[e]=r[e](n);return i}}function Sr(n){return function(t){return 0>=t?0:t>=1?1:n(t)}}function Ar(n){return function(t){return 1-n(1-t)}}function Lr(n){return function(t){return.5*(.5>t?n(2*t):2-n(2-2*t))}}function Er(n){return n*n}function Tr(n){return n*n*n}function Cr(n){if(0>=n)return 0;if(n>=1)return 1;var t=n*n,e=t*n;return 4*(.5>n?e:3*(n-t)+e-.75)}function zr(n){return function(t){return Math.pow(t,n)}}function Pr(n){return 1-Math.cos(n*Jo)}function qr(n){return Math.pow(2,10*(n-1))}function Rr(n){return 1-Math.sqrt(1-n*n)}function Or(n,t){var e;return arguments.length<2&&(t=.45),arguments.length?e=t/Vo*Math.asin(1/n):(n=1,e=t/4),function(r){return 1+n*Math.pow(2,-10*r)*Math.sin((r-e)*Vo/t)}}function Ur(n){return n||(n=1.70158),function(t){return t*t*((n+1)*t-n)}}function Dr(n){return 1/2.75>n?7.5625*n*n:2/2.75>n?7.5625*(n-=1.5/2.75)*n+.75:2.5/2.75>n?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375}function jr(n,t){n=ho.hcl(n),t=ho.hcl(t);var e=n.h,r=n.c,i=n.l,a=t.h-e,o=t.c-r,u=t.l-i;return isNaN(o)&&(o=0,r=isNaN(r)?t.c:r),isNaN(a)?(a=0,e=isNaN(e)?t.h:e):a>180?a-=360:-180>a&&(a+=360),function(n){return vn(e+a*n,r+o*n,i+u*n)+""}}function Fr(n,t){n=ho.hsl(n),t=ho.hsl(t);var e=n.h,r=n.s,i=n.l,a=t.h-e,o=t.s-r,u=t.l-i;return isNaN(o)&&(o=0,r=isNaN(r)?t.s:r),isNaN(a)?(a=0,e=isNaN(e)?t.h:e):a>180?a-=360:-180>a&&(a+=360),function(n){return gn(e+a*n,r+o*n,i+u*n)+""}}function Ir(n,t){n=ho.lab(n),t=ho.lab(t);var e=n.l,r=n.a,i=n.b,a=t.l-e,o=t.a-r,u=t.b-i;return function(n){return yn(e+a*n,r+o*n,i+u*n)+""}}function Br(n,t){return t-=n,function(e){return Math.round(n+t*e)}}function Hr(n){var t=[n.a,n.b],e=[n.c,n.d],r=Yr(t),i=Vr(t,e),a=Yr(Jr(e,t,-i))||0;t[0]*e[1]<e[0]*t[1]&&(t[0]*=-1,t[1]*=-1,r*=-1,i*=-1),this.rotate=(r?Math.atan2(t[1],t[0]):Math.atan2(-e[0],e[1]))*Zo,this.translate=[n.e,n.f],this.scale=[r,a],this.skew=a?Math.atan2(i,a)*Zo:0}function Vr(n,t){return n[0]*t[0]+n[1]*t[1]}function Yr(n){var t=Math.sqrt(Vr(n,n));return t&&(n[0]/=t,n[1]/=t),t}function Jr(n,t,e){return n[0]+=e*t[0],n[1]+=e*t[1],n}function Gr(n){return n.length?n.pop()+",":""}function Zr(n,t,e,r){if(n[0]!==t[0]||n[1]!==t[1]){var i=e.push("translate(",null,",",null,")");r.push({i:i-4,x:br(n[0],t[0])},{i:i-2,x:br(n[1],t[1])})}else(t[0]||t[1])&&e.push("translate("+t+")")}function Xr(n,t,e,r){n!==t?(n-t>180?t+=360:t-n>180&&(n+=360),r.push({i:e.push(Gr(e)+"rotate(",null,")")-2,x:br(n,t)})):t&&e.push(Gr(e)+"rotate("+t+")")}function Wr(n,t,e,r){n!==t?r.push({i:e.push(Gr(e)+"skewX(",null,")")-2,x:br(n,t)}):t&&e.push(Gr(e)+"skewX("+t+")")}function $r(n,t,e,r){if(n[0]!==t[0]||n[1]!==t[1]){var i=e.push(Gr(e)+"scale(",null,",",null,")");r.push({i:i-4,x:br(n[0],t[0])},{i:i-2,x:br(n[1],t[1])})}else(1!==t[0]||1!==t[1])&&e.push(Gr(e)+"scale("+t+")")}function Kr(n,t){var e=[],r=[];return n=ho.transform(n),t=ho.transform(t),Zr(n.translate,t.translate,e,r),Xr(n.rotate,t.rotate,e,r),Wr(n.skew,t.skew,e,r),$r(n.scale,t.scale,e,r),n=t=null,function(n){for(var t,i=-1,a=r.length;++i<a;)e[(t=r[i]).i]=t.x(n);return e.join("")}}function Qr(n,t){return t=(t-=n=+n)||1/t,function(e){return(e-n)/t}}function ni(n,t){return t=(t-=n=+n)||1/t,function(e){return Math.max(0,Math.min(1,(e-n)/t))}}function ti(n){for(var t=n.source,e=n.target,r=ri(t,e),i=[t];t!==r;)t=t.parent,i.push(t);for(var a=i.length;e!==r;)i.splice(a,0,e),e=e.parent;return i}function ei(n){for(var t=[],e=n.parent;null!=e;)t.push(n),n=e,e=e.parent;return t.push(n),t}function ri(n,t){if(n===t)return n;for(var e=ei(n),r=ei(t),i=e.pop(),a=r.pop(),o=null;i===a;)o=i,i=e.pop(),a=r.pop();return o}function ii(n){n.fixed|=2}function ai(n){n.fixed&=-7}function oi(n){n.fixed|=4,n.px=n.x,n.py=n.y}function ui(n){n.fixed&=-5}function si(n,t,e){var r=0,i=0;if(n.charge=0,!n.leaf)for(var a,o=n.nodes,u=o.length,s=-1;++s<u;)a=o[s],null!=a&&(si(a,t,e),n.charge+=a.charge,r+=a.charge*a.cx,i+=a.charge*a.cy);if(n.point){n.leaf||(n.point.x+=Math.random()-.5,n.point.y+=Math.random()-.5);var l=t*e[n.point.index];n.charge+=n.pointCharge=l,r+=l*n.point.x,i+=l*n.point.y}n.cx=r/n.charge,n.cy=i/n.charge}function li(n,t){return ho.rebind(n,t,"sort","children","value"),n.nodes=n,n.links=di,n}function ci(n,t){for(var e=[n];null!=(n=e.pop());)if(t(n),(i=n.children)&&(r=i.length))for(var r,i;--r>=0;)e.push(i[r])}function fi(n,t){for(var e=[n],r=[];null!=(n=e.pop());)if(r.push(n),(a=n.children)&&(i=a.length))for(var i,a,o=-1;++o<i;)e.push(a[o]);for(;null!=(n=r.pop());)t(n)}function hi(n){return n.children}function pi(n){return n.value}function gi(n,t){return t.value-n.value}function di(n){return ho.merge(n.map(function(n){return(n.children||[]).map(function(t){return{source:n,target:t}})}))}function vi(n){return n.x}function mi(n){return n.y}function yi(n,t,e){n.y0=t,n.y=e}function xi(n){return ho.range(n.length)}function ki(n){for(var t=-1,e=n[0].length,r=[];++t<e;)r[t]=0;return r}function Mi(n){for(var t,e=1,r=0,i=n[0][1],a=n.length;a>e;++e)(t=n[e][1])>i&&(r=e,i=t);return r}function bi(n){return n.reduce(wi,0)}function wi(n,t){return n+t[1]}function _i(n,t){return Ni(n,Math.ceil(Math.log(t.length)/Math.LN2+1))}function Ni(n,t){for(var e=-1,r=+n[0],i=(n[1]-r)/t,a=[];++e<=t;)a[e]=i*e+r;return a}function Si(n){return[ho.min(n),ho.max(n)]}function Ai(n,t){return n.value-t.value}function Li(n,t){var e=n._pack_next;n._pack_next=t,t._pack_prev=n,t._pack_next=e,e._pack_prev=t}function Ei(n,t){n._pack_next=t,t._pack_prev=n}function Ti(n,t){var e=t.x-n.x,r=t.y-n.y,i=n.r+t.r;return.999*i*i>e*e+r*r}function Ci(n){function t(n){c=Math.min(n.x-n.r,c),f=Math.max(n.x+n.r,f),h=Math.min(n.y-n.r,h),p=Math.max(n.y+n.r,p)}if((e=n.children)&&(l=e.length)){var e,r,i,a,o,u,s,l,c=1/0,f=-(1/0),h=1/0,p=-(1/0);if(e.forEach(zi),r=e[0],r.x=-r.r,r.y=0,t(r),l>1&&(i=e[1],i.x=i.r,i.y=0,t(i),l>2))for(a=e[2],Ri(r,i,a),t(a),Li(r,a),r._pack_prev=a,Li(a,i),i=r._pack_next,o=3;l>o;o++){Ri(r,i,a=e[o]);var g=0,d=1,v=1;for(u=i._pack_next;u!==i;u=u._pack_next,d++)if(Ti(u,a)){g=1;break}if(1==g)for(s=r._pack_prev;s!==u._pack_prev&&!Ti(s,a);s=s._pack_prev,v++);g?(v>d||d==v&&i.r<r.r?Ei(r,i=u):Ei(r=s,i),o--):(Li(r,a),i=a,t(a))}var m=(c+f)/2,y=(h+p)/2,x=0;for(o=0;l>o;o++)a=e[o],a.x-=m,a.y-=y,x=Math.max(x,a.r+Math.sqrt(a.x*a.x+a.y*a.y));n.r=x,e.forEach(Pi)}}function zi(n){n._pack_next=n._pack_prev=n}function Pi(n){delete n._pack_next,delete n._pack_prev}function qi(n,t,e,r){var i=n.children;if(n.x=t+=r*n.x,n.y=e+=r*n.y,n.r*=r,i)for(var a=-1,o=i.length;++a<o;)qi(i[a],t,e,r)}function Ri(n,t,e){var r=n.r+e.r,i=t.x-n.x,a=t.y-n.y;if(r&&(i||a)){var o=t.r+e.r,u=i*i+a*a;o*=o,r*=r;var s=.5+(r-o)/(2*u),l=Math.sqrt(Math.max(0,2*o*(r+u)-(r-=u)*r-o*o))/(2*u);e.x=n.x+s*i+l*a,e.y=n.y+s*a-l*i}else e.x=n.x+r,e.y=n.y}function Oi(n,t){return n.parent==t.parent?1:2}function Ui(n){var t=n.children;return t.length?t[0]:n.t}function Di(n){var t,e=n.children;return(t=e.length)?e[t-1]:n.t}function ji(n,t,e){var r=e/(t.i-n.i);t.c-=r,t.s+=e,n.c+=r,t.z+=e,t.m+=e}function Fi(n){for(var t,e=0,r=0,i=n.children,a=i.length;--a>=0;)t=i[a],t.z+=e,t.m+=e,e+=t.s+(r+=t.c)}function Ii(n,t,e){return n.a.parent===t.parent?n.a:e}function Bi(n){return 1+ho.max(n,function(n){return n.y})}function Hi(n){return n.reduce(function(n,t){return n+t.x},0)/n.length}function Vi(n){var t=n.children;return t&&t.length?Vi(t[0]):n}function Yi(n){var t,e=n.children;return e&&(t=e.length)?Yi(e[t-1]):n}function Ji(n){return{x:n.x,y:n.y,dx:n.dx,dy:n.dy}}function Gi(n,t){var e=n.x+t[3],r=n.y+t[0],i=n.dx-t[1]-t[3],a=n.dy-t[0]-t[2];return 0>i&&(e+=i/2,i=0),0>a&&(r+=a/2,a=0),{x:e,y:r,dx:i,dy:a}}function Zi(n){var t=n[0],e=n[n.length-1];return e>t?[t,e]:[e,t]}function Xi(n){return n.rangeExtent?n.rangeExtent():Zi(n.range())}function Wi(n,t,e,r){var i=e(n[0],n[1]),a=r(t[0],t[1]);return function(n){return a(i(n))}}function $i(n,t){var e,r=0,i=n.length-1,a=n[r],o=n[i];return a>o&&(e=r,r=i,i=e,e=a,a=o,o=e),n[r]=t.floor(a),n[i]=t.ceil(o),n}function Ki(n){return n?{floor:function(t){return Math.floor(t/n)*n},ceil:function(t){return Math.ceil(t/n)*n}}:Ls}function Qi(n,t,e,r){var i=[],a=[],o=0,u=Math.min(n.length,t.length)-1;for(n[u]<n[0]&&(n=n.slice().reverse(),t=t.slice().reverse());++o<=u;)i.push(e(n[o-1],n[o])),a.push(r(t[o-1],t[o]));return function(t){var e=ho.bisect(n,t,1,u)-1;return a[e](i[e](t))}}function na(n,t,e,r){function i(){var i=Math.min(n.length,t.length)>2?Qi:Wi,s=r?ni:Qr;return o=i(n,t,s,e),u=i(t,n,s,_r),a}function a(n){return o(n)}var o,u;return a.invert=function(n){return u(n)},a.domain=function(t){return arguments.length?(n=t.map(Number),i()):n},a.range=function(n){return arguments.length?(t=n,i()):t},a.rangeRound=function(n){return a.range(n).interpolate(Br)},a.clamp=function(n){return arguments.length?(r=n,i()):r},a.interpolate=function(n){return arguments.length?(e=n,i()):e},a.ticks=function(t){return ia(n,t)},a.tickFormat=function(t,e){return aa(n,t,e)},a.nice=function(t){return ea(n,t),i()},a.copy=function(){return na(n,t,e,r)},i()}function ta(n,t){return ho.rebind(n,t,"range","rangeRound","interpolate","clamp")}function ea(n,t){return $i(n,Ki(ra(n,t)[2])),$i(n,Ki(ra(n,t)[2])),n}function ra(n,t){null==t&&(t=10);var e=Zi(n),r=e[1]-e[0],i=Math.pow(10,Math.floor(Math.log(r/t)/Math.LN10)),a=t/r*i;return.15>=a?i*=10:.35>=a?i*=5:.75>=a&&(i*=2),e[0]=Math.ceil(e[0]/i)*i,e[1]=Math.floor(e[1]/i)*i+.5*i,e[2]=i,e}function ia(n,t){return ho.range.apply(ho,ra(n,t))}function aa(n,t,e){var r=ra(n,t);if(e){var i=vu.exec(e);if(i.shift(),"s"===i[8]){var a=ho.formatPrefix(Math.max(No(r[0]),No(r[1])));return i[7]||(i[7]="."+oa(a.scale(r[2]))),i[8]="f",e=ho.format(i.join("")),function(n){return e(a.scale(n))+a.symbol}}i[7]||(i[7]="."+ua(i[8],r)),e=i.join("")}else e=",."+oa(r[2])+"f";return ho.format(e)}function oa(n){return-Math.floor(Math.log(n)/Math.LN10+.01)}function ua(n,t){var e=oa(t[2]);return n in Es?Math.abs(e-oa(Math.max(No(t[0]),No(t[1]))))+ +("e"!==n):e-2*("%"===n)}function sa(n,t,e,r){function i(n){return(e?Math.log(0>n?0:n):-Math.log(n>0?0:-n))/Math.log(t)}function a(n){return e?Math.pow(t,n):-Math.pow(t,-n)}function o(t){return n(i(t))}return o.invert=function(t){return a(n.invert(t))},o.domain=function(t){return arguments.length?(e=t[0]>=0,n.domain((r=t.map(Number)).map(i)),o):r},o.base=function(e){return arguments.length?(t=+e,n.domain(r.map(i)),o):t},o.nice=function(){var t=$i(r.map(i),e?Math:Cs);return n.domain(t),r=t.map(a),o},o.ticks=function(){var n=Zi(r),o=[],u=n[0],s=n[1],l=Math.floor(i(u)),c=Math.ceil(i(s)),f=t%1?2:t;if(isFinite(c-l)){if(e){for(;c>l;l++)for(var h=1;f>h;h++)o.push(a(l)*h);o.push(a(l))}else for(o.push(a(l));l++<c;)for(var h=f-1;h>0;h--)o.push(a(l)*h);for(l=0;o[l]<u;l++);for(c=o.length;o[c-1]>s;c--);o=o.slice(l,c)}return o},o.tickFormat=function(n,e){if(!arguments.length)return Ts;arguments.length<2?e=Ts:"function"!=typeof e&&(e=ho.format(e));var r=Math.max(1,t*n/o.ticks().length);return function(n){var o=n/a(Math.round(i(n)));return t-.5>o*t&&(o*=t),r>=o?e(n):""}},o.copy=function(){return sa(n.copy(),t,e,r)},ta(o,n)}function la(n,t,e){function r(t){return n(i(t))}var i=ca(t),a=ca(1/t);return r.invert=function(t){return a(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain((e=t.map(Number)).map(i)),r):e},r.ticks=function(n){return ia(e,n)},r.tickFormat=function(n,t){return aa(e,n,t)},r.nice=function(n){return r.domain(ea(e,n))},r.exponent=function(o){return arguments.length?(i=ca(t=o),a=ca(1/t),n.domain(e.map(i)),r):t},r.copy=function(){return la(n.copy(),t,e)},ta(r,n)}function ca(n){return function(t){return 0>t?-Math.pow(-t,n):Math.pow(t,n)}}function fa(n,t){function e(e){return a[((i.get(e)||("range"===t.t?i.set(e,n.push(e)):NaN))-1)%a.length]}function r(t,e){return ho.range(n.length).map(function(n){return t+e*n})}var i,a,o;return e.domain=function(r){if(!arguments.length)return n;n=[],i=new g;for(var a,o=-1,u=r.length;++o<u;)i.has(a=r[o])||i.set(a,n.push(a));return e[t.t].apply(e,t.a)},e.range=function(n){return arguments.length?(a=n,o=0,t={t:"range",a:arguments},e):a},e.rangePoints=function(i,u){arguments.length<2&&(u=0);var s=i[0],l=i[1],c=n.length<2?(s=(s+l)/2,0):(l-s)/(n.length-1+u);return a=r(s+c*u/2,c),o=0,t={t:"rangePoints",a:arguments},e},e.rangeRoundPoints=function(i,u){arguments.length<2&&(u=0);var s=i[0],l=i[1],c=n.length<2?(s=l=Math.round((s+l)/2),0):(l-s)/(n.length-1+u)|0;return a=r(s+Math.round(c*u/2+(l-s-(n.length-1+u)*c)/2),c),o=0,t={t:"rangeRoundPoints",a:arguments},e},e.rangeBands=function(i,u,s){arguments.length<2&&(u=0),arguments.length<3&&(s=u);var l=i[1]<i[0],c=i[l-0],f=i[1-l],h=(f-c)/(n.length-u+2*s);return a=r(c+h*s,h),l&&a.reverse(),o=h*(1-u),t={t:"rangeBands",a:arguments},e},e.rangeRoundBands=function(i,u,s){arguments.length<2&&(u=0),arguments.length<3&&(s=u);var l=i[1]<i[0],c=i[l-0],f=i[1-l],h=Math.floor((f-c)/(n.length-u+2*s));return a=r(c+Math.round((f-c-(n.length-u)*h)/2),h),l&&a.reverse(),o=Math.round(h*(1-u)),t={t:"rangeRoundBands",a:arguments},e},e.rangeBand=function(){return o},e.rangeExtent=function(){return Zi(t.a[0])},e.copy=function(){return fa(n,t)},e.domain(n)}function ha(n,t){function e(){var e=0,a=t.length;for(i=[];++e<a;)i[e-1]=ho.quantile(n,e/a);return r}function r(n){return isNaN(n=+n)?void 0:t[ho.bisect(i,n)]}var i;return r.domain=function(t){return arguments.length?(n=t.map(s).filter(l).sort(u),e()):n},r.range=function(n){return arguments.length?(t=n,e()):t},r.quantiles=function(){return i},r.invertExtent=function(e){return e=t.indexOf(e),0>e?[NaN,NaN]:[e>0?i[e-1]:n[0],e<i.length?i[e]:n[n.length-1]]},r.copy=function(){return ha(n,t)},e()}function pa(n,t,e){function r(t){return e[Math.max(0,Math.min(o,Math.floor(a*(t-n))))]}function i(){return a=e.length/(t-n),o=e.length-1,r}var a,o;return r.domain=function(e){return arguments.length?(n=+e[0],t=+e[e.length-1],i()):[n,t]},r.range=function(n){return arguments.length?(e=n,i()):e},r.invertExtent=function(t){return t=e.indexOf(t),t=0>t?NaN:t/a+n,[t,t+1/a]},r.copy=function(){return pa(n,t,e)},i()}function ga(n,t){function e(e){return e>=e?t[ho.bisect(n,e)]:void 0}return e.domain=function(t){return arguments.length?(n=t,e):n},e.range=function(n){return arguments.length?(t=n,e):t},e.invertExtent=function(e){return e=t.indexOf(e),[n[e-1],n[e]]},e.copy=function(){return ga(n,t)},e}function da(n){function t(n){return+n}return t.invert=t,t.domain=t.range=function(e){return arguments.length?(n=e.map(t),t):n},t.ticks=function(t){return ia(n,t)},t.tickFormat=function(t,e){return aa(n,t,e)},t.copy=function(){return da(n)},t}function va(){return 0}function ma(n){return n.innerRadius}function ya(n){return n.outerRadius}function xa(n){return n.startAngle}function ka(n){return n.endAngle}function Ma(n){return n&&n.padAngle}function ba(n,t,e,r){return(n-e)*t-(t-r)*n>0?0:1}function wa(n,t,e,r,i){var a=n[0]-t[0],o=n[1]-t[1],u=(i?r:-r)/Math.sqrt(a*a+o*o),s=u*o,l=-u*a,c=n[0]+s,f=n[1]+l,h=t[0]+s,p=t[1]+l,g=(c+h)/2,d=(f+p)/2,v=h-c,m=p-f,y=v*v+m*m,x=e-r,k=c*p-h*f,M=(0>m?-1:1)*Math.sqrt(Math.max(0,x*x*y-k*k)),b=(k*m-v*M)/y,w=(-k*v-m*M)/y,_=(k*m+v*M)/y,N=(-k*v+m*M)/y,S=b-g,A=w-d,L=_-g,E=N-d;return S*S+A*A>L*L+E*E&&(b=_,w=N),[[b-s,w-l],[b*e/x,w*e/x]]}function _a(n){function t(t){function o(){l.push("M",a(n(c),u))}for(var s,l=[],c=[],f=-1,h=t.length,p=zn(e),g=zn(r);++f<h;)i.call(this,s=t[f],f)?c.push([+p.call(this,s,f),+g.call(this,s,f)]):c.length&&(o(),c=[]);return c.length&&o(),l.length?l.join(""):null}var e=qe,r=Re,i=Rt,a=Na,o=a.key,u=.7;return t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t.defined=function(n){return arguments.length?(i=n,t):i},t.interpolate=function(n){return arguments.length?(o="function"==typeof n?a=n:(a=Us.get(n)||Na).key,t):o},t.tension=function(n){return arguments.length?(u=n,t):u},t}function Na(n){return n.length>1?n.join("L"):n+"Z"}function Sa(n){return n.join("L")+"Z"}function Aa(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("H",(r[0]+(r=n[t])[0])/2,"V",r[1]);return e>1&&i.push("H",r[0]),i.join("")}function La(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("V",(r=n[t])[1],"H",r[0]);return i.join("")}function Ea(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("H",(r=n[t])[0],"V",r[1]);return i.join("")}function Ta(n,t){return n.length<4?Na(n):n[1]+Pa(n.slice(1,-1),qa(n,t))}function Ca(n,t){return n.length<3?Sa(n):n[0]+Pa((n.push(n[0]),n),qa([n[n.length-2]].concat(n,[n[1]]),t))}function za(n,t){return n.length<3?Na(n):n[0]+Pa(n,qa(n,t))}function Pa(n,t){if(t.length<1||n.length!=t.length&&n.length!=t.length+2)return Na(n);var e=n.length!=t.length,r="",i=n[0],a=n[1],o=t[0],u=o,s=1;if(e&&(r+="Q"+(a[0]-2*o[0]/3)+","+(a[1]-2*o[1]/3)+","+a[0]+","+a[1],i=n[1],s=2),t.length>1){u=t[1],a=n[s],s++,r+="C"+(i[0]+o[0])+","+(i[1]+o[1])+","+(a[0]-u[0])+","+(a[1]-u[1])+","+a[0]+","+a[1];for(var l=2;l<t.length;l++,s++)a=n[s],u=t[l],r+="S"+(a[0]-u[0])+","+(a[1]-u[1])+","+a[0]+","+a[1]}if(e){var c=n[s];r+="Q"+(a[0]+2*u[0]/3)+","+(a[1]+2*u[1]/3)+","+c[0]+","+c[1]}return r}function qa(n,t){for(var e,r=[],i=(1-t)/2,a=n[0],o=n[1],u=1,s=n.length;++u<s;)e=a,a=o,o=n[u],r.push([i*(o[0]-e[0]),i*(o[1]-e[1])]);return r}function Ra(n){if(n.length<3)return Na(n);var t=1,e=n.length,r=n[0],i=r[0],a=r[1],o=[i,i,i,(r=n[1])[0]],u=[a,a,a,r[1]],s=[i,",",a,"L",ja(Fs,o),",",ja(Fs,u)];for(n.push(n[e-1]);++t<=e;)r=n[t],o.shift(),o.push(r[0]),u.shift(),u.push(r[1]),Fa(s,o,u);return n.pop(),s.push("L",r),s.join("")}function Oa(n){if(n.length<4)return Na(n);for(var t,e=[],r=-1,i=n.length,a=[0],o=[0];++r<3;)t=n[r],a.push(t[0]),o.push(t[1]);for(e.push(ja(Fs,a)+","+ja(Fs,o)),--r;++r<i;)t=n[r],a.shift(),a.push(t[0]),o.shift(),o.push(t[1]),Fa(e,a,o);return e.join("")}function Ua(n){for(var t,e,r=-1,i=n.length,a=i+4,o=[],u=[];++r<4;)e=n[r%i],o.push(e[0]),u.push(e[1]);for(t=[ja(Fs,o),",",ja(Fs,u)],--r;++r<a;)e=n[r%i],o.shift(),o.push(e[0]),u.shift(),u.push(e[1]),Fa(t,o,u);return t.join("")}function Da(n,t){var e=n.length-1;if(e)for(var r,i,a=n[0][0],o=n[0][1],u=n[e][0]-a,s=n[e][1]-o,l=-1;++l<=e;)r=n[l],i=l/e,r[0]=t*r[0]+(1-t)*(a+i*u),r[1]=t*r[1]+(1-t)*(o+i*s);return Ra(n)}function ja(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]+n[3]*t[3]}function Fa(n,t,e){n.push("C",ja(Ds,t),",",ja(Ds,e),",",ja(js,t),",",ja(js,e),",",ja(Fs,t),",",ja(Fs,e))}function Ia(n,t){return(t[1]-n[1])/(t[0]-n[0])}function Ba(n){for(var t=0,e=n.length-1,r=[],i=n[0],a=n[1],o=r[0]=Ia(i,a);++t<e;)r[t]=(o+(o=Ia(i=a,a=n[t+1])))/2;return r[t]=o,r}function Ha(n){for(var t,e,r,i,a=[],o=Ba(n),u=-1,s=n.length-1;++u<s;)t=Ia(n[u],n[u+1]),No(t)<Io?o[u]=o[u+1]=0:(e=o[u]/t,r=o[u+1]/t,i=e*e+r*r,i>9&&(i=3*t/Math.sqrt(i),o[u]=i*e,o[u+1]=i*r));for(u=-1;++u<=s;)i=(n[Math.min(s,u+1)][0]-n[Math.max(0,u-1)][0])/(6*(1+o[u]*o[u])),a.push([i||0,o[u]*i||0]);return a}function Va(n){return n.length<3?Na(n):n[0]+Pa(n,Ha(n))}function Ya(n){for(var t,e,r,i=-1,a=n.length;++i<a;)t=n[i],e=t[0],r=t[1]-Jo,t[0]=e*Math.cos(r),t[1]=e*Math.sin(r);return n}function Ja(n){function t(t){function s(){d.push("M",u(n(m),f),c,l(n(v.reverse()),f),"Z")}for(var h,p,g,d=[],v=[],m=[],y=-1,x=t.length,k=zn(e),M=zn(i),b=e===r?function(){return p}:zn(r),w=i===a?function(){return g}:zn(a);++y<x;)o.call(this,h=t[y],y)?(v.push([p=+k.call(this,h,y),g=+M.call(this,h,y)]),m.push([+b.call(this,h,y),+w.call(this,h,y)])):v.length&&(s(),v=[],m=[]);return v.length&&s(),d.length?d.join(""):null}var e=qe,r=qe,i=0,a=Re,o=Rt,u=Na,s=u.key,l=u,c="L",f=.7;return t.x=function(n){return arguments.length?(e=r=n,t):r},t.x0=function(n){return arguments.length?(e=n,t):e},t.x1=function(n){return arguments.length?(r=n,t):r},t.y=function(n){return arguments.length?(i=a=n,t):a},t.y0=function(n){return arguments.length?(i=n,t):i},t.y1=function(n){return arguments.length?(a=n,t):a},t.defined=function(n){return arguments.length?(o=n,t):o},t.interpolate=function(n){return arguments.length?(s="function"==typeof n?u=n:(u=Us.get(n)||Na).key,l=u.reverse||u,c=u.closed?"M":"L",t):s},t.tension=function(n){return arguments.length?(f=n,t):f},t}function Ga(n){return n.radius}function Za(n){return[n.x,n.y]}function Xa(n){return function(){var t=n.apply(this,arguments),e=t[0],r=t[1]-Jo;return[e*Math.cos(r),e*Math.sin(r)]}}function Wa(){return 64}function $a(){return"circle"}function Ka(n){var t=Math.sqrt(n/Ho);return"M0,"+t+"A"+t+","+t+" 0 1,1 0,"+-t+"A"+t+","+t+" 0 1,1 0,"+t+"Z"}function Qa(n){return function(){var t,e,r;(t=this[n])&&(r=t[e=t.active])&&(r.timer.c=null,r.timer.t=NaN,--t.count?delete t[e]:delete this[n],t.active+=.5,r.event&&r.event.interrupt.call(this,this.__data__,r.index))}}function no(n,t,e){return To(n,Gs),n.namespace=t,n.id=e,n}function to(n,t,e,r){var i=n.id,a=n.namespace;return Z(n,"function"==typeof e?function(n,o,u){n[a][i].tween.set(t,r(e.call(n,n.__data__,o,u)))}:(e=r(e),function(n){n[a][i].tween.set(t,e)}))}function eo(n){return null==n&&(n=""),function(){this.textContent=n}}function ro(n){return null==n?"__transition__":"__transition_"+n+"__"}function io(n,t,e,r,i){function a(n){var t=d.delay;return l.t=t+s,n>=t?o(n-t):void(l.c=o)}function o(e){var i=p.active,a=p[i];a&&(a.timer.c=null,a.timer.t=NaN,--p.count,delete p[i],a.event&&a.event.interrupt.call(n,n.__data__,a.index));for(var o in p)if(r>+o){var g=p[o];g.timer.c=null,g.timer.t=NaN,--p.count,delete p[o]}l.c=u,Un(function(){return l.c&&u(e||1)&&(l.c=null,l.t=NaN),1},0,s),p.active=r,d.event&&d.event.start.call(n,n.__data__,t),h=[],d.tween.forEach(function(e,r){(r=r.call(n,n.__data__,t))&&h.push(r)}),f=d.ease,c=d.duration}function u(i){for(var a=i/c,o=f(a),u=h.length;u>0;)h[--u].call(n,o);return a>=1?(d.event&&d.event.end.call(n,n.__data__,t),--p.count?delete p[r]:delete n[e],1):void 0}var s,l,c,f,h,p=n[e]||(n[e]={active:0,count:0}),d=p[r];d||(s=i.time,l=Un(a,0,s),d=p[r]={tween:new g,time:s,timer:l,delay:i.delay,duration:i.duration,ease:i.ease,index:t},i=null,++p.count)}function ao(n,t,e){n.attr("transform",function(n){var r=t(n);return"translate("+(isFinite(r)?r:e(n))+",0)"})}function oo(n,t,e){n.attr("transform",function(n){var r=t(n);return"translate(0,"+(isFinite(r)?r:e(n))+")"})}function uo(n){return n.toISOString()}function so(n,t,e){function r(t){return n(t)}function i(n,e){var r=n[1]-n[0],i=r/e,a=ho.bisect(el,i);return a==el.length?[t.year,ra(n.map(function(n){return n/31536e6}),e)[2]]:a?t[i/el[a-1]<el[a]/i?a-1:a]:[al,ra(n,e)[2]]}return r.invert=function(t){return lo(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain(t),r):n.domain().map(lo)},r.nice=function(n,t){function e(e){return!isNaN(e)&&!n.range(e,lo(+e+1),t).length}var a=r.domain(),o=Zi(a),u=null==n?i(o,10):"number"==typeof n&&i(o,n);return u&&(n=u[0],t=u[1]),r.domain($i(a,t>1?{floor:function(t){for(;e(t=n.floor(t));)t=lo(t-1);return t},ceil:function(t){for(;e(t=n.ceil(t));)t=lo(+t+1);return t}}:n))},r.ticks=function(n,t){var e=Zi(r.domain()),a=null==n?i(e,10):"number"==typeof n?i(e,n):!n.range&&[{range:n},t];return a&&(n=a[0],t=a[1]),n.range(e[0],lo(+e[1]+1),1>t?1:t)},r.tickFormat=function(){return e},r.copy=function(){return so(n.copy(),t,e)},ta(r,n)}function lo(n){return new Date(n)}function co(n){return JSON.parse(n.responseText)}function fo(n){var t=vo.createRange();return t.selectNode(vo.body),t.createContextualFragment(n.responseText)}var ho={version:"3.5.13"},po=[].slice,go=function(n){return po.call(n)},vo=this.document;if(vo)try{go(vo.documentElement.childNodes)[0].nodeType}catch(mo){go=function(n){for(var t=n.length,e=new Array(t);t--;)e[t]=n[t];return e}}if(Date.now||(Date.now=function(){return+new Date}),vo)try{vo.createElement("DIV").style.setProperty("opacity",0,"")}catch(yo){var xo=this.Element.prototype,ko=xo.setAttribute,Mo=xo.setAttributeNS,bo=this.CSSStyleDeclaration.prototype,wo=bo.setProperty;xo.setAttribute=function(n,t){ko.call(this,n,t+"")},xo.setAttributeNS=function(n,t,e){Mo.call(this,n,t,e+"")},bo.setProperty=function(n,t,e){wo.call(this,n,t+"",e)}}ho.ascending=u,ho.descending=function(n,t){return n>t?-1:t>n?1:t>=n?0:NaN},ho.min=function(n,t){var e,r,i=-1,a=n.length;if(1===arguments.length){for(;++i<a;)if(null!=(r=n[i])&&r>=r){e=r;break}for(;++i<a;)null!=(r=n[i])&&e>r&&(e=r)}else{for(;++i<a;)if(null!=(r=t.call(n,n[i],i))&&r>=r){e=r;break}for(;++i<a;)null!=(r=t.call(n,n[i],i))&&e>r&&(e=r)}return e},ho.max=function(n,t){var e,r,i=-1,a=n.length;if(1===arguments.length){for(;++i<a;)if(null!=(r=n[i])&&r>=r){e=r;break}for(;++i<a;)null!=(r=n[i])&&r>e&&(e=r)}else{for(;++i<a;)if(null!=(r=t.call(n,n[i],i))&&r>=r){e=r;break}for(;++i<a;)null!=(r=t.call(n,n[i],i))&&r>e&&(e=r)}return e},ho.extent=function(n,t){var e,r,i,a=-1,o=n.length;if(1===arguments.length){for(;++a<o;)if(null!=(r=n[a])&&r>=r){e=i=r;break}for(;++a<o;)null!=(r=n[a])&&(e>r&&(e=r),r>i&&(i=r))}else{for(;++a<o;)if(null!=(r=t.call(n,n[a],a))&&r>=r){e=i=r;break}for(;++a<o;)null!=(r=t.call(n,n[a],a))&&(e>r&&(e=r),r>i&&(i=r))}return[e,i]},ho.sum=function(n,t){var e,r=0,i=n.length,a=-1;if(1===arguments.length)for(;++a<i;)l(e=+n[a])&&(r+=e);else for(;++a<i;)l(e=+t.call(n,n[a],a))&&(r+=e);return r},ho.mean=function(n,t){var e,r=0,i=n.length,a=-1,o=i;if(1===arguments.length)for(;++a<i;)l(e=s(n[a]))?r+=e:--o;else for(;++a<i;)l(e=s(t.call(n,n[a],a)))?r+=e:--o;return o?r/o:void 0},ho.quantile=function(n,t){var e=(n.length-1)*t+1,r=Math.floor(e),i=+n[r-1],a=e-r;return a?i+a*(n[r]-i):i},ho.median=function(n,t){var e,r=[],i=n.length,a=-1;if(1===arguments.length)for(;++a<i;)l(e=s(n[a]))&&r.push(e);else for(;++a<i;)l(e=s(t.call(n,n[a],a)))&&r.push(e);return r.length?ho.quantile(r.sort(u),.5):void 0},ho.variance=function(n,t){var e,r,i=n.length,a=0,o=0,u=-1,c=0;if(1===arguments.length)for(;++u<i;)l(e=s(n[u]))&&(r=e-a,a+=r/++c,o+=r*(e-a));else for(;++u<i;)l(e=s(t.call(n,n[u],u)))&&(r=e-a,a+=r/++c,o+=r*(e-a));return c>1?o/(c-1):void 0},ho.deviation=function(){var n=ho.variance.apply(this,arguments);return n?Math.sqrt(n):n};var _o=c(u);ho.bisectLeft=_o.left,ho.bisect=ho.bisectRight=_o.right,ho.bisector=function(n){return c(1===n.length?function(t,e){return u(n(t),e)}:n)},ho.shuffle=function(n,t,e){(a=arguments.length)<3&&(e=n.length,2>a&&(t=0));for(var r,i,a=e-t;a;)i=Math.random()*a--|0,r=n[a+t],n[a+t]=n[i+t],n[i+t]=r;return n},ho.permute=function(n,t){for(var e=t.length,r=new Array(e);e--;)r[e]=n[t[e]];return r},ho.pairs=function(n){for(var t,e=0,r=n.length-1,i=n[0],a=new Array(0>r?0:r);r>e;)a[e]=[t=i,i=n[++e]];
	return a},ho.zip=function(){if(!(r=arguments.length))return[];for(var n=-1,t=ho.min(arguments,f),e=new Array(t);++n<t;)for(var r,i=-1,a=e[n]=new Array(r);++i<r;)a[i]=arguments[i][n];return e},ho.transpose=function(n){return ho.zip.apply(ho,n)},ho.keys=function(n){var t=[];for(var e in n)t.push(e);return t},ho.values=function(n){var t=[];for(var e in n)t.push(n[e]);return t},ho.entries=function(n){var t=[];for(var e in n)t.push({key:e,value:n[e]});return t},ho.merge=function(n){for(var t,e,r,i=n.length,a=-1,o=0;++a<i;)o+=n[a].length;for(e=new Array(o);--i>=0;)for(r=n[i],t=r.length;--t>=0;)e[--o]=r[t];return e};var No=Math.abs;ho.range=function(n,t,e){if(arguments.length<3&&(e=1,arguments.length<2&&(t=n,n=0)),(t-n)/e===1/0)throw new Error("infinite range");var r,i=[],a=h(No(e)),o=-1;if(n*=a,t*=a,e*=a,0>e)for(;(r=n+e*++o)>t;)i.push(r/a);else for(;(r=n+e*++o)<t;)i.push(r/a);return i},ho.map=function(n,t){var e=new g;if(n instanceof g)n.forEach(function(n,t){e.set(n,t)});else if(Array.isArray(n)){var r,i=-1,a=n.length;if(1===arguments.length)for(;++i<a;)e.set(i,n[i]);else for(;++i<a;)e.set(t.call(n,r=n[i],i),r)}else for(var o in n)e.set(o,n[o]);return e};var So="__proto__",Ao="\x00";p(g,{has:m,get:function(n){return this._[d(n)]},set:function(n,t){return this._[d(n)]=t},remove:y,keys:x,values:function(){var n=[];for(var t in this._)n.push(this._[t]);return n},entries:function(){var n=[];for(var t in this._)n.push({key:v(t),value:this._[t]});return n},size:k,empty:M,forEach:function(n){for(var t in this._)n.call(this,v(t),this._[t])}}),ho.nest=function(){function n(t,o,u){if(u>=a.length)return r?r.call(i,o):e?o.sort(e):o;for(var s,l,c,f,h=-1,p=o.length,d=a[u++],v=new g;++h<p;)(f=v.get(s=d(l=o[h])))?f.push(l):v.set(s,[l]);return t?(l=t(),c=function(e,r){l.set(e,n(t,r,u))}):(l={},c=function(e,r){l[e]=n(t,r,u)}),v.forEach(c),l}function t(n,e){if(e>=a.length)return n;var r=[],i=o[e++];return n.forEach(function(n,i){r.push({key:n,values:t(i,e)})}),i?r.sort(function(n,t){return i(n.key,t.key)}):r}var e,r,i={},a=[],o=[];return i.map=function(t,e){return n(e,t,0)},i.entries=function(e){return t(n(ho.map,e,0),0)},i.key=function(n){return a.push(n),i},i.sortKeys=function(n){return o[a.length-1]=n,i},i.sortValues=function(n){return e=n,i},i.rollup=function(n){return r=n,i},i},ho.set=function(n){var t=new b;if(n)for(var e=0,r=n.length;r>e;++e)t.add(n[e]);return t},p(b,{has:m,add:function(n){return this._[d(n+="")]=!0,n},remove:y,values:x,size:k,empty:M,forEach:function(n){for(var t in this._)n.call(this,v(t))}}),ho.behavior={},ho.rebind=function(n,t){for(var e,r=1,i=arguments.length;++r<i;)n[e=arguments[r]]=_(n,t,t[e]);return n};var Lo=["webkit","ms","moz","Moz","o","O"];ho.dispatch=function(){for(var n=new A,t=-1,e=arguments.length;++t<e;)n[arguments[t]]=L(n);return n},A.prototype.on=function(n,t){var e=n.indexOf("."),r="";if(e>=0&&(r=n.slice(e+1),n=n.slice(0,e)),n)return arguments.length<2?this[n].on(r):this[n].on(r,t);if(2===arguments.length){if(null==t)for(n in this)this.hasOwnProperty(n)&&this[n].on(r,null);return this}},ho.event=null,ho.requote=function(n){return n.replace(Eo,"\\$&")};var Eo=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g,To={}.__proto__?function(n,t){n.__proto__=t}:function(n,t){for(var e in t)n[e]=t[e]},Co=function(n,t){return t.querySelector(n)},zo=function(n,t){return t.querySelectorAll(n)},Po=function(n,t){var e=n.matches||n[N(n,"matchesSelector")];return(Po=function(n,t){return e.call(n,t)})(n,t)};"function"==typeof Sizzle&&(Co=function(n,t){return Sizzle(n,t)[0]||null},zo=Sizzle,Po=Sizzle.matchesSelector),ho.selection=function(){return ho.select(vo.documentElement)};var qo=ho.selection.prototype=[];qo.select=function(n){var t,e,r,i,a=[];n=P(n);for(var o=-1,u=this.length;++o<u;){a.push(t=[]),t.parentNode=(r=this[o]).parentNode;for(var s=-1,l=r.length;++s<l;)(i=r[s])?(t.push(e=n.call(i,i.__data__,s,o)),e&&"__data__"in i&&(e.__data__=i.__data__)):t.push(null)}return z(a)},qo.selectAll=function(n){var t,e,r=[];n=q(n);for(var i=-1,a=this.length;++i<a;)for(var o=this[i],u=-1,s=o.length;++u<s;)(e=o[u])&&(r.push(t=go(n.call(e,e.__data__,u,i))),t.parentNode=e);return z(r)};var Ro={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};ho.ns={prefix:Ro,qualify:function(n){var t=n.indexOf(":"),e=n;return t>=0&&"xmlns"!==(e=n.slice(0,t))&&(n=n.slice(t+1)),Ro.hasOwnProperty(e)?{space:Ro[e],local:n}:n}},qo.attr=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node();return n=ho.ns.qualify(n),n.local?e.getAttributeNS(n.space,n.local):e.getAttribute(n)}for(t in n)this.each(R(t,n[t]));return this}return this.each(R(n,t))},qo.classed=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node(),r=(n=D(n)).length,i=-1;if(t=e.classList){for(;++i<r;)if(!t.contains(n[i]))return!1}else for(t=e.getAttribute("class");++i<r;)if(!U(n[i]).test(t))return!1;return!0}for(t in n)this.each(j(t,n[t]));return this}return this.each(j(n,t))},qo.style=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t="");for(e in n)this.each(I(e,n[e],t));return this}if(2>r){var i=this.node();return o(i).getComputedStyle(i,null).getPropertyValue(n)}e=""}return this.each(I(n,t,e))},qo.property=function(n,t){if(arguments.length<2){if("string"==typeof n)return this.node()[n];for(t in n)this.each(B(t,n[t]));return this}return this.each(B(n,t))},qo.text=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.textContent=null==t?"":t}:null==n?function(){this.textContent=""}:function(){this.textContent=n}):this.node().textContent},qo.html=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.innerHTML=null==t?"":t}:null==n?function(){this.innerHTML=""}:function(){this.innerHTML=n}):this.node().innerHTML},qo.append=function(n){return n=H(n),this.select(function(){return this.appendChild(n.apply(this,arguments))})},qo.insert=function(n,t){return n=H(n),t=P(t),this.select(function(){return this.insertBefore(n.apply(this,arguments),t.apply(this,arguments)||null)})},qo.remove=function(){return this.each(V)},qo.data=function(n,t){function e(n,e){var r,i,a,o=n.length,c=e.length,f=Math.min(o,c),h=new Array(c),p=new Array(c),d=new Array(o);if(t){var v,m=new g,y=new Array(o);for(r=-1;++r<o;)(i=n[r])&&(m.has(v=t.call(i,i.__data__,r))?d[r]=i:m.set(v,i),y[r]=v);for(r=-1;++r<c;)(i=m.get(v=t.call(e,a=e[r],r)))?i!==!0&&(h[r]=i,i.__data__=a):p[r]=Y(a),m.set(v,!0);for(r=-1;++r<o;)r in y&&m.get(y[r])!==!0&&(d[r]=n[r])}else{for(r=-1;++r<f;)i=n[r],a=e[r],i?(i.__data__=a,h[r]=i):p[r]=Y(a);for(;c>r;++r)p[r]=Y(e[r]);for(;o>r;++r)d[r]=n[r]}p.update=h,p.parentNode=h.parentNode=d.parentNode=n.parentNode,u.push(p),s.push(h),l.push(d)}var r,i,a=-1,o=this.length;if(!arguments.length){for(n=new Array(o=(r=this[0]).length);++a<o;)(i=r[a])&&(n[a]=i.__data__);return n}var u=X([]),s=z([]),l=z([]);if("function"==typeof n)for(;++a<o;)e(r=this[a],n.call(r,r.parentNode.__data__,a));else for(;++a<o;)e(r=this[a],n);return s.enter=function(){return u},s.exit=function(){return l},s},qo.datum=function(n){return arguments.length?this.property("__data__",n):this.property("__data__")},qo.filter=function(n){var t,e,r,i=[];"function"!=typeof n&&(n=J(n));for(var a=0,o=this.length;o>a;a++){i.push(t=[]),t.parentNode=(e=this[a]).parentNode;for(var u=0,s=e.length;s>u;u++)(r=e[u])&&n.call(r,r.__data__,u,a)&&t.push(r)}return z(i)},qo.order=function(){for(var n=-1,t=this.length;++n<t;)for(var e,r=this[n],i=r.length-1,a=r[i];--i>=0;)(e=r[i])&&(a&&a!==e.nextSibling&&a.parentNode.insertBefore(e,a),a=e);return this},qo.sort=function(n){n=G.apply(this,arguments);for(var t=-1,e=this.length;++t<e;)this[t].sort(n);return this.order()},qo.each=function(n){return Z(this,function(t,e,r){n.call(t,t.__data__,e,r)})},qo.call=function(n){var t=go(arguments);return n.apply(t[0]=this,t),this},qo.empty=function(){return!this.node()},qo.node=function(){for(var n=0,t=this.length;t>n;n++)for(var e=this[n],r=0,i=e.length;i>r;r++){var a=e[r];if(a)return a}return null},qo.size=function(){var n=0;return Z(this,function(){++n}),n};var Oo=[];ho.selection.enter=X,ho.selection.enter.prototype=Oo,Oo.append=qo.append,Oo.empty=qo.empty,Oo.node=qo.node,Oo.call=qo.call,Oo.size=qo.size,Oo.select=function(n){for(var t,e,r,i,a,o=[],u=-1,s=this.length;++u<s;){r=(i=this[u]).update,o.push(t=[]),t.parentNode=i.parentNode;for(var l=-1,c=i.length;++l<c;)(a=i[l])?(t.push(r[l]=e=n.call(i.parentNode,a.__data__,l,u)),e.__data__=a.__data__):t.push(null)}return z(o)},Oo.insert=function(n,t){return arguments.length<2&&(t=W(this)),qo.insert.call(this,n,t)},ho.select=function(n){var t;return"string"==typeof n?(t=[Co(n,vo)],t.parentNode=vo.documentElement):(t=[n],t.parentNode=a(n)),z([t])},ho.selectAll=function(n){var t;return"string"==typeof n?(t=go(zo(n,vo)),t.parentNode=vo.documentElement):(t=go(n),t.parentNode=null),z([t])},qo.on=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t=!1);for(e in n)this.each($(e,n[e],t));return this}if(2>r)return(r=this.node()["__on"+n])&&r._;e=!1}return this.each($(n,t,e))};var Uo=ho.map({mouseenter:"mouseover",mouseleave:"mouseout"});vo&&Uo.forEach(function(n){"on"+n in vo&&Uo.remove(n)});var Do,jo=0;ho.mouse=function(n){return tn(n,T())};var Fo=this.navigator&&/WebKit/.test(this.navigator.userAgent)?-1:0;ho.touch=function(n,t,e){if(arguments.length<3&&(e=t,t=T().changedTouches),t)for(var r,i=0,a=t.length;a>i;++i)if((r=t[i]).identifier===e)return tn(n,r)},ho.behavior.drag=function(){function n(){this.on("mousedown.drag",i).on("touchstart.drag",a)}function t(n,t,i,a,o){return function(){function u(){var n,e,r=t(h,d);r&&(n=r[0]-x[0],e=r[1]-x[1],g|=n|e,x=r,p({type:"drag",x:r[0]+l[0],y:r[1]+l[1],dx:n,dy:e}))}function s(){t(h,d)&&(m.on(a+v,null).on(o+v,null),y(g),p({type:"dragend"}))}var l,c=this,f=ho.event.target,h=c.parentNode,p=e.of(c,arguments),g=0,d=n(),v=".drag"+(null==d?"":"-"+d),m=ho.select(i(f)).on(a+v,u).on(o+v,s),y=nn(f),x=t(h,d);r?(l=r.apply(c,arguments),l=[l.x-x[0],l.y-x[1]]):l=[0,0],p({type:"dragstart"})}}var e=C(n,"drag","dragstart","dragend"),r=null,i=t(S,ho.mouse,o,"mousemove","mouseup"),a=t(en,ho.touch,w,"touchmove","touchend");return n.origin=function(t){return arguments.length?(r=t,n):r},ho.rebind(n,e,"on")},ho.touches=function(n,t){return arguments.length<2&&(t=T().touches),t?go(t).map(function(t){var e=tn(n,t);return e.identifier=t.identifier,e}):[]};var Io=1e-6,Bo=Io*Io,Ho=Math.PI,Vo=2*Ho,Yo=Vo-Io,Jo=Ho/2,Go=Ho/180,Zo=180/Ho,Xo=Math.SQRT2,Wo=2,$o=4;ho.interpolateZoom=function(n,t){var e,r,i=n[0],a=n[1],o=n[2],u=t[0],s=t[1],l=t[2],c=u-i,f=s-a,h=c*c+f*f;if(Bo>h)r=Math.log(l/o)/Xo,e=function(n){return[i+n*c,a+n*f,o*Math.exp(Xo*n*r)]};else{var p=Math.sqrt(h),g=(l*l-o*o+$o*h)/(2*o*Wo*p),d=(l*l-o*o-$o*h)/(2*l*Wo*p),v=Math.log(Math.sqrt(g*g+1)-g),m=Math.log(Math.sqrt(d*d+1)-d);r=(m-v)/Xo,e=function(n){var t=n*r,e=ln(v),u=o/(Wo*p)*(e*cn(Xo*t+v)-sn(v));return[i+u*c,a+u*f,o*e/ln(Xo*t+v)]}}return e.duration=1e3*r,e},ho.behavior.zoom=function(){function n(n){n.on(T,f).on(Qo+".zoom",p).on("dblclick.zoom",g).on(q,h)}function t(n){return[(n[0]-_.x)/_.k,(n[1]-_.y)/_.k]}function e(n){return[n[0]*_.k+_.x,n[1]*_.k+_.y]}function r(n){_.k=Math.max(S[0],Math.min(S[1],n))}function i(n,t){t=e(t),_.x+=n[0]-t[0],_.y+=n[1]-t[1]}function a(t,e,a,o){t.__chart__={x:_.x,y:_.y,k:_.k},r(Math.pow(2,o)),i(v=e,a),t=ho.select(t),A>0&&(t=t.transition().duration(A)),t.call(n.event)}function u(){M&&M.domain(k.range().map(function(n){return(n-_.x)/_.k}).map(k.invert)),w&&w.domain(b.range().map(function(n){return(n-_.y)/_.k}).map(b.invert))}function s(n){L++||n({type:"zoomstart"})}function l(n){u(),n({type:"zoom",scale:_.k,translate:[_.x,_.y]})}function c(n){--L||(n({type:"zoomend"}),v=null)}function f(){function n(){u=1,i(ho.mouse(r),h),l(a)}function e(){f.on(z,null).on(P,null),p(u),c(a)}var r=this,a=R.of(r,arguments),u=0,f=ho.select(o(r)).on(z,n).on(P,e),h=t(ho.mouse(r)),p=nn(r);Js.call(r),s(a)}function h(){function n(){var n=ho.touches(g);return p=_.k,n.forEach(function(n){n.identifier in v&&(v[n.identifier]=t(n))}),n}function e(){var t=ho.event.target;ho.select(t).on(k,o).on(M,u),b.push(t);for(var e=ho.event.changedTouches,r=0,i=e.length;i>r;++r)v[e[r].identifier]=null;var s=n(),l=Date.now();if(1===s.length){if(500>l-x){var c=s[0];a(g,c,v[c.identifier],Math.floor(Math.log(_.k)/Math.LN2)+1),E()}x=l}else if(s.length>1){var c=s[0],f=s[1],h=c[0]-f[0],p=c[1]-f[1];m=h*h+p*p}}function o(){var n,t,e,a,o=ho.touches(g);Js.call(g);for(var u=0,s=o.length;s>u;++u,a=null)if(e=o[u],a=v[e.identifier]){if(t)break;n=e,t=a}if(a){var c=(c=e[0]-n[0])*c+(c=e[1]-n[1])*c,f=m&&Math.sqrt(c/m);n=[(n[0]+e[0])/2,(n[1]+e[1])/2],t=[(t[0]+a[0])/2,(t[1]+a[1])/2],r(f*p)}x=null,i(n,t),l(d)}function u(){if(ho.event.touches.length){for(var t=ho.event.changedTouches,e=0,r=t.length;r>e;++e)delete v[t[e].identifier];for(var i in v)return void n()}ho.selectAll(b).on(y,null),w.on(T,f).on(q,h),N(),c(d)}var p,g=this,d=R.of(g,arguments),v={},m=0,y=".zoom-"+ho.event.changedTouches[0].identifier,k="touchmove"+y,M="touchend"+y,b=[],w=ho.select(g),N=nn(g);e(),s(d),w.on(T,null).on(q,e)}function p(){var n=R.of(this,arguments);y?clearTimeout(y):(Js.call(this),d=t(v=m||ho.mouse(this)),s(n)),y=setTimeout(function(){y=null,c(n)},50),E(),r(Math.pow(2,.002*Ko())*_.k),i(v,d),l(n)}function g(){var n=ho.mouse(this),e=Math.log(_.k)/Math.LN2;a(this,n,t(n),ho.event.shiftKey?Math.ceil(e)-1:Math.floor(e)+1)}var d,v,m,y,x,k,M,b,w,_={x:0,y:0,k:1},N=[960,500],S=nu,A=250,L=0,T="mousedown.zoom",z="mousemove.zoom",P="mouseup.zoom",q="touchstart.zoom",R=C(n,"zoomstart","zoom","zoomend");return Qo||(Qo="onwheel"in vo?(Ko=function(){return-ho.event.deltaY*(ho.event.deltaMode?120:1)},"wheel"):"onmousewheel"in vo?(Ko=function(){return ho.event.wheelDelta},"mousewheel"):(Ko=function(){return-ho.event.detail},"MozMousePixelScroll")),n.event=function(n){n.each(function(){var n=R.of(this,arguments),t=_;Vs?ho.select(this).transition().each("start.zoom",function(){_=this.__chart__||{x:0,y:0,k:1},s(n)}).tween("zoom:zoom",function(){var e=N[0],r=N[1],i=v?v[0]:e/2,a=v?v[1]:r/2,o=ho.interpolateZoom([(i-_.x)/_.k,(a-_.y)/_.k,e/_.k],[(i-t.x)/t.k,(a-t.y)/t.k,e/t.k]);return function(t){var r=o(t),u=e/r[2];this.__chart__=_={x:i-r[0]*u,y:a-r[1]*u,k:u},l(n)}}).each("interrupt.zoom",function(){c(n)}).each("end.zoom",function(){c(n)}):(this.__chart__=_,s(n),l(n),c(n))})},n.translate=function(t){return arguments.length?(_={x:+t[0],y:+t[1],k:_.k},u(),n):[_.x,_.y]},n.scale=function(t){return arguments.length?(_={x:_.x,y:_.y,k:null},r(+t),u(),n):_.k},n.scaleExtent=function(t){return arguments.length?(S=null==t?nu:[+t[0],+t[1]],n):S},n.center=function(t){return arguments.length?(m=t&&[+t[0],+t[1]],n):m},n.size=function(t){return arguments.length?(N=t&&[+t[0],+t[1]],n):N},n.duration=function(t){return arguments.length?(A=+t,n):A},n.x=function(t){return arguments.length?(M=t,k=t.copy(),_={x:0,y:0,k:1},n):M},n.y=function(t){return arguments.length?(w=t,b=t.copy(),_={x:0,y:0,k:1},n):w},ho.rebind(n,R,"on")};var Ko,Qo,nu=[0,1/0];ho.color=hn,hn.prototype.toString=function(){return this.rgb()+""},ho.hsl=pn;var tu=pn.prototype=new hn;tu.brighter=function(n){return n=Math.pow(.7,arguments.length?n:1),new pn(this.h,this.s,this.l/n)},tu.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),new pn(this.h,this.s,n*this.l)},tu.rgb=function(){return gn(this.h,this.s,this.l)},ho.hcl=dn;var eu=dn.prototype=new hn;eu.brighter=function(n){return new dn(this.h,this.c,Math.min(100,this.l+ru*(arguments.length?n:1)))},eu.darker=function(n){return new dn(this.h,this.c,Math.max(0,this.l-ru*(arguments.length?n:1)))},eu.rgb=function(){return vn(this.h,this.c,this.l).rgb()},ho.lab=mn;var ru=18,iu=.95047,au=1,ou=1.08883,uu=mn.prototype=new hn;uu.brighter=function(n){return new mn(Math.min(100,this.l+ru*(arguments.length?n:1)),this.a,this.b)},uu.darker=function(n){return new mn(Math.max(0,this.l-ru*(arguments.length?n:1)),this.a,this.b)},uu.rgb=function(){return yn(this.l,this.a,this.b)},ho.rgb=wn;var su=wn.prototype=new hn;su.brighter=function(n){n=Math.pow(.7,arguments.length?n:1);var t=this.r,e=this.g,r=this.b,i=30;return t||e||r?(t&&i>t&&(t=i),e&&i>e&&(e=i),r&&i>r&&(r=i),new wn(Math.min(255,t/n),Math.min(255,e/n),Math.min(255,r/n))):new wn(i,i,i)},su.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),new wn(n*this.r,n*this.g,n*this.b)},su.hsl=function(){return Ln(this.r,this.g,this.b)},su.toString=function(){return"#"+Sn(this.r)+Sn(this.g)+Sn(this.b)};var lu=ho.map({aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074});lu.forEach(function(n,t){lu.set(n,_n(t))}),ho.functor=zn,ho.xhr=Pn(w),ho.dsv=function(n,t){function e(n,e,a){arguments.length<3&&(a=e,e=null);var o=qn(n,t,null==e?r:i(e),a);return o.row=function(n){return arguments.length?o.response(null==(e=n)?r:i(n)):e},o}function r(n){return e.parse(n.responseText)}function i(n){return function(t){return e.parse(t.responseText,n)}}function a(t){return t.map(o).join(n)}function o(n){return u.test(n)?'"'+n.replace(/\"/g,'""')+'"':n}var u=new RegExp('["'+n+"\n]"),s=n.charCodeAt(0);return e.parse=function(n,t){var r;return e.parseRows(n,function(n,e){if(r)return r(n,e-1);var i=new Function("d","return {"+n.map(function(n,t){return JSON.stringify(n)+": d["+t+"]"}).join(",")+"}");r=t?function(n,e){return t(i(n),e)}:i})},e.parseRows=function(n,t){function e(){if(c>=l)return o;if(i)return i=!1,a;var t=c;if(34===n.charCodeAt(t)){for(var e=t;e++<l;)if(34===n.charCodeAt(e)){if(34!==n.charCodeAt(e+1))break;++e}c=e+2;var r=n.charCodeAt(e+1);return 13===r?(i=!0,10===n.charCodeAt(e+2)&&++c):10===r&&(i=!0),n.slice(t+1,e).replace(/""/g,'"')}for(;l>c;){var r=n.charCodeAt(c++),u=1;if(10===r)i=!0;else if(13===r)i=!0,10===n.charCodeAt(c)&&(++c,++u);else if(r!==s)continue;return n.slice(t,c-u)}return n.slice(t)}for(var r,i,a={},o={},u=[],l=n.length,c=0,f=0;(r=e())!==o;){for(var h=[];r!==a&&r!==o;)h.push(r),r=e();t&&null==(h=t(h,f++))||u.push(h)}return u},e.format=function(t){if(Array.isArray(t[0]))return e.formatRows(t);var r=new b,i=[];return t.forEach(function(n){for(var t in n)r.has(t)||i.push(r.add(t))}),[i.map(o).join(n)].concat(t.map(function(t){return i.map(function(n){return o(t[n])}).join(n)})).join("\n")},e.formatRows=function(n){return n.map(a).join("\n")},e},ho.csv=ho.dsv(",","text/csv"),ho.tsv=ho.dsv("	","text/tab-separated-values");var cu,fu,hu,pu,gu=this[N(this,"requestAnimationFrame")]||function(n){setTimeout(n,17)};ho.timer=function(){Un.apply(this,arguments)},ho.timer.flush=function(){jn(),Fn()},ho.round=function(n,t){return t?Math.round(n*(t=Math.pow(10,t)))/t:Math.round(n)};var du=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"].map(Bn);ho.formatPrefix=function(n,t){var e=0;return(n=+n)&&(0>n&&(n*=-1),t&&(n=ho.round(n,In(n,t))),e=1+Math.floor(1e-12+Math.log(n)/Math.LN10),e=Math.max(-24,Math.min(24,3*Math.floor((e-1)/3)))),du[8+e/3]};var vu=/(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,mu=ho.map({b:function(n){return n.toString(2)},c:function(n){return String.fromCharCode(n)},o:function(n){return n.toString(8)},x:function(n){return n.toString(16)},X:function(n){return n.toString(16).toUpperCase()},g:function(n,t){return n.toPrecision(t)},e:function(n,t){return n.toExponential(t)},f:function(n,t){return n.toFixed(t)},r:function(n,t){return(n=ho.round(n,In(n,t))).toFixed(Math.max(0,Math.min(20,In(n*(1+1e-15),t))))}}),yu=ho.time={},xu=Date;Yn.prototype={getDate:function(){return this._.getUTCDate()},getDay:function(){return this._.getUTCDay()},getFullYear:function(){return this._.getUTCFullYear()},getHours:function(){return this._.getUTCHours()},getMilliseconds:function(){return this._.getUTCMilliseconds()},getMinutes:function(){return this._.getUTCMinutes()},getMonth:function(){return this._.getUTCMonth()},getSeconds:function(){return this._.getUTCSeconds()},getTime:function(){return this._.getTime()},getTimezoneOffset:function(){return 0},valueOf:function(){return this._.valueOf()},setDate:function(){ku.setUTCDate.apply(this._,arguments)},setDay:function(){ku.setUTCDay.apply(this._,arguments)},setFullYear:function(){ku.setUTCFullYear.apply(this._,arguments)},setHours:function(){ku.setUTCHours.apply(this._,arguments)},setMilliseconds:function(){ku.setUTCMilliseconds.apply(this._,arguments)},setMinutes:function(){ku.setUTCMinutes.apply(this._,arguments)},setMonth:function(){ku.setUTCMonth.apply(this._,arguments)},setSeconds:function(){ku.setUTCSeconds.apply(this._,arguments)},setTime:function(){ku.setTime.apply(this._,arguments)}};var ku=Date.prototype;yu.year=Jn(function(n){return n=yu.day(n),n.setMonth(0,1),n},function(n,t){n.setFullYear(n.getFullYear()+t)},function(n){return n.getFullYear()}),yu.years=yu.year.range,yu.years.utc=yu.year.utc.range,yu.day=Jn(function(n){var t=new xu(2e3,0);return t.setFullYear(n.getFullYear(),n.getMonth(),n.getDate()),t},function(n,t){n.setDate(n.getDate()+t)},function(n){return n.getDate()-1}),yu.days=yu.day.range,yu.days.utc=yu.day.utc.range,yu.dayOfYear=function(n){var t=yu.year(n);return Math.floor((n-t-6e4*(n.getTimezoneOffset()-t.getTimezoneOffset()))/864e5)},["sunday","monday","tuesday","wednesday","thursday","friday","saturday"].forEach(function(n,t){t=7-t;var e=yu[n]=Jn(function(n){return(n=yu.day(n)).setDate(n.getDate()-(n.getDay()+t)%7),n},function(n,t){n.setDate(n.getDate()+7*Math.floor(t))},function(n){var e=yu.year(n).getDay();return Math.floor((yu.dayOfYear(n)+(e+t)%7)/7)-(e!==t)});yu[n+"s"]=e.range,yu[n+"s"].utc=e.utc.range,yu[n+"OfYear"]=function(n){var e=yu.year(n).getDay();return Math.floor((yu.dayOfYear(n)+(e+t)%7)/7)}}),yu.week=yu.sunday,yu.weeks=yu.sunday.range,yu.weeks.utc=yu.sunday.utc.range,yu.weekOfYear=yu.sundayOfYear;var Mu={"-":"",_:" ",0:"0"},bu=/^\s*\d+/,wu=/^%/;ho.locale=function(n){return{numberFormat:Hn(n),timeFormat:Zn(n)}};var _u=ho.locale({decimal:".",thousands:",",grouping:[3],currency:["$",""],dateTime:"%a %b %e %X %Y",date:"%m/%d/%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]});ho.format=_u.numberFormat,ho.geo={},dt.prototype={s:0,t:0,add:function(n){vt(n,this.t,Nu),vt(Nu.s,this.s,this),this.s?this.t+=Nu.t:this.s=Nu.t},reset:function(){this.s=this.t=0},valueOf:function(){return this.s}};var Nu=new dt;ho.geo.stream=function(n,t){n&&Su.hasOwnProperty(n.type)?Su[n.type](n,t):mt(n,t)};var Su={Feature:function(n,t){mt(n.geometry,t)},FeatureCollection:function(n,t){for(var e=n.features,r=-1,i=e.length;++r<i;)mt(e[r].geometry,t)}},Au={Sphere:function(n,t){t.sphere()},Point:function(n,t){n=n.coordinates,t.point(n[0],n[1],n[2])},MultiPoint:function(n,t){for(var e=n.coordinates,r=-1,i=e.length;++r<i;)n=e[r],t.point(n[0],n[1],n[2])},LineString:function(n,t){yt(n.coordinates,t,0)},MultiLineString:function(n,t){for(var e=n.coordinates,r=-1,i=e.length;++r<i;)yt(e[r],t,0)},Polygon:function(n,t){xt(n.coordinates,t)},MultiPolygon:function(n,t){for(var e=n.coordinates,r=-1,i=e.length;++r<i;)xt(e[r],t)},GeometryCollection:function(n,t){for(var e=n.geometries,r=-1,i=e.length;++r<i;)mt(e[r],t)}};ho.geo.area=function(n){return Lu=0,ho.geo.stream(n,Tu),Lu};var Lu,Eu=new dt,Tu={sphere:function(){Lu+=4*Ho},point:S,lineStart:S,lineEnd:S,polygonStart:function(){Eu.reset(),Tu.lineStart=kt},polygonEnd:function(){var n=2*Eu;Lu+=0>n?4*Ho+n:n,Tu.lineStart=Tu.lineEnd=Tu.point=S}};ho.geo.bounds=function(){function n(n,t){x.push(k=[c=n,h=n]),f>t&&(f=t),t>p&&(p=t)}function t(t,e){var r=Mt([t*Go,e*Go]);if(m){var i=wt(m,r),a=[i[1],-i[0],0],o=wt(a,i);St(o),o=At(o);var s=t-g,l=s>0?1:-1,d=o[0]*Zo*l,v=No(s)>180;if(v^(d>l*g&&l*t>d)){var y=o[1]*Zo;y>p&&(p=y)}else if(d=(d+360)%360-180,v^(d>l*g&&l*t>d)){var y=-o[1]*Zo;f>y&&(f=y)}else f>e&&(f=e),e>p&&(p=e);v?g>t?u(c,t)>u(c,h)&&(h=t):u(t,h)>u(c,h)&&(c=t):h>=c?(c>t&&(c=t),t>h&&(h=t)):t>g?u(c,t)>u(c,h)&&(h=t):u(t,h)>u(c,h)&&(c=t)}else n(t,e);m=r,g=t}function e(){M.point=t}function r(){k[0]=c,k[1]=h,M.point=n,m=null}function i(n,e){if(m){var r=n-g;y+=No(r)>180?r+(r>0?360:-360):r}else d=n,v=e;Tu.point(n,e),t(n,e)}function a(){Tu.lineStart()}function o(){i(d,v),Tu.lineEnd(),No(y)>Io&&(c=-(h=180)),k[0]=c,k[1]=h,m=null}function u(n,t){return(t-=n)<0?t+360:t}function s(n,t){return n[0]-t[0]}function l(n,t){return t[0]<=t[1]?t[0]<=n&&n<=t[1]:n<t[0]||t[1]<n}var c,f,h,p,g,d,v,m,y,x,k,M={point:n,lineStart:e,lineEnd:r,polygonStart:function(){M.point=i,M.lineStart=a,M.lineEnd=o,y=0,Tu.polygonStart()},polygonEnd:function(){Tu.polygonEnd(),M.point=n,M.lineStart=e,M.lineEnd=r,0>Eu?(c=-(h=180),f=-(p=90)):y>Io?p=90:-Io>y&&(f=-90),k[0]=c,k[1]=h}};return function(n){p=h=-(c=f=1/0),x=[],ho.geo.stream(n,M);var t=x.length;if(t){x.sort(s);for(var e,r=1,i=x[0],a=[i];t>r;++r)e=x[r],l(e[0],i)||l(e[1],i)?(u(i[0],e[1])>u(i[0],i[1])&&(i[1]=e[1]),u(e[0],i[1])>u(i[0],i[1])&&(i[0]=e[0])):a.push(i=e);for(var o,e,g=-(1/0),t=a.length-1,r=0,i=a[t];t>=r;i=e,++r)e=a[r],(o=u(i[1],e[0]))>g&&(g=o,c=e[0],h=i[1])}return x=k=null,c===1/0||f===1/0?[[NaN,NaN],[NaN,NaN]]:[[c,f],[h,p]]}}(),ho.geo.centroid=function(n){Cu=zu=Pu=qu=Ru=Ou=Uu=Du=ju=Fu=Iu=0,ho.geo.stream(n,Bu);var t=ju,e=Fu,r=Iu,i=t*t+e*e+r*r;return Bo>i&&(t=Ou,e=Uu,r=Du,Io>zu&&(t=Pu,e=qu,r=Ru),i=t*t+e*e+r*r,Bo>i)?[NaN,NaN]:[Math.atan2(e,t)*Zo,un(r/Math.sqrt(i))*Zo]};var Cu,zu,Pu,qu,Ru,Ou,Uu,Du,ju,Fu,Iu,Bu={sphere:S,point:Et,lineStart:Ct,lineEnd:zt,polygonStart:function(){Bu.lineStart=Pt},polygonEnd:function(){Bu.lineStart=Ct}},Hu=jt(Rt,Ht,Yt,[-Ho,-Ho/2]),Vu=1e9;ho.geo.clipExtent=function(){var n,t,e,r,i,a,o={stream:function(n){return i&&(i.valid=!1),i=a(n),i.valid=!0,i},extent:function(u){return arguments.length?(a=Xt(n=+u[0][0],t=+u[0][1],e=+u[1][0],r=+u[1][1]),i&&(i.valid=!1,i=null),o):[[n,t],[e,r]]}};return o.extent([[0,0],[960,500]])},(ho.geo.conicEqualArea=function(){return Wt($t)}).raw=$t,ho.geo.albers=function(){return ho.geo.conicEqualArea().rotate([96,0]).center([-.6,38.7]).parallels([29.5,45.5]).scale(1070)},ho.geo.albersUsa=function(){function n(n){var a=n[0],o=n[1];return t=null,e(a,o),t||(r(a,o),t)||i(a,o),t}var t,e,r,i,a=ho.geo.albers(),o=ho.geo.conicEqualArea().rotate([154,0]).center([-2,58.5]).parallels([55,65]),u=ho.geo.conicEqualArea().rotate([157,0]).center([-3,19.9]).parallels([8,18]),s={point:function(n,e){t=[n,e]}};return n.invert=function(n){var t=a.scale(),e=a.translate(),r=(n[0]-e[0])/t,i=(n[1]-e[1])/t;return(i>=.12&&.234>i&&r>=-.425&&-.214>r?o:i>=.166&&.234>i&&r>=-.214&&-.115>r?u:a).invert(n)},n.stream=function(n){var t=a.stream(n),e=o.stream(n),r=u.stream(n);return{point:function(n,i){t.point(n,i),e.point(n,i),r.point(n,i)},sphere:function(){t.sphere(),e.sphere(),r.sphere()},lineStart:function(){t.lineStart(),e.lineStart(),r.lineStart()},lineEnd:function(){t.lineEnd(),e.lineEnd(),r.lineEnd()},polygonStart:function(){t.polygonStart(),e.polygonStart(),r.polygonStart()},polygonEnd:function(){t.polygonEnd(),e.polygonEnd(),r.polygonEnd()}}},n.precision=function(t){return arguments.length?(a.precision(t),o.precision(t),u.precision(t),n):a.precision()},n.scale=function(t){return arguments.length?(a.scale(t),o.scale(.35*t),u.scale(t),n.translate(a.translate())):a.scale()},n.translate=function(t){if(!arguments.length)return a.translate();var l=a.scale(),c=+t[0],f=+t[1];return e=a.translate(t).clipExtent([[c-.455*l,f-.238*l],[c+.455*l,f+.238*l]]).stream(s).point,r=o.translate([c-.307*l,f+.201*l]).clipExtent([[c-.425*l+Io,f+.12*l+Io],[c-.214*l-Io,f+.234*l-Io]]).stream(s).point,i=u.translate([c-.205*l,f+.212*l]).clipExtent([[c-.214*l+Io,f+.166*l+Io],[c-.115*l-Io,f+.234*l-Io]]).stream(s).point,n},n.scale(1070)};var Yu,Ju,Gu,Zu,Xu,Wu,$u={point:S,lineStart:S,lineEnd:S,polygonStart:function(){Ju=0,$u.lineStart=Kt},polygonEnd:function(){$u.lineStart=$u.lineEnd=$u.point=S,Yu+=No(Ju/2)}},Ku={point:Qt,lineStart:S,lineEnd:S,polygonStart:S,polygonEnd:S},Qu={point:ee,lineStart:re,lineEnd:ie,polygonStart:function(){Qu.lineStart=ae},polygonEnd:function(){Qu.point=ee,Qu.lineStart=re,Qu.lineEnd=ie}};ho.geo.path=function(){function n(n){return n&&("function"==typeof u&&a.pointRadius(+u.apply(this,arguments)),o&&o.valid||(o=i(a)),ho.geo.stream(n,o)),a.result()}function t(){return o=null,n}var e,r,i,a,o,u=4.5;return n.area=function(n){return Yu=0,ho.geo.stream(n,i($u)),Yu},n.centroid=function(n){return Pu=qu=Ru=Ou=Uu=Du=ju=Fu=Iu=0,ho.geo.stream(n,i(Qu)),Iu?[ju/Iu,Fu/Iu]:Du?[Ou/Du,Uu/Du]:Ru?[Pu/Ru,qu/Ru]:[NaN,NaN]},n.bounds=function(n){return Xu=Wu=-(Gu=Zu=1/0),ho.geo.stream(n,i(Ku)),[[Gu,Zu],[Xu,Wu]]},n.projection=function(n){return arguments.length?(i=(e=n)?n.stream||se(n):w,t()):e},n.context=function(n){return arguments.length?(a=null==(r=n)?new ne:new oe(n),"function"!=typeof u&&a.pointRadius(u),t()):r},n.pointRadius=function(t){return arguments.length?(u="function"==typeof t?t:(a.pointRadius(+t),+t),n):u},n.projection(ho.geo.albersUsa()).context(null)},ho.geo.transform=function(n){return{stream:function(t){var e=new le(t);for(var r in n)e[r]=n[r];return e}}},le.prototype={point:function(n,t){this.stream.point(n,t);
	},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}},ho.geo.projection=fe,ho.geo.projectionMutator=he,(ho.geo.equirectangular=function(){return fe(ge)}).raw=ge.invert=ge,ho.geo.rotation=function(n){function t(t){return t=n(t[0]*Go,t[1]*Go),t[0]*=Zo,t[1]*=Zo,t}return n=ve(n[0]%360*Go,n[1]*Go,n.length>2?n[2]*Go:0),t.invert=function(t){return t=n.invert(t[0]*Go,t[1]*Go),t[0]*=Zo,t[1]*=Zo,t},t},de.invert=ge,ho.geo.circle=function(){function n(){var n="function"==typeof r?r.apply(this,arguments):r,t=ve(-n[0]*Go,-n[1]*Go,0).invert,i=[];return e(null,null,1,{point:function(n,e){i.push(n=t(n,e)),n[0]*=Zo,n[1]*=Zo}}),{type:"Polygon",coordinates:[i]}}var t,e,r=[0,0],i=6;return n.origin=function(t){return arguments.length?(r=t,n):r},n.angle=function(r){return arguments.length?(e=ke((t=+r)*Go,i*Go),n):t},n.precision=function(r){return arguments.length?(e=ke(t*Go,(i=+r)*Go),n):i},n.angle(90)},ho.geo.distance=function(n,t){var e,r=(t[0]-n[0])*Go,i=n[1]*Go,a=t[1]*Go,o=Math.sin(r),u=Math.cos(r),s=Math.sin(i),l=Math.cos(i),c=Math.sin(a),f=Math.cos(a);return Math.atan2(Math.sqrt((e=f*o)*e+(e=l*c-s*f*u)*e),s*c+l*f*u)},ho.geo.graticule=function(){function n(){return{type:"MultiLineString",coordinates:t()}}function t(){return ho.range(Math.ceil(a/v)*v,i,v).map(h).concat(ho.range(Math.ceil(l/m)*m,s,m).map(p)).concat(ho.range(Math.ceil(r/g)*g,e,g).filter(function(n){return No(n%v)>Io}).map(c)).concat(ho.range(Math.ceil(u/d)*d,o,d).filter(function(n){return No(n%m)>Io}).map(f))}var e,r,i,a,o,u,s,l,c,f,h,p,g=10,d=g,v=90,m=360,y=2.5;return n.lines=function(){return t().map(function(n){return{type:"LineString",coordinates:n}})},n.outline=function(){return{type:"Polygon",coordinates:[h(a).concat(p(s).slice(1),h(i).reverse().slice(1),p(l).reverse().slice(1))]}},n.extent=function(t){return arguments.length?n.majorExtent(t).minorExtent(t):n.minorExtent()},n.majorExtent=function(t){return arguments.length?(a=+t[0][0],i=+t[1][0],l=+t[0][1],s=+t[1][1],a>i&&(t=a,a=i,i=t),l>s&&(t=l,l=s,s=t),n.precision(y)):[[a,l],[i,s]]},n.minorExtent=function(t){return arguments.length?(r=+t[0][0],e=+t[1][0],u=+t[0][1],o=+t[1][1],r>e&&(t=r,r=e,e=t),u>o&&(t=u,u=o,o=t),n.precision(y)):[[r,u],[e,o]]},n.step=function(t){return arguments.length?n.majorStep(t).minorStep(t):n.minorStep()},n.majorStep=function(t){return arguments.length?(v=+t[0],m=+t[1],n):[v,m]},n.minorStep=function(t){return arguments.length?(g=+t[0],d=+t[1],n):[g,d]},n.precision=function(t){return arguments.length?(y=+t,c=be(u,o,90),f=we(r,e,y),h=be(l,s,90),p=we(a,i,y),n):y},n.majorExtent([[-180,-90+Io],[180,90-Io]]).minorExtent([[-180,-80-Io],[180,80+Io]])},ho.geo.greatArc=function(){function n(){return{type:"LineString",coordinates:[t||r.apply(this,arguments),e||i.apply(this,arguments)]}}var t,e,r=_e,i=Ne;return n.distance=function(){return ho.geo.distance(t||r.apply(this,arguments),e||i.apply(this,arguments))},n.source=function(e){return arguments.length?(r=e,t="function"==typeof e?null:e,n):r},n.target=function(t){return arguments.length?(i=t,e="function"==typeof t?null:t,n):i},n.precision=function(){return arguments.length?n:0},n},ho.geo.interpolate=function(n,t){return Se(n[0]*Go,n[1]*Go,t[0]*Go,t[1]*Go)},ho.geo.length=function(n){return ns=0,ho.geo.stream(n,ts),ns};var ns,ts={sphere:S,point:S,lineStart:Ae,lineEnd:S,polygonStart:S,polygonEnd:S},es=Le(function(n){return Math.sqrt(2/(1+n))},function(n){return 2*Math.asin(n/2)});(ho.geo.azimuthalEqualArea=function(){return fe(es)}).raw=es;var rs=Le(function(n){var t=Math.acos(n);return t&&t/Math.sin(t)},w);(ho.geo.azimuthalEquidistant=function(){return fe(rs)}).raw=rs,(ho.geo.conicConformal=function(){return Wt(Ee)}).raw=Ee,(ho.geo.conicEquidistant=function(){return Wt(Te)}).raw=Te;var is=Le(function(n){return 1/n},Math.atan);(ho.geo.gnomonic=function(){return fe(is)}).raw=is,Ce.invert=function(n,t){return[n,2*Math.atan(Math.exp(t))-Jo]},(ho.geo.mercator=function(){return ze(Ce)}).raw=Ce;var as=Le(function(){return 1},Math.asin);(ho.geo.orthographic=function(){return fe(as)}).raw=as;var os=Le(function(n){return 1/(1+n)},function(n){return 2*Math.atan(n)});(ho.geo.stereographic=function(){return fe(os)}).raw=os,Pe.invert=function(n,t){return[-t,2*Math.atan(Math.exp(n))-Jo]},(ho.geo.transverseMercator=function(){var n=ze(Pe),t=n.center,e=n.rotate;return n.center=function(n){return n?t([-n[1],n[0]]):(n=t(),[n[1],-n[0]])},n.rotate=function(n){return n?e([n[0],n[1],n.length>2?n[2]+90:90]):(n=e(),[n[0],n[1],n[2]-90])},e([0,0,90])}).raw=Pe,ho.geom={},ho.geom.hull=function(n){function t(n){if(n.length<3)return[];var t,i=zn(e),a=zn(r),o=n.length,u=[],s=[];for(t=0;o>t;t++)u.push([+i.call(this,n[t],t),+a.call(this,n[t],t),t]);for(u.sort(Ue),t=0;o>t;t++)s.push([u[t][0],-u[t][1]]);var l=Oe(u),c=Oe(s),f=c[0]===l[0],h=c[c.length-1]===l[l.length-1],p=[];for(t=l.length-1;t>=0;--t)p.push(n[u[l[t]][2]]);for(t=+f;t<c.length-h;++t)p.push(n[u[c[t]][2]]);return p}var e=qe,r=Re;return arguments.length?t(n):(t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t)},ho.geom.polygon=function(n){return To(n,us),n};var us=ho.geom.polygon.prototype=[];us.area=function(){for(var n,t=-1,e=this.length,r=this[e-1],i=0;++t<e;)n=r,r=this[t],i+=n[1]*r[0]-n[0]*r[1];return.5*i},us.centroid=function(n){var t,e,r=-1,i=this.length,a=0,o=0,u=this[i-1];for(arguments.length||(n=-1/(6*this.area()));++r<i;)t=u,u=this[r],e=t[0]*u[1]-u[0]*t[1],a+=(t[0]+u[0])*e,o+=(t[1]+u[1])*e;return[a*n,o*n]},us.clip=function(n){for(var t,e,r,i,a,o,u=Fe(n),s=-1,l=this.length-Fe(this),c=this[l-1];++s<l;){for(t=n.slice(),n.length=0,i=this[s],a=t[(r=t.length-u)-1],e=-1;++e<r;)o=t[e],De(o,c,i)?(De(a,c,i)||n.push(je(a,o,c,i)),n.push(o)):De(a,c,i)&&n.push(je(a,o,c,i)),a=o;u&&n.push(n[0]),c=i}return n};var ss,ls,cs,fs,hs,ps=[],gs=[];Ze.prototype.prepare=function(){for(var n,t=this.edges,e=t.length;e--;)n=t[e].edge,n.b&&n.a||t.splice(e,1);return t.sort(We),t.length},or.prototype={start:function(){return this.edge.l===this.site?this.edge.a:this.edge.b},end:function(){return this.edge.l===this.site?this.edge.b:this.edge.a}},ur.prototype={insert:function(n,t){var e,r,i;if(n){if(t.P=n,t.N=n.N,n.N&&(n.N.P=t),n.N=t,n.R){for(n=n.R;n.L;)n=n.L;n.L=t}else n.R=t;e=n}else this._?(n=fr(this._),t.P=null,t.N=n,n.P=n.L=t,e=n):(t.P=t.N=null,this._=t,e=null);for(t.L=t.R=null,t.U=e,t.C=!0,n=t;e&&e.C;)r=e.U,e===r.L?(i=r.R,i&&i.C?(e.C=i.C=!1,r.C=!0,n=r):(n===e.R&&(lr(this,e),n=e,e=n.U),e.C=!1,r.C=!0,cr(this,r))):(i=r.L,i&&i.C?(e.C=i.C=!1,r.C=!0,n=r):(n===e.L&&(cr(this,e),n=e,e=n.U),e.C=!1,r.C=!0,lr(this,r))),e=n.U;this._.C=!1},remove:function(n){n.N&&(n.N.P=n.P),n.P&&(n.P.N=n.N),n.N=n.P=null;var t,e,r,i=n.U,a=n.L,o=n.R;if(e=a?o?fr(o):a:o,i?i.L===n?i.L=e:i.R=e:this._=e,a&&o?(r=e.C,e.C=n.C,e.L=a,a.U=e,e!==o?(i=e.U,e.U=n.U,n=e.R,i.L=n,e.R=o,o.U=e):(e.U=i,i=e,n=e.R)):(r=n.C,n=e),n&&(n.U=i),!r){if(n&&n.C)return void(n.C=!1);do{if(n===this._)break;if(n===i.L){if(t=i.R,t.C&&(t.C=!1,i.C=!0,lr(this,i),t=i.R),t.L&&t.L.C||t.R&&t.R.C){t.R&&t.R.C||(t.L.C=!1,t.C=!0,cr(this,t),t=i.R),t.C=i.C,i.C=t.R.C=!1,lr(this,i),n=this._;break}}else if(t=i.L,t.C&&(t.C=!1,i.C=!0,cr(this,i),t=i.L),t.L&&t.L.C||t.R&&t.R.C){t.L&&t.L.C||(t.R.C=!1,t.C=!0,lr(this,t),t=i.L),t.C=i.C,i.C=t.L.C=!1,cr(this,i),n=this._;break}t.C=!0,n=i,i=i.U}while(!n.C);n&&(n.C=!1)}}},ho.geom.voronoi=function(n){function t(n){var t=new Array(n.length),r=u[0][0],i=u[0][1],a=u[1][0],o=u[1][1];return hr(e(n),u).cells.forEach(function(e,u){var s=e.edges,l=e.site,c=t[u]=s.length?s.map(function(n){var t=n.start();return[t.x,t.y]}):l.x>=r&&l.x<=a&&l.y>=i&&l.y<=o?[[r,o],[a,o],[a,i],[r,i]]:[];c.point=n[u]}),t}function e(n){return n.map(function(n,t){return{x:Math.round(a(n,t)/Io)*Io,y:Math.round(o(n,t)/Io)*Io,i:t}})}var r=qe,i=Re,a=r,o=i,u=ds;return n?t(n):(t.links=function(n){return hr(e(n)).edges.filter(function(n){return n.l&&n.r}).map(function(t){return{source:n[t.l.i],target:n[t.r.i]}})},t.triangles=function(n){var t=[];return hr(e(n)).cells.forEach(function(e,r){for(var i,a,o=e.site,u=e.edges.sort(We),s=-1,l=u.length,c=u[l-1].edge,f=c.l===o?c.r:c.l;++s<l;)i=c,a=f,c=u[s].edge,f=c.l===o?c.r:c.l,r<a.i&&r<f.i&&gr(o,a,f)<0&&t.push([n[r],n[a.i],n[f.i]])}),t},t.x=function(n){return arguments.length?(a=zn(r=n),t):r},t.y=function(n){return arguments.length?(o=zn(i=n),t):i},t.clipExtent=function(n){return arguments.length?(u=null==n?ds:n,t):u===ds?null:u},t.size=function(n){return arguments.length?t.clipExtent(n&&[[0,0],n]):u===ds?null:u&&u[1]},t)};var ds=[[-1e6,-1e6],[1e6,1e6]];ho.geom.delaunay=function(n){return ho.geom.voronoi().triangles(n)},ho.geom.quadtree=function(n,t,e,r,i){function a(n){function a(n,t,e,r,i,a,o,u){if(!isNaN(e)&&!isNaN(r))if(n.leaf){var s=n.x,c=n.y;if(null!=s)if(No(s-e)+No(c-r)<.01)l(n,t,e,r,i,a,o,u);else{var f=n.point;n.x=n.y=n.point=null,l(n,f,s,c,i,a,o,u),l(n,t,e,r,i,a,o,u)}else n.x=e,n.y=r,n.point=t}else l(n,t,e,r,i,a,o,u)}function l(n,t,e,r,i,o,u,s){var l=.5*(i+u),c=.5*(o+s),f=e>=l,h=r>=c,p=h<<1|f;n.leaf=!1,n=n.nodes[p]||(n.nodes[p]=mr()),f?i=l:u=l,h?o=c:s=c,a(n,t,e,r,i,o,u,s)}var c,f,h,p,g,d,v,m,y,x=zn(u),k=zn(s);if(null!=t)d=t,v=e,m=r,y=i;else if(m=y=-(d=v=1/0),f=[],h=[],g=n.length,o)for(p=0;g>p;++p)c=n[p],c.x<d&&(d=c.x),c.y<v&&(v=c.y),c.x>m&&(m=c.x),c.y>y&&(y=c.y),f.push(c.x),h.push(c.y);else for(p=0;g>p;++p){var M=+x(c=n[p],p),b=+k(c,p);d>M&&(d=M),v>b&&(v=b),M>m&&(m=M),b>y&&(y=b),f.push(M),h.push(b)}var w=m-d,_=y-v;w>_?y=v+w:m=d+_;var N=mr();if(N.add=function(n){a(N,n,+x(n,++p),+k(n,p),d,v,m,y)},N.visit=function(n){yr(n,N,d,v,m,y)},N.find=function(n){return xr(N,n[0],n[1],d,v,m,y)},p=-1,null==t){for(;++p<g;)a(N,n[p],f[p],h[p],d,v,m,y);--p}else n.forEach(N.add);return f=h=n=c=null,N}var o,u=qe,s=Re;return(o=arguments.length)?(u=dr,s=vr,3===o&&(i=e,r=t,e=t=0),a(n)):(a.x=function(n){return arguments.length?(u=n,a):u},a.y=function(n){return arguments.length?(s=n,a):s},a.extent=function(n){return arguments.length?(null==n?t=e=r=i=null:(t=+n[0][0],e=+n[0][1],r=+n[1][0],i=+n[1][1]),a):null==t?null:[[t,e],[r,i]]},a.size=function(n){return arguments.length?(null==n?t=e=r=i=null:(t=e=0,r=+n[0],i=+n[1]),a):null==t?null:[r-t,i-e]},a)},ho.interpolateRgb=kr,ho.interpolateObject=Mr,ho.interpolateNumber=br,ho.interpolateString=wr;var vs=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,ms=new RegExp(vs.source,"g");ho.interpolate=_r,ho.interpolators=[function(n,t){var e=typeof t;return("string"===e?lu.has(t.toLowerCase())||/^(#|rgb\(|hsl\()/i.test(t)?kr:wr:t instanceof hn?kr:Array.isArray(t)?Nr:"object"===e&&isNaN(t)?Mr:br)(n,t)}],ho.interpolateArray=Nr;var ys=function(){return w},xs=ho.map({linear:ys,poly:zr,quad:function(){return Er},cubic:function(){return Tr},sin:function(){return Pr},exp:function(){return qr},circle:function(){return Rr},elastic:Or,back:Ur,bounce:function(){return Dr}}),ks=ho.map({"in":w,out:Ar,"in-out":Lr,"out-in":function(n){return Lr(Ar(n))}});ho.ease=function(n){var t=n.indexOf("-"),e=t>=0?n.slice(0,t):n,r=t>=0?n.slice(t+1):"in";return e=xs.get(e)||ys,r=ks.get(r)||w,Sr(r(e.apply(null,po.call(arguments,1))))},ho.interpolateHcl=jr,ho.interpolateHsl=Fr,ho.interpolateLab=Ir,ho.interpolateRound=Br,ho.transform=function(n){var t=vo.createElementNS(ho.ns.prefix.svg,"g");return(ho.transform=function(n){if(null!=n){t.setAttribute("transform",n);var e=t.transform.baseVal.consolidate()}return new Hr(e?e.matrix:Ms)})(n)},Hr.prototype.toString=function(){return"translate("+this.translate+")rotate("+this.rotate+")skewX("+this.skew+")scale("+this.scale+")"};var Ms={a:1,b:0,c:0,d:1,e:0,f:0};ho.interpolateTransform=Kr,ho.layout={},ho.layout.bundle=function(){return function(n){for(var t=[],e=-1,r=n.length;++e<r;)t.push(ti(n[e]));return t}},ho.layout.chord=function(){function n(){var n,l,f,h,p,g={},d=[],v=ho.range(a),m=[];for(e=[],r=[],n=0,h=-1;++h<a;){for(l=0,p=-1;++p<a;)l+=i[h][p];d.push(l),m.push(ho.range(a)),n+=l}for(o&&v.sort(function(n,t){return o(d[n],d[t])}),u&&m.forEach(function(n,t){n.sort(function(n,e){return u(i[t][n],i[t][e])})}),n=(Vo-c*a)/n,l=0,h=-1;++h<a;){for(f=l,p=-1;++p<a;){var y=v[h],x=m[y][p],k=i[y][x],M=l,b=l+=k*n;g[y+"-"+x]={index:y,subindex:x,startAngle:M,endAngle:b,value:k}}r[y]={index:y,startAngle:f,endAngle:l,value:d[y]},l+=c}for(h=-1;++h<a;)for(p=h-1;++p<a;){var w=g[h+"-"+p],_=g[p+"-"+h];(w.value||_.value)&&e.push(w.value<_.value?{source:_,target:w}:{source:w,target:_})}s&&t()}function t(){e.sort(function(n,t){return s((n.source.value+n.target.value)/2,(t.source.value+t.target.value)/2)})}var e,r,i,a,o,u,s,l={},c=0;return l.matrix=function(n){return arguments.length?(a=(i=n)&&i.length,e=r=null,l):i},l.padding=function(n){return arguments.length?(c=n,e=r=null,l):c},l.sortGroups=function(n){return arguments.length?(o=n,e=r=null,l):o},l.sortSubgroups=function(n){return arguments.length?(u=n,e=null,l):u},l.sortChords=function(n){return arguments.length?(s=n,e&&t(),l):s},l.chords=function(){return e||n(),e},l.groups=function(){return r||n(),r},l},ho.layout.force=function(){function n(n){return function(t,e,r,i){if(t.point!==n){var a=t.cx-n.x,o=t.cy-n.y,u=i-e,s=a*a+o*o;if(s>u*u/m){if(d>s){var l=t.charge/s;n.px-=a*l,n.py-=o*l}return!0}if(t.point&&s&&d>s){var l=t.pointCharge/s;n.px-=a*l,n.py-=o*l}}return!t.charge}}function t(n){n.px=ho.event.x,n.py=ho.event.y,s.resume()}var e,r,i,a,o,u,s={},l=ho.dispatch("start","tick","end"),c=[1,1],f=.9,h=bs,p=ws,g=-30,d=_s,v=.1,m=.64,y=[],x=[];return s.tick=function(){if((i*=.99)<.005)return e=null,l.end({type:"end",alpha:i=0}),!0;var t,r,s,h,p,d,m,k,M,b=y.length,w=x.length;for(r=0;w>r;++r)s=x[r],h=s.source,p=s.target,k=p.x-h.x,M=p.y-h.y,(d=k*k+M*M)&&(d=i*o[r]*((d=Math.sqrt(d))-a[r])/d,k*=d,M*=d,p.x-=k*(m=h.weight+p.weight?h.weight/(h.weight+p.weight):.5),p.y-=M*m,h.x+=k*(m=1-m),h.y+=M*m);if((m=i*v)&&(k=c[0]/2,M=c[1]/2,r=-1,m))for(;++r<b;)s=y[r],s.x+=(k-s.x)*m,s.y+=(M-s.y)*m;if(g)for(si(t=ho.geom.quadtree(y),i,u),r=-1;++r<b;)(s=y[r]).fixed||t.visit(n(s));for(r=-1;++r<b;)s=y[r],s.fixed?(s.x=s.px,s.y=s.py):(s.x-=(s.px-(s.px=s.x))*f,s.y-=(s.py-(s.py=s.y))*f);l.tick({type:"tick",alpha:i})},s.nodes=function(n){return arguments.length?(y=n,s):y},s.links=function(n){return arguments.length?(x=n,s):x},s.size=function(n){return arguments.length?(c=n,s):c},s.linkDistance=function(n){return arguments.length?(h="function"==typeof n?n:+n,s):h},s.distance=s.linkDistance,s.linkStrength=function(n){return arguments.length?(p="function"==typeof n?n:+n,s):p},s.friction=function(n){return arguments.length?(f=+n,s):f},s.charge=function(n){return arguments.length?(g="function"==typeof n?n:+n,s):g},s.chargeDistance=function(n){return arguments.length?(d=n*n,s):Math.sqrt(d)},s.gravity=function(n){return arguments.length?(v=+n,s):v},s.theta=function(n){return arguments.length?(m=n*n,s):Math.sqrt(m)},s.alpha=function(n){return arguments.length?(n=+n,i?n>0?i=n:(e.c=null,e.t=NaN,e=null,l.end({type:"end",alpha:i=0})):n>0&&(l.start({type:"start",alpha:i=n}),e=Un(s.tick)),s):i},s.start=function(){function n(n,r){if(!e){for(e=new Array(i),s=0;i>s;++s)e[s]=[];for(s=0;l>s;++s){var a=x[s];e[a.source.index].push(a.target),e[a.target.index].push(a.source)}}for(var o,u=e[t],s=-1,c=u.length;++s<c;)if(!isNaN(o=u[s][n]))return o;return Math.random()*r}var t,e,r,i=y.length,l=x.length,f=c[0],d=c[1];for(t=0;i>t;++t)(r=y[t]).index=t,r.weight=0;for(t=0;l>t;++t)r=x[t],"number"==typeof r.source&&(r.source=y[r.source]),"number"==typeof r.target&&(r.target=y[r.target]),++r.source.weight,++r.target.weight;for(t=0;i>t;++t)r=y[t],isNaN(r.x)&&(r.x=n("x",f)),isNaN(r.y)&&(r.y=n("y",d)),isNaN(r.px)&&(r.px=r.x),isNaN(r.py)&&(r.py=r.y);if(a=[],"function"==typeof h)for(t=0;l>t;++t)a[t]=+h.call(this,x[t],t);else for(t=0;l>t;++t)a[t]=h;if(o=[],"function"==typeof p)for(t=0;l>t;++t)o[t]=+p.call(this,x[t],t);else for(t=0;l>t;++t)o[t]=p;if(u=[],"function"==typeof g)for(t=0;i>t;++t)u[t]=+g.call(this,y[t],t);else for(t=0;i>t;++t)u[t]=g;return s.resume()},s.resume=function(){return s.alpha(.1)},s.stop=function(){return s.alpha(0)},s.drag=function(){return r||(r=ho.behavior.drag().origin(w).on("dragstart.force",ii).on("drag.force",t).on("dragend.force",ai)),arguments.length?void this.on("mouseover.force",oi).on("mouseout.force",ui).call(r):r},ho.rebind(s,l,"on")};var bs=20,ws=1,_s=1/0;ho.layout.hierarchy=function(){function n(i){var a,o=[i],u=[];for(i.depth=0;null!=(a=o.pop());)if(u.push(a),(l=e.call(n,a,a.depth))&&(s=l.length)){for(var s,l,c;--s>=0;)o.push(c=l[s]),c.parent=a,c.depth=a.depth+1;r&&(a.value=0),a.children=l}else r&&(a.value=+r.call(n,a,a.depth)||0),delete a.children;return fi(i,function(n){var e,i;t&&(e=n.children)&&e.sort(t),r&&(i=n.parent)&&(i.value+=n.value)}),u}var t=gi,e=hi,r=pi;return n.sort=function(e){return arguments.length?(t=e,n):t},n.children=function(t){return arguments.length?(e=t,n):e},n.value=function(t){return arguments.length?(r=t,n):r},n.revalue=function(t){return r&&(ci(t,function(n){n.children&&(n.value=0)}),fi(t,function(t){var e;t.children||(t.value=+r.call(n,t,t.depth)||0),(e=t.parent)&&(e.value+=t.value)})),t},n},ho.layout.partition=function(){function n(t,e,r,i){var a=t.children;if(t.x=e,t.y=t.depth*i,t.dx=r,t.dy=i,a&&(o=a.length)){var o,u,s,l=-1;for(r=t.value?r/t.value:0;++l<o;)n(u=a[l],e,s=u.value*r,i),e+=s}}function t(n){var e=n.children,r=0;if(e&&(i=e.length))for(var i,a=-1;++a<i;)r=Math.max(r,t(e[a]));return 1+r}function e(e,a){var o=r.call(this,e,a);return n(o[0],0,i[0],i[1]/t(o[0])),o}var r=ho.layout.hierarchy(),i=[1,1];return e.size=function(n){return arguments.length?(i=n,e):i},li(e,r)},ho.layout.pie=function(){function n(o){var u,s=o.length,l=o.map(function(e,r){return+t.call(n,e,r)}),c=+("function"==typeof r?r.apply(this,arguments):r),f=("function"==typeof i?i.apply(this,arguments):i)-c,h=Math.min(Math.abs(f)/s,+("function"==typeof a?a.apply(this,arguments):a)),p=h*(0>f?-1:1),g=ho.sum(l),d=g?(f-s*p)/g:0,v=ho.range(s),m=[];return null!=e&&v.sort(e===Ns?function(n,t){return l[t]-l[n]}:function(n,t){return e(o[n],o[t])}),v.forEach(function(n){m[n]={data:o[n],value:u=l[n],startAngle:c,endAngle:c+=u*d+p,padAngle:h}}),m}var t=Number,e=Ns,r=0,i=Vo,a=0;return n.value=function(e){return arguments.length?(t=e,n):t},n.sort=function(t){return arguments.length?(e=t,n):e},n.startAngle=function(t){return arguments.length?(r=t,n):r},n.endAngle=function(t){return arguments.length?(i=t,n):i},n.padAngle=function(t){return arguments.length?(a=t,n):a},n};var Ns={};ho.layout.stack=function(){function n(u,s){if(!(h=u.length))return u;var l=u.map(function(e,r){return t.call(n,e,r)}),c=l.map(function(t){return t.map(function(t,e){return[a.call(n,t,e),o.call(n,t,e)]})}),f=e.call(n,c,s);l=ho.permute(l,f),c=ho.permute(c,f);var h,p,g,d,v=r.call(n,c,s),m=l[0].length;for(g=0;m>g;++g)for(i.call(n,l[0][g],d=v[g],c[0][g][1]),p=1;h>p;++p)i.call(n,l[p][g],d+=c[p-1][g][1],c[p][g][1]);return u}var t=w,e=xi,r=ki,i=yi,a=vi,o=mi;return n.values=function(e){return arguments.length?(t=e,n):t},n.order=function(t){return arguments.length?(e="function"==typeof t?t:Ss.get(t)||xi,n):e},n.offset=function(t){return arguments.length?(r="function"==typeof t?t:As.get(t)||ki,n):r},n.x=function(t){return arguments.length?(a=t,n):a},n.y=function(t){return arguments.length?(o=t,n):o},n.out=function(t){return arguments.length?(i=t,n):i},n};var Ss=ho.map({"inside-out":function(n){var t,e,r=n.length,i=n.map(Mi),a=n.map(bi),o=ho.range(r).sort(function(n,t){return i[n]-i[t]}),u=0,s=0,l=[],c=[];for(t=0;r>t;++t)e=o[t],s>u?(u+=a[e],l.push(e)):(s+=a[e],c.push(e));return c.reverse().concat(l)},reverse:function(n){return ho.range(n.length).reverse()},"default":xi}),As=ho.map({silhouette:function(n){var t,e,r,i=n.length,a=n[0].length,o=[],u=0,s=[];for(e=0;a>e;++e){for(t=0,r=0;i>t;t++)r+=n[t][e][1];r>u&&(u=r),o.push(r)}for(e=0;a>e;++e)s[e]=(u-o[e])/2;return s},wiggle:function(n){var t,e,r,i,a,o,u,s,l,c=n.length,f=n[0],h=f.length,p=[];for(p[0]=s=l=0,e=1;h>e;++e){for(t=0,i=0;c>t;++t)i+=n[t][e][1];for(t=0,a=0,u=f[e][0]-f[e-1][0];c>t;++t){for(r=0,o=(n[t][e][1]-n[t][e-1][1])/(2*u);t>r;++r)o+=(n[r][e][1]-n[r][e-1][1])/u;a+=o*n[t][e][1]}p[e]=s-=i?a/i*u:0,l>s&&(l=s)}for(e=0;h>e;++e)p[e]-=l;return p},expand:function(n){var t,e,r,i=n.length,a=n[0].length,o=1/i,u=[];for(e=0;a>e;++e){for(t=0,r=0;i>t;t++)r+=n[t][e][1];if(r)for(t=0;i>t;t++)n[t][e][1]/=r;else for(t=0;i>t;t++)n[t][e][1]=o}for(e=0;a>e;++e)u[e]=0;return u},zero:ki});ho.layout.histogram=function(){function n(n,a){for(var o,u,s=[],l=n.map(e,this),c=r.call(this,l,a),f=i.call(this,c,l,a),a=-1,h=l.length,p=f.length-1,g=t?1:1/h;++a<p;)o=s[a]=[],o.dx=f[a+1]-(o.x=f[a]),o.y=0;if(p>0)for(a=-1;++a<h;)u=l[a],u>=c[0]&&u<=c[1]&&(o=s[ho.bisect(f,u,1,p)-1],o.y+=g,o.push(n[a]));return s}var t=!0,e=Number,r=Si,i=_i;return n.value=function(t){return arguments.length?(e=t,n):e},n.range=function(t){return arguments.length?(r=zn(t),n):r},n.bins=function(t){return arguments.length?(i="number"==typeof t?function(n){return Ni(n,t)}:zn(t),n):i},n.frequency=function(e){return arguments.length?(t=!!e,n):t},n},ho.layout.pack=function(){function n(n,a){var o=e.call(this,n,a),u=o[0],s=i[0],l=i[1],c=null==t?Math.sqrt:"function"==typeof t?t:function(){return t};if(u.x=u.y=0,fi(u,function(n){n.r=+c(n.value)}),fi(u,Ci),r){var f=r*(t?1:Math.max(2*u.r/s,2*u.r/l))/2;fi(u,function(n){n.r+=f}),fi(u,Ci),fi(u,function(n){n.r-=f})}return qi(u,s/2,l/2,t?1:1/Math.max(2*u.r/s,2*u.r/l)),o}var t,e=ho.layout.hierarchy().sort(Ai),r=0,i=[1,1];return n.size=function(t){return arguments.length?(i=t,n):i},n.radius=function(e){return arguments.length?(t=null==e||"function"==typeof e?e:+e,n):t},n.padding=function(t){return arguments.length?(r=+t,n):r},li(n,e)},ho.layout.tree=function(){function n(n,i){var c=o.call(this,n,i),f=c[0],h=t(f);if(fi(h,e),h.parent.m=-h.z,ci(h,r),l)ci(f,a);else{var p=f,g=f,d=f;ci(f,function(n){n.x<p.x&&(p=n),n.x>g.x&&(g=n),n.depth>d.depth&&(d=n)});var v=u(p,g)/2-p.x,m=s[0]/(g.x+u(g,p)/2+v),y=s[1]/(d.depth||1);ci(f,function(n){n.x=(n.x+v)*m,n.y=n.depth*y})}return c}function t(n){for(var t,e={A:null,children:[n]},r=[e];null!=(t=r.pop());)for(var i,a=t.children,o=0,u=a.length;u>o;++o)r.push((a[o]=i={_:a[o],parent:t,children:(i=a[o].children)&&i.slice()||[],A:null,a:null,z:0,m:0,c:0,s:0,t:null,i:o}).a=i);return e.children[0]}function e(n){var t=n.children,e=n.parent.children,r=n.i?e[n.i-1]:null;if(t.length){Fi(n);var a=(t[0].z+t[t.length-1].z)/2;r?(n.z=r.z+u(n._,r._),n.m=n.z-a):n.z=a}else r&&(n.z=r.z+u(n._,r._));n.parent.A=i(n,r,n.parent.A||e[0])}function r(n){n._.x=n.z+n.parent.m,n.m+=n.parent.m}function i(n,t,e){if(t){for(var r,i=n,a=n,o=t,s=i.parent.children[0],l=i.m,c=a.m,f=o.m,h=s.m;o=Di(o),i=Ui(i),o&&i;)s=Ui(s),a=Di(a),a.a=n,r=o.z+f-i.z-l+u(o._,i._),r>0&&(ji(Ii(o,n,e),n,r),l+=r,c+=r),f+=o.m,l+=i.m,h+=s.m,c+=a.m;o&&!Di(a)&&(a.t=o,a.m+=f-c),i&&!Ui(s)&&(s.t=i,s.m+=l-h,e=n)}return e}function a(n){n.x*=s[0],n.y=n.depth*s[1]}var o=ho.layout.hierarchy().sort(null).value(null),u=Oi,s=[1,1],l=null;return n.separation=function(t){return arguments.length?(u=t,n):u},n.size=function(t){return arguments.length?(l=null==(s=t)?a:null,n):l?null:s},n.nodeSize=function(t){return arguments.length?(l=null==(s=t)?null:a,n):l?s:null},li(n,o)},ho.layout.cluster=function(){function n(n,a){var o,u=t.call(this,n,a),s=u[0],l=0;fi(s,function(n){var t=n.children;t&&t.length?(n.x=Hi(t),n.y=Bi(t)):(n.x=o?l+=e(n,o):0,n.y=0,o=n)});var c=Vi(s),f=Yi(s),h=c.x-e(c,f)/2,p=f.x+e(f,c)/2;return fi(s,i?function(n){n.x=(n.x-s.x)*r[0],n.y=(s.y-n.y)*r[1]}:function(n){n.x=(n.x-h)/(p-h)*r[0],n.y=(1-(s.y?n.y/s.y:1))*r[1]}),u}var t=ho.layout.hierarchy().sort(null).value(null),e=Oi,r=[1,1],i=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(i=null==(r=t),n):i?null:r},n.nodeSize=function(t){return arguments.length?(i=null!=(r=t),n):i?r:null},li(n,t)},ho.layout.treemap=function(){function n(n,t){for(var e,r,i=-1,a=n.length;++i<a;)r=(e=n[i]).value*(0>t?0:t),e.area=isNaN(r)||0>=r?0:r}function t(e){var a=e.children;if(a&&a.length){var o,u,s,l=f(e),c=[],h=a.slice(),g=1/0,d="slice"===p?l.dx:"dice"===p?l.dy:"slice-dice"===p?1&e.depth?l.dy:l.dx:Math.min(l.dx,l.dy);for(n(h,l.dx*l.dy/e.value),c.area=0;(s=h.length)>0;)c.push(o=h[s-1]),c.area+=o.area,"squarify"!==p||(u=r(c,d))<=g?(h.pop(),g=u):(c.area-=c.pop().area,i(c,d,l,!1),d=Math.min(l.dx,l.dy),c.length=c.area=0,g=1/0);c.length&&(i(c,d,l,!0),c.length=c.area=0),a.forEach(t)}}function e(t){var r=t.children;if(r&&r.length){var a,o=f(t),u=r.slice(),s=[];for(n(u,o.dx*o.dy/t.value),s.area=0;a=u.pop();)s.push(a),s.area+=a.area,null!=a.z&&(i(s,a.z?o.dx:o.dy,o,!u.length),s.length=s.area=0);r.forEach(e)}}function r(n,t){for(var e,r=n.area,i=0,a=1/0,o=-1,u=n.length;++o<u;)(e=n[o].area)&&(a>e&&(a=e),e>i&&(i=e));return r*=r,t*=t,r?Math.max(t*i*g/r,r/(t*a*g)):1/0}function i(n,t,e,r){var i,a=-1,o=n.length,u=e.x,l=e.y,c=t?s(n.area/t):0;if(t==e.dx){for((r||c>e.dy)&&(c=e.dy);++a<o;)i=n[a],i.x=u,i.y=l,i.dy=c,u+=i.dx=Math.min(e.x+e.dx-u,c?s(i.area/c):0);i.z=!0,i.dx+=e.x+e.dx-u,e.y+=c,e.dy-=c}else{for((r||c>e.dx)&&(c=e.dx);++a<o;)i=n[a],i.x=u,i.y=l,i.dx=c,l+=i.dy=Math.min(e.y+e.dy-l,c?s(i.area/c):0);i.z=!1,i.dy+=e.y+e.dy-l,e.x+=c,e.dx-=c}}function a(r){var i=o||u(r),a=i[0];return a.x=a.y=0,a.value?(a.dx=l[0],a.dy=l[1]):a.dx=a.dy=0,o&&u.revalue(a),n([a],a.dx*a.dy/a.value),(o?e:t)(a),h&&(o=i),i}var o,u=ho.layout.hierarchy(),s=Math.round,l=[1,1],c=null,f=Ji,h=!1,p="squarify",g=.5*(1+Math.sqrt(5));return a.size=function(n){return arguments.length?(l=n,a):l},a.padding=function(n){function t(t){var e=n.call(a,t,t.depth);return null==e?Ji(t):Gi(t,"number"==typeof e?[e,e,e,e]:e)}function e(t){return Gi(t,n)}if(!arguments.length)return c;var r;return f=null==(c=n)?Ji:"function"==(r=typeof n)?t:"number"===r?(n=[n,n,n,n],e):e,a},a.round=function(n){return arguments.length?(s=n?Math.round:Number,a):s!=Number},a.sticky=function(n){return arguments.length?(h=n,o=null,a):h},a.ratio=function(n){return arguments.length?(g=n,a):g},a.mode=function(n){return arguments.length?(p=n+"",a):p},li(a,u)},ho.random={normal:function(n,t){var e=arguments.length;return 2>e&&(t=1),1>e&&(n=0),function(){var e,r,i;do e=2*Math.random()-1,r=2*Math.random()-1,i=e*e+r*r;while(!i||i>1);return n+t*e*Math.sqrt(-2*Math.log(i)/i)}},logNormal:function(){var n=ho.random.normal.apply(ho,arguments);return function(){return Math.exp(n())}},bates:function(n){var t=ho.random.irwinHall(n);return function(){return t()/n}},irwinHall:function(n){return function(){for(var t=0,e=0;n>e;e++)t+=Math.random();return t}}},ho.scale={};var Ls={floor:w,ceil:w};ho.scale.linear=function(){return na([0,1],[0,1],_r,!1)};var Es={s:1,g:1,p:1,r:1,e:1};ho.scale.log=function(){return sa(ho.scale.linear().domain([0,1]),10,!0,[1,10])};var Ts=ho.format(".0e"),Cs={floor:function(n){return-Math.ceil(-n)},ceil:function(n){return-Math.floor(-n)}};ho.scale.pow=function(){return la(ho.scale.linear(),1,[0,1])},ho.scale.sqrt=function(){return ho.scale.pow().exponent(.5)},ho.scale.ordinal=function(){return fa([],{t:"range",a:[[]]})},ho.scale.category10=function(){return ho.scale.ordinal().range(zs)},ho.scale.category20=function(){return ho.scale.ordinal().range(Ps)},ho.scale.category20b=function(){return ho.scale.ordinal().range(qs)},ho.scale.category20c=function(){return ho.scale.ordinal().range(Rs)};var zs=[2062260,16744206,2924588,14034728,9725885,9197131,14907330,8355711,12369186,1556175].map(Nn),Ps=[2062260,11454440,16744206,16759672,2924588,10018698,14034728,16750742,9725885,12955861,9197131,12885140,14907330,16234194,8355711,13092807,12369186,14408589,1556175,10410725].map(Nn),qs=[3750777,5395619,7040719,10264286,6519097,9216594,11915115,13556636,9202993,12426809,15186514,15190932,8666169,11356490,14049643,15177372,8077683,10834324,13528509,14589654].map(Nn),Rs=[3244733,7057110,10406625,13032431,15095053,16616764,16625259,16634018,3253076,7652470,10607003,13101504,7695281,10394312,12369372,14342891,6513507,9868950,12434877,14277081].map(Nn);ho.scale.quantile=function(){return ha([],[])},ho.scale.quantize=function(){return pa(0,1,[0,1])},ho.scale.threshold=function(){return ga([.5],[0,1])},ho.scale.identity=function(){return da([0,1])},ho.svg={},ho.svg.arc=function(){function n(){var n=Math.max(0,+e.apply(this,arguments)),l=Math.max(0,+r.apply(this,arguments)),c=o.apply(this,arguments)-Jo,f=u.apply(this,arguments)-Jo,h=Math.abs(f-c),p=c>f?0:1;if(n>l&&(g=l,l=n,n=g),h>=Yo)return t(l,p)+(n?t(n,1-p):"")+"Z";var g,d,v,m,y,x,k,M,b,w,_,N,S=0,A=0,L=[];if((m=(+s.apply(this,arguments)||0)/2)&&(v=a===Os?Math.sqrt(n*n+l*l):+a.apply(this,arguments),p||(A*=-1),l&&(A=un(v/l*Math.sin(m))),n&&(S=un(v/n*Math.sin(m)))),l){y=l*Math.cos(c+A),x=l*Math.sin(c+A),k=l*Math.cos(f-A),M=l*Math.sin(f-A);var E=Math.abs(f-c-2*A)<=Ho?0:1;if(A&&ba(y,x,k,M)===p^E){var T=(c+f)/2;y=l*Math.cos(T),x=l*Math.sin(T),k=M=null}}else y=x=0;if(n){b=n*Math.cos(f-S),w=n*Math.sin(f-S),_=n*Math.cos(c+S),N=n*Math.sin(c+S);var C=Math.abs(c-f+2*S)<=Ho?0:1;if(S&&ba(b,w,_,N)===1-p^C){var z=(c+f)/2;b=n*Math.cos(z),w=n*Math.sin(z),_=N=null}}else b=w=0;if(h>Io&&(g=Math.min(Math.abs(l-n)/2,+i.apply(this,arguments)))>.001){d=l>n^p?0:1;var P=g,q=g;if(Ho>h){var R=null==_?[b,w]:null==k?[y,x]:je([y,x],[_,N],[k,M],[b,w]),O=y-R[0],U=x-R[1],D=k-R[0],j=M-R[1],F=1/Math.sin(Math.acos((O*D+U*j)/(Math.sqrt(O*O+U*U)*Math.sqrt(D*D+j*j)))/2),I=Math.sqrt(R[0]*R[0]+R[1]*R[1]);q=Math.min(g,(n-I)/(F-1)),P=Math.min(g,(l-I)/(F+1))}if(null!=k){var B=wa(null==_?[b,w]:[_,N],[y,x],l,P,p),H=wa([k,M],[b,w],l,P,p);g===P?L.push("M",B[0],"A",P,",",P," 0 0,",d," ",B[1],"A",l,",",l," 0 ",1-p^ba(B[1][0],B[1][1],H[1][0],H[1][1]),",",p," ",H[1],"A",P,",",P," 0 0,",d," ",H[0]):L.push("M",B[0],"A",P,",",P," 0 1,",d," ",H[0])}else L.push("M",y,",",x);if(null!=_){var V=wa([y,x],[_,N],n,-q,p),Y=wa([b,w],null==k?[y,x]:[k,M],n,-q,p);g===q?L.push("L",Y[0],"A",q,",",q," 0 0,",d," ",Y[1],"A",n,",",n," 0 ",p^ba(Y[1][0],Y[1][1],V[1][0],V[1][1]),",",1-p," ",V[1],"A",q,",",q," 0 0,",d," ",V[0]):L.push("L",Y[0],"A",q,",",q," 0 0,",d," ",V[0])}else L.push("L",b,",",w)}else L.push("M",y,",",x),null!=k&&L.push("A",l,",",l," 0 ",E,",",p," ",k,",",M),L.push("L",b,",",w),null!=_&&L.push("A",n,",",n," 0 ",C,",",1-p," ",_,",",N);return L.push("Z"),L.join("")}function t(n,t){return"M0,"+n+"A"+n+","+n+" 0 1,"+t+" 0,"+-n+"A"+n+","+n+" 0 1,"+t+" 0,"+n}var e=ma,r=ya,i=va,a=Os,o=xa,u=ka,s=Ma;return n.innerRadius=function(t){return arguments.length?(e=zn(t),n):e},n.outerRadius=function(t){return arguments.length?(r=zn(t),n):r},n.cornerRadius=function(t){return arguments.length?(i=zn(t),n):i},n.padRadius=function(t){return arguments.length?(a=t==Os?Os:zn(t),n):a},n.startAngle=function(t){return arguments.length?(o=zn(t),n):o},n.endAngle=function(t){return arguments.length?(u=zn(t),n):u},n.padAngle=function(t){return arguments.length?(s=zn(t),n):s},n.centroid=function(){var n=(+e.apply(this,arguments)+ +r.apply(this,arguments))/2,t=(+o.apply(this,arguments)+ +u.apply(this,arguments))/2-Jo;return[Math.cos(t)*n,Math.sin(t)*n]},n};var Os="auto";ho.svg.line=function(){return _a(w)};var Us=ho.map({linear:Na,"linear-closed":Sa,step:Aa,"step-before":La,"step-after":Ea,basis:Ra,"basis-open":Oa,"basis-closed":Ua,bundle:Da,cardinal:za,"cardinal-open":Ta,"cardinal-closed":Ca,monotone:Va});Us.forEach(function(n,t){t.key=n,t.closed=/-closed$/.test(n)});var Ds=[0,2/3,1/3,0],js=[0,1/3,2/3,0],Fs=[0,1/6,2/3,1/6];ho.svg.line.radial=function(){var n=_a(Ya);return n.radius=n.x,delete n.x,n.angle=n.y,delete n.y,n},La.reverse=Ea,Ea.reverse=La,ho.svg.area=function(){return Ja(w)},ho.svg.area.radial=function(){var n=Ja(Ya);return n.radius=n.x,delete n.x,n.innerRadius=n.x0,delete n.x0,n.outerRadius=n.x1,delete n.x1,n.angle=n.y,delete n.y,n.startAngle=n.y0,delete n.y0,n.endAngle=n.y1,delete n.y1,n},ho.svg.chord=function(){function n(n,u){var s=t(this,a,n,u),l=t(this,o,n,u);return"M"+s.p0+r(s.r,s.p1,s.a1-s.a0)+(e(s,l)?i(s.r,s.p1,s.r,s.p0):i(s.r,s.p1,l.r,l.p0)+r(l.r,l.p1,l.a1-l.a0)+i(l.r,l.p1,s.r,s.p0))+"Z"}function t(n,t,e,r){var i=t.call(n,e,r),a=u.call(n,i,r),o=s.call(n,i,r)-Jo,c=l.call(n,i,r)-Jo;
	return{r:a,a0:o,a1:c,p0:[a*Math.cos(o),a*Math.sin(o)],p1:[a*Math.cos(c),a*Math.sin(c)]}}function e(n,t){return n.a0==t.a0&&n.a1==t.a1}function r(n,t,e){return"A"+n+","+n+" 0 "+ +(e>Ho)+",1 "+t}function i(n,t,e,r){return"Q 0,0 "+r}var a=_e,o=Ne,u=Ga,s=xa,l=ka;return n.radius=function(t){return arguments.length?(u=zn(t),n):u},n.source=function(t){return arguments.length?(a=zn(t),n):a},n.target=function(t){return arguments.length?(o=zn(t),n):o},n.startAngle=function(t){return arguments.length?(s=zn(t),n):s},n.endAngle=function(t){return arguments.length?(l=zn(t),n):l},n},ho.svg.diagonal=function(){function n(n,i){var a=t.call(this,n,i),o=e.call(this,n,i),u=(a.y+o.y)/2,s=[a,{x:a.x,y:u},{x:o.x,y:u},o];return s=s.map(r),"M"+s[0]+"C"+s[1]+" "+s[2]+" "+s[3]}var t=_e,e=Ne,r=Za;return n.source=function(e){return arguments.length?(t=zn(e),n):t},n.target=function(t){return arguments.length?(e=zn(t),n):e},n.projection=function(t){return arguments.length?(r=t,n):r},n},ho.svg.diagonal.radial=function(){var n=ho.svg.diagonal(),t=Za,e=n.projection;return n.projection=function(n){return arguments.length?e(Xa(t=n)):t},n},ho.svg.symbol=function(){function n(n,r){return(Is.get(t.call(this,n,r))||Ka)(e.call(this,n,r))}var t=$a,e=Wa;return n.type=function(e){return arguments.length?(t=zn(e),n):t},n.size=function(t){return arguments.length?(e=zn(t),n):e},n};var Is=ho.map({circle:Ka,cross:function(n){var t=Math.sqrt(n/5)/2;return"M"+-3*t+","+-t+"H"+-t+"V"+-3*t+"H"+t+"V"+-t+"H"+3*t+"V"+t+"H"+t+"V"+3*t+"H"+-t+"V"+t+"H"+-3*t+"Z"},diamond:function(n){var t=Math.sqrt(n/(2*Hs)),e=t*Hs;return"M0,"+-t+"L"+e+",0 0,"+t+" "+-e+",0Z"},square:function(n){var t=Math.sqrt(n)/2;return"M"+-t+","+-t+"L"+t+","+-t+" "+t+","+t+" "+-t+","+t+"Z"},"triangle-down":function(n){var t=Math.sqrt(n/Bs),e=t*Bs/2;return"M0,"+e+"L"+t+","+-e+" "+-t+","+-e+"Z"},"triangle-up":function(n){var t=Math.sqrt(n/Bs),e=t*Bs/2;return"M0,"+-e+"L"+t+","+e+" "+-t+","+e+"Z"}});ho.svg.symbolTypes=Is.keys();var Bs=Math.sqrt(3),Hs=Math.tan(30*Go);qo.transition=function(n){for(var t,e,r=Vs||++Zs,i=ro(n),a=[],o=Ys||{time:Date.now(),ease:Cr,delay:0,duration:250},u=-1,s=this.length;++u<s;){a.push(t=[]);for(var l=this[u],c=-1,f=l.length;++c<f;)(e=l[c])&&io(e,c,i,r,o),t.push(e)}return no(a,i,r)},qo.interrupt=function(n){return this.each(null==n?Js:Qa(ro(n)))};var Vs,Ys,Js=Qa(ro()),Gs=[],Zs=0;Gs.call=qo.call,Gs.empty=qo.empty,Gs.node=qo.node,Gs.size=qo.size,ho.transition=function(n,t){return n&&n.transition?Vs?n.transition(t):n:ho.selection().transition(n)},ho.transition.prototype=Gs,Gs.select=function(n){var t,e,r,i=this.id,a=this.namespace,o=[];n=P(n);for(var u=-1,s=this.length;++u<s;){o.push(t=[]);for(var l=this[u],c=-1,f=l.length;++c<f;)(r=l[c])&&(e=n.call(r,r.__data__,c,u))?("__data__"in r&&(e.__data__=r.__data__),io(e,c,a,i,r[a][i]),t.push(e)):t.push(null)}return no(o,a,i)},Gs.selectAll=function(n){var t,e,r,i,a,o=this.id,u=this.namespace,s=[];n=q(n);for(var l=-1,c=this.length;++l<c;)for(var f=this[l],h=-1,p=f.length;++h<p;)if(r=f[h]){a=r[u][o],e=n.call(r,r.__data__,h,l),s.push(t=[]);for(var g=-1,d=e.length;++g<d;)(i=e[g])&&io(i,g,u,o,a),t.push(i)}return no(s,u,o)},Gs.filter=function(n){var t,e,r,i=[];"function"!=typeof n&&(n=J(n));for(var a=0,o=this.length;o>a;a++){i.push(t=[]);for(var e=this[a],u=0,s=e.length;s>u;u++)(r=e[u])&&n.call(r,r.__data__,u,a)&&t.push(r)}return no(i,this.namespace,this.id)},Gs.tween=function(n,t){var e=this.id,r=this.namespace;return arguments.length<2?this.node()[r][e].tween.get(n):Z(this,null==t?function(t){t[r][e].tween.remove(n)}:function(i){i[r][e].tween.set(n,t)})},Gs.attr=function(n,t){function e(){this.removeAttribute(u)}function r(){this.removeAttributeNS(u.space,u.local)}function i(n){return null==n?e:(n+="",function(){var t,e=this.getAttribute(u);return e!==n&&(t=o(e,n),function(n){this.setAttribute(u,t(n))})})}function a(n){return null==n?r:(n+="",function(){var t,e=this.getAttributeNS(u.space,u.local);return e!==n&&(t=o(e,n),function(n){this.setAttributeNS(u.space,u.local,t(n))})})}if(arguments.length<2){for(t in n)this.attr(t,n[t]);return this}var o="transform"==n?Kr:_r,u=ho.ns.qualify(n);return to(this,"attr."+n,t,u.local?a:i)},Gs.attrTween=function(n,t){function e(n,e){var r=t.call(this,n,e,this.getAttribute(i));return r&&function(n){this.setAttribute(i,r(n))}}function r(n,e){var r=t.call(this,n,e,this.getAttributeNS(i.space,i.local));return r&&function(n){this.setAttributeNS(i.space,i.local,r(n))}}var i=ho.ns.qualify(n);return this.tween("attr."+n,i.local?r:e)},Gs.style=function(n,t,e){function r(){this.style.removeProperty(n)}function i(t){return null==t?r:(t+="",function(){var r,i=o(this).getComputedStyle(this,null).getPropertyValue(n);return i!==t&&(r=_r(i,t),function(t){this.style.setProperty(n,r(t),e)})})}var a=arguments.length;if(3>a){if("string"!=typeof n){2>a&&(t="");for(e in n)this.style(e,n[e],t);return this}e=""}return to(this,"style."+n,t,i)},Gs.styleTween=function(n,t,e){function r(r,i){var a=t.call(this,r,i,o(this).getComputedStyle(this,null).getPropertyValue(n));return a&&function(t){this.style.setProperty(n,a(t),e)}}return arguments.length<3&&(e=""),this.tween("style."+n,r)},Gs.text=function(n){return to(this,"text",n,eo)},Gs.remove=function(){var n=this.namespace;return this.each("end.transition",function(){var t;this[n].count<2&&(t=this.parentNode)&&t.removeChild(this)})},Gs.ease=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].ease:("function"!=typeof n&&(n=ho.ease.apply(ho,arguments)),Z(this,function(r){r[e][t].ease=n}))},Gs.delay=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].delay:Z(this,"function"==typeof n?function(r,i,a){r[e][t].delay=+n.call(r,r.__data__,i,a)}:(n=+n,function(r){r[e][t].delay=n}))},Gs.duration=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].duration:Z(this,"function"==typeof n?function(r,i,a){r[e][t].duration=Math.max(1,n.call(r,r.__data__,i,a))}:(n=Math.max(1,n),function(r){r[e][t].duration=n}))},Gs.each=function(n,t){var e=this.id,r=this.namespace;if(arguments.length<2){var i=Ys,a=Vs;try{Vs=e,Z(this,function(t,i,a){Ys=t[r][e],n.call(t,t.__data__,i,a)})}finally{Ys=i,Vs=a}}else Z(this,function(i){var a=i[r][e];(a.event||(a.event=ho.dispatch("start","end","interrupt"))).on(n,t)});return this},Gs.transition=function(){for(var n,t,e,r,i=this.id,a=++Zs,o=this.namespace,u=[],s=0,l=this.length;l>s;s++){u.push(n=[]);for(var t=this[s],c=0,f=t.length;f>c;c++)(e=t[c])&&(r=e[o][i],io(e,c,o,a,{time:r.time,ease:r.ease,delay:r.delay+r.duration,duration:r.duration})),n.push(e)}return no(u,o,a)},ho.svg.axis=function(){function n(n){n.each(function(){var n,l=ho.select(this),c=this.__chart__||e,f=this.__chart__=e.copy(),h=null==s?f.ticks?f.ticks.apply(f,u):f.domain():s,p=null==t?f.tickFormat?f.tickFormat.apply(f,u):w:t,g=l.selectAll(".tick").data(h,f),d=g.enter().insert("g",".domain").attr("class","tick").style("opacity",Io),v=ho.transition(g.exit()).style("opacity",Io).remove(),m=ho.transition(g.order()).style("opacity",1),y=Math.max(i,0)+o,x=Xi(f),k=l.selectAll(".domain").data([0]),M=(k.enter().append("path").attr("class","domain"),ho.transition(k));d.append("line"),d.append("text");var b,_,N,S,A=d.select("line"),L=m.select("line"),E=g.select("text").text(p),T=d.select("text"),C=m.select("text"),z="top"===r||"left"===r?-1:1;if("bottom"===r||"top"===r?(n=ao,b="x",N="y",_="x2",S="y2",E.attr("dy",0>z?"0em":".71em").style("text-anchor","middle"),M.attr("d","M"+x[0]+","+z*a+"V0H"+x[1]+"V"+z*a)):(n=oo,b="y",N="x",_="y2",S="x2",E.attr("dy",".32em").style("text-anchor",0>z?"end":"start"),M.attr("d","M"+z*a+","+x[0]+"H0V"+x[1]+"H"+z*a)),A.attr(S,z*i),T.attr(N,z*y),L.attr(_,0).attr(S,z*i),C.attr(b,0).attr(N,z*y),f.rangeBand){var P=f,q=P.rangeBand()/2;c=f=function(n){return P(n)+q}}else c.rangeBand?c=f:v.call(n,f,c);d.call(n,c,f),m.call(n,f,f)})}var t,e=ho.scale.linear(),r=Xs,i=6,a=6,o=3,u=[10],s=null;return n.scale=function(t){return arguments.length?(e=t,n):e},n.orient=function(t){return arguments.length?(r=t in Ws?t+"":Xs,n):r},n.ticks=function(){return arguments.length?(u=go(arguments),n):u},n.tickValues=function(t){return arguments.length?(s=t,n):s},n.tickFormat=function(e){return arguments.length?(t=e,n):t},n.tickSize=function(t){var e=arguments.length;return e?(i=+t,a=+arguments[e-1],n):i},n.innerTickSize=function(t){return arguments.length?(i=+t,n):i},n.outerTickSize=function(t){return arguments.length?(a=+t,n):a},n.tickPadding=function(t){return arguments.length?(o=+t,n):o},n.tickSubdivide=function(){return arguments.length&&n},n};var Xs="bottom",Ws={top:1,right:1,bottom:1,left:1};ho.svg.brush=function(){function n(a){a.each(function(){var a=ho.select(this).style("pointer-events","all").style("-webkit-tap-highlight-color","rgba(0,0,0,0)").on("mousedown.brush",i).on("touchstart.brush",i),o=a.selectAll(".background").data([0]);o.enter().append("rect").attr("class","background").style("visibility","hidden").style("cursor","crosshair"),a.selectAll(".extent").data([0]).enter().append("rect").attr("class","extent").style("cursor","move");var u=a.selectAll(".resize").data(d,w);u.exit().remove(),u.enter().append("g").attr("class",function(n){return"resize "+n}).style("cursor",function(n){return $s[n]}).append("rect").attr("x",function(n){return/[ew]$/.test(n)?-3:null}).attr("y",function(n){return/^[ns]/.test(n)?-3:null}).attr("width",6).attr("height",6).style("visibility","hidden"),u.style("display",n.empty()?"none":null);var s,f=ho.transition(a),h=ho.transition(o);l&&(s=Xi(l),h.attr("x",s[0]).attr("width",s[1]-s[0]),e(f)),c&&(s=Xi(c),h.attr("y",s[0]).attr("height",s[1]-s[0]),r(f)),t(f)})}function t(n){n.selectAll(".resize").attr("transform",function(n){return"translate("+f[+/e$/.test(n)]+","+h[+/^s/.test(n)]+")"})}function e(n){n.select(".extent").attr("x",f[0]),n.selectAll(".extent,.n>rect,.s>rect").attr("width",f[1]-f[0])}function r(n){n.select(".extent").attr("y",h[0]),n.selectAll(".extent,.e>rect,.w>rect").attr("height",h[1]-h[0])}function i(){function i(){32==ho.event.keyCode&&(L||(x=null,C[0]-=f[1],C[1]-=h[1],L=2),E())}function d(){32==ho.event.keyCode&&2==L&&(C[0]+=f[1],C[1]+=h[1],L=0,E())}function v(){var n=ho.mouse(M),i=!1;k&&(n[0]+=k[0],n[1]+=k[1]),L||(ho.event.altKey?(x||(x=[(f[0]+f[1])/2,(h[0]+h[1])/2]),C[0]=f[+(n[0]<x[0])],C[1]=h[+(n[1]<x[1])]):x=null),S&&m(n,l,0)&&(e(_),i=!0),A&&m(n,c,1)&&(r(_),i=!0),i&&(t(_),w({type:"brush",mode:L?"move":"resize"}))}function m(n,t,e){var r,i,o=Xi(t),s=o[0],l=o[1],c=C[e],d=e?h:f,v=d[1]-d[0];return L&&(s-=c,l-=v+c),r=(e?g:p)?Math.max(s,Math.min(l,n[e])):n[e],L?i=(r+=c)+v:(x&&(c=Math.max(s,Math.min(l,2*x[e]-r))),r>c?(i=r,r=c):i=c),d[0]!=r||d[1]!=i?(e?u=null:a=null,d[0]=r,d[1]=i,!0):void 0}function y(){v(),_.style("pointer-events","all").selectAll(".resize").style("display",n.empty()?"none":null),ho.select("body").style("cursor",null),z.on("mousemove.brush",null).on("mouseup.brush",null).on("touchmove.brush",null).on("touchend.brush",null).on("keydown.brush",null).on("keyup.brush",null),T(),w({type:"brushend"})}var x,k,M=this,b=ho.select(ho.event.target),w=s.of(M,arguments),_=ho.select(M),N=b.datum(),S=!/^(n|s)$/.test(N)&&l,A=!/^(e|w)$/.test(N)&&c,L=b.classed("extent"),T=nn(M),C=ho.mouse(M),z=ho.select(o(M)).on("keydown.brush",i).on("keyup.brush",d);if(ho.event.changedTouches?z.on("touchmove.brush",v).on("touchend.brush",y):z.on("mousemove.brush",v).on("mouseup.brush",y),_.interrupt().selectAll("*").interrupt(),L)C[0]=f[0]-C[0],C[1]=h[0]-C[1];else if(N){var P=+/w$/.test(N),q=+/^n/.test(N);k=[f[1-P]-C[0],h[1-q]-C[1]],C[0]=f[P],C[1]=h[q]}else ho.event.altKey&&(x=C.slice());_.style("pointer-events","none").selectAll(".resize").style("display",null),ho.select("body").style("cursor",b.style("cursor")),w({type:"brushstart"}),v()}var a,u,s=C(n,"brushstart","brush","brushend"),l=null,c=null,f=[0,0],h=[0,0],p=!0,g=!0,d=Ks[0];return n.event=function(n){n.each(function(){var n=s.of(this,arguments),t={x:f,y:h,i:a,j:u},e=this.__chart__||t;this.__chart__=t,Vs?ho.select(this).transition().each("start.brush",function(){a=e.i,u=e.j,f=e.x,h=e.y,n({type:"brushstart"})}).tween("brush:brush",function(){var e=Nr(f,t.x),r=Nr(h,t.y);return a=u=null,function(i){f=t.x=e(i),h=t.y=r(i),n({type:"brush",mode:"resize"})}}).each("end.brush",function(){a=t.i,u=t.j,n({type:"brush",mode:"resize"}),n({type:"brushend"})}):(n({type:"brushstart"}),n({type:"brush",mode:"resize"}),n({type:"brushend"}))})},n.x=function(t){return arguments.length?(l=t,d=Ks[!l<<1|!c],n):l},n.y=function(t){return arguments.length?(c=t,d=Ks[!l<<1|!c],n):c},n.clamp=function(t){return arguments.length?(l&&c?(p=!!t[0],g=!!t[1]):l?p=!!t:c&&(g=!!t),n):l&&c?[p,g]:l?p:c?g:null},n.extent=function(t){var e,r,i,o,s;return arguments.length?(l&&(e=t[0],r=t[1],c&&(e=e[0],r=r[0]),a=[e,r],l.invert&&(e=l(e),r=l(r)),e>r&&(s=e,e=r,r=s),(e!=f[0]||r!=f[1])&&(f=[e,r])),c&&(i=t[0],o=t[1],l&&(i=i[1],o=o[1]),u=[i,o],c.invert&&(i=c(i),o=c(o)),i>o&&(s=i,i=o,o=s),(i!=h[0]||o!=h[1])&&(h=[i,o])),n):(l&&(a?(e=a[0],r=a[1]):(e=f[0],r=f[1],l.invert&&(e=l.invert(e),r=l.invert(r)),e>r&&(s=e,e=r,r=s))),c&&(u?(i=u[0],o=u[1]):(i=h[0],o=h[1],c.invert&&(i=c.invert(i),o=c.invert(o)),i>o&&(s=i,i=o,o=s))),l&&c?[[e,i],[r,o]]:l?[e,r]:c&&[i,o])},n.clear=function(){return n.empty()||(f=[0,0],h=[0,0],a=u=null),n},n.empty=function(){return!!l&&f[0]==f[1]||!!c&&h[0]==h[1]},ho.rebind(n,s,"on")};var $s={n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"},Ks=[["n","e","s","w","nw","ne","se","sw"],["e","w"],["n","s"],[]],Qs=yu.format=_u.timeFormat,nl=Qs.utc,tl=nl("%Y-%m-%dT%H:%M:%S.%LZ");Qs.iso=Date.prototype.toISOString&&+new Date("2000-01-01T00:00:00.000Z")?uo:tl,uo.parse=function(n){var t=new Date(n);return isNaN(t)?null:t},uo.toString=tl.toString,yu.second=Jn(function(n){return new xu(1e3*Math.floor(n/1e3))},function(n,t){n.setTime(n.getTime()+1e3*Math.floor(t))},function(n){return n.getSeconds()}),yu.seconds=yu.second.range,yu.seconds.utc=yu.second.utc.range,yu.minute=Jn(function(n){return new xu(6e4*Math.floor(n/6e4))},function(n,t){n.setTime(n.getTime()+6e4*Math.floor(t))},function(n){return n.getMinutes()}),yu.minutes=yu.minute.range,yu.minutes.utc=yu.minute.utc.range,yu.hour=Jn(function(n){var t=n.getTimezoneOffset()/60;return new xu(36e5*(Math.floor(n/36e5-t)+t))},function(n,t){n.setTime(n.getTime()+36e5*Math.floor(t))},function(n){return n.getHours()}),yu.hours=yu.hour.range,yu.hours.utc=yu.hour.utc.range,yu.month=Jn(function(n){return n=yu.day(n),n.setDate(1),n},function(n,t){n.setMonth(n.getMonth()+t)},function(n){return n.getMonth()}),yu.months=yu.month.range,yu.months.utc=yu.month.utc.range;var el=[1e3,5e3,15e3,3e4,6e4,3e5,9e5,18e5,36e5,108e5,216e5,432e5,864e5,1728e5,6048e5,2592e6,7776e6,31536e6],rl=[[yu.second,1],[yu.second,5],[yu.second,15],[yu.second,30],[yu.minute,1],[yu.minute,5],[yu.minute,15],[yu.minute,30],[yu.hour,1],[yu.hour,3],[yu.hour,6],[yu.hour,12],[yu.day,1],[yu.day,2],[yu.week,1],[yu.month,1],[yu.month,3],[yu.year,1]],il=Qs.multi([[".%L",function(n){return n.getMilliseconds()}],[":%S",function(n){return n.getSeconds()}],["%I:%M",function(n){return n.getMinutes()}],["%I %p",function(n){return n.getHours()}],["%a %d",function(n){return n.getDay()&&1!=n.getDate()}],["%b %d",function(n){return 1!=n.getDate()}],["%B",function(n){return n.getMonth()}],["%Y",Rt]]),al={range:function(n,t,e){return ho.range(Math.ceil(n/e)*e,+t,e).map(lo)},floor:w,ceil:w};rl.year=yu.year,yu.scale=function(){return so(ho.scale.linear(),rl,il)};var ol=rl.map(function(n){return[n[0].utc,n[1]]}),ul=nl.multi([[".%L",function(n){return n.getUTCMilliseconds()}],[":%S",function(n){return n.getUTCSeconds()}],["%I:%M",function(n){return n.getUTCMinutes()}],["%I %p",function(n){return n.getUTCHours()}],["%a %d",function(n){return n.getUTCDay()&&1!=n.getUTCDate()}],["%b %d",function(n){return 1!=n.getUTCDate()}],["%B",function(n){return n.getUTCMonth()}],["%Y",Rt]]);ol.year=yu.year.utc,yu.scale.utc=function(){return so(ho.scale.linear(),ol,ul)},ho.text=Pn(function(n){return n.responseText}),ho.json=function(n,t){return qn(n,"application/json",co,t)},ho.html=function(n,t){return qn(n,"text/html",fo,t)},ho.xml=Pn(function(n){return n.responseXML}),this.d3=ho,r=ho,i="function"==typeof r?r.call(t,e,t,n):r,!(void 0!==i&&(n.exports=i))}()},function(n,t,e){var r=e(3);"string"==typeof r&&(r=[[n.id,r,""]]);e(5)(r,{});r.locals&&(n.exports=r.locals)},function(n,t,e){t=n.exports=e(4)(),t.push([n.id,"svg {\n  display: block;\n  min-width: 100%;\n  width: 100%;\n  min-height: 100%;\n}\n\ncircle.node {\n  stroke: #ccc;\n  stroke-width: 1px;\n  opacity: 1;\n  fill: white;\n}\n\npolygon.node {\n  stroke: #ccc;\n  stroke-width: 1px;\n  opacity: 1;\n  fill: white;\n}\n\ncircle.node.label {\n    stroke: transparent;\n    stroke-width: 0;\n    fill: white;\n    display: inline;\n}\n\ncircle.outline_node {\n    stroke-width: 1px;\n    fill: red;\n}\n\ncircle.protein {\n    fill: gray;\n    fill-opacity: 0.5;\n    stroke-width: 4;\n}\n\ncircle.hidden_outline {\n    stroke-width: 0px;\n}\n\n\nline.link {\n  stroke: #999;\n  stroke-opacity: 0.8;\n  stroke-width: 2;\n}\n\nline.pseudoknot {\n    stroke: red;\n}\n\nline.basepair {\n  stroke: red;\n}\n\nline.intermolecule {\n  stroke: blue;\n}\n\nline.chain_chain {\n  stroke-dasharray: 3,3;\n}\n\nline.fake {\n  stroke: green;\n}\n\n.transparent {\n    fill: transparent;\n    stroke-width: 0;\n    stroke-opacity: 0;\n    opacity: 0;\n    visibility: hidden;\n}\n\n.drag_line {\n  stroke: #999;\n  stroke-width: 2;\n  pointer-events: none;\n}\n\n.drag_line_hidden {\n  stroke: #999;\n  stroke-width: 0;\n  pointer-events: none;\n}\n\n.d3-tip {\n    line-height: 1;\n    font-weight: bold;\n    padding: 6px;\n    background: rgba(0, 0, 0, 0.6);\n    color: #fff;\n    border-radius: 4px;\n    pointer-events: none;\n          }\n\ntext.node-label {\n    font-weight: bold;\n    font-family: Tahoma, Geneva, sans-serif;\n    color: rgb(100,100,100);\n    pointer-events: none;\n}\n\ntext {\n    pointer-events: none;\n}\n\ng.gnode {\n\n}\n\ncircle.outline_node.selected {\n    visibility: visible;\n}\n\ncircle.outline_node {\n    visibility: hidden;\n}\n\n.brush .extent {\n  fill-opacity: .1;\n  stroke: #fff;\n  shape-rendering: crispEdges;\n}\n\n.noselect {\n    -webkit-touch-callout: none;\n    -webkit-user-select: none;\n    -khtml-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n",""])},function(n,t){n.exports=function(){var n=[];return n.toString=function(){for(var n=[],t=0;t<this.length;t++){var e=this[t];e[2]?n.push("@media "+e[2]+"{"+e[1]+"}"):n.push(e[1])}return n.join("")},n.i=function(t,e){"string"==typeof t&&(t=[[null,t,""]]);for(var r={},i=0;i<this.length;i++){var a=this[i][0];"number"==typeof a&&(r[a]=!0)}for(i=0;i<t.length;i++){var o=t[i];"number"==typeof o[0]&&r[o[0]]||(e&&!o[2]?o[2]=e:e&&(o[2]="("+o[2]+") and ("+e+")"),n.push(o))}},n}},function(n,t,e){function r(n,t){for(var e=0;e<n.length;e++){var r=n[e],i=p[r.id];if(i){i.refs++;for(var a=0;a<i.parts.length;a++)i.parts[a](r.parts[a]);for(;a<r.parts.length;a++)i.parts.push(l(r.parts[a],t))}else{for(var o=[],a=0;a<r.parts.length;a++)o.push(l(r.parts[a],t));p[r.id]={id:r.id,refs:1,parts:o}}}}function i(n){for(var t=[],e={},r=0;r<n.length;r++){var i=n[r],a=i[0],o=i[1],u=i[2],s=i[3],l={css:o,media:u,sourceMap:s};e[a]?e[a].parts.push(l):t.push(e[a]={id:a,parts:[l]})}return t}function a(n,t){var e=v(),r=x[x.length-1];if("top"===n.insertAt)r?r.nextSibling?e.insertBefore(t,r.nextSibling):e.appendChild(t):e.insertBefore(t,e.firstChild),x.push(t);else{if("bottom"!==n.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");e.appendChild(t)}}function o(n){n.parentNode.removeChild(n);var t=x.indexOf(n);t>=0&&x.splice(t,1)}function u(n){var t=document.createElement("style");return t.type="text/css",a(n,t),t}function s(n){var t=document.createElement("link");return t.rel="stylesheet",a(n,t),t}function l(n,t){var e,r,i;if(t.singleton){var a=y++;e=m||(m=u(t)),r=c.bind(null,e,a,!1),i=c.bind(null,e,a,!0)}else n.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(e=s(t),r=h.bind(null,e),i=function(){o(e),e.href&&URL.revokeObjectURL(e.href)}):(e=u(t),r=f.bind(null,e),i=function(){o(e)});return r(n),function(t){if(t){if(t.css===n.css&&t.media===n.media&&t.sourceMap===n.sourceMap)return;r(n=t)}else i()}}function c(n,t,e,r){var i=e?"":r.css;if(n.styleSheet)n.styleSheet.cssText=k(t,i);else{var a=document.createTextNode(i),o=n.childNodes;o[t]&&n.removeChild(o[t]),o.length?n.insertBefore(a,o[t]):n.appendChild(a)}}function f(n,t){var e=t.css,r=t.media;t.sourceMap;if(r&&n.setAttribute("media",r),n.styleSheet)n.styleSheet.cssText=e;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(e))}}function h(n,t){var e=t.css,r=(t.media,t.sourceMap);r&&(e+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var i=new Blob([e],{type:"text/css"}),a=n.href;n.href=URL.createObjectURL(i),a&&URL.revokeObjectURL(a)}var p={},g=function(n){var t;return function(){return"undefined"==typeof t&&(t=n.apply(this,arguments)),t}},d=g(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),v=g(function(){return document.head||document.getElementsByTagName("head")[0]}),m=null,y=0,x=[];n.exports=function(n,t){t=t||{},"undefined"==typeof t.singleton&&(t.singleton=d()),"undefined"==typeof t.insertAt&&(t.insertAt="bottom");var e=i(n);return r(e,t),function(n){for(var a=[],o=0;o<e.length;o++){var u=e[o],s=p[u.id];s.refs--,a.push(s)}if(n){var l=i(n);r(l,t)}for(var o=0;o<a.length;o++){var s=a[o];if(0===s.refs){for(var c=0;c<s.parts.length;c++)s.parts[c]();delete p[s.id]}}}};var k=function(){var n=[];return function(t,e){return n[t]=e,n.filter(Boolean).join("\n")}}()},function(n,t,e){"use strict";function r(){var n=(new Date).getTime(),t="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=(n+16*Math.random())%16|0;return n=Math.floor(n/16),("x"==t?e:3&e|8).toString(16)});return t}function i(n,t,e){var i=this;i.type="protein",i.size=t,i.nodes=[{name:"P",num:1,radius:3*Math.sqrt(t),rna:i,nodeType:"protein",structName:n,elemType:"p",size:t,uid:r()}],i.links=[],i.uid=r(),i.addUids=function(n){for(var t=0;t<n.length;t++)i.nodes[t].uid=n[t];return i},i.getUids=function(){uids=[];for(var n=0;n<i.dotbracket.length;n++)uids.push(i.nodes[n].uid);return uids}}function a(n,t,e,i){var a=this;a.type="rna",a.circularizeExternal=!1,0===arguments.length?(a.seq="",a.dotbracket="",a.structName=""):(a.seq=n,a.dotbracket=t,a.structName=e),arguments.length<4&&(i=1),a.circular=!1,a.dotbracket.length>0&&"*"==a.dotbracket[a.dotbracket.length-1]&&(a.dotbracket=a.dotbracket.slice(0,a.dotbracket.length-1),a.circular=!0),a.uid=r(),a.elements=[],a.pseudoknotPairs=[],a.nucsToNodes={},a.addUids=function(n){for(var t=a.nodes.filter(function(n){return"nucleotide"==n.nodeType}),e=0;e<n.length&&e<t.length;e++)t[e].uid=n[e];return a},a.computePairtable=function(){a.pairtable=u.rnaUtilities.dotbracketToPairtable(a.dotbracket)},a.removeBreaks=function(n){for(var t=[],e=-1;(e=n.indexOf("&"))>=0;)t.push(e),n=n.substring(0,e)+"oo"+n.substring(e+1,n.length);return{targetString:n,breaks:t}};var o=a.removeBreaks(a.dotbracket);a.dotbracket=o.targetString,a.dotBracketBreaks=o.breaks,o=a.removeBreaks(a.seq),a.seq=o.targetString,a.seqBreaks=o.breaks,a.calculateStartNumberArray=function(){a.startNumberArray=[];for(var n=0;n<a.dotbracket.length;n++)a.startNumberArray.push(i),"o"==a.dotbracket[n]&&(i=-n)},a.calculateStartNumberArray(),a.rnaLength=a.dotbracket.length,(0,u.arraysEqual)(a.dotBracketBreaks,a.seqBreaks)||(console.log("WARNING: Sequence and structure breaks not equal"),console.log("WARNING: Using the breaks in the structure")),a.computePairtable(),a.addPositions=function(n,t){for(var e=a.nodes.filter(function(t){return t.nodeType==n}),r=0;r<e.length;r++)e[r].x=t[r][0],e[r].px=t[r][0],e[r].y=t[r][1],e[r].py=t[r][1];return a},a.breakNodesToFakeNodes=function(){for(var n=a.nodes.filter(function(n){return"nucleotide"==n.nodeType}),t=0;t<n.length;t++)"o"==a.dotbracket[t]&&(n[t].nodeType="middle");for(var t=0;t<a.elements.length;t++){for(var e=!1,r=0;r<a.elements[t][2].length;r++)a.dotBracketBreaks.indexOf(a.elements[t][2][r])>=0&&(e=!0);e?a.elements[t][2].map(function(n){0!=n&&(a.nodes[n-1].elemType="e")}):a.elements[t][2].map(function(n){0!=n&&(a.nodes[n-1].elemType=a.elements[t][0])})}return a},a.getPositions=function(n){for(var t=[],e=a.nodes.filter(function(t){return t.nodeType==n}),r=0;r<e.length;r++)t.push([e[r].x,e[r].y]);return t},a.getUids=function(){for(var n=[],t=0;t<a.dotbracket.length;t++)n.push(a.nodes[t].uid);return n},a.reinforceStems=function(){for(var n=a.pairtable,t=a.elements.filter(function(n){return"s"==n[0]&&n[2].length>=4}),e=0;e<t.length;e++)for(var r=t[e][2],i=r.slice(0,r.length/2),o=0;o<i.length-1;o++)a.addFakeNode([i[o],i[o+1],n[i[o+1]],n[i[o]]]);return a},a.reinforceLoops=function(){for(var n=function(n){return 0!==n&&n<=a.dotbracket.length},t=0;t<a.elements.length;t++)if("s"!=a.elements[t][0]&&(a.circularizeExternal||"e"!=a.elements[t][0])){var e=a.elements[t][2].filter(n);if("e"==a.elements[t][0]){var i={name:"",num:-3,radius:0,rna:a,nodeType:"middle",elemType:"f",nucs:[],x:a.nodes[a.rnaLength-1].x,y:a.nodes[a.rnaLength-1].y,px:a.nodes[a.rnaLength-1].px,py:a.nodes[a.rnaLength-1].py,uid:r()},o={name:"",num:-2,radius:0,rna:a,nodeType:"middle",elemType:"f",nucs:[],x:a.nodes[0].x,y:a.nodes[0].y,px:a.nodes[0].px,py:a.nodes[0].py,uid:r()};e.push(a.nodes.length+1),e.push(a.nodes.length+2),a.nodes.push(i),a.nodes.push(o)}a.addFakeNode(e)}return a},a.updateLinkUids=function(){for(var n=0;n<a.links.length;n++)a.links[n].uid=a.links[n].source.uid+a.links[n].target.uid;return a},a.addFakeNode=function(n){for(var t=18,e=6.283/(2*n.length),i=t/(2*Math.tan(e)),o="",u=0;u<n.length;u++)o+=a.nodes[n[u]-1].uid;var s={name:"",num:-1,radius:i,rna:a,nodeType:"middle",elemType:"f",nucs:n,uid:o};a.nodes.push(s);var l=0,c=0,f=0;e=3.14159*(n.length-2)/(2*n.length),i=.5/Math.cos(e);for(var h=0;h<n.length;h++)if(!(0===n[h]||n[h]>a.dotbracket.length)){a.links.push({source:a.nodes[n[h]-1],target:a.nodes[a.nodes.length-1],linkType:"fake",value:i,uid:r()}),n.length>4&&a.links.push({source:a.nodes[n[h]-1],target:a.nodes[n[(h+Math.floor(n.length/2))%n.length]-1],linkType:"fake",value:2*i,uid:r()});var p=3.14159*(n.length-2)/n.length,g=2*Math.cos(1.570795-p/2);a.links.push({source:a.nodes[n[h]-1],target:a.nodes[n[(h+2)%n.length]-1],linkType:"fake",value:g});var d=a.nodes[n[h]-1];"x"in d&&(l+=d.x,c+=d.y,f+=1)}return f>0&&(s.x=l/f,s.y=c/f,s.px=s.x,s.py=s.y),a},a.connectFakeNodes=function(){for(var n=18,t=function(n){return"middle"==n.nodeType},e={},r=a.nodes.filter(t),i=new Set,o=1;o<=a.nodes.length;o++)e[o]=[];for(var o=0;o<r.length;o++)for(var u=r[o],s=0;s<u.nucs.length;s++){for(var l=u.nucs[s],c=0;c<e[l].length;c++)if(!i.has(JSON.stringify([e[l][c].uid,u.uid].sort()))){var f=e[l][c].radius+u.radius;a.links.push({source:e[l][c],target:u,value:f/n,linkType:"fake_fake"}),i.add(JSON.stringify([e[l][c].uid,u.uid].sort()))}e[l].push(u)}return a},a.addExtraLinks=function(n){if("undefined"==typeof n)return a;for(var t=0;t<n.length;t++){var e=a.getNodeFromNucleotides(n[t].from),i=a.getNodeFromNucleotides(n[t].to),o={source:e,target:i,linkType:"extra",extraLinkType:n[t].linkType,uid:r()};a.links.push(o)}return a},a.elementsToJson=function(){var n=a.pairtable;a.elements;a.nodes=[],a.links=[];var t={};a.elements.sort();for(var e=0;e<a.elements.length;e++)for(var i=a.elements[e][2],o=0;o<i.length;o++)t[i[o]]=a.elements[e][0];for(var e=1;e<=n[0];e++){var u=a.seq[e-1];(a.dotBracketBreaks.indexOf(e-1)>=0||a.dotBracketBreaks.indexOf(e-2)>=0)&&(u=""),a.nodes.push({name:u,num:e+a.startNumberArray[e-1]-1,radius:5,rna:a,nodeType:"nucleotide",structName:a.structName,elemType:t[e],uid:r(),linked:!1})}for(var e=0;e<a.nodes.length;e++)0===e?a.nodes[e].prevNode=null:a.nodes[e].prevNode=a.nodes[e-1],e==a.nodes.length-1?a.nodes[e].nextNode=null:a.nodes[e].nextNode=a.nodes[e+1];for(var e=1;e<=n[0];e++)0!==n[e]&&a.links.push({source:a.nodes[e-1],target:a.nodes[n[e]-1],linkType:"basepair",value:1,uid:r()}),e>1&&-1===a.dotBracketBreaks.indexOf(e-1)&&-1==a.dotBracketBreaks.indexOf(e-2)&&-1==a.dotBracketBreaks.indexOf(e-3)&&(a.links.push({source:a.nodes[e-2],target:a.nodes[e-1],linkType:"backbone",value:1,uid:r()}),a.nodes[e-1].linked=!0);for(var e=0;e<a.pseudoknotPairs.length;e++)a.links.push({source:a.nodes[a.pseudoknotPairs[e][0]-1],target:a.nodes[a.pseudoknotPairs[e][1]-1],linkType:"pseudoknot",value:1,uid:r()});return a.circular&&a.links.push({source:a.nodes[0],target:a.nodes[a.rnaLength-1],linkType:"backbone",value:1,uid:r()}),a},a.ptToElements=function(n,t,e,r){var i=[],o=[e-1],u=[r+1];if(e>r)return[];for(;0===n[e];e++)o.push(e);for(;0===n[r];r--)u.push(r);if(e>r){if(o.push(e),0===t)return[["e",t,o.sort(s)]];for(var l=!1,c=[],f=[],h=0;h<o.length;h++)l?f.push(o[h]):c.push(o[h]),a.dotBracketBreaks.indexOf(o[h])>=0&&(l=!0);return l?[["h",t,o.sort(s)]]:[["h",t,o.sort(s)]]}if(n[e]!=r){var p=o,h=e;for(p.push(h);r>=h;){for(i=i.concat(a.ptToElements(n,t,h,n[h])),p.push(n[h]),h=n[h]+1;0===n[h]&&r>=h;h++)p.push(h);p.push(h)}return p.pop(),p=p.concat(u),p.length>0&&(0===t?i.push(["e",t,p.sort(s)]):i.push(["m",t,p.sort(s)])),i}if(n[e]===r){o.push(e),u.push(r);var g=o.concat(u);g.length>4&&(0===t?i.push(["e",t,o.concat(u).sort(s)]):i.push(["i",t,o.concat(u).sort(s)]))}for(var d=[];n[e]===r&&r>e;)d.push(e),d.push(r),e+=1,r-=1,t+=1;return o=[e-1],u=[r+1],i.push(["s",t,d.sort(s)]),i.concat(a.ptToElements(n,t,e,r))},a.addLabels=function(n,t){if(0===arguments.length&&(n=1,t=10),1===arguments.length&&(t=10),0===t)return a;0>=t&&console.log("The label interval entered in invalid:",t);for(var e=1;e<=a.pairtable[0];e++)if(e%t===0){var i,o,u,s,l,c,f=a.nodes[e-1];1==a.rnaLength?(c=[f.x-15,f.y],l=[f.x-15,f.y]):(u=1==e?a.nodes[a.rnaLength-1]:a.nodes[e-2],s=e==a.rnaLength?a.nodes[0]:a.nodes[e],0!==a.pairtable[s.num]&&0!==a.pairtable[u.num]&&0!==a.pairtable[f.num]&&(u=s=a.nodes[a.pairtable[f.num]-1]),0===a.pairtable[f.num]||0!==a.pairtable[s.num]&&0!==a.pairtable[u.num]?(c=[s.x-f.x,s.y-f.y],l=[u.x-f.x,u.y-f.y]):(c=[f.x-s.x,f.y-s.y],l=[f.x-u.x,f.y-u.y]));var h=[c[0]+l[0],c[1]+l[1]],p=Math.sqrt(h[0]*h[0]+h[1]*h[1]),g=[h[0]/p,h[1]/p],d=[-15*g[0],-15*g[1]],i=a.nodes[e-1].x+d[0],o=a.nodes[e-1].y+d[1],v={name:e+a.startNumberArray[e-1]-1,num:-1,radius:6,rna:a,nodeType:"label",structName:a.structName,elemType:"l",x:i,y:o,px:i,py:o,uid:r()},m={source:a.nodes[e-1],target:v,value:1,linkType:"label_link",uid:r()};a.nodes.push(v),a.links.push(m)}return a},a.recalculateElements=function(){if(a.removePseudoknots(),a.elements=a.ptToElements(a.pairtable,0,1,a.dotbracket.length),a.circular&&(externalLoop=a.elements.filter(function(n){return"e"==n[0]?!0:void 0}),externalLoop.length>0)){eloop=externalLoop[0],nucs=eloop[2].sort(s),prev=nucs[0],hloop=!0,numGreater=0;for(var n=1;n<nucs.length;n++)nucs[n]-prev>1&&(numGreater+=1),prev=nucs[n];1==numGreater?eloop[0]="h":2==numGreater?eloop[0]="i":eloop[0]="m"}return a},a.reassignLinkUids=function(){for(var n,n=0;n<a.links.length;n++)a.links[n].uid=a.links[n].source.uid+a.links[n].target.uid;return a},a.removePseudoknots=function(){return a.pairtable.length>1?a.pseudoknotPairs=u.rnaUtilities.removePseudoknotsFromPairtable(a.pairtable):a.pseudoknotPairs=[],a},a.addPseudoknots=function(){for(var n=a.pairtable,t=a.pseudoknotPairs,e=0;e<t.length;e++)n[t[e][0]]=t[e][1],n[t[e][1]]=t[e][0];return a.pseudoknotPairs=[],a},a.addName=function(n){return"undefined"==typeof n?(a.name="",a):(a.name=n,a)},a.rnaLength>0&&a.recalculateElements()}function o(n){for(var t={},e=[],o=[],u=0;u<n.molecules.length;u++){var s,l=n.molecules[u];
	"rna"==l.type?(s=new a(l.seq,l.ss,l.header),s.circularizeExternal=!0,s.elementsToJson().addPositions("nucleotide",l.positions).addLabels().reinforceStems().reinforceLoops()):"protein"==l.type&&(s=new i(l.header,l.size)),s.addUids(l.uids);for(var c=0;c<s.nodes.length;c++)t[s.nodes[c].uid]=s.nodes[c];e.push(s)}for(var u=0;u<n.extraLinks.length;u++)link=n.extraLinks[u],link.source=t[link.source],link.target=t[link.target],link.uid=r(),o.push(link);return{graphs:e,extraLinks:o}}Object.defineProperty(t,"__esModule",{value:!0}),t.ProteinGraph=i,t.RNAGraph=a,t.moleculesToJson=o;var u=e(7),s=function(n,t){return n-t};"undefined"==typeof String.prototype.trim&&(String.prototype.trim=function(){return String(this).replace(/^\s+|\s+$/g,"")})},function(n,t){"use strict";function e(n,t){if(n===t)return!0;if(null===n||null===t)return!1;if(n.length!=t.length)return!1;for(var e=0;e<n.length;++e)if(n[e]!==t[e])return!1;return!0}function r(){var n=this;n.bracketLeft="([{<ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),n.bracketRight=")]}>abcdefghijklmnopqrstuvwxyz".split(""),n.inverseBrackets=function(n){for(var t={},e=0;e<n.length;e++)t[n[e]]=e;return t},n.maximumMatching=function(n){for(var t=n[0],e=0,r=new Array(t+1),i=0;t>=i;i++){r[i]=new Array(t+1);for(var a=i;t>=a;a++)r[i][a]=0}for(var o=0,i=t-e-1;i>0;i--)for(var a=i+e+1;t>=a;a++){o=r[i][a-1];for(var u=a-e-1;u>=i;u--)n[u]===a&&(o=Math.max(o,(u>i?r[i][u-1]:0)+1+(a-u-1>0?r[u+1][a-1]:0)));r[i][a]=o}return o=r[1][t],r},n.backtrackMaximumMatching=function(t,e){var r=Array.apply(null,Array(t.length)).map(function(){return 0});return n.mmBt(t,r,e,1,t.length-1),r},n.mmBt=function(t,e,r,i,a){var o=t[i][a],u=0;if(!(u>a-i-1)){if(t[i][a-1]==o)return void n.mmBt(t,e,r,i,a-1);for(var s=a-u-1;s>=i;s--)if(r[a]===s){var l=s>i?t[i][s-1]:0,c=a-s-1>0?t[s+1][a-1]:0;if(l+c+1==o)return e[s]=a,e[a]=s,s>i&&n.mmBt(t,e,r,i,s-1),void n.mmBt(t,e,r,s+1,a-1)}console.log("FAILED!!!"+i+","+a+": backtracking failed!")}},n.dotbracketToPairtable=function(t){var e=Array.apply(null,new Array(t.length+1)).map(Number.prototype.valueOf,0);e[0]=t.length;for(var r={},i=0;i<n.bracketLeft.length;i++)r[i]=[];for(var a=n.inverseBrackets(n.bracketLeft),o=n.inverseBrackets(n.bracketRight),i=0;i<t.length;i++){var u=t[i],s=i+1;if("."==u||"o"==u)e[s]=0;else if(u in a)r[a[u]].push(s);else{if(!(u in o))throw"Unknown symbol in dotbracket string";var l=r[o[u]].pop();e[s]=l,e[l]=s}}for(var c in r)if(r[c].length>0)throw"Unmatched base at position "+r[c][0];return e},n.insertIntoStack=function(n,t,e){for(var r=0;n[r].length>0&&n[r][n[r].length-1]<e;)r+=1;return n[r].push(e),r},n.deleteFromStack=function(n,t){for(var e=0;0===n[e].length||n[e][n[e].length-1]!=t;)e+=1;return n[e].pop(),e},n.pairtableToDotbracket=function(t){for(var e={},r=0;r<t[0];r++)e[r]=[];for(var r,i={},a="",r=1;r<t[0]+1;r++){if(0!==t[r]&&t[r]in i)throw"Invalid pairtable contains duplicate entries";i[t[r]]=!0,a+=0===t[r]?".":t[r]>r?n.bracketLeft[n.insertIntoStack(e,r,t[r])]:n.bracketRight[n.deleteFromStack(e,r)]}return a},n.findUnmatched=function(t,e,r){for(var i,a=[],o=[],u=e,s=r,i=e;r>=i;i++)0!==t[i]&&(t[i]<e||t[i]>r)&&o.push([i,t[i]]);for(var i=u;s>=i;i++){for(;0===t[i]&&s>=i;)i++;for(r=t[i];t[i]===r;)i++,r--;a=a.concat(n.findUnmatched(t,i,r))}return o.length>0&&a.push(o),a},n.removePseudoknotsFromPairtable=function(t){for(var e=n.maximumMatching(t),r=n.backtrackMaximumMatching(e,t),i=[],a=1;a<t.length;a++)t[a]<a||r[a]!=t[a]&&(i.push([a,t[a]]),t[t[a]]=0,t[a]=0);return i}}Object.defineProperty(t,"__esModule",{value:!0}),t.arraysEqual=e,t.RNAUtilities=r;t.rnaUtilities=new r},function(n,t){"use strict";function e(n){var t,e,r,i=0,a=100,o=100,u=15,s=[],l=[];e=n[0];var c=Array.apply(null,new Array(e+5)).map(Number.prototype.valueOf,0),f=Array.apply(null,new Array(16+Math.floor(e/5))).map(Number.prototype.valueOf,0),h=Array.apply(null,new Array(16+Math.floor(e/5))).map(Number.prototype.valueOf,0),p=0,g=0,d=Math.PI/2,v=function y(n,t,e){var r,i,a,o,u,s,l,v,m,x,k,M,b=2,w=0,_=0,N=Array.apply(null,new Array(3+2*Math.floor((t-n)/5))).map(Number.prototype.valueOf,0);for(r=n-1,t++;n!=t;)if(i=e[n],i&&0!=n){b+=2,a=n,o=i,N[++w]=a,N[++w]=o,n=i+1,u=a,s=o,v=0;do a++,o--,v++;while(e[a]==o&&e[a]>a);if(l=v-2,v>=2&&(c[u+1+l]+=d,c[s-1-l]+=d,c[u]+=d,c[s]+=d,v>2))for(;l>=1;l--)c[u+l]=Math.PI,c[s-l]=Math.PI;h[++g]=v,o>=a&&y(a,o,e)}else n++,b++,_++;for(M=Math.PI*(b-2)/b,N[++w]=t,m=0>r?0:r,x=1;w>=x;x++){for(k=N[x]-m,l=0;k>=l;l++)c[m+l]+=M;if(x>w)break;m=N[++x]}f[++p]=_};v(0,e+1,n),f[p]-=2,r=i,s[0]=a,l[0]=o;var m=[];for(m.push([s[0],l[0]]),t=1;e>t;t++)s[t]=s[t-1]+u*Math.cos(r),l[t]=l[t-1]+u*Math.sin(r),m.push([s[t],l[t]]),r+=Math.PI-c[t+1];return m}Object.defineProperty(t,"__esModule",{value:!0}),t.simpleXyCoordinates=e},function(n,t){"use strict";function e(n){var t=this;return t.colorsText=n,t.parseRange=function(n){for(var t=n.split(","),e=[],r=0;r<t.length;r++){var i=t[r].split("-");if(1==i.length)e.push(parseInt(i[0]));else if(2==i.length)for(var a=parseInt(i[0]),o=parseInt(i[1]),u=a;o>=u;u++)e.push(u);else console.log("Malformed range (too many dashes):",n)}return e},t.parseColorText=function(n){for(var e=n.split("\n"),r="",i=1,a={colorValues:{"":{}},range:["white","steelblue"]},o=[],u=0;u<e.length;u++)if(">"!=e[u][0]){words=e[u].trim().split(/[\s]+/);for(var s=0;s<words.length;s++)if(isNaN(words[s])){if(0===words[s].search("range")){parts=words[s].split("="),partsRight=parts[1].split(":"),a.range=[partsRight[0],partsRight[1]];continue}if(0==words[s].search("domain")){parts=words[s].split("="),partsRight=parts[1].split(":"),a.domain=[partsRight[0],partsRight[1]];continue}parts=words[s].split(":"),nums=t.parseRange(parts[0]),color=parts[1];for(var l=0;l<nums.length;l++)isNaN(color)?a.colorValues[r][nums[l]]=color:(a.colorValues[r][nums[l]]=+color,o.push(Number(color)))}else a.colorValues[r][i]=Number(words[s]),i+=1,o.push(Number(words[s]))}else r=e[u].trim().slice(1),i=1,a.colorValues[r]={};return"domain"in a||(a.domain=[Math.min.apply(null,o),Math.max.apply(null,o)]),t.colorsJson=a,t},t.normalizeColors=function(){var n;for(var e in t.colorsJson){var r=Number.MAX_VALUE,i=Number.MIN_VALUE;for(var a in t.colorsJson.colorValues[e])n=t.colorsJson.colorValues[e][a],"number"==typeof n&&(r>n&&(r=n),n>i&&(i=n));for(a in t.colorsJson.colorValues[e])n=t.colorsJson.colorValues[e][a],"number"==typeof n&&(t.colorsJson.colorValues[e][a]=(n-r)/(i-r))}return t},t.parseColorText(t.colorsText),t}Object.defineProperty(t,"__esModule",{value:!0}),t.ColorScheme=e}])});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(5);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./treemap.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./treemap.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "    .overlay {\n        fill: none;\n        pointer-events: all;\n    }\n\n.treemapNode {\n  font: 10px sans-serif;\n  line-height: 12px;\n  overflow: hidden;\n  position: absolute;\n  text-indent: 2px;\n}\n\n.axis path,\n.axis line {\n  fill: none;\n  stroke: #000;\n  shape-rendering: crispEdges;\n}\n.axis text {\n        font-family: sans-serif;\n            font-size: 13px;\n        }\n\n.x.axis path {\n  display: none;\n}\n\n.line {\n  fill: none;\n  stroke: steelblue;\n  stroke-width: 2px;\n}\n", ""]);

	// exports


/***/ },
/* 6 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(9);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./drforna.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./drforna.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, ".time-indicator {\n    stroke: black;\n    stroke-width: 2px;\n    stroke-dasharray: 5, 5;\n}\n\n.time-label {\n    text-anchor: middle;\n}\n\n.outline-div {\n    border:1px solid black;\n}\n", ""]);

	// exports


/***/ }
/******/ ])
});
;