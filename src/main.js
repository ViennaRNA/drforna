import * as d3new from "d3"
import {elementToSVG } from 'dom-to-svg'
import { saveAs } from "file-saver";

import {FornaContainer, RNAUtilities} from 'fornac';

/**
 * @file main.js
 * @author Anda Latif, Stefan Hammer, Peter Kerpediev
 * @see <a href="https://github.com/ViennaRNA/drforna">DrForna</a>
 * @description Visualization of cotranscriptional folding
 *
 */  

/**
 * Instance of RNAUtilities from fornac
 */  
var rnaUtilities = new RNAUtilities();

/**
 * containers containing the secondary structure graphs 
 * 
 */
let containers;

/**
 * Occupancy Treshhold, structures with smaller occupancy will not be shown,
 * 0.01 by default @type {number}
 */
let occupancyTreshold=0.01;

/**
 * Prepares the plotting area:
 ** removes the previous content 
 ** creates the visual container containing the treemap
 ** create the table container containing the structures for the selected time point
 * @param {string} elementName the name of the HTML element
 * @param {string} notificationContent the notification to appear
 
 */
function preparePlotArea() {  
    //remove the previous content
    let container = d3new.select("#visualization")
    container.selectAll('div').remove()
    
    //display loading indicator
    container.style('text-align', 'center')
        .append('div')
        .attr('id', 'loadingNotification')
        .style('display', 'inline')
        .html('Loading ...')
    // create the ensemble visualization area (treemap)
    container
        .append('div')
        .attr('id', 'ensemblevis')
    // create the time-point selection panel
    container
        .append('div')
        .attr('id', 'timetablevis')
        .html("<p>and time table container-most populated structure</p>")

    //// create the table showing input data 
    //container
    //    .append('div')
    //    .attr('id', 'datatable')
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
 ** It loads the file containing the details of the simulation and the fasta
 file containing the sequence. The filename is split by "." and the first part
 is taken with .fa extension as the name of the file containing the
 corresponding sequence
 * @param {string} filename
 */
function load_example(drffile, fafile){
    filteredData = null
    nestedData = []
    d3new.text(fafile).then(d => {
        a = d3new.csvParse(d)                
        seq_name = a.columns[0]
        //console.log(Array.from(a)[0][seq_name])
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
            d.replace(/ +/g, ",").replace(/\n,+/g, "\n").replace(/^\s*\n/gm, ""))
        containers = {};
        let container = d3new.select("#ensemblevis")
        container.remove()

        ShowData(Array.from(a))
        document.querySelectorAll('.fileinput').forEach((item) => {
            item.addEventListener('change', () => {return false})})
    })      
}

/**              
 * Method that starts the visualization: 
 ** reads and shows the data from the example "grow.drf" and then gives the
 oportunity to upload files and sequences
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
    filteredData=null
    nestedData=[]
        
    
    document.querySelectorAll('.fileinput').forEach((item) => {
        item.addEventListener('click', (event) => {playAnimation=false
             event.target.value=""
        })
        item.addEventListener('change', (event) => {  
        // let rb=document.querySelectorAll('input[type=radio][name=fileinput]:checked')
        // //console.log(rb)
        // if (rb.length!=0)
        //     {rb[0].checked=false}
        document.querySelectorAll("#sequence").forEach((item)=>{item.value=""})
        inputSeq=""
   
       let files = event.target.files
        filename=files[0].name
       
        for (let i = 0, f; f = files[i]; i++) {
            let reader = new FileReader()
            reader.onload = (val) => {                                   
               let a=[]
              //console.log(val.target.result.replace(/ +/g, ",").replace(/\n,+/g, "\n").replace(/^\s*\n/gm, ""))
               a = d3new.csvParse(val.target.result.replace(/ +/g, ",").replace(/\n,+/g, "\n").replace(/^\s*\n/gm, ""))                
                containers = {};                  
                let nd = Array.from(d3new.group(a.filter((d) => {return +d.occupancy > occupancyTreshold }), d => +d.time))
                let dd= Array.from(d3new.group( a, d  => +d.time))
                //  console.log(dd)
                //  console.log("nd", nd)
                if (nd.length<dd.length) {
                  //  console.log("discarded time points")
                    alert("Some time points present in your file were discarded due to the presence of only low occupied structures ")
                }
                realtime=d3new.min(dd[0])
                ShowData(a)
            }            
            reader.readAsText(f);
        }
    });
 })
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
let scalel;
/**
 * the svg containing the scales
 * 
 */
