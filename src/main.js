import * as d3new from "d3"
import { documentToSVG, elementToSVG, inlineResources, formatXML } from 'dom-to-svg'
import { saveAs } from "file-saver";

import {FornaContainer, RNAUtilities} from 'fornac';

/**
 * @file main.js
 * @author Anda Latif, Stefan Hammer, Peter Kerpediev, Stefan Badelt
 * @see <a href="https://github.com/ViennaRNA/drforna">DrForna</a>
 * @description Visualization of cotranscriptional folding.
 */  

/**
 * Instance of RNAUtilities form fornac
 */  
var rnaUtilities = new RNAUtilities();

/**
 * containers containing the secondary structure graphs 
 */
let containers;

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
    let container = d3new.select("#visualization")
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
 * Current file name (selected or uploaded)
 ** will be used for generating the name of the downloaded image
 * @type {string}
 */
let filename=""
/**
 * Current sequence, can be written in the text field or uploaded from a file
 * @type {string}
 */
let inputSeq=""
/**
 * Current sequence name, introduced by ">" on the first line in the text input or in the file
 * @type {string}
 */
let seq_name=""

/**
 * Function that loads an example for the visualization. 
 * @param {string} filename of drf input
 * @param {string} filename of fasta input
 */
function load_example(drffile, fafile){
    d3new.text(fafile).then(d => {
        a = d3new.csvParse(d)                
        seq_name = a.columns[0]
        console.log(Array.from(a)[0][seq_name])
        let se = Object.keys(Array.from(a)).map(function(key){
            return a[key][seq_name];                  
        }) 
        inputSeq = se.join("")
        document.querySelectorAll("#sequence")
            .forEach((item)=>{item.value=seq_name+"\n"+inputSeq})})
        .catch(() => {
            inputSeq = ""
            seq_name = ""
            document.querySelectorAll("#sequence").forEach((item)=>{item.value=""})
        })

    let a = []
    d3new.text(drffile).then(d => {
        a = d3new.csvParse(
                d.replace(/ +/g, ",").replace(/\n,+/g, "\n")
                 .replace(/^\s*\n/gm, ""))
        ShowData(Array.from(a), null, null)
        document.getElementById('drfinput')
            .addEventListener('change', () => {return false})
    })      
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
    load_example("grow.drf", "grow.fa")
    readFromFileUpload();
    readSequence()
} 

/**
  * 
  * method for reading the input from an uploaded file and then showing the
  * data by calling ShowData
  *  
  */  

function readFromFileUpload(){
  let item = document.getElementById('drfinput');
  item.addEventListener('click', (event) => {
    playAnimation = false;
    //event.target.value = "";
  });
  item.addEventListener('change', (event) => {
    // code for handling file upload
    document.querySelectorAll('#sequence').forEach((item) => {
      item.value = '';
    });
    inputSeq = '';
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (val) => {
      const data = d3new.csvParse(val.target.result.replace(/ +/g, ',').replace(/\n,+/g, '\n').replace(/^\s*\n/gm, ''));
        console.log(data)
      ShowData(data, null, null);
    };
    reader.readAsText(file);
  });
}
/**
     * 
    * method for reading the sequence, from the text field or from the file. 
    *  
    */  

