import * as d3 from "d3"
import { saveAs } from 'file-saver';
import { elementToSVG } from 'dom-to-svg'

const { parseFasta } = require('./utils');
import { getFornaContainer, 
         calculateNucleotideColors } from './myforna';

/**
 * @file main.js
 * @author Anda Latif, Stefan Hammer, Peter Kerpediev, Stefan Badelt
 * @see <a href="https://github.com/ViennaRNA/drforna">DrForna</a>
 * @description Visualization of cotranscriptional folding.
 */  

function parse_fasta(text) {
    let data = parseFasta(text)
    if (data.id === null) {
        data.id = 'drforna'
    }
    return [data.id, data.sequence]
} 

function parse_drf(text) {
    return d3.csvParse(text.replace(/ +/g, ",")
        .replace(/\n,+/g, "\n")
        .replace(/^\s*\n/gm, ""))
}

/**
 * Default occupancy threshhold to reduce input file size 
 * @type {number} Defaults to 0.01.
 */
let occupancyThreshold = 0.01;

/**
 * Prepares the visualization area from scratch (new visualization div setup).
 */
function preparePlotArea() {  
    //remove the previous content
    let container = d3.select("#visualization")
    container.selectAll('div').remove()
    
    //display loading indicator
    container.append('div')
        .attr('id', 'loadingNotification')
        .style('display', 'inline')
        .html('Loading ...')
    // create the ensemble visualization area (treemap)
    container
        .append('div')
        .attr('id', 'ensemblevis')
    // create the time point selection panel
    container
        .append('div')
        .attr('id', 'timetablevis')
    // create the info table about the selected time point
    container
        .append('div')
        .attr('id', 'timetableinfo')
}


/**
 * Function for downloading the content of the visualization area.
 * the name of the downloaded file is generated using the name of the current selected file, the current time and the current date. 
//  * @param {string} name of the container 
 */
function downloadSVG(name, realtime) {
    function filter(node) {
        return (node.tagName !== 'i');
    }
    let tmddown = document.getElementById("visualization")
    const svgDocument = elementToSVG(tmddown)
    let svgString = new XMLSerializer().serializeToString(svgDocument)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    saveAs(blob, `${name + "_at_t=" + realtime}.svg`)
}

/**
 * Logarithmic scale- for steps after transcription ends
 *  
 */
let logscale;
/**
 * Linear scale- for cotranscritional steps
 *  
 */
let linscale;
/**
 * the svg containing the scales
 * 
 */
let svg;
/**
 * the list of structures for the previous selected time point, to verify if anything changed
 * @type {number}
 */
let strtoPlotprev=null;

/**
 * Method for initialization based on the data
 ** determine sequence length
 ** set mouse as not active 
 */
function initialize(){
    preparePlotArea(); 

    // Set the dimensions of everything in in the visualization area
    // changed that to be relative to fullscreen now, looking ok so far.
    let visContainer = d3.select(`#fullscreen`).node()
    const visContainerWidth = visContainer.getBoundingClientRect().width; 
    const visContainerHeight = visContainer.getBoundingClientRect().height;

    const cH = document.getElementById("controls").clientHeight;
    const sH = document.getElementById("seqfield").getBoundingClientRect().height; 
    const tH = 110 // timetablevis is generated later, but at fixed height
    const iH = 25  // timepointinfo is generated later, but should be approx 25
    const subH = cH + sH + tH + iH + 10

    const ensContainerWidth = visContainerWidth;
    const ensContainerHeight = Math.max(200, //TODO: this still causes trouble
                                        visContainerHeight - subH);
    const timeScaleWidth = visContainerWidth - 30;

    return [visContainerWidth,
            visContainerHeight,
            ensContainerWidth, 
            ensContainerHeight,
            timeScaleWidth]
}
/**
 * Split time points into 'transcription' and 'after transcription'
 * Also identifies the maximal number of structural alternatives per time point.
 *
 * @param {Array} nestedData The input data read form the file, grouped by time
 * @returns {Array} time points during transcription
 * @returns {Array} time points after transcription
 * @returns {number} maximal number of structural alternatives per time point
 */