let svg;
/**
 * the selected time point
 * @type {number}
 */
let realtime=null;
/**
 * the previous time point, to check if anything changed before unnecessarly reploting
 * @type {number}
 */
let prevtime=null
/**
 * the list of structures for the previous selected time point, to verify if anything changed
 * @type {number}
 */
let strtoPlotprev=null;
/**
 * full length of the sequence considered
 * @type {number}
 */
let sequenceLength = null;
/**
 * Boolean variable to show if the mouse is active
 * @type {boolean}
 */
let mouseactive=false;
/**
 * width of the visual container, changed when window is resized
 * @type {number}
 */
let visContainerWidth=800

/**
 * width of the scale, 98% of the container width
 * @type {number}
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
 * @param {Array} data  the parsed content of the input file
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
    visContainerWidth = d3new.select('#ensemblevis').node().getBoundingClientRect().width; 
    
    lineChartWidth = visContainerWidth * .98; 
    tableContainer = d3new.select(`#timetablevis`);
    tableContainer.selectAll("svg").remove()
    mouseactive=false
    
    viscontainer = d3new.select('#ensemblevis')
    viscontainer.append('div').attr('id','treemapdiv')//.style('height', '500px')
    
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
 * @type {number}
 */
 let maxNoStr=0

/**
 * Method for splitting the data into transcription steps and steps after transcription, 
 *  and identifying the maximal number of  structural alternatives that appear  
 * @param {Array} nestedData The input data read form the file, grouped by time
 * @returns {Array} trascription steps
 * @returns {Array} Steps after trascription
 * @returns {number}  maximal number of structural alternatives
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
                    if (+e.occupancy>=+best.occupancy){best=e}})
                mostoccupiedpertime.push([el[0], best])
                })    
            let mostocc=[mostoccupiedpertime[0]]
            //console.log(mostoccupiedpertime)
            mostoccupiedpertime.forEach((el)=>{
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
 * @returns {number} first time point in the file
 * @returns {number} time of the end of transcription 
 */
