import * as d3new from "d3"
import {FornaContainer, RNAUtilities, rnaTreemap, rnaPlot} from 'fornac';
//import { rnaPlot } from "fornac/src/rnaplot";
//var rnaUtilities = new RNAUtilities();
const occupancyTreshold = 0.01
start();
function start() {
    //read from file
     document.querySelectorAll('.fileinput').forEach((item) => {
        item.addEventListener('change', (event) => {
           let files = event.target.files
            for (let i = 0, f; f = files[i]; i++) {
                let reader = new FileReader()
                reader.onload = (val) => {                                   
                   let a = d3new.csvParse(val.target.result.replace(/ +/g, ","))                   
                   ShowData(a)
                }            
                reader.readAsText(f);
            }
        });
    })
    //read selected example 
    document.querySelectorAll('.forminput').forEach((item) => {
        item.addEventListener('change', (event) => {
            let fileName = item.lastElementChild.value
            //preparePlotArea(drTrafoContainer)
            //let container = d3new.select("#drTrafoContainer")
            //container.select('#loadingNotification').remove()
            let a = []
            d3new.text(fileName).then(d => {
                a = d3new.csvParse(d.replace(/ +/g, ","))
                ShowData(Array.from(a))
            })
        })
    })
}

let scale;
let logscale;
let scalel;
let svg;
let realtime;
let prevtime=null
let sequenceLength = null;