function SplitTranscription(nestedData, seqlen){
    // the end of transciption is identified as the first time step where 
    // structures of maximal length occur
    let transcriptionSteps = [] 
    let AfterTranscription = []
    let maxNoStr = 0
    nestedData.forEach(el=>{
        if (el[1].length>maxNoStr){
            maxNoStr=el[1].length // max num of structures per time point
        }
        if (el[1][0].structure.length<seqlen){ // structure not at full length
            transcriptionSteps.push(el) // retain time as transcription step 
        }
        else{
            AfterTranscription.push(el) // a time step after transcription
        }
    })
    transcriptionSteps.push(AfterTranscription[0]) 
    return [transcriptionSteps, AfterTranscription, maxNoStr]
}
 /**
  * the logarithmic x-axis   
  */
let x_axislog 
 /**
  * the linear x-axis   
  */
let x_axislin 
 /**
  * the nucleotide scale   
  */
let nucleotideScale 
 /**
  * the combined scale: linear untill end of transcription and logarithmic after   
  */
let combinedScale
 /**
  * the nucleotide position y-axis   
  */
let y_axis
 /**
  * the first time point in the current file   
  */
let mintime

/**
 * Returns the most occupied structure for each time point.
 *
 * @param {Array} nestedData - The nested array containing the data.
 * @returns {Array} - The list containing the most occupied structure for each time point.
 */
function mostOccupiedperTime(nestedData) {
  const mopt = nestedData.map(el => [el[0], el[1].reduce((a, b) => 
      (+a.occupancy >= +b.occupancy ? a : b))])
  const mostocc = mopt.filter((el, i) => i === 0 || el[1].id !== mopt[i-1][1].id)
  return mostocc
}

/**
 * function  for creating the scales, and determinining the start and end of transcription
 * @returns {Object} the combined Scale  
 * @returns {number} first time point in the file
 * @returns {number} time of the end of transcription 
 */
function CreateScales(vCW, tSW, lintimes, logtimes, seqlen){

    let minlintime=d3.min(lintimes, d=>+d[0])
    let maxlintime=d3.max(lintimes, d=>+d[0])
    let minlogtime=d3.min(logtimes, d=>+d[0]) // this may come in handy later ...
    let maxlogtime=d3.max(logtimes, d=>+d[0])

    linscale = d3.scaleLinear()
        .domain([minlintime, maxlintime]) 
        .range([30, tSW * .75]) // occupy 75% of the scale
    logscale = d3.scaleLog() 
        .domain([maxlintime, maxlogtime+0.001])
        .range([tSW * .75, tSW]) // occupy last 25% 

    // a function that takes the argument time and determines if its on the 
    // lin or log scale
    combinedScale = time => time < maxlintime ? linscale(time) : logscale(time); 

    let tableContainer = d3.select(`#timetablevis`);
    tableContainer.selectAll("#timesvg").remove()
    svg = tableContainer
        .append("svg")
        .attr("width", vCW)
        .attr("id", "timesvg"); //create the svg containing the scales

    // the lin and log scale on the bottom, positions were defined
    x_axislin = d3.axisBottom().scale(linscale);
    x_axislog = d3.axisBottom().scale(logscale).ticks(5);
    // and the vertical nucleotide  
    nucleotideScale = d3.scaleLinear().range([80, 0]);
    // Append group and insert axes
    nucleotideScale.domain([0, seqlen]);
    y_axis = d3.axisLeft()
        .scale(nucleotideScale).ticks(5);

    return [combinedScale, nucleotideScale, maxlintime]
}

/**
 * Mathod  for drawing the scales
 * 
 */   
function drawScales(vCW){
    svg.append("g").attr("width", vCW)
        .attr("height", 110)
        .attr("transform", "translate (30,10)")
        .call(y_axis)    
    svg.append("g").attr("transform", "translate (0,90)").attr("height", 110).call(x_axislin);
    svg.append("g").attr("transform", "translate (0,90)").attr("height", 110).call(x_axislog).attr("color", "blue");    
}
/**
 * function for drawing the colors of the nucleotides above the time scale
 ** every vertical section is colored bottom to top corresponding to the color of the nucleotide sequence in the most occupied structure for that specific time point 
 * 
 */
function createScaleColors(tSW, seqlen, mostocc, cScale, nScale){  
    mostocc.forEach((el,i)=>{
        let end = 0
        if (i == mostocc.length-1){
            end = tSW
        }
        else{
            end = cScale(mostocc[i+1][0])
        }
        svg.selectAll(".rectculoare"+i)
            .data(el[1].colors)
            .enter()
            .append("rect")
            .attr(`class`,'rectculoare'+i)
            .attr("id", (d,j)=> "rectculoare"+el[0]+d+j)
            .attr("width", end-cScale(el[0]))
            .attr("height", 80/seqlen)
            .attr("transform", (d,k)=> `translate(${+cScale(el[0])},${nScale(k)+10})`)
            .attr("fill", (d) => {return `${(d)}`; })
    })
}   
/**
 * Method for drawing a circle on the combined scale for every time point present in the file 
 */   
