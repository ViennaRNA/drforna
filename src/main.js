

import * as d3new from "d3"
import * as domtoimage from "dom-to-image"
import {FornaContainer, RNAUtilities} from 'fornac';
//@ts-check

var rnaUtilities = new RNAUtilities();
/**
 * containers containing the secondary structure graphs 
 * 
 */

let containers;
/**
 * Occupancy Treshhold, structures with smaller occupancy will not be shown, 0.01 by default
 * @type {number}
 */
const occupancyTreshold = 0.01
//displays loading indicator

/**
 * Prepares the plotting area:
 ** removes the previous content 
 ** creates the visual container containing the treemap
 ** create the table container containing the structures for the selected time point
 * @param {string} elementName the name of the HTML element
 * @param {string} notificationContent the notification to appear
 
 */
function preparePlotArea(elementName, notificationContent = 'Loading...') {  
        //remove the previous content
    let container = d3new.select(elementName)
    container.selectAll('div')
        .remove()
    //display loading indicator
    container.style('text-align', 'center')
        .append('div')
        .attr('id', 'loadingNotification')
        .style('display', 'inline')
        .html(notificationContent)
    // create the visual container containing the treemap
    container
        .append('div')
        .attr('id', 'visContainer')
        .attr("height", 500)
    // create the table container containing the structures for the selected time point
    container
        .append('div')
        .attr('id', 'tableContainer')
        .html(" <p>and time table container-most populated structure</p>")
}

/**
 * Current file name (selected or uploaded)
 ** will be used for generating the name of the downloaded image
 * @type {string}
 */
let filename=""


/**
 * Method that starts the visualization: 
 ** reads and shows the data from selected or uploaded file
 */
function start() {
    prevtime = null
    nestedData = null
    
    readFromFileRadio();
    readFromFileUpload();
} 
 /**
     * 
    * method for reading the input from a selected file and then showing the data by calling ShowData
    * 
    */  
function readFromFileRadio(){
    filteredData=null
    nestedData=[]
    //read selected example 
    document.querySelectorAll('.forminput').forEach((item) => {
        item.addEventListener('change', (event) => {
            document.querySelectorAll('.fileinput').forEach((item)=>{item.lastElementChild.value=""})
             filename = item.lastElementChild.value
             
       // filename=fileName
            let a = []
            d3new.text(filename).then(d => {
                a = d3new.csvParse(d.replace(/ +/g, ",").replace(/\n,+/g, "\n").replace(/^\s*\n/gm, ""))
                containers = {};
                let container = d3new.select("#visContainer")
                container.remove()
               
                ShowData(Array.from(a))
            })
        })
    })

    
}
 /**
     * 
    * method for reading the input from an uploaded file and then showing the data by calling ShowData
    *  
    */  
function readFromFileUpload(){
    filteredData=null
    nestedData=[]
    document.querySelectorAll('.fileinput').forEach((item) => {
    item.addEventListener('change', (event) => {
        let rb=document.querySelectorAll('input[type=radio][name=fileinput]:checked')
        //console.log(rb)
        if (rb.length!=0)
            {rb[0].checked=false}
    
   
       let files = event.target.files
        filename=files[0].name
        //console.log(filename)
       //console.log(files)
       
        for (let i = 0, f; f = files[i]; i++) {
            let reader = new FileReader()
            reader.onload = (val) => {                                   
               let a=[]
              //console.log(val.target.result.replace(/ +/g, ",").replace(/\n,+/g, "\n").replace(/^\s*\n/gm, ""))
               a = d3new.csvParse(val.target.result.replace(/ +/g, ",").replace(/\n,+/g, "\n").replace(/^\s*\n/gm, "")) 
               //console.log(a)
               //a = d3new.csvParse(a.replace("\n,", "\n"))    
                containers = {}; 
                

               ShowData(a)
            }            
            reader.readAsText(f);
        }
    });
 })
}

/**
 * Function for downloading the content of the container,
 ** the name of the downloaded file is generated using the name of the current selected file, the current time and the current date. 
 ** also dispays a notification when the file was downloaded
 * @param {string} elem name of the container
 
 */