function ShowData(data) {
    preparePlotArea(drTrafoContainer); 
    let container = d3new.select("#drTrafoContainer");
    container.select('#loadingNotification').remove(); //remove the loading notification 
    sequenceLength=data[data.length - 1].structure.length; //length of the transcribed sequence, used for seeing when the transcription ends
    let visContainerWidth = d3new.select('#visContainer').node().getBoundingClientRect().width; //for resizing with window resize
    let lineChartWidth = visContainerWidth * .98; 
    let tableContainer = d3new.select(`#tableContainer`);

    const onResize = () => {
        //retain position we are at and if animation was on an remake plots accordingly!
        playAnimation = false
        tableContainer.selectAll("#timesvg").remove() //remove time scale
        //viscontainer.selectAll(".div").selectAll(".svg").remove() 
        viscontainer.selectAll("#treemapdiv").remove()//remove plots
        ShowData(data);// redraw plots ?? update dimensions instead??
    }
    window.addEventListener("resize", debounce(onResize, 1000)); //when the window was resize, call the onResize function after 1000 ms

    let viscontainer = d3new.select('#visContainer')
    viscontainer.append('div').attr('id','treemapdiv').style('height', '500px')
    

    let filteredData = data.filter((d) => { return d.occupancy > occupancyTreshold })//select structures with high enough occupancy
    let nestedID=Array.from(d3new.group(filteredData, d => d.id)) //extract all the id's that occur, I actually only need id and structure in dot bracket 
                    // assign equal ocupancies to all the structures and create treemaps with the plots 
                    //such that later I only resize the plots, not regenerate them for every time step
                    //to have less lag
    let nestedData = Array.from(d3new.group(filteredData, d => d.time))//nest data by  time points to extract the structures to plot for every time step
    
    // havin the sequence length at the end, the end of transciption is identified as the first time step where the structures of that length occur
    let trascriptionSteps=[] 
    let AfterTrascription=[]
    nestedData.forEach(el=>{
        if (el[1][0].structure.length<sequenceLength){
                trascriptionSteps.push(el) //retain time as transcription step 
                                        //if the first structure in the list of structures for that time point is shorter than the end structure
        }
        else{
                AfterTrascription.push(el) //otherwise it is a time step after thascription end
            }
    })
    trascriptionSteps.push(AfterTrascription[0]) //the end of transcription is added in both lists
    
    //We want to make linear scale till transcription end 
    //and log scale after transcription ends

    let maxtime = d3new.max(filteredData, d =>+d.time)//I use filtered data to ignore time steps in which all stuctures are with ocuppancy smaller than threshhold
    let mintime = d3new.min(filteredData, d => +d.time) //I use the +(0) to automatically convert to Number, otherwise it would be string
    let minlintime=d3new.min(trascriptionSteps, d=>+d[0])
    let maxlintime=d3new.max(trascriptionSteps, d=>+d[0])
    //console.log("time", minlintime, maxlintime)
    let minlogtime=d3new.min(AfterTrascription, d=>+d[0])
    let maxlogtime=d3new.max(AfterTrascription, d=>+d[0])
    //console.log(minlogtime, maxlogtime)

    tableContainer.selectAll("p").remove()
    tableContainer.selectAll("#timesvg").remove()
    //Calculate the size of the linear and the log scale 
    //
    scale = d3new.scaleLinear()
        .domain([mintime, maxtime])// + (maxtime-mintime)/100
        .range([20, lineChartWidth-20])
    scalel = d3new.scaleLinear()
         .domain([minlintime, maxlintime])// + (maxtime-mintime)/100
         .range([20, scale(maxlintime)])
    logscale = d3new.scaleLog()
          .domain([minlogtime, maxlogtime])// + (maxtime-mintime)/100
          .range([scale(maxlintime), lineChartWidth-20])


    const combinedScale = time => time < maxlintime
        ? scalel(time)
        : logscale(time);

    svg = d3new.select("#tableContainer")
        .append("svg")
        .attr("width", lineChartWidth)
        .attr("height", 120)
        .attr("id", "timesvg");
    let x_axis = d3new.axisBottom().scale(scale);
    let x_axislog = d3new.axisBottom()
         .scale(logscale);
    let x_axislin = d3new.axisBottom()
         .scale(scalel);

    let nucleotideScale = d3new.scaleLinear()
        .range([80, 0]);
    if (sequenceLength == null)
        nucleotideScale.domain([0, data[data.length - 1].structure.length])
    else
        nucleotideScale.domain([0, sequenceLength]);
    var y_axis = d3new.axisLeft()
        .scale(nucleotideScale)
    //Append group and insert axes
    svg.append("g").attr("width", lineChartWidth)
        .attr("height", 110)
        .attr("transform", "translate (20,10)")
        .call(y_axis)    
    // svg.append("g").attr("transform", "translate (0,90)").attr("height", 110)
    //     .call(x_axis);
     //console.log("here",scale(maxlintime), scale(maxlogtime))

    svg.append("g").attr("transform", "translate (0,90)").attr("height", 110).call(x_axislin);
    svg.append("g").attr("transform", "translate (0,90)").attr("height", 110).call(x_axislog).attr("color", "blue");
    
    let join = viscontainer.selectAll("div").data([nestedData])
    join.enter().append("div")
    //draw points on x axis for existing time points
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

    let strToPlot
    nestedData.forEach(element => {
         if (element[0] == mintime) {
              strToPlot = element[1] 
            } 
        })
    if (prevtime==null){
        prevtime = mintime
    }
    
    PLOT(prevtime)
    showLine(scale(prevtime)) 
    svg.append("line")
            .attr("class", "transcriplengthLine")
            .attr("x1", scale(maxlintime))  
            .attr("y1", 0)
            .attr("x2", scale(maxlintime))  
            .attr("y2", 120)
            .style("stroke-width", 0.5)
            .style("stroke","black")
            .style("fill", "none");
    

    //toggle animation state on button click
    let playAnimation = false;
    let play = d3new.select("#toggleAnimation");
    let elementIndex = 0;
    play.on("click", () => {playAnimation = !playAnimation    
        nestedData.forEach(element => {
            if (element[0] == +prevtime) {
                elementIndex=nestedData.indexOf(element)
                }
            })
    })

    const animationDelay = 1000;
    setInterval(() => {
        if (!playAnimation) {//console.log("aici ");\\ ruleaza o data pe secunda, nu e foarte frumos...
                 return;
        }
        const element = nestedData[elementIndex];
        PLOT(element[0])
        showLine(scale(element[0]))
        elementIndex += 1;
        if (elementIndex >= nestedData.length)
            elementIndex = 0;
    }, animationDelay);
    
    svg
    // .on("mouseover", function (event, d) {
    //     if (playAnimation) return;
    //     const mousetime = scale.invert(d3new.pointer(event)[0]);        
    //     for (let t in data) {
    //         //console.log(data[t].time)
    //         if (data[t].time <= mousetime) { realtime = data[t].time }
    //     }        
    //     if (prevtime != realtime) {
    //         prevtime = realtime
    //         PLOT(realtime)
    //     }
    // })
    .on("mousemove", function (event, d) {
        if (playAnimation) return;
        const mousetime = scale.invert(d3new.pointer(event)[0]);
        if (d3new.pointer(event)[0] >= 20 && d3new.pointer(event)[0] <= lineChartWidth-20) {
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

    function makeTreemapData(strToPlot) {
        return [
            { name: "parent", parent: null, value: 0 },
            ...strToPlot.map(el => ({ name: el.id, parent: "parent", value: el.occupancy }))
        ]
    }

    function PLOT(realtime) {        
        nestedData.forEach(element => { 
            if (element[0] == realtime) {
                 strToPlot = element[1] 
                } 
            })
           //generate treemap data
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


        
        const containers = {};
        viscontainer.select("#treemapdiv").remove()
        viscontainer.append("div").attr("id", "treemapdiv")
            .style('position', 'relative')
            //.style('margin', '0px')

            .style("width", `${svgWidth}px`)
            .style("height", `${svgHeight}px`)
            //.style('position ', 'absolute')            
            //.style("stroke", "black")
            //.style("background-color", "#62b6a2")
            .selectAll(".svg").remove()
            .data(root.leaves())
            .enter()
            .append("svg").attr("id",  function (d) { console.log(d);
                return "svg"+d.data.name})
            //.attr( 'display', 'inline')
            .style('position', 'absolute')
            .style('left',  d =>{ return d.x0; })
            .style('top', function (d) { return d.y0; })
            .style('width', function (d) { return (d.x1 - d.x0); })
            .style('height', function (d) { return (d.y1 - d.y0); })
            //.style('position', 'relative')
            .style("stroke", "black")
            .style("fill", "#62b6a2")
            .each(function (d) {
                //console.log("d",d, strToPlot)
                let str=''
                let rectname=''; //console.log("here",strToPlot); 
                    strToPlot.forEach(el=>{
                        if (el.id==d.data.name){
                            str=el.structure  
                            rectname="svg"+d.data.name  
                        }
                    })
                if ( str != '') {
                    //plot=rnaPlot({'rnaLayout': 'naview'})
                    //console.log(plot)
                    //console.log(rectname);
                    containers[rectname] = new FornaContainer('#' + rectname, {zoomable:false});
                    // // Draw initial RNA
                   
                    containers[rectname].transitionRNA(str);//???
                    //console.log(containers)
                    //containers[divName(d)].setOutlineColor(color(d.name));

                    //let colorStrings = d.colors.map(function(d, i) {
                    //    return `${i+1}:${d}`;
                    //}
                   // );

                   // let colorString = colorStrings.join(' ');

                   // containers[rectname].addCustomColorsText(colorString);
                }
                });
            





        viscontainer.selectAll("#treemapdiv").selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("x", function (d) { return d.x0 + 1 })    //  to adjust position (to the right)
            .attr("y", function (d) { return d.y0 + 8 })    //  to adjust position (lower)
            .text(function (d) {
                    let str=""; //console.log("here",strToPlot); 
                    strToPlot.forEach(el=>{
                        if (el.id==d.data.name){
                            str=el.structure    
                        }
                    })
                        //console.log(str)
                        //let cont=new FornaContainer("#"+d).transitionRNA(str)
                        //console.log(cont)
                    return d.data.name+"  "+str
                    })
            .attr("font-size", "10px")
            .attr("font-family", "DejaVu Sans Mono")
            .attr("fill", "white")
              
        d3new.select("#tableContainer")
            .selectAll("table").remove()
        let structures = d3new.select("#tableContainer").append("table")
            .style("font-family", "DejaVu Sans Mono")
        let th = structures.append("tr")
        th.append("td").text("ID")
        th.append("td").text("Time")
        th.append("td").text("Ocupancy")
        th.append("td").text("Structure")
        th.append("td").text("Energy")
//TODO monospace for structures
        structures.selectAll(".tableData").data(strToPlot).enter()
            .append("tr").attr("class", "tableData")
            .selectAll("td").data(d => [d.id, d.time, d.occupancy, d.structure, d.energy]).enter()
            .append("td").text(dd => dd);
            //WHERE TO PUT MONOSPACE
    return realtime
    }
    function drawCotranscriptionalLine() {
        let rainbowScale = (t) => { return d3new.hcl(t * 360, 100, 55); };
        //console.log(rainbowScale)
        //calculateNucleotideColors(data);
        //calculateColorPerTimePoint(nestedData);
    }
    // function RNAGraph( dotbracket = ''){
    //     var self = this;
    //     self.type = 'rna';
    //     self.dotbracket = dotbracket;  
    //     self.computePairtable = function() {
    //         self.pairtable = rnaUtilities.dotbracketToPairtable(self.dotbracket);
    //     };
    //     self.computePairtable();



   // }
}


function preparePlotArea(elementName, notificationContent = 'Loading...') {
    let container = d3new.select(elementName)
    container.selectAll('div')
        .remove()
    // container.selectAll('p')
    //     .remove()
    // loading indicator
    container.style('text-align', 'center')
        .append('div')
        .attr('id', 'loadingNotification')
        .style('display', 'inline')
        .html(notificationContent)
    // treemap container
    container
        .append('div')
        .attr('id', 'visContainer')
        .attr("height", 500)
        //.attr("width", )
    //.html("treemap-visual container")
    // table container
    container
        .append('div')
        .attr('id', 'tableContainer')
        .html(" <p>and time table container-most populated structure</p>")
}










function debounce(func, time){
    var time = time || 100; // 100 by default if no param
    var timer;
    return function(event){
        if(timer) clearTimeout(timer);
        timer = setTimeout(func, time, event);
    };
}