function readSequence(){
    document.querySelectorAll('.seqfileinpc').forEach((item) => {    
        item.addEventListener('click', (event) => {playAnimation=false
            event.target.value=""
            document.querySelectorAll("#sequence").forEach((item)=>{item.value=""})
            //?? should I delete sequence, what if someone decided on not uploading 
       }) 
        item.addEventListener('change', (event) => {
            let files = event.target.files
            filename=files[0].name
            
            for (let i = 0, f; f = files[i]; i++) {
                let reader = new FileReader()
                reader.onload = (val) => {                                   
                    let a=[]
                    //console.log(val.target.result.replace(/ +/g, ",").replace(/\n,+/g, "\n").replace(/^\s*\n/gm, ""))
                    a = d3new.csvParse(val.target.result.replace(/ +/g, ",").replace(/\n,+/g, "\n").replace(/^\s*\n/gm, "")) 
                    seq_name=a.columns[0]
                    let se = Object.keys(Array.from(a)).map(function(key){
                                        return a[key][seq_name];})
                    inputSeq=se.join("")                
                    document.querySelectorAll("#sequence").forEach((item)=>{item.value=seq_name+"\n"+inputSeq})
                    
                }            
                reader.readAsText(f);
            } 
        })
     });
    

    document.querySelectorAll('.seqform').forEach((item) => {
        item.addEventListener('click', () => {playAnimation=false})
        item.addEventListener('change', (event) => {
            let input_text_array=event.target.value.trimEnd().trimStart().split("\n")
            if (input_text_array==""|| input_text_array=="")  {
                seq_name=""
                inputSeq=""
                event.target.value=""

            }
            if (">"==input_text_array[0][0]){
                seq_name= input_text_array[0].substring(1)
                inputSeq= input_text_array.slice(1, ).join("").replace(/ +/g, "")
                inputSeq=inputSeq.toUpperCase()
                event.target.value=">"+seq_name+"\n"+inputSeq
            }
            else{
                
                    seq_name=""
                    inputSeq= input_text_array.join("").replace(/ +/g, "")
                    inputSeq=inputSeq.toUpperCase()
                    event.target.value=inputSeq
            }            
        })
    })
}

