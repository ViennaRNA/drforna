import * as d3 from "d3"
import { saveAs } from 'file-saver';
import { elementToSVG } from 'dom-to-svg'

const { parseFasta } = require('./utils');
import { getFornaContainer, 
         calculateNucleotideColors } from './myforna';

let playAnimation = false;

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

function init_time_control_panel(filteredData, nestedData, 
    vCW, tSW, t0, tlog, t8, seqlen, cotr) {
    // Creates the Time SVG
    const [timesvg, tScale, itScale, nScale] = CreateScales(vCW, tSW, t0, tlog, t8, seqlen, cotr);
    // adding colors to filteredData
    filteredData.forEach(function(d) {
        d.colors = calculateNucleotideColors(d.structure, nScale) 
    })
    const mostocc = mostOccupiedperTime(nestedData)
    createScaleColors(timesvg, tSW, seqlen, mostocc, tScale, nScale)  
    drawCirclesForTimepoints(nestedData, tScale)
    return [timesvg, tScale, itScale, nScale, mostocc]
}


/**
 * Function for downloading the content of the visualization area.
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

function get_critical_timepoints(data, seqlen) {
    let cotr = true
    const t0 = +data[0].time
    let tlog = +data.find(el => el.structure.length === seqlen)?.time
    if (t0 === tlog) {
        // In case there is only full-length data... 
        // so no cotranscriptional folding.
        tlog = +data.find(el => +el.time > t0)?.time
        cotr = false
    }
    const t8 = +data.slice(-1)[0].time
    return [t0, tlog, t8, cotr]
}

/**
 * Prepares the visualization area from scratch (new visualization div setup).
 */