function drawCirclesForTimepoints(nestedData){
    const timePoints = nestedData.map(d => +d[0]);
    
    d3.select("#timesvg").selectAll('.timePoint').remove();
    d3.select("#timesvg").selectAll('.timePoint').data(timePoints)
        .enter()
            .append('circle')
                .attr('class', 'timePoint')
                .attr('cx',d =>combinedScale(d))//  scale(d))
                .attr('cy', 90)
                .attr('r', 1)
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('strokeWidth', 1);
}
/**
 * Method for drawing a black line to mark the end of transcription  
 */  
function ShowEndOfTranscriptionLine(cScale, maxlintime){
    svg.append("line") 
        .attr("class", "transcriplengthLine")
        .attr("x1", cScale(maxlintime))  
        .attr("y1", 0)
        .attr("x2", cScale(maxlintime))  
        .attr("y2", 120)
}

/**
 * Function for extracting the list of structures to plot for the selected time point
 * @param {number} time selected time point
 * @returns {Array} List of structures to plot for the selected time point
 */  
function StructuresToPlot(nestedData, time){
    let strToPlot = []
    nestedData.forEach(element => {
        if (+element[0] == +time) {
            strToPlot = element[1] 
        } 
    })
    return strToPlot
}
/**
 * the index of the element with key current time point in nested data, used for the animation, such that all time points in the data are considered
 * @type  {number}
 */  
let elementIndex = 0;
/**
 * Animation delay for the play button, time in miliseconds between consecutive plots
 * @type {number}
 */  
let animationDelay = 10;

/**
 * Boolean for determining if the play button is active 
 * @type {boolean} 
 */  
let playAnimation = false;
let Sum_of_occ
/**
 * Mathod for showing a line at the current selected coordinates
 * @param {number} coord the x-coordinate on the visual container of the selected time point 
 * @param {string} color the color of the line, red by default
 */  
function showLine(coord, color="red") {
    svg.selectAll(".currenttimeLine").remove()
    svg.append("line")
        .attr("class", "currenttimeLine")
        .attr("x1", coord)  
        .attr("y1", 0)
        .attr("x2", coord)  
        .attr("y2", 120)
        .style("stroke",color)
}
/**
 * Generate a rgb color string from hcl
 * @param {Array} colors hcl color for each nucleotide
 * @returns {Array} a list of rgb colors, one for each nucleotide
 */ 
function formatColors (colors) {   
    return colors.map(function(c) {               
        return c.rgb().toString();
    })
}

/**
 * Function for generating the table containing the summary of the file, corresponding to the selected time point
 
 ** The first line contains the currently selected time point
 ** A table containing the structures, with 'ID', 'Occupancy', 'Structure' and  'Energy', where the parantheses in dot bracket notation are collored according to the helix they are part of
 * @param {Array} strToPlot The list of structures selected for the currently selected time point
 */           