/**
 * Function for downloading the content of the container,
 ** the name of the downloaded file is generated using the name of the current selected file, the current time and the current date. 
 ** also dispays a notification when the file was downloaded
//  * @param {string} elem name of the container 
 */
 function downloadsSVG() {
    function filter (node) {
        return (node.tagName !== 'i');
      }
    let tmddown=document.getElementById("visualization")

    // htmlToImage.toJpeg(tmddown)
    //     .then(function (dataUrl) {
            
    //         let link = document.createElement('a');
            let today = new Date()
            let date = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
            let time = today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();
           
            // link.download = filename+"_"+date+"_"+time+'.jpeg';
    //         link.href = dataUrl;
    //         link.click();
    //       });
    
		const svgDocument =elementToSVG(tmddown)
        //  documentToSVG(document)

		let svgString = new XMLSerializer().serializeToString(svgDocument)
        // svgString = formatXML(svgString) //try downloading drTrafoContainer without the table 
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
		
	saveAs(blob, `${filename+"_"+date+"_"+time}.svg`)
          
            
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
 * Boolean variable to show if the mouse is active
 * @type {boolean}
 */
let mouseactive=false;

/**
 * Method for initialization based on the data
 ** determine sequence length
 ** initialize containers 
 ** set mouse as not active 
 */
function initialize(){
    preparePlotArea(); 

    // Set the dimensions of everything in in the visualization area
    // changed that to be relative to fullscreen now, looking ok so far.
    let visContainer = d3new.select(`#fullscreen`).node()
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
 * @returns {Object} rainbow Scale
 * @returns {number} first time point in the file
 * @returns {number} time of the end of transcription 
 */
function CreateScales(vCW, tSW, lintimes, logtimes, seqlen){

    let minlintime=d3new.min(lintimes, d=>+d[0])
    let maxlintime=d3new.max(lintimes, d=>+d[0])
    let minlogtime=d3new.min(logtimes, d=>+d[0]) // this may come in handy later ...
    let maxlogtime=d3new.max(logtimes, d=>+d[0])

    linscale = d3new.scaleLinear()
        .domain([minlintime, maxlintime]) 
        .range([30, tSW * .75]) // occupy 75% of the scale
    logscale = d3new.scaleLog() 
        .domain([maxlintime, maxlogtime+0.001])
        .range([tSW * .75, tSW]) // occupy last 25% 

    // a function that takes the argument time and determines if its on the 
    // lin or log scale
    combinedScale = time => time < maxlintime ? linscale(time) : logscale(time); 

    let tableContainer = d3new.select(`#timetablevis`);
    tableContainer.selectAll("#timesvg").remove()
    svg = tableContainer
        .append("svg")
        .attr("width", vCW)
        .attr("id", "timesvg"); //create the svg containing the scales

    // the lin and log scale on the bottom, positions were defined
    x_axislin = d3new.axisBottom().scale(linscale);
    x_axislog = d3new.axisBottom().scale(logscale).ticks(5);
    // and the vertical nucleotide  
    nucleotideScale = d3new.scaleLinear().range([80, 0]);
    // Append group and insert axes
    nucleotideScale.domain([0, seqlen]);
    y_axis = d3new.axisLeft()
        .scale(nucleotideScale).ticks(5);

    let rainbowScale = (t) => { 
        return d3.hcl(360*t, 100, 55); 
    };
    return [combinedScale, rainbowScale, nucleotideScale, maxlintime]
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
 * delay for the plot, to avoid plotting all intermediate stages if the mouse already moved further
 *  
 */  
let delayPLOT = undefined;
/**
 * delay for the plot when resize, to avoid plotting all intermediate stages if the mouse already moved further
 *  
 */  
let delayResize = undefined;
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
    console.log(coord)
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
function WriteTable(strToPlot, mostocc){
    var colnames = ['ID', 'Occupancy', 'Structure' , 'Energy'];    

    d3new.select("#datatable")
        .selectAll("table").remove()
    let structures = d3new.select("#datatable").append("table")
    let th = structures.append("thead")
    th.append('tr').selectAll('th')
        .data(colnames).enter()
        .append('th')
        .text(function (column) { return column; })
        .append('th').style("text-align", "right")
        .text(function (column) { 
            if (column=="Structure"){
                return inputSeq.slice(0, strToPlot[0].structure.length) //
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
                // console.log(res)
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
function ensPlot(nestedData, realtime, eCW, eCH, seqlen, mostocc) { 
    console.log('ep', realtime)
    let strToPlot = StructuresToPlot(nestedData, realtime)
    console.log('ep2', realtime)
    console.log('ep2', strToPlot)
    console.log('ep2', strToPlot[0])
    if (strtoPlotprev != strToPlot) {
        const treemapData = makeTreemapData(strToPlot);
        let root = d3new.stratify().id(function(d) { return d.name})   
            .parentId(function(d){ return d.parent})(treemapData);
        root.sum(d => +d.value).sort((a, b) => b.value - a.value)  
        Sum_of_occ=Math.round(root.value*100000)/100000

        d3new.treemap()
            .size([eCW, eCH])
            .padding(4)(root)

        let ensContainer = d3new.select('#ensemblevis');
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
                    containers[rectname] = new FornaContainer('#' + rectname, {
                        zoomable: false, 
                        editable: false, 
                        animation: false,
                        displayNodeLabel: true,
                        transitionDuration: 0});
                    // Remove line if you don't want sequence info shown 
                    containers[rectname].addRNA(d.data.str,{"sequence": inputSeq} )
                    containers[rectname].transitionRNA(d.data.str);
                    let colorStrings = d.data.colors.map(function(d, i) {
                        return `${i+1}:${d}`;
                    });
                    let colorString = colorStrings.join(' ');
                    containers[rectname].addCustomColorsText(colorString);              
                }     
            });

        let time = d3new.select("#timetableinfo")
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
        WriteTable(strToPlot, mostocc) 
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
 * Function which  determines the colors of each nucleotide according to the position of the stem that they're in
 ** get a pairtable and a list of the secondary structure elements
 ** store the colors of each nucleotide
 ** for each nucleotide in the stem assign it the stem's average nucleotide number
 ** and convert average nucleotide numbers to colors
 * @param {Array} data the parsed content of the input file
 */
function calculateNucleotideColors(data, rScale, nScale) {
    data.forEach(function(d) {
        // determine the colors of each nucleotide according to the position
        // of the stem that they're in
        // each 'd' is a line in the dr transfomer output
        d.time = +d.time;
        d.occupancy = +d.occupancy;

        // get a pairtable and a list of the secondary structure elements
        let pt = rnaUtilities.dotbracketToPairtable(d.structure);
        let pk = rnaUtilities.removePseudoknotsFromPairtable(pt);
        let elements = rnaUtilities.ptToElements(pt, 0, 1, pt[0], []);
        // store the colors of each nucleotide
        let colors = Array(pt[0]).fill(d3.hsl("white"));
        for (let i = 0; i < elements.length; i++) {
            if (elements[i][0] != 's')
                continue; // we're not interested in anything but stems
            // for each nucleotide in the stem
            // assign it the stem's average nucleotide number
            let averageBpNum = elements[i][2].reduce(
                (a,b) => { return a+b }, 0) / (elements[i][2].length);
            // convert average nucleotide numbers to colors
            elements[i][2].map((d) => {
                let nucleotideNormPosition = nScale(+averageBpNum);
                colors[d-1] = rScale(nucleotideNormPosition);
            });
            // each structure gets its own set of structures
        }
        d.colors = colors;
    });
}
/**
 * Function for visulizing  a HTML element in  fullscreen mode, used on fullScreenContainer upon Fullscreen button click 
 ** thanks to https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
 * @param {string} elem the name of the container to be visualized in fullscreen
 * 
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
 * @param {Array} data the parsed content of the input file
 */

function ShowData(data, realtime, prevtime) {     
    const [vCW, vCH, eCW, eCH, tSW] = initialize()
    const seqlen = data[data.length - 1].structure.length;
    containers = {};
    strtoPlotprev = null
    mouseactive = false

    document.querySelectorAll('.occupancy').forEach((item) => {
        occupancyThreshold=item.value
        item.addEventListener('change', () => {
            //TODO Look at the end of transcription in the original file and
            //get the max occupancy there, otherwise the whole time points
            //change! Error message when the occupancy threshold is bigger than
            //max occ at end of transcr
        occupancyThreshold=item.value
        ShowData(data, realtime, prevtime)
        })
    })
    let container = d3new.select("#visualization");
    container.select('#loadingNotification').remove();

    let filteredData = data.filter((d) => { return +d.occupancy > occupancyThreshold }) 
    // nested data by time points to extract the structures for every time step
    let nestedData = Array.from(d3new.group(filteredData, d =>+d.time)) 

    //            if (nd.length<dd.length) {
    //              //  console.log("discarded time points")
    //                alert("Some time points present in your file were discarded due to the presence of only low occupied structures ")
    //            }
    const [lintimes, logtimes, maxNoStr] = SplitTranscription(nestedData, seqlen)

    // all do edits to the svg
    const [cScale, rScale, nScale, maxlintime] = CreateScales(vCW, tSW,
        lintimes, logtimes, seqlen);
    calculateNucleotideColors(filteredData, rScale, nScale) 
    const mostocc = mostOccupiedperTime(nestedData)
    createScaleColors(tSW, seqlen, mostocc, cScale, nScale)  
    drawScales(vCW)
    drawCirclesForTimepoints(nestedData)
    ShowEndOfTranscriptionLine(cScale, maxlintime)

    // this has not been necessary so far
    mintime = d3new.min(filteredData, d => +d.time);
    if (realtime == null) {realtime = mintime}
    if (prevtime == null) {prevtime = mintime }

    let strToPlot = StructuresToPlot(nestedData, prevtime)
    strtoPlotprev = ensPlot(nestedData, prevtime, eCW, eCH, seqlen, mostocc)


    // continue here
    showLine(cScale(prevtime)) 

    let mousetime = 30 // the beginning of the plot
    svg.on("mousemove", (event) => {
        if (playAnimation) return;
        if (!mouseactive) return;
        let x = d3new.pointer(event)[0];
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
        if (prevtime != realtime) {
            prevtime = realtime
            if (delayPLOT) clearTimeout(delayPLOT);
            delayPLOT = setTimeout(ensPlot, 5*maxNoStr, nestedData, realtime, eCW, eCH, seqlen, mostocc);
        }
    })


    svg.on("click", (event) => {
        if (playAnimation) { playAnimation = !playAnimation }
        mouseactive = !mouseactive;
        //scale invert for combined scale
        (d3new.pointer(event)[0]<linscale(maxlintime))
        ?mousetime = linscale.invert(d3new.pointer(event)[0]) 
        :mousetime = logscale.invert(d3new.pointer(event)[0])
        console.log(d3new.pointer(event)[0], mousetime)
        // TODO: redundant?
        if (d3new.pointer(event)[0] >= 30 && d3new.pointer(event)[0] <= tSW) {
            showLine(d3new.pointer(event)[0])
        }
        for (let t in filteredData) {
            if (filteredData[t].time <= mousetime) { 
                realtime = filteredData[t].time 
            }
        }
        if (prevtime != realtime) {
            prevtime = realtime
            ensPlot(nestedData, realtime, eCW, eCH, seqlen, mostocc)
        }
    })
    
    let reload_b = d3new.select("#SeqReload")
    reload_b.on('click', function() {
        playAnimation=false
        //console.log("clicked ")
        readSequence()
        prevtime=null
        if (realtime==null){
            realtime=mintime
        }
        ShowData(data, realtime, prevtime) 
        ensPlot(nestedData, realtime, eCW, eCH, seqlen, mostocc)
        showLine(cScale(realtime)) 
    })

    let bfullscr = d3new.select("#toggleFullScreen")
    bfullscr.on('click', function() {
        playAnimation=false
        toggleFullScreen(document.getElementById('fullscreen'));
    })
    let bd = d3new.select("#downloadButton")
    bd.on("click", () => {
        if (playAnimation) {playAnimation=false}
      //console.log("down")
        downloadsSVG()
        // downloadPng()
        // downloadsSVG()
    })
    let play = d3new.select("#toggleAnimation");
    //
     
    play.on("click", () => {playAnimation = !playAnimation    
        
        nestedData.forEach(element => {
            if (+element[0] == +prevtime) {
                elementIndex=nestedData.indexOf(element)
                }
            }) 
            document.querySelectorAll('.playspeed').forEach((item) => {
                item.addEventListener('change', () => {
                    
                    animationDelay=item.value
                   //console.log( animationDelay)
                })
                   
            })
            
            let ToogleAnimation= setInterval(() => {
               // console.log(animationDelay)
                if (!playAnimation) {//console.log("aici ");\\ ruleaza o data pe secunda, nu e foarte frumos...
                    clearInterval(ToogleAnimation)
                    return ;
                }
                if (elementIndex >= nestedData.length){            
                    elementIndex = 0;
                }
                const element = nestedData[elementIndex];
                //console.log(nestedData)
                prevtime = +element[0]
                ensPlot(nestedData, prevtime, eCW, eCH, seqlen, mostocc)
                showLine(cScale(prevtime))
                elementIndex += 1;
                return prevtime
            }, animationDelay);
           
            
    })

    const onResize = () => {
        playAnimation = false      
        ShowData(data, realtime, prevtime); // redraw plot
        // TODO: this does not resize the 
        //if (realtime!=null){
        //    try{ensPlot(realtime, eCW, eCH, seqlen)
        //        showLine(combinedScale(realtime)) 
        //    }
        //    catch{()=>{
        //        // console.log("err", err)
        //         }
        //        
        //    }
        //    return
        //}
    }
    
    window.onresize = function() {
        playAnimation=false
        if (delayResize) clearTimeout(delayResize);
        delayResize = setTimeout(onResize, 300)
    };
    return
} 

function hideseq() { 
    const x = document.getElementById("seqfield");
    x.style.display = x.style.display === "none" ? "block" : "none"; 
}

function hidetab() { 
    const x = document.getElementById("datatable");
    x.style.display = x.style.display === "none" ? "block" : "none"; 
}

start();