function downloadPng() {
   
    //console.log('Downloading... ')
    domtoimage.toPng(document.getElementById("drTrafoContainer"))
    .then(function (dataUrl) {
        let link = document.createElement('a');
        let today = new Date()
        let date = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
        let time = today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();
       
        link.download = filename+"_"+date+"_"+time+'.png';
        alert("File "+link.download+" was downloaded")
        link.href = dataUrl;
        link.click();
        

    });
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
let scalel;
/**
 * the svg containing the scales
 * 
 */
let svg;
/**
 * the selected time point
 * @type {float}
 */
let realtime;
/**
 * the previous time point, to check if anything changed before unnecessarly reploting
 * @type {float}
 */
let prevtime=null
/**
 * the list of structures for the previous selected time point, to verify if anything changed
 * @type {float}
 */
let strtoPlotprev=null;
/**
 * full length of the sequence considered
 * @type {integer}
 */
let sequenceLength = null;
/**
 * Boolean variable to show if the mouse is active
 * @type {boolean}
 */
let mouseactive=false;
/**
 * width of the visual container, changed when window is resized
 * @type {integer}
 */
let visContainerWidth=800

/**
 * width of the scale, 98% of the container width
 * @type {integer}
 */
let lineChartWidth = visContainerWidth * .98; 
/**
 * table container, for the table containing the summary of the file for the selected time point
 * @type {object}
 */
let tableContainer=null
/**
 * visual  container, containing the plots and the scales
 * @type {object}
 */
let viscontainer=null 


/**
 * Method for initialization based on the data
 ** determine sequence length
 ** initialize containers 
 ** set mouse as not active 
 * 
 * @param {Array} data The input data read form the file
 */

function initialize(data){
    containers = {};
    //start at the beginning, initialize  
    prevtime = null
    strtoPlotprev = null
    sequenceLength = data[data.length - 1].structure.length; //length of the transcribed sequence, used for seeing when the transcription ends
    filteredData=null
    nestedData=[]
    //for resizing with window resize
    visContainerWidth = d3new.select('#visContainer').node().getBoundingClientRect().width; 
    
    lineChartWidth = visContainerWidth * .98; 
    tableContainer = d3new.select(`#tableContainer`);
    tableContainer.selectAll("svg").remove()
    mouseactive=false
    
    viscontainer = d3new.select('#visContainer')
    viscontainer.append('div').attr('id','treemapdiv').style('height', '500px')
    
}
/**
 * filtered data, only those structured with occupancy greater than the treshhold
 * @type {Array}
 */
let filteredData=null
/**
 * nested data, filtered data grouped by timepoint
 * @type {Array}
 */
let nestedData=[]
/**
 * transcription steps, identified as the steps until the structure has full length
 * @type {Array}
 */
 let trascriptionSteps=[] 
 /**
 * steps after transcription ends
 * @type {Array}
 */
 let AfterTrascription=[]
 /**
 * maximal number of structural alternatives
 * @type {integer}
 */
 let maxNoStr=0

/**
 * Method for splitting the data into transcription steps and steps after transcription, 
 *  and identifying the maximal number of  structural alternatives that appear  
 * @param {Array} nestedData The input data read form the file, grouped by time
 * @returns {Array} trascription steps
 * @returns {Array} Steps after trascription
 * @returns {integer}  maximal number of structural alternatives
 */
 function SplitTranscription(nestedData){
    // having the sequence length at the end, the end of transciption is identified as the first time step where the structures of that length occur
     trascriptionSteps=[] 
     AfterTrascription=[]
     maxNoStr=0
    nestedData.forEach(el=>{
        if (el[1].length>maxNoStr){
        maxNoStr=el[1].length //detect how many alternatives apear maximally 
        }
        if (el[1][0].structure.length<sequenceLength){ //if the structure is not at full length
                trascriptionSteps.push(el) //retain time as transcription step 
        }
        else{
                AfterTrascription.push(el) //otherwise it is a time step after thascription end
            }
    })
    trascriptionSteps.push(AfterTrascription[0]) //the end of transcription is added in both lists
    //AfterTrascription.push(trascriptionSteps[trascriptionSteps.length-1])
    //console.log(trascriptionSteps)
    //console.log(AfterTrascription)
    return   trascriptionSteps,  AfterTrascription, maxNoStr
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
  * the rainbow color scale  
  */
let rainbowScale 
 /**
  * the first time point in the current file   
  */
let mintime
/**
  * the list containing the most occupied structure for each time point
  */
let mostocc
let mostoccupiedpertime
/**
  * the time at which the transcription ends   
  */
let maxlintime
/**
  *Function determining  the most occupied structure for each time point
  * @returns {Array}  the list containing the most occupied structure for each time point
  */
 function mostOccupiedperTime()   {
            mostoccupiedpertime=[]
            nestedData.forEach(el=>{  
                let best=el[1][0]
                let all=el[1]
                all.forEach(e=>{ //console.log(best.occupancy, "   " ,e.occupancy)
                    if (e.occupancy>=best.occupancy){best=e}})
                mostoccupiedpertime.push([el[0], best])
                })    
            let mostocc=[mostoccupiedpertime[0]]
            //console.log(mostoccupiedpertime)
            mostoccupiedpertime.forEach((el,i)=>{
                //console.log(mostocc[mostocc.length-1][1].id,"  ", el[1].id)

                if (el[1].id!=mostocc[mostocc.length-1][1].id){
                    mostocc.push([el[0], el[1]])
                }
            })
            return mostocc
    }

/**
 * function  for creating the scales, and determinining the start and end of transcription
 * @returns {Object} the combined Scale  
 * @returns {Object} rainbow Scale
 * @returns {float} first time point in the file
 * @returns {float} time of the end of transcription 
 */
function CreateScales(){
        
        //I use filtered data to ignore time steps in which all stuctures are with ocuppancy smaller than threshhold
         mintime = d3new.min(filteredData, d => +d.time) // I use the +(0) to automatically convert to Number, otherwise it would be string
        let minlintime=d3new.min(trascriptionSteps, d=>+d[0])
        let maxlintime=d3new.max(trascriptionSteps, d=>+d[0])
        //console.log("time", minlintime, maxlintime)
        let minlogtime=d3new.min(AfterTrascription, d=>+d[0])
        let maxlogtime=d3new.max(AfterTrascription, d=>+d[0])
        //console.log(minlogtime, maxlogtime)
        prevtime = mintime
        tableContainer.selectAll("p").remove()
        tableContainer.selectAll("#timesvg").remove()
    
        scalel = d3new.scaleLinear() //the linear scale
                    .domain([minlintime, maxlintime]) 
                    .range([30, (lineChartWidth-30)*.75]) //will always occupy 75% of the scale

        logscale = d3new.scaleLog() //    LOG SCALE, treat 0 as exception still TO DO!!!!!
                        .domain([maxlintime, maxlogtime+0.001])
                        .range([(lineChartWidth - 30) * .75, lineChartWidth - 30]) //the last 25% will be occupied by the log scale
        // console.log(logscale)

        combinedScale = time => time < maxlintime  //define the combined scale that identifies on which scale we are
            ? scalel(time)  //if time is lower that the maximal linear time  we are on the linear scale
            : logscale(time); //else on the log scale

        svg = d3new.select("#tableContainer")
            .append("svg")
            .attr("width", lineChartWidth)
            .attr("height", 120)
            .attr("id", "timesvg"); //create the svg containing the scales
        
        //the lin and log scale on the bottom, positions were defined
         x_axislog = d3new.axisBottom()
            .scale(logscale);
         x_axislin = d3new.axisBottom()
            .scale(scalel);
        //and the vertical nucleotide  
         nucleotideScale = d3new.scaleLinear()
            .range([80, 0]);
                        

        //Append group and insert axes
        nucleotideScale.domain([0, sequenceLength]);
         y_axis = d3new.axisLeft()
            .scale(nucleotideScale)
        
            
         rainbowScale = (t) => { //console.log(t/ sequenceLength)
            return d3.hcl(360*t, 100, 55 ); 
            //return d3.hcl(360* t/(sequenceLength), 100* t/(sequenceLength), 55); 
        // return d3.hcl(360* t, 100, 55); 
        };
        
        return combinedScale, rainbowScale, mintime, maxlintime
}

/**
 * Mathod  for drawing the scales
 * 
 */   
function drawScales(){
    svg.append("g").attr("width", lineChartWidth)
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
function createScaleColors(){  
        mostocc.forEach((el,i)=>{
                let end=0
                if (i== mostocc.length-1){
                    end=lineChartWidth-30
                }
                else{
                    end=combinedScale(mostocc[i+1][0])
                }
                
                svg.selectAll(".rectculoare"+i)
                    .data(el[1].colors)
                    .enter()
                    .append("rect")
                    .attr(`class`,'rectculoare'+i)
                    .attr("id", (d,j)=> "rectculoare"+el[0]+d+j)
                    .attr("width",end-combinedScale(el[0]))
                    .attr("height", 80/sequenceLength)
                    .attr("transform", (d,k)=> `translate(${+combinedScale(el[0])},${nucleotideScale(k)+10})`)
                    .attr("fill", (d) => {return `${(d)}`; })
                    .each(function(d,i) {//console.log("ha"+d+"ind "+i)
                    })
    
        })
}   
/**
 * Method for drawing a circle on the combined scale for every time point present in the file 
 */   
function drawCirclesForTimepoints(){
    const timePoints = nestedData.map(d => +d[0]);
    
    d3new.select("#timesvg").selectAll('.timePoint').remove();
    d3new.select("#timesvg").selectAll('.timePoint').data(timePoints)
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
function ShowEndOfTranscriptionLine(){
    svg.append("line") //append black line to mark end of transcription
        .attr("class", "transcriplengthLine")
        .attr("x1", scalel(maxlintime))  
        .attr("y1", 0)
        .attr("x2", scalel(maxlintime))  
        .attr("y2", 120)
        .style("stroke-width", 1.5)
        .style("stroke","black")
       .style("fill", "none");
}

        // function timer(lap){ 
        //     if(lap) console.log(`${lap} in: ${(performance.now()-timer.prev).toFixed(3)}ms`); 
        //     timer.prev = performance.now();
        // }

/**
 *  Debounce function that, as long as it continues to be invoked, will not be triggered.
 * @param {Function}  func Name of the function 
 * @param {integer} time Time in milliseconds to wait before the function gets called, 100 by default
 * @returns {Function} 
 */

 function debounce(func, time){
    var time = time || 100; // 100 by default if no param
    var _timer;
    return function(event){
        if (_timer) clearTimeout(_timer);
        _timer = setTimeout(func, time, event);
    };
}

/**
 * List of structures to plot for the selected time point
 */  
let strToPlot;
/**
 * Function for extracting the list of structures to plot for the selected time point
 * @param {float} time selected time point
 * @returns {Array} List of structures to plot for the selected time point
 */  
function StructuresToPlot(time){
    strToPlot=[]
    nestedData.forEach(element => {
        if (element[0] == time) {
            strToPlot = element[1] 
            } 
        })
    return strToPlot
}
let elementIndex = 0;
/**
 * Animation delay for the play button, time in miliseconds between consecutive plots
 * @type {integer}
 */  
const animationDelay = 10;

/**
 * delay for the plot, to avoid plotting all intermediate stages if the mouse already moved further
 *  
 */  
let delayPLOT = undefined;
/**
 * Boolean for determining if the play button is active 
 * @type {boolean} 
 */  
let playAnimation = false;
/**
 * Mathod for showing a line at the current selected coordinates
 * @param {integer} coord the x-coordinate on the visual container of the selected time point 
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
        .style("stroke-width", 1)
        .style("stroke",color)
        .style("fill", "none");
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
function WriteTable(strToPlot){
                var colnames = ['ID',// 'Time', 
                'Occupancy', 'Structure', 'Energy'];    
    
                d3new.select("#tableContainer")
                    .selectAll("table").remove()
                d3new.select("#tableContainer")
                    .selectAll("time").remove()
                let time=d3new.select("#tableContainer").append("time")
                .style("font-family", "DejaVu Sans Mono")
                let structures = d3new.select("#tableContainer").append("table")
                    .style("font-family", "DejaVu Sans Mono")
                let ttime = time.append("thead").append('tr')
                ttime.append("td").text("Selected time point: "+strToPlot[0].time+" s")
                let th = structures.append("thead")
                th.append('tr').selectAll('th')
                            .data(colnames).enter()
                            .append('th')
                            .text(function (column) { return column; });
                let tbody = structures.append('tbody')
                let tr = tbody.selectAll("tr")
                      .data(strToPlot)
                      .enter()
                      .append("tr").attr("class", "tableData")
                      .selectAll("td")
                      .data(d => {
                          return [{column:"id", value:d.id},//{column:"time", value: d.time},
                                  {column:"oc", value:Math.round(d.occupancy*1000)/1000}, 
                                  {column:"str", value:d.structure, col:d.colors},{column:"en", value: d.energy}]//, {column:"col", value:d.colors}]
                      })
                      .enter()
                tr.each((dd,j) =>{
                    if (dd.column == "id") {
                         tbody.append("tr")
                        
                    }                
                    if (dd.column=="str") {                   
                        let tb=tbody.append("td")
                        tb.selectAll('span').remove()
                        for (let i = 0; i < dd.value.length; i++) {
                          tb.append('span')
                          .style('background-color',dd.col[i])
                          .text(dd.value[i])
                        }
                    }
                    else  if (dd.column!="str") {
                         if(dd.column=="id"){
                             //console.log(mostocc)
                             //console.log(mostoccupiedpertime)
                            let bestid
                            mostocc.forEach(e=>{
                                if (+e[0]<=+strToPlot[0].time){
                                    bestid=e[1].id
                                }
                            })
                            if( dd.value==bestid){
                                        tbody.append("td").text(dd.value).style('background-color',"rgb(247, 200, 194)")
                                        //console.log("colored")
                            }
                            else {
                                    tbody.append("td").text(dd.value)
                                
                            }
                        } else
                        tbody.append("td").text(dd.value)
                    }
                })
            }
          
/**
 * Function for plotting the treemap containing the structures, as well as writing the table
 * @param {float} realtime the selected time (as present in the file) 
 * @returns {Array} The list of plotted structures, as the ones that were now previously plotted
  */   
function PLOT(realtime) {   
            strToPlot = StructuresToPlot(realtime)
            if (strtoPlotprev != strToPlot) {
                const treemapData = makeTreemapData(strToPlot);
                const svgWidth = lineChartWidth
                const svgHeight = 500
                var root = d3new.stratify()
                    .id(function (d) { return d.name; })   // Name of the entity (column name is name in csv)
                    .parentId(function (d) { return d.parent; })   // Name of the parent (column name is parent in csv)
                    (treemapData);
                root.sum(d => +d.value)   // Compute the numeric value for each entity
                d3new.treemap()
                    .size([svgWidth, svgHeight])
                    .padding(4)
                    (root)
                viscontainer.select("#treemapdiv").remove()
                viscontainer.append("div").attr("id", "treemapdiv") 
                            .style('position', 'relative')
                            .style("width", `${svgWidth}px`)
                            .style("height", `${svgHeight}px`)
                            .selectAll(".svg").remove() // leave out
                            .data(root.leaves())
                            .enter()
                            .append("svg").attr("id",   d => { return "svg"+d.data.name})                        
                            .style('position', 'absolute')
                            .style('left',  d =>{ return d.x0; })
                            .style('top',  d => { return d.y0; })
                            .style('width',  d => { return (d.x1 - d.x0); })
                            .style('height',  d => { return (d.y1 - d.y0); })
                            .style("stroke", "black")
                            .style("fill", "#62b6a2")
                            .style("border", "thin solid black")
                            .append("text")
                            .style('position', 'relative')
                            .attr("x", 1)    //  to adjust position (to the right)
                            .attr("y", 10)    //  to adjust position (lower)
                            .text( d => { return d.data.name })
                            .attr("font-size", "12px")
                            .attr("font-family", "DejaVu Sans Mono")
                            .attr("fill", "white")
                            .each( d => {
                                let rectname="svg"+d.data.name
                                if ( d.data.str != '') {
                                    containers[rectname] = new FornaContainer('#' + rectname,{zoomable:false, editable:false,animation:false, 
                                        transitionDuration:0});
                                    containers[rectname].transitionRNA(d.data.str);  
                                    let colorStrings = d.data.colors.map(function(d, i) {
                                        return `${i+1}:${d}`;
                                    });
                                    let colorString = colorStrings.join(' ');
                                    containers[rectname].addCustomColorsText(colorString);              
                                }     
                            });
                WriteTable(strToPlot) 
            }
            
            strtoPlotprev=strToPlot
            
            return strtoPlotprev    
}
/**
 * Function for making a treemap structure out of the data 
 * @param {Array} data the data 
 * @returns {Array} The treemap hierarchical structure, in our case with only one level of hierarchy
  */ 
function makeTreemapData(data) {
    return [
        { name: "parent", parent: null, value: 0, str:"", colors: "" },
        ...data.map(el => (
            { 
                name: el.id, parent: "parent", value: el.occupancy, str: el.structure, colors:formatColors(el.colors) }))
    ]
}
/**
 * Function which  determines the colors of each nucleotide according to the position of the stem that they're in
 ** get a pairtable and a list of the secondary structure elements
 ** store the colors of each nucleotide
 ** for each nucleotide in the stem assign it the stem's average nucleotide number
 ** and convert average nucleotide numbers to colors
 * @param {Array} data 
 */
function calculateNucleotideColors(data) {
    data.forEach(function(d, i) {
        // determine the colors of each nucleotide according to the position
        // of the stem that they're in
        // each 'd' is a line in the dr transfomer output
        d.time = +d.time;
        d.occupancy = +d.occupancy;

        // get a pairtable and a list of the secondary structure elements
        let pt = rnaUtilities.dotbracketToPairtable(d.structure);
        //console.log("pt", pt)
        let elements = rnaUtilities.ptToElements(pt, 0, 1, pt[0], []);
        //console.log("el",elements)
        // store the colors of each nucleotide
        let colors = Array(pt[0]).fill(d3.hsl("white"));
        //console.log(elements)
    

        for (let i = 0; i < elements.length; i++) {
            if (elements[i][0] != 's')
                continue;     //we're not interested in anything but stems

            // for each nucleotide in the stem
            // assign it the stem's average nucleotide number
            let averageBpNum = elements[i][2].reduce(
                (a,b) => { return a+b }, 0) / (elements[i][2].length);
               
            // convert average nucleotide numbers to colors
            elements[i][2].map((d) => {
                let nucleotideNormPosition = nucleotideScale(+averageBpNum);
                colors[d-1] = rainbowScale(nucleotideNormPosition);
                //console.log(elements[i], nucleotideNormPosition)
                //console.log(i, averageBpNum, nucleotideNormPosition,  colors[d-1])
            });


            // each structure gets its own set of structures
        }
        d.colors = colors;
        //console.log(colors)
    });
}
/**
 * Function for making an element fullscreen, used on fullScreenContainer upon Fullscreen button click 
 * thanks to https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
 * @param {string} elem the name of the container to be visualized in fullscreen
 * @returns {*}
 */
// 
function toggleFullScreen(elem) {
  if (!document.fullscreenElement &&    // alternative standard method
    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
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
        visContainerWidth = d3new.select('#visContainer').node().getBoundingClientRect().width; 
    } else {
        // exit fullScreen
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
 * @param {Array} data 
 */

function ShowData(data) { 

    preparePlotArea(drTrafoContainer); 
    initialize(data)
    prevtime = null
    let container = d3new.select("#drTrafoContainer");
    container.select('#loadingNotification').remove(); //remove the loading notification 
    const onResize = () => {
        //retain position we are at and if animation was on an remake plots accordingly!?? TODO?
        //maybe not delete everything but just resize
        playAnimation = false        
        tableContainer.selectAll("#timesvg").remove() //remove time scale
        //viscontainer.selectAll(".div").selectAll(".svg").remove() 
        viscontainer.selectAll("#treemapdiv").remove()//remove plots
        ShowData(data); // redraw plots
    }
    window.addEventListener("resize", debounce(onResize, 1000)); // when the window was resize, call the onResize function after 1000 ms

    filteredData = data.filter((d) => { return d.occupancy > occupancyTreshold }) // select structures with high enough occupancy
    nestedData = Array.from(d3new.group(filteredData, d => d.time)) // nest data by  time points to extract the structures to plot for every time step
    trascriptionSteps,  AfterTrascription, maxNoStr = SplitTranscription(nestedData)
    combinedScale, rainbowScale ,mintime, maxlintime= CreateScales();
    
    calculateNucleotideColors(filteredData) 
    mostocc = mostOccupiedperTime()
    //console.log(mostoccupiedpertime)
    createScaleColors()  
    drawScales()
    drawCirclesForTimepoints()
    if (prevtime == null){ prevtime = mintime }
    strToPlot = StructuresToPlot(prevtime)
    strtoPlotprev = PLOT(prevtime)
    showLine(combinedScale(prevtime)) 
    ShowEndOfTranscriptionLine()
    let mousetime=30

    svg.on("click", (event) => {
        if (playAnimation) {playAnimation=!playAnimation};
        mouseactive=!mouseactive;
        //scale invert for combined scale
        (d3new.pointer(event)[0]<scalel(maxlintime))
        ?mousetime = scalel.invert(d3new.pointer(event)[0]) 
        :mousetime= logscale.invert(d3new.pointer(event)[0])
      
        if (d3new.pointer(event)[0] >= 30 && d3new.pointer(event)[0] <= lineChartWidth-30) {
            showLine(d3new.pointer(event)[0])
        }
        for (let t in data) {
            if (data[t].time <= mousetime) { 
                realtime = data[t].time 
            }
        }
        if (prevtime != realtime) {
            prevtime = realtime
            PLOT(realtime)
        }
    })
    
    svg.on("mousemove", (event) => {
        
        if (playAnimation) return;
        if (!mouseactive) return;
        let x = d3new.pointer(event)[0];
        //let x = d3new.pointer(event, event.target)[0];
       
        //scale invert for combined scale
        (x <= scalel(maxlintime))
              ? mousetime = scalel.invert(x) 
              : mousetime = logscale.invert(x)
       // console.log(mousetime- scale.invert(x) )
        //console.log(mousetime)
        if (x >= 30 && x <= lineChartWidth-30) {
            showLine(x)
        }

        for (let t in data) {
            if (data[t].time <= mousetime) { 
                realtime = data[t].time 
            }
        }
        if (prevtime != realtime) {
            prevtime = realtime
            
            // timer()
            if (delayPLOT) clearTimeout(delayPLOT);
            delayPLOT = setTimeout(PLOT, 5*maxNoStr, realtime);
            
            // PLOT(realtime)
            // timer("mouse")
           // timer(1)
        }
    })
    let bfullscr = d3new.select("#toggleFullScreen")
    bfullscr.on('click', function() {
        toggleFullScreen(document.getElementById('fullScreenContainer'));
    })
    let bd = d3new.select("#downloadButton")
    bd.on("click", () => {
        if (playAnimation) {playAnimation=false};
      //console.log("down")
        downloadPng()})
    let play = d3new.select("#toggleAnimation");
    //
    play.on("click", () => {playAnimation = !playAnimation    
        
        nestedData.forEach(element => {
            if (+element[0] == +prevtime) {
                elementIndex=nestedData.indexOf(element)
                }
            }) 
        // ToogleAnimation( )

        // /**
        //  * Mathod for animation upon clicking the play button
        //  ** starts at the current time point (the first time point in the file OR the first to the left of the current selected one)
        //  ** goes through every time point present in the file and plots the structures (circles were drawn for these time points)
        //  *
        //  */  
        // function ToogleAnimation(){  
            
            setInterval(() => {
                if (!playAnimation) {//console.log("aici ");\\ ruleaza o data pe secunda, nu e foarte frumos...
                     
                    
                    return ;
                }
                if (elementIndex >= nestedData.length){            
                    elementIndex = 0;
                }
                const element = nestedData[elementIndex];
                //console.log(nestedData)
                
                prevtime = +element[0]
                PLOT(prevtime)
                showLine(combinedScale(prevtime))
                
                elementIndex += 1;
                
                return prevtime
            }, animationDelay);
           
        //}
            
    })
    
} 


start();