function WriteTable(strToPlot, mostocc, sequence){
    var colnames = ['ID', 'Occupancy', 'Structure' , 'Energy'];    

    d3.select("#datatable")
        .selectAll("table").remove()
    let structures = d3.select("#datatable").append("table")
    let th = structures.append("thead")
    th.append('tr').selectAll('th')
        .data(colnames).enter()
        .append('th')
        .text(function (column) { return column; })
        .append('th').style("text-align", "right")
        .text(function (column) { 
            if (column=="Structure"){
                return sequence.slice(0, strToPlot[0].structure.length) //
            }
            else
                return " "
        }).style("text-align", "right")

    let tbody = structures.append('tbody').style("text-align", "left")
    let tr = tbody.selectAll("tr")
        .data(strToPlot)
        .enter()
        .append("tr").attr("class", "tableData")                      
        .selectAll("td")
        .data(d => {
            return [{column:"id", value:d.id},//{column:"time", value: d.time},
                {column:"oc", value:d.occupancy},
                {column:"str", value:d.structure, col:d.colors},{column:"en", value: d.energy}]//, {column:"col", value:d.colors}]
        })
                      .enter()
                tr.each((dd) =>{
                    if (dd.column == "id") {
                         tbody.append("tr")
                        
                    }                
                    if (dd.column=="str") {                   
                        let tb=tbody.append("td")
                                .style( "white-space", "nowrap").attr("text-align", "center")
                        tb.selectAll('span').remove()
                        for (let i = 0; i < dd.value.length; i++) {
                          tb.append('span')
                          .style('background-color',dd.col[i])
                          .text(dd.value[i])
                        }
                    }
                    else  if (dd.column!="str") {
                         if(dd.column=="id"){
                            let bestid
                            mostocc.forEach(e=>{
                                if (+e[0]<=+strToPlot[0].time){
                                    bestid=e[1].id
                                }
                            })
                            if( dd.value==bestid){
                                        tbody.append("td").text(dd.value).style('background-color',"rgb(247, 200, 194)")
                            }
                            else {
                                    tbody.append("td").text(dd.value)
                                
                            }
                        } else
                        tbody.append("td").text(dd.value)
                    }
               
                })  
            function writeLabels(length){
                let j=10
                let res=""
                for (let i = 0; i < length; i++) {
                    if ((res.length)==i){
                    if ((res.length+1)%10==0){
                        res+=j
                        j+=10
                    }
                    else if((res.length+1)%5==0){res+=","}
                        else {res+="."}}}
                return res

            }
            let lastrow=tbody.append("tr") 
            lastrow.append('td')
                .text(" ")
                lastrow.append('td')
                .text(" ")
                lastrow.append('td')
                .text(writeLabels(strToPlot[0].structure.length))
                .style("text-align", "left") 
                lastrow.append('td')
                .text(" ")               
            
            }
          
/**
 * Function for plotting the treemap containing the structures, as well as
 * writing the table
 *
 * @param {number} realtime the selected time (as present in the file) 
 * @returns {Array} The list of plotted structures, as the ones that were now
 * previously plotted
  */   
function ensPlot(nestedData, realtime, eCW, eCH, seqlen, mostocc, sequence) { 
    let strToPlot = StructuresToPlot(nestedData, realtime)
    if (strtoPlotprev != strToPlot) {
        let containers = {}
        const treemapData = makeTreemapData(strToPlot);
        let root = d3.stratify().id(function(d) { return d.name})   
            .parentId(function(d){ return d.parent})(treemapData);
        root.sum(d => +d.value).sort((a, b) => b.value - a.value)  
        Sum_of_occ=Math.round(root.value*100000)/100000

        d3.treemap()
            .size([eCW, eCH])
            .padding(4)(root)

        let ensContainer = d3.select('#ensemblevis');
        ensContainer.select("#treemapdiv").remove()
        let zoom = false;
        ensContainer.append("div").attr("id", "treemapdiv") 
            .style("width", `${eCW}px`)
            .style("height", `${eCH}px`)
            .selectAll(".svg").remove() // leave out
            .data(root.leaves())
            .enter()
            .append("svg")
            .attr("class", "plot")
            .style("z-index", 1)
            .attr("id",   d => { return "svg"+d.data.name})
            .on("mouseover", (e,d)=> {  // show occ when mouse over
                d3.select("#treemapdiv").append("div")
                  .attr("class", "infodiv")
                  .html(d.data.value)
                  .style('left',  ()=>{ return `${d.x0+30}px`; })
                  .style('top',  () => { return `${d.y0}px`; })
                  .style("z-index", 3);})    
            .on('mouseout', (e,d)=> {  
                d3.select(".infodiv").remove() //delete on mouseout   
            }) 
            .on("click", (e,d) =>{
                let rectname = "svg" + d.data.name
                let c = d3.select('#' + rectname)
                if (zoom == false) {
                    zoom = true 
                    d3.select(".infodiv").remove()
                    d3.select("#treemapdiv").append("div")
                        .attr("class", "help")
                        .style("width", `${eCW}px`)
                        .style("height", `${eCH}px`)
                        .style('position', 'relative')
                        .style("z-index", 2)
                        .style("background-color", "azure")
                        .style("text-align", "center")
                        .text("Selected structure, occupancy "+d.data.value); 
                    c.style("width", `${eCW}px`)
                        .style("height", `${eCH}px`)
                        .style('left',  d =>{ return `${0}px`; })
                        .style('top',  d => { return `${0}px`; })
                        .style("z-index", 3)
                } else {
                    zoom = false
                    d3.select(".help").remove()
                    return c.style('left', d =>{ return `${d.x0}px`; })
                        .style('top', d => { return `${d.y0}px`; })
                        .style("z-index", 1)
                        .style('width',  d => { return `${(d.x1 - d.x0)}px`; })
                        .style('height',  d => { return `${(d.y1 - d.y0)}px`; })}
            })
            .style('position', 'absolute')
            .style('left',  d =>{ return `${d.x0}px`; })
            .style('top',  d => { return `${d.y0}px`; })
            .style('width',  d => { return `${(d.x1 - d.x0)}px`; })
            .style('height',  d => { return `${(d.y1 - d.y0)}px`; })
            .style("stroke", "black")
            .style("fill", "#62b6a2")
            .style("border", "thin solid black")
            .append("text")
            .attr("x", 2)    //  to adjust position (to the right)
            .attr("y", 12)    //  to adjust position (lower)
            .text( d => { return d.data.name })
            .attr("font-size", "0.8rem")                            
            .each( d => {
                let rectname="svg"+d.data.name
                if ( d.data.str != '') {
                    containers[rectname] = getFornaContainer(rectname, 
                        sequence, d.data.str, d.data.colors)
                }     
            });

        let time = d3.select("#timetableinfo")
        time.selectAll("table").remove()
        let trow = time.append("table").attr("id", "timeinfo").append("tr")
        trow.append("td")
            .style('width', '300px')
            .text("Selected time point: " + strToPlot[0].time + " s")
        trow.append("td")
            .style('width', '300px')
            .text("Transcript length: " + 
                strToPlot[0].structure.length + "/" + seqlen + " nt")
        trow.append("td")
            .style('width', '300px')
            .text("Sum of occupancies: " + Sum_of_occ)
        WriteTable(strToPlot, mostocc, sequence) 
    }
    strtoPlotprev = strToPlot
    return strtoPlotprev    
}