function preparePlotArea() {  
    //remove the previous content
    let container = d3.select("#visualization")
    container.selectAll('div').remove()
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
 * Returns the most occupied structure for each time point.
 *
 * @param {Array} nestedData - The nested array containing the data.
 * @returns {Array} - The list containing the most occupied structure for each time point.
 */
function mostOccupiedperTime(nestedData) {
  const mopt = nestedData.map(el => 
      [el[0], el[1].reduce(
          (a, b) => (+a.occupancy >= +b.occupancy ? a : b)
      )]
  )
  const mostocc = mopt.filter((el, i) => i === 0 || el[1].id !== mopt[i-1][1].id)
  return mostocc
}

/**
 * function  for creating the scales, and determinining the start and end of transcription
 * @returns {Object} the combined Scale  
 * @returns {number} first time point in the file
 * @returns {number} time of the end of transcription 
 */
function CreateScales(vCW, tSW, t0, tlog, t8, seqlen, cotr) {
    // Adjust the vertical black line (which usually marks the end of
    // transcription at 75% of the scale)
    const blackL = (cotr) ? .75 : .25

    // first the x-axis (time)
    const linscale = d3.scaleLinear()
        .domain([t0, tlog]) 
        .range([30, tSW * blackL]) 
    const logscale = d3.scaleLog() 
        .domain([tlog, t8+(t8-tlog)/10]) // hmmm ...
        .range([tSW * blackL, tSW])
    // map time to coordinates on the lin or log scale
    const combinedScale = time => (time < tlog) 
        ? linscale(time) 
        : logscale(time); 
    // map (mouse) coordinates on the lin or log scale to time
    const invertedScale = time => (time <= linscale(tlog))
        ? linscale.invert(time) 
        : logscale.invert(time);

    const x_axislin = d3.axisBottom().scale(linscale);
    const x_axislog = d3.axisBottom().scale(logscale).ticks(5);

    // and the vertical nucleotide  
    const nucleotideScale = d3.scaleLinear()
        .domain([0, seqlen])
        .range([80, 0]);
    const y_axis = d3.axisLeft().scale(nucleotideScale).ticks(5);

    let timeContainer = d3.select(`#timetablevis`);
    timeContainer.selectAll("#timesvg").remove()
    let timesvg = timeContainer
        .append("svg")
        .attr("width", vCW)
        .attr("id", "timesvg"); //create the svg containing the scales
    timesvg.append("g")
        .attr("width", vCW)
        .attr("height", 110)
        .attr("transform", "translate (30, 10)")
        .call(y_axis);
    timesvg.append("g")
        .attr("transform", "translate (0, 90)")
        .attr("height", 110)
        .call(x_axislin);
    timesvg.append("g")
        .attr("transform", "translate (0, 90)")
        .attr("height", 110)
        .call(x_axislog).attr("color", "blue");    
    timesvg.append("line") 
        .attr("class", "transcriplengthLine")
        .attr("x1", combinedScale(tlog))  
        .attr("y1", 0)
        .attr("x2", combinedScale(tlog))  
        .attr("y2", 120);
    return [timesvg, combinedScale, invertedScale, nucleotideScale]
}

/**
 * function for drawing the colors of the nucleotides above the time scale
 ** every vertical section is colored bottom to top corresponding to the color of the nucleotide sequence in the most occupied structure for that specific time point 
 * 
 */
function createScaleColors(timesvg, tSW, seqlen, mostocc, tScale, nScale){  
    mostocc.forEach((el, i) => {
        const end = (i < mostocc.length-1) ? tScale(mostocc[i+1][0]) : tSW;
        timesvg.insert("g", ":first-child") // move rectangles into the background
            .selectAll(".rectculoare"+i)
            .data(el[1].colors)
            .enter()
            .append("rect")
            .attr(`class`, 'rectculoare'+i)
            .attr("id", (d, j) => "rectculoare" + el[0] + d + j)
            .attr("width", end - tScale(el[0]))
            .attr("height", 80/seqlen)
            .attr("transform", (d,k)=> `translate(${+tScale(el[0])},${nScale(k)+10})`)
            .attr("fill", (d) => {return `${(d)}`; })
    });
}

/**
 * Method for drawing a circle on the combined scale for every time point present in the file 
 */   
function drawCirclesForTimepoints(nestedData, tScale) {
    const timePoints = nestedData.map(d => +d[0]);
    d3.select("#timesvg").selectAll('.timePoint').remove();
    d3.select("#timesvg").selectAll('.timePoint').data(timePoints)
        .enter()
            .append('circle')
                .attr('class', 'timePoint')
                .attr('cx', d => tScale(d))
                .attr('cy', 91)
                .attr('r', 1)
                .attr('fill', 'black')
                .attr('stroke', 'black')
                .attr('strokeWidth', 0);
}

/**
 * Function for extracting the list of structures to plot for the selected time point
 * @param {number} time selected time point
 * @returns {Array} List of structures to plot for the selected time point
 */  
function StructuresToPlot(nestedData, time){
    const foundElement = nestedData.find(element => +element[0] === +time);
    return foundElement ? foundElement[1] : null;
}

/**
 * Mathod for showing a line at the current selected coordinates
 * @param {number} coord the x-coordinate on the visual container of the selected time point 
 * @param {string} color the color of the line, red by default
 */  
function showLine(timesvg, coord, color="red") {
    timesvg.selectAll(".currenttimeLine").remove()
    timesvg.append("line")
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
function WriteTable(strToPlot, mostocc, sequence) {
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
 * @returns {Array} The list of plotted structures, as the ones that were now
 * previously plotted
  */   
function ensPlot(strToPlot, eCW, eCH, seqlen, sequence) { 
    const treemapData = makeTreemapData(strToPlot);
    let root = d3.stratify()
        .id(function(d) { return d.name })   
        .parentId(function(d) { return d.parent })
        (treemapData)
        .sum(d => +d.value)
        .sort((a, b) => b.value - a.value);

    d3.treemap()
        .size([eCW, eCH])
        .padding(4)(root)

    let containers = {}

    let ensContainer = d3.select('#ensemblevis');
    ensContainer.select("#treemapdiv").remove()
    let zoom = false;
    ensContainer.append("div")
        .attr("id", "treemapdiv") 
        .style("width", `${eCW}px`)
        .style("height", `${eCH}px`)
        .selectAll(".svg")
        .remove()
        .data(root.leaves())
        .enter()
        .append("svg")
        .attr("class", "plot")
        //.style('background-color', 'white')
        .style("z-index", 1)
        .attr("id", d => { return "svg" + d.data.name })
        .on("mouseover", (e, d) => { // show occupancy
            d3.select("#treemapdiv").append("div")
                .attr("class", "infodiv")
                .html(d.data.value)
                .style('left', () => { return `${d.x0+30}px`; })
                .style('top', () => { return `${d.y0}px`; })
                .style("z-index", 3); 
        })    
        .on('mouseout', (e, d) => {  
            d3.select(".infodiv").remove()
        }) 
        .on("click", (e, d) => {
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
                    .style('left', d => { return `${0}px`; })
                    .style('top', d => { return `${0}px`; })
                    .style("z-index", 3)
            } else {
                zoom = false
                d3.select(".help").remove()
                return c.style('left', d => { return `${d.x0}px`; })
                    .style('top', d => { return `${d.y0}px`; })
                    .style("z-index", 1)
                    .style('width', d => { return `${(d.x1 - d.x0)}px`; })
                    .style('height', d => { return `${(d.y1 - d.y0)}px`; })
            }
        })
        .style('position', 'absolute')
        .style('left', d => { return `${d.x0}px`; })
        .style('top', d => { return `${d.y0}px`; })
        .style('width', d => { return `${(d.x1 - d.x0)}px`; })
        .style('height', d => { return `${(d.y1 - d.y0)}px`; })
        .style("stroke", "black")
        .style("fill", "#62b6a2")
        .style("border", "thin solid black")
        .append("text")
        .attr("x", 2) // move to the right
        .attr("y", 12) // move lower
        .text( d => { return d.data.name })
        .attr("font-size", "0.8rem")                            
        .each( d => {
            let rectname = "svg" + d.data.name
            if ( d.data.str != '' ) {
                containers[rectname] = getFornaContainer(rectname, 
                    sequence, d.data.str, d.data.colors)
            }     
        });

    let Sum_of_occ = Math.round(root.value*100000)/100000
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
}

/**
 * Function for making a treemap structure out of the data 
 * @param {Array} data the data 
 * @returns {Array} The treemap hierarchical structure, in our case with only one level of hierarchy
  */ 
function makeTreemapData(data) {
    return [{ name: "parent", parent: null, value: 0, str: "", colors: "" },
        ...data.map(el => ({ 
            name: el.id, 
            parent: "parent", 
            value: el.occupancy, 
            str: el.structure, 
            colors:formatColors(el.colors) 
        }))
    ]
}

/**
 * Function for visulizing  a HTML element in  fullscreen mode, used on fullScreenContainer upon Fullscreen button click 
 ** thanks to https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
 * @param {string} elem the name of the container to be visualized in fullscreen
 * 
 */

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

function findMaxNoStr(nestedData) {
    return nestedData.reduce((maxNoStr, el) => {
        const noStr = el[1].length;
        return noStr > maxNoStr ? noStr : maxNoStr;
    }, 0);
}


/**
 * Function for showing the data, which consists mostly of calls of previously defined functions and the mouse events
 * @param {Array} data the parsed content of the input file
 */
function ShowData(data, timepoint, seqname, sequence) {
    console.log('calling ShowData', timepoint, seqname, sequence)

    // shall we also initialize the treemap, etc?
    const [vCW, vCH, eCW, eCH, tSW] = initialize()

    // get some basic properties from the full data.
    const seqlen = data[data.length - 1].structure.length;
    const [t0, tlog, t8, cotr] = get_critical_timepoints(data, seqlen);

    // Set occupancy threshold and filter data, ...
    const occ = document.getElementById("occupancy")
    const filteredData = data.filter((d) => { return +d.occupancy > +occ.value}) 
    const nestedData = Array.from(d3.group(filteredData, d => +d.time)) 

    const maxNoStr = findMaxNoStr(nestedData)

    const [timesvg, tScale, itScale, nScale, mostocc] = init_time_control_panel(
        filteredData, nestedData, vCW, tSW, t0, tlog, t8, seqlen, cotr);

    // now render the timepoint
    if (timepoint == null) {
        timepoint = d3.min(filteredData, d => +d.time);
    } else if (StructuresToPlot(nestedData, timepoint) === null) {
        // jump to the previous timepoint
        let newtimepoint = null;
        nestedData.forEach(d=> {
            if (+d[0] <= +timepoint) {
                newtimepoint = +d[0];}
        })
        // for (let i = 0; i < nestedData.length; i++) {
        //     const currentTime = +nestedData[i][0];
        //     if (currentTime <= +timepoint) {
        //         newtimepoint = currentTime;
        //     } else {
        //         break;
        //     }
        // }
        timepoint = newtimepoint
    }

    showLine(timesvg, tScale(timepoint)) 
    let strToPlot = StructuresToPlot(nestedData, timepoint);
    ensPlot(strToPlot, eCW, eCH, seqlen, sequence)
    WriteTable(strToPlot, mostocc, sequence) 
    let [strToPlotprev, timeprev] = [strToPlot, timepoint]

    let mousetime = 30; // the beginning of the plot
    let mouseactive = false;
    let delayPLOT = undefined;
    timesvg.on("mousemove", (event) => {
        if (playAnimation) return;
        if (!mouseactive) return;
        let mx = d3.pointer(event)[0];
        mousetime = itScale(mx)
        if (mx >= 30 && mx <= tSW) {
            showLine(timesvg, mx)
        }
        for (let d of filteredData) {
          if (d.time <= mousetime) {
            timepoint = d.time;
          }
        }
        if (timepoint != timeprev) {
            strToPlot = StructuresToPlot(nestedData, timepoint);
            if (strToPlot != strToPlotprev) {
                if (delayPLOT) clearTimeout(delayPLOT);
                delayPLOT = setTimeout(ensPlot, 5*maxNoStr, strToPlot, eCW, eCH, seqlen, sequence);
                WriteTable(strToPlot, mostocc, sequence) 
                strToPlotprev = strToPlot
            }
            timeprev = timepoint
        }
    })

    timesvg.on("click", (event) => {
        if (playAnimation) { playAnimation = !playAnimation }
        mouseactive = !mouseactive;
        mousetime = itScale(d3.pointer(event)[0])
        if (d3.pointer(event)[0] >= 30 && d3.pointer(event)[0] <= tSW) {
            showLine(timesvg, d3.pointer(event)[0])
        }
        for (let d of filteredData) {
          if (d.time <= mousetime) {
            timepoint = d.time;
          }
        }
        if (timepoint != timeprev) {
            strToPlot = StructuresToPlot(nestedData, timepoint);
            if (strToPlot != strToPlotprev) {
                ensPlot(strToPlot, eCW, eCH, seqlen, sequence)
                WriteTable(strToPlot, mostocc, sequence) 
                strToPlotprev = strToPlot
            }
            timeprev = timepoint
        }
    })

    // index of the element with current time point in nested data, used for
    // the animation, such that all time points in the data are considered
    let elementIndex = 0;
    const speed = document.getElementById("playspeed")
    let play = d3.select("#toggleAnimation");
    play.on("click", () => {
        playAnimation = !playAnimation
        nestedData.forEach(element => {
            if (+element[0] === +timepoint) {
                elementIndex = nestedData.indexOf(element) + 1
            }
        if (elementIndex==nestedData.length){
            elementIndex = 0;
        }
        }) 
        let ToogleAnimation = setInterval(() => {
            if (!playAnimation) {
                clearInterval(ToogleAnimation);
                return
            }
            if (elementIndex >= nestedData.length) {
                elementIndex = 0;
                playAnimation = false;
                return
            }
            const element = nestedData[elementIndex];
            timepoint = +element[0]
            strToPlot = StructuresToPlot(nestedData, timepoint);
            if (strToPlot != strToPlotprev) {
                ensPlot(strToPlot, eCW, eCH, seqlen, sequence)
                WriteTable(strToPlot, mostocc, sequence) 
                strToPlotprev = strToPlot
            }
            showLine(timesvg, tScale(timepoint))
            elementIndex += 1;
            timeprev = timepoint;
        }, speed.value);
    })
    let next = d3.select("#NextTime");
    next.on("click", () => {    
        nestedData.forEach(element => {
            if (+element[0] === +timepoint) {
                elementIndex = nestedData.indexOf(element) + 1
            }
        }) 
        if (elementIndex >= nestedData.length) {
            elementIndex = 0;
        }
        const element = nestedData[elementIndex];
        timepoint = +element[0]
        strToPlot = StructuresToPlot(nestedData, timepoint);
        if (strToPlot != strToPlotprev) {
            ensPlot(strToPlot, eCW, eCH, seqlen, sequence)
            WriteTable(strToPlot, mostocc, sequence) 
            strToPlotprev = strToPlot
        }
        showLine(timesvg, tScale(timepoint))
        timeprev = timepoint
    })
    let prev = d3.select("#PrevTime");
    prev.on("click", () => {    
        nestedData.forEach(element => {
            if (+element[0] === +timepoint) {
                elementIndex = nestedData.indexOf(element) - 1
            }
        }) 
        if (elementIndex == -1) {
            elementIndex = nestedData.length-1;
        } 
        const element = nestedData[elementIndex];
        timepoint = +element[0]
        strToPlot = StructuresToPlot(nestedData, timepoint);
        if (strToPlot != strToPlotprev) {
            ensPlot(strToPlot, eCW, eCH, seqlen, sequence)
            WriteTable(strToPlot, mostocc, sequence) 
            strToPlotprev = strToPlot
        }
        showLine(timesvg, tScale(timepoint))
        timeprev = timepoint
    })

    const schange = () => {
        console.log('New ms/frame value:', speed.value);
    };
    speed.removeEventListener('change', schange); 
    speed.addEventListener('change', schange);

    const ochange = () => {
        console.log('New maximum occupancy value:', occ.value);
        ShowData(data, timepoint, seqname, sequence)
    };
    occ.removeEventListener('change', ochange); 
    occ.addEventListener('change', ochange);

    // Update Sequence TODO: ensPlot?
    let bsload = d3.select("#seqload")
    bsload.on('click', function() {
        playAnimation = false;
        let stext = document.getElementById("seqtext");
        const [seqname, sequence] = parse_fasta(stext.value);
        ShowData(data, timepoint, seqname, sequence);
    });

    let bdload = d3.select("#downloadButton")
    bdload.on("click", () => {
        playAnimation = false;
        downloadSVG(seqname, timepoint);
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
        delayResize = setTimeout(ShowData, 300, data, timepoint, seqname, sequence);
    };
    let  hlink = document.getElementById('helplink');
    hlink.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent the default link behavior
      const url = hlink.href;
      window.open(url, '_blank');
    });
    let gitlink = document.getElementById('githublink');
    gitlink.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent the default link behavior
      const url = gitlink.href;
      window.open(url, '_blank');
    });
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
    document.getElementById("tabTable")
    .addEventListener("click", function() {opennewtab();}, false);
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

function opennewtab() { 
    const x = document.getElementById("datatable").outerHTML;
    const newTab = window.open();
    newTab.document.write(x);
    const y =  newTab.document.getElementById("datatable")
    y.style.display = "block"; 
  
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

            ShowData(drfdata, null, seqname, sequence);
    }).catch(error => {
        throw error
    });
}

/**
 * Method for reading drf input from an uploaded file.
 * (Automatically clears sequence information.)
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
            ShowData(data, null, '', '');
        };
        let st = document.getElementById("seqtext")
        st.value = "";
        st.title = "Provide sequence input in fasta format.";
        st.style.borderColor = 'black';
        reader.readAsText(file);
    });
}

/**
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