function CreateScales(){
        
        //I use filtered data to ignore time steps in which all stuctures are with ocuppancy smaller than threshhold
         mintime = d3new.min(filteredData, d => +d.time) // I use the +(0) to automatically convert to Number, otherwise it would be string
        let minlintime=d3new.min(trascriptionSteps, d=>+d[0])
        let maxlintime=d3new.max(trascriptionSteps, d=>+d[0])
        //console.log("time", minlintime, maxlintime)
        //let minlogtime=d3new.min(AfterTrascription, d=>+d[0])
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

        svg = d3new.select("#timetablevis")
            .append("svg")
            .attr("width", lineChartWidth)
            //.attr("height", 120)
            .attr("id", "timesvg"); //create the svg containing the scales
        
        //the lin and log scale on the bottom, positions were defined
         x_axislog = d3new.axisBottom()
            .scale(logscale).ticks(5);
         x_axislin = d3new.axisBottom()
            .scale(scalel);
        //and the vertical nucleotide  
         nucleotideScale = d3new.scaleLinear()
            .range([80, 0]);
                        

        //Append group and insert axes
        nucleotideScale.domain([0, sequenceLength]);
         y_axis = d3new.axisLeft()
            .scale(nucleotideScale).ticks(5);
        
            
         rainbowScale = (t) => { //console.log(t/ sequenceLength)
            //console.log(t, t/(2* sequenceLength))
            return d3.hcl(4*t, 100, 55); 
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
                    
                    //.each(function(d,i) {//console.log("ha"+d+"ind "+i)
                    //})
    
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
    //     .style("stroke-width", 1.5)
    //     .style("stroke","black")
    //    .style("fill", "none");
}

        // function timer(lap){ 
        //     if(lap) console.log(`${lap} in: ${(performance.now()-timer.prev).toFixed(3)}ms`); 
        //     timer.prev = performance.now();
        // }

/**
 *  Debounce function that, as long as it continues to be invoked, will not be triggered.
 * @param {Function}  func Name of the function 
 * @param {number} time Time in milliseconds to wait before the function gets called, 100 by default
 * @returns {Function} 
 */

//  function debounce(func, time){
//     var time = time || 100; // 100 by default if no param
//     var _timer;
//     return function(event){
//         if (_timer) clearTimeout(_timer);
//         _timer = setTimeout(func, time, event);
//     };
// }

/**
 * List of structures to plot for the selected time point
 * @type {Array}
 */  
let strToPlot;
/**
 * Function for extracting the list of structures to plot for the selected time point
 * @param {number} time selected time point
 * @returns {Array} List of structures to plot for the selected time point
 */  
function StructuresToPlot(time){
    strToPlot=[]
   // console.log(nestedData)
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
    
    svg.selectAll(".currenttimeLine").remove()
    svg.append("line")
        .attr("class", "currenttimeLine")
        .attr("x1", coord)  
        .attr("y1", 0)
        .attr("x2", coord)  
        .attr("y2", 120)
        // .style("stroke-width", 1)
        .style("stroke",color)
        // .style("fill", "none");
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
    //console.log(strToPlot)
                var colnames = ['ID',// 'Time', 
                'Occupancy', 'Structure' , 'Energy'];    
    
                d3new.select("#datatable")
                    .selectAll("table").remove()
                // d3new.select("#datatable")
                //     .selectAll("time").remove()
                // let time=d3new.select("#datatable").append("div").attr("id", "time")
                
                let structures = d3new.select("#datatable").append("table")
                 
                    
                // let ttime = time.append("table").attr("id", "ttime")
                // let trow=ttime.append("tr")
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
                                  // value:Math.round(d.occupancy*1000)/1000}, 
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
 * Function for plotting the treemap containing the structures, as well as writing the table
 * @param {number} realtime the selected time (as present in the file) 
 * @returns {Array} The list of plotted structures, as the ones that were now previously plotted
  */   
function PLOT(realtime) { 
    strToPlot = StructuresToPlot(realtime)
    if (strtoPlotprev != strToPlot) {
        const treemapData = makeTreemapData(strToPlot);
        const svgWidth = lineChartWidth+20
        const svgHeight = lineChartWidth*0.4
        let root = d3new.stratify().id(function(d) { return d.name})   // Name of the entity (column name is name in csv)
            .parentId(function(d){ return d.parent})(treemapData);
        root.sum(d => +d.value).sort((a, b) => b.value - a.value)  // Compute the numeric value for each entity
        //console.log(root.value)
        Sum_of_occ=Math.round(root.value*100000)/100000
        d3new.treemap()
            .size([svgWidth, svgHeight])
            .padding(4)(root)

        viscontainer.select("#treemapdiv").remove()
        let zoom=false;
        viscontainer.append("div").attr("id", "treemapdiv") 
        
        // .style("background-color", "white")
        //.style('position', 'relative')
            .style("width", `${svgWidth}px`)
            .style("height", `${svgHeight}px`)
            .selectAll(".svg").remove() // leave out
            .data(root.leaves())
            .enter()
            .append("svg")
            .attr("class", "plot")
            .style("background-color", "white")
            .style("opacity", 100).style("z-index", 1)
            .attr("id",   d => { return "svg"+d.data.name})
        // .style("background-color", "white") .style("opacity", 50)
            .on("mouseover", (e,d)=> {  //show occ when mouse over
                d3.select(".infodiv").remove()
                let infodiv = d3.select("#treemapdiv").append("div")
                    .attr("class", "infodiv")
                    .style("opacity", 0);  
                //console.log(e,d);
                infodiv.html(d.data.value)
                    .style('left',  ()=>{ return `${d.x0+25}px`; })
                    .style('top',  () => { return `${d.y0}px`; })
                return infodiv.style("opacity", 100).style("z-index", 3);})    
            .on('mouseout', (e,d)=> {  
                d3.select(".infodiv").remove() //delete on mouseout   
            }) 
            .on("click", (e,d) =>{
                //console.log(e,d)
                let c = d3.select("#svg"+d.data.name)

                if (zoom==false) {
                    zoom=true 
                    d3.select(".infodiv").remove()
                    d3.select(".help").remove()
                    let helpdiv = d3.select("#treemapdiv").append("div")
                        .attr("class", "help").style("width", `${svgWidth}px`)
                        .style("height", `${svgHeight}px`)
                        .style('position', 'relative')
                        .style("z-index", 2)
                        .style("background-color", "azure")
                        .text("Selected structure, occupancy "+d.data.value); 
                        // VARIANT2: PUT SEQ ON ZOOM
                        let rectname="svg"+d.data.name
                        containers[rectname].addRNA(d.data.str,{"sequence": inputSeq} )
                                 

                    // console.log(d.data)                              
                    return c.style("width", `${svgWidth}px`)
                        .style("height", `${svgHeight}px`)
                        .style('left',  d =>{ return `${0}px`; })
                        .style('top',  d => { return `${0}px`; })
                        .style("opacity", 10)
                        .style("z-index", 3)

                }
                else{zoom=false
                    d3.select(".help").remove()
                    // VARIANT2: Delete seq from treemap
                        
                    let rectname="svg"+d.data.name
                    containers[rectname].addRNA(d.data.str)

                    return c.style('left',  d =>{ return `${d.x0}px`; })
                        .style('top',  d => { return `${d.y0}px`; })
                        .style("z-index", 1)
                    // .style("background-color", "white")                                
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
        //.style('position', 'relative')
            .attr("x", 1)    //  to adjust position (to the right)
            .attr("y", 10)    //  to adjust position (lower)
            .text( d => { return d.data.name })
            .attr("font-size", "12px")                            
            .attr("fill", "white")      
            .each( d => {
                let rectname="svg"+d.data.name
                if ( d.data.str != '') {
                    containers[rectname] = new FornaContainer('#' + rectname,{zoomable:false, editable:false, animation:false, displayNodeLabel: true,// labelInterval:0,
                        transitionDuration:0});
                    containers[rectname].addRNA(d.data.str
                        // VARIANT2: Delete seq from treemap
                        // ,{"sequence": inputSeq} 
                        )
                    containers[rectname].transitionRNA(d.data.str);
                    // console.log(containers[rectname])    
                    let colorStrings = d.data.colors.map(function(d, i) {
                        return `${i+1}:${d}`;
                    });
                    let colorString = colorStrings.join(' ');
                    containers[rectname].addCustomColorsText(colorString);              
                }     
            });
        d3new.select("#timetablevis")
            .selectAll("table").remove()
        d3new.select("#timetablevis")
            .selectAll("#time").remove()
        // let time = d3new.select("#timetablevis").append("div").attr("id", "time")
        // time.append("table")
        let ttime =d3new.select("#timetablevis").append("div").attr("id", "time").append("table").attr("id", "ttime")
        let trow = ttime.append("tr")

        trow.append("td").text("Selected time point: ")
        trow.append("td").text(+strToPlot[0].time+" s")
        trow=ttime.append("tr")

        trow.append("td").text("Transcription length: ")
        trow.append("td").text( strToPlot[0].structure.length+"/"+sequenceLength)
        trow=ttime.append("tr")

        trow.append("td").text("Sum of occupancies: ")
        trow.append("td").text( Sum_of_occ)
        /*
        */
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
 * @param {Array} data the parsed content of the input file
 */
function calculateNucleotideColors(data) {
    data.forEach(function(d) {
        // determine the colors of each nucleotide according to the position
        // of the stem that they're in
        // each 'd' is a line in the dr transfomer output
        d.time = +d.time;
        d.occupancy = +d.occupancy;

        // get a pairtable and a list of the secondary structure elements
        let pt = rnaUtilities.dotbracketToPairtable(d.structure);
        // console.log("pt", pt)
        let pk=rnaUtilities.removePseudoknotsFromPairtable(pt)
        if  (pk.length>0){
            // console.log(d.time, "pk", pk, pt)
            // console.log(pt)
        }
            
        let elements = rnaUtilities.ptToElements(pt, 0, 1, pt[0], []);
        // console.log("el",elements)
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
                let colorScale = d3new.scaleLinear()
                .range([0, 360]).domain([0, sequenceLength]);
                let nucleotideNormPosition = colorScale(+averageBpNum);
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
        visContainerWidth = d3new.select('#ensemblevis').node().getBoundingClientRect().width; 
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
//let ret=false
/**
 * Function for showing the data, which consists mostly of calls of previously defined functions and the mouse events
 * @param {Array} data the parsed content of the input file
 */

function ShowData(data) {     
    preparePlotArea(); 
    
    document.querySelectorAll('.occupancy').forEach((item) => {
        occupancyTreshold=item.value
        item.addEventListener('change', () => {
            //TODO Look at the end of transcription in the original file and get the max occupancy there,
            // otherwise the whole time points change! Error message when the occupancy threshold is bigger than max occ at end of transcr
        occupancyTreshold=item.value
        initialize(data)
        
        ShowData(data)
        })
        
    })
    initialize(data)
    let container = d3new.select("#visualization");
    container.select('#loadingNotification').remove(); //remove the loading notification  
    
   
    prevtime = null
    filteredData = data.filter((d) => { return +d.occupancy > occupancyTreshold }) // select structures with high enough occupancy
    nestedData = Array.from(d3new.group(filteredData, d =>+d.time)) // nest data by  time points to extract the structures to plot for every time step
    trascriptionSteps,  AfterTrascription, maxNoStr = SplitTranscription(nestedData)
    combinedScale, rainbowScale ,mintime, maxlintime= CreateScales();
    if (realtime==null) {realtime=mintime}
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
        if (playAnimation) {playAnimation=!playAnimation}
        mouseactive=!mouseactive;
        //scale invert for combined scale
        (d3new.pointer(event)[0]<scalel(maxlintime))
        ?mousetime = scalel.invert(d3new.pointer(event)[0]) 
        :mousetime= logscale.invert(d3new.pointer(event)[0])
      
        if (d3new.pointer(event)[0] >= 30 && d3new.pointer(event)[0] <= lineChartWidth-30) {
            showLine(d3new.pointer(event)[0])
        }
        for (let t in filteredData) {
            if (filteredData[t].time <= mousetime) { 
                realtime = filteredData[t].time 
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

        for (let t in filteredData) {
            if (filteredData[t].time <= mousetime) { 
                realtime = filteredData[t].time 
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
    let reload_b = d3new.select("#SeqReload")
    reload_b.on('click', function() {
        playAnimation=false
        //console.log("clicked ")
        readSequence()
        prevtime=null
        if (realtime==null){
            realtime=mintime
        }
        ShowData(data) 
        PLOT(realtime)
        showLine(combinedScale(realtime)) 
       
        

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
    let next = d3new.select("#NextTime");
    next.on("click", () => {
        nestedData.forEach(element => {
            if (+element[0] == +prevtime) {
                elementIndex=nestedData.indexOf(element)
                }
            }) 
            elementIndex += 1;
            if (elementIndex >= nestedData.length){            
                elementIndex = 0;
            }
            const element = nestedData[elementIndex];
            //console.log(nestedData)
            
            prevtime = +element[0]
         
            PLOT(prevtime)
            showLine(combinedScale(prevtime))
      

    })
    let prev = d3new.select("#PrevTime");
    prev.on("click", () => {
        nestedData.forEach(element => {
            if (+element[0] == +prevtime) {
                elementIndex=nestedData.indexOf(element)
                }
            }) 
            
            if (elementIndex == 0){            
                elementIndex = nestedData.length-1;
            }
            else {elementIndex -= 1;}
            
            const element = nestedData[elementIndex];
            console.log(element)
            
            prevtime = +element[0]
         
            PLOT(prevtime)
            showLine(combinedScale(prevtime))
      

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
             
                PLOT(prevtime)
                showLine(combinedScale(prevtime))
       

                
                elementIndex += 1;
                
                return prevtime
            }, animationDelay);
           
            
    })

    const onResize = () => {
        //retain position we are at and if animation was on an remake plots accordingly!?? TODO?
        //maybe not delete everything but just resize to increase performance
        playAnimation = false      
        ShowData(data); // redraw plot
       // console.log("ai")
        if (realtime!=null){
            try{PLOT(realtime)
                showLine(combinedScale(realtime)) 
            }
            catch{()=>{
                // console.log("err", err)
                 }
                
            }
            return
        }
        //  ret=true
        //  if (prevtime!=null){
        //     PLOT(prevtime)
        //     showLine(combinedScale(prevtime)) 
        // }
      
        
    }
    
  
    // console.log("init",ret)
    window.onresize = function() {

        playAnimation=false
       
        if (delayResize) clearTimeout(delayResize);
        delayResize = setTimeout(onResize, 300)

        // ShowData(data)
        // if (realtime!=null){
        //         PLOT(realtime)
        //         showLine(combinedScale(realtime)) 
        //     }
        // console.log("1",ret)
     
    };
   // console.log(data)
    return
//     console.log("after",ret)
//    if (ret) {ret=false
//     return prevtime}
    
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