/**
 * Function for making a treemap structure out of the data 
 * @param {Array} data the data 
 * @returns {Array} The treemap hierarchical structure, in our case with only one level of hierarchy
  */ 
function makeTreemapData(data) {
    return [{ name: "parent", parent: null, value: 0, str:"", colors: "" },
            ...data.map(el => ({ name: el.id, 
                                 parent: "parent", 
                                 value: el.occupancy, 
                                 str: el.structure, 
                                 colors:formatColors(el.colors) }))
    ]
}

/**
 * Function for visulizing  a HTML element in  fullscreen mode, used on fullScreenContainer upon Fullscreen button click 
 ** thanks to https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
 * @param {string} elem the name of the container to be visualized in fullscreen
 * 
 */
// 
function toggleFullScreen(elem) {
    if (!document.fullscreenElement && 
        !document.mozFullScreenElement && 
        !document.webkitFullscreenElement && 
        !document.msFullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else {
            console.log("Fullscreen not working: ", elem)
            return
        }
    } else { // exit fullScreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else {
            console.log("Fullscreen not working: ", elem)
            return
        }
    }
}

/**
 * Function for showing the data, which consists mostly of calls of previously defined functions and the mouse events
 * @param {Array} data the parsed content of the input file
 */

function ShowData(data, realtime, prevtime, seqname, sequence) {
    console.log('calling ShowData', realtime, prevtime, seqname, sequence)
    const [vCW, vCH, eCW, eCH, tSW] = initialize()
    const seqlen = data[data.length - 1].structure.length;
    strtoPlotprev = null
    let mouseactive = false

    document.querySelectorAll('.occupancy').forEach((item) => {
        occupancyThreshold=item.value
        item.addEventListener('change', () => {
            //TODO Look at the end of transcription in the original file and
            //get the max occupancy there, otherwise the whole time points
            //change! Error message when the occupancy threshold is bigger than
            //max occ at end of transcr
        occupancyThreshold=item.value
        ShowData(data, realtime, prevtime, seqname, sequence)
        })
    })
    d3.select("#visualization").select('#loadingNotification').remove();

    let filteredData = data.filter((d) => { return +d.occupancy > occupancyThreshold }) 
    // nested data by time points to extract the structures for every time step
    let nestedData = Array.from(d3.group(filteredData, d =>+d.time)) 

    //if (nd.length<dd.length) {
    //    alert("Some time points were discarded due to the presence of only low occupied structures ")
    //}
    const [lintimes, logtimes, maxNoStr] = SplitTranscription(nestedData, seqlen)

    // all do edits to the svg
    const [cScale, nScale, maxlintime] = CreateScales(vCW, tSW,
        lintimes, logtimes, seqlen);

    // continue here: let's move this into a separate file?
    filteredData.forEach(function(d) {
        d.colors = calculateNucleotideColors(d.structure, nScale) 
    })

    const mostocc = mostOccupiedperTime(nestedData)
    createScaleColors(tSW, seqlen, mostocc, cScale, nScale)  
    drawScales(vCW)
    drawCirclesForTimepoints(nestedData)
    ShowEndOfTranscriptionLine(cScale, maxlintime)

    // this has not been necessary so far
    mintime = d3.min(filteredData, d => +d.time);
    if (realtime == null) {realtime = mintime}
    if (prevtime == null) {prevtime = mintime }

    let strToPlot = StructuresToPlot(nestedData, prevtime)
    strtoPlotprev = ensPlot(nestedData, prevtime, eCW, eCH, seqlen, mostocc, sequence)

    // continue here
    showLine(cScale(prevtime)) 

    let mousetime = 30 // the beginning of the plot
    svg.on("mousemove", (event) => {
        if (playAnimation) return;
        if (!mouseactive) return;
        let x = d3.pointer(event)[0];
        //scale invert for combined scale
        (x <= linscale(maxlintime))
              ? mousetime = linscale.invert(x) 
              : mousetime = logscale.invert(x)
        if (x >= 30 && x <= tSW) {
            showLine(x)
        }
        for (let t in filteredData) {
            if (filteredData[t].time <= mousetime) { 
                realtime = filteredData[t].time 
            }
        }
        let delayPLOT = undefined;
        if (prevtime != realtime) {
            prevtime = realtime
            if (delayPLOT) clearTimeout(delayPLOT);
            delayPLOT = setTimeout(ensPlot, 5*maxNoStr, nestedData, realtime, eCW, eCH, seqlen, mostocc, sequence);
        }
    })
    svg.on("click", (event) => {
        if (playAnimation) { playAnimation = !playAnimation }
        mouseactive = !mouseactive;
        //scale invert for combined scale
        (d3.pointer(event)[0]<linscale(maxlintime))
        ?mousetime = linscale.invert(d3.pointer(event)[0]) 
        :mousetime = logscale.invert(d3.pointer(event)[0])
        if (d3.pointer(event)[0] >= 30 && d3.pointer(event)[0] <= tSW) {
            showLine(d3.pointer(event)[0])
        }
        for (let t in filteredData) {
            if (filteredData[t].time <= mousetime) { 
                realtime = filteredData[t].time 
            }
        }
        if (prevtime != realtime) {
            prevtime = realtime
            ensPlot(nestedData, realtime, eCW, eCH, seqlen, mostocc, sequence)
        }
    })
    
    let play = d3.select("#toggleAnimation");
    play.on("click", () => {
        playAnimation = !playAnimation    
        nestedData.forEach(element => {
            if (+element[0] === +prevtime) {
                elementIndex = nestedData.indexOf(element)
            }
        }) 
        document.querySelectorAll('.playspeed').forEach((item) => {
            item.addEventListener('change', () => {
                animationDelay = item.value;
            })
        })
        let ToogleAnimation = setInterval(() => {
            if (!playAnimation) {
                clearInterval(ToogleAnimation);
                return
            }
            if (elementIndex >= nestedData.length){            
                elementIndex = 0;
            }
            const element = nestedData[elementIndex];
            prevtime = +element[0]
            ensPlot(nestedData, prevtime, eCW, eCH, seqlen, mostocc, sequence)
            showLine(cScale(prevtime))
            elementIndex += 1;
            return prevtime
        }, animationDelay);
    })
    
    // Update Sequence TODO: ensPlot?
    let bsload = d3.select("#seqload")
    bsload.on('click', function() {
        playAnimation = false;
        let stext = document.getElementById("seqtext");
        const [seqname, sequence] = parse_fasta(stext.value);
        ShowData(data, realtime, prevtime, seqname, sequence);
    });

    let bdload = d3.select("#downloadButton")
    bdload.on("click", () => {
        playAnimation = false;
        downloadSVG(seqname, realtime);
    })

    let bfullscr = d3.select("#toggleFullScreen")
    bfullscr.on('click', function() {
        playAnimation = false; //TODO: why?
        toggleFullScreen(document.getElementById('fullscreen'));
    })

    // Window resize, redraw everything!
    let delayResize = undefined;
    window.onresize = function() {
        playAnimation = false;
        if (delayResize) clearTimeout(delayResize);
        delayResize = setTimeout(ShowData, 300, data, realtime, prevtime, seqname, sequence);
    };
} 

