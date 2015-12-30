var toggleView = function() {};

$ ( document ).ready(function() {
    //window.addEventListener("resize", setSize, false);

    /*
    function setSize() {
        var element = d3.select('#visContainer')

        var chartWidth = $( '#visContainer' ).width();
        var chartHeight = $( window ).height();

        var svg = element.select('svg')

        svg.attr('width', chartWidth)
        .attr('height', chartHeight)
    }
    */

    /*
    function createNewPlot(file) {
        var dotStructPlot = dotStructLayout();

        console.log('file', file);
        data = JSON.parse(file.target.result);

        dotStructPlot.width(data.seq.length * 10);

        var boundContainer = d3.select('#visContainer')
        .selectAll('svg')
        .data([data], function(d) { return d.seq })

        var svg = boundContainer.enter()
        .append('svg')
        .attr('id', 'dotplot')

        boundContainer.exit()
        .remove()

        var style = svg.append('svg:style');
        $.get(location.origin + window.location.pathname.replace(/[^\/]+$/g,"") + "css/dotstruct.css", 
              function(content){
                  style.text(content.replace(/[\s\n]/g, ""));

                  svg.call(dotStructPlot);

              });

        setSize();
    }
    */

    d3.dsv(" ", 'text/plain')('data/pete.growing', function(error, data) {
    //d3.dsv(" ", 'text/plain')('data/pete.out.filtered', function(error, data) {
        currentCTView = 'time-series'
        var width = 800;
        var height = 600;

        var showPlot = function(plotLayout) {
            //dotStructPlot.width(data.seq.length * 10);
            d3.select('#visContainer')
            .selectAll('.removable-plot')
            .remove();

            var svg = d3.select('#visContainer')
            .append('div')   //add a div that we can easily remove
            .classed('removable-plot', true)
            .data([data])
            /*
            .enter()
            .append('svg')
            */
            //.attr('width', plotLayout.width())
            //.attr('height', plotLayout.height())
            .attr('id', 'my-plot');

            svg.call(plotLayout);
        }

        var showTimeSeriesPlot = function() {
            showPlot(cotranscriptionalTimeSeriesLayout().width(800).height(600));

            if (toggleView == showTimeSeriesPlot)
                toggleView = showSmallMultiplesPlot;
            else
                toggleView = showTimeSeriesPlot;
        }

        var showSmallMultiplesPlot = function() {
            showPlot(cotranscriptionalSmallMultiplesLayout().width(800));

            if (toggleView == showTimeSeriesPlot)
                toggleView = showSmallMultiplesPlot;
            else
                toggleView = showTimeSeriesPlot;
        }

        toggleView = showTimeSeriesPlot;
        //toggleView = showSmallMultiplesPlot;
        toggleView();
    });

    /* add event listener to the file browse button */
  $('#files').on('change', function(evt) {
      var files = evt.target.files; // FileList object

      // files is a FileList of File objects. List some properties.
      var output = [];
      for (var i = 0, f; f = files[i]; i++) {
          var reader = new FileReader()
          reader.onload = createNewPlot;
          reader.readAsText(f);

      }
    })
    .on('click', function(){ this.value = null; });

})

function savePNG() {
    saveSvgAsPng(document.getElementById('dotplot'), 'dotplot.png', 10);
    return;
}

function combineDotAndStruct() {
    var svg = document.getElementById('dotplot'); 

    var gMiddle = d3.select('#middle-layer');
    var gRoot = d3.select('#root-g');

    if (gMiddle.attr('transform') == 'translate(0,0)')
        gMiddle.transition().attr('transform', 'translate(' + gRoot.node().getBBox().width + ',0)').attr('opacity',1.0);
    else
        gMiddle.transition().attr('transform', 'translate(0,0)').attr('opacity', 0.4);
}

function saveSVG() {
    saveSvgAsPng(document.getElementById('dotplot'), 'dotplot.png', 4);
    return;

    console.log("saving svg..."); 
    var svg = document.getElementById('dotplot'); 

    //get svg source. 
    var serializer = new XMLSerializer(); 
    var source = serializer.serializeToString(svg); 

    //add name spaces. 
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){ 
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"'); 
    } 
    if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){ 
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    } 

    //add xml declaration 
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source; 

    // use FileSave to get a downloadable SVG File 
    var file = new Blob([source], {type: "data:image/svg+xml;charset=utf-8"}); 
    saveAs(file, "dotplot.svg"); 
}