/**
 * Method that starts the visualization: 
 * hides the sequence info and summary table
 * reads and shows the data from the example inputs
 * responds to new data uploaded by the user 
 */
function start() {
    hideseq()
    document.getElementById("toggleSequence")
        .addEventListener("click", function() {hideseq();}, false);
    hidetab()
    document.getElementById("toggleTable")
        .addEventListener("click", function() {hidetab();}, false);
    load_examples("grow.drf", "grow.fa");
    read_drf_file();
    read_seq_file();
} 

function hideseq() { 
    const x = document.getElementById("seqfield");
    x.style.display = x.style.display === "none" ? "block" : "none"; 
}

function hidetab() { 
    const x = document.getElementById("datatable");
    x.style.display = x.style.display === "none" ? "block" : "none"; 
}

/**
 * Function that loads an example for the visualization. 
 * @param {string} filename of drf input
 * @param {string} filename of fasta input
 */
function load_examples(drffile, fafile) {
    let sload = document.getElementById("seqload")
    let stext = document.getElementById("seqtext")
    const promise1 = d3.text(fafile).then(data => {
        stext.value = data
        return data
    }).then(data => {
        stext.style.borderColor = 'black';
        stext.title = "Provide sequence input in fasta format.";
        sload.disabled = false
        return parse_fasta(data);
    }).catch(error => {
        console.log("Error while loading " + fafile + ": " + error);
        stext.style.borderColor = 'red';
        stext.title = error;
        sload.disabled = true
        return ['drforna', '']
    })

    const promise2 = d3.text(drffile).then(data => {
        return parse_drf(data)
    }).catch(error => {
        console.log("Error while loading " + drffile + ": " + error)
    })

    Promise.all([promise1, promise2])
        .then(([[seqname, sequence], drfdata]) => {
            ShowData(drfdata, null, null, seqname, sequence);
    }).catch(error => {
        throw error
    });
}

/**
 * Method for reading drf input from an uploaded file.
 * (Automatically clears sequence information.)
 *  
 */  
function read_drf_file() {
    let item = document.getElementById('drfinput');
    item.addEventListener('click', (event) => {
        playAnimation = false;
    });
    item.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (val) => {
            const data = parse_drf(val.target.result)
            ShowData(data, null, null, '', '');
        };
        let st = document.getElementById("seqtext")
        st.value = "";
        st.title = "Provide sequence input in fasta format.";
        st.style.borderColor = 'black';
        reader.readAsText(file);
    });
}

/**
  * 
  * method for reading the sequence, from the text field or from the file. 
  *  
  */  
function read_seq_file() {
    let sload = document.getElementById("seqload")
    let sfile = document.getElementById("seqfile")
    sfile.addEventListener("click", (event) => {
        playAnimation = false
    }) 
    sfile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (val) => {
            let st = document.getElementById("seqtext")
            try {
                const [seqname, sequence] = parse_fasta(val.target.result);
                st.style.borderColor = 'black';
                st.title = "Provide sequence input in fasta format.";
                st.value = ">"+seqname+"\n"+sequence;
                sload.disabled = false;
            } catch (error) {
                console.log("Error while loading " + val + ": " + error);
                st.style.borderColor = 'red';
                st.title = error;
                st.value = val.target.result
                sload.disabled = true;
            }
        };
        reader.readAsText(file);
    });

    let stext = document.getElementById("seqtext")
    stext.addEventListener('click', () => {
        playAnimation = false
    })
    stext.addEventListener('change', (event) => {
        sfile.value = ""
        try {
            const [seqname, sequence] = parse_fasta(event.target.value);
            stext.style.borderColor = 'black';
            stext.title = "Provide sequence input in fasta format.";
            sload.disabled = false;
        } catch (error) {
            console.log("Error while loading " + event.target.value + ": " + error);
            stext.style.borderColor = 'red';
            stext.title = error;
            sload.disabled = true
        }
    })
}

start();
