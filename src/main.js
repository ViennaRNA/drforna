import * as d3new from "d3"
import * as domtoimage from "dom-to-image"
import {FornaContainer, RNAUtilities, rnaTreemap, rnaPlot} from 'fornac';
//import 'fornac/src/fornac.css';
//import dstyle from './drforna.css';

var rnaUtilities = new RNAUtilities();
let containers = {};

const occupancyTreshold = 0.01
function preparePlotArea(elementName, notificationContent = 'Loading...') {
    let container = d3new.select(elementName)
    container.selectAll('div')
        .remove()
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
        
    // table container
    container
        .append('div')
        .attr('id', 'tableContainer')
        .html(" <p>and time table container-most populated structure</p>")
}
start();
function start() {
    let filename
       
    
            //read from file
     document.querySelectorAll('.fileinput').forEach((item) => {
        item.addEventListener('change', (event) => {
            let rb=document.querySelectorAll('input[type=radio][name=fileinput]:checked')
            //console.log(rb)
            if (rb.length!=0)
                {rb[0].checked=false}
        
       
           let files = event.target.files
           filename=files[0].name
           //console.log(files)
           
            for (let i = 0, f; f = files[i]; i++) {
                let reader = new FileReader()
                reader.onload = (val) => {                                   
                   let a=[]
                   a = d3new.csvParse(val.target.result.replace(/ +/g, ","))      
                    containers = {}; 

                   ShowData(a)
                }            
                reader.readAsText(f);
            }
        });
    })
    //read selected example 
    document.querySelectorAll('.forminput').forEach((item) => {
        item.addEventListener('change', (event) => {
            document.querySelectorAll('.fileinput').forEach((item)=>{item.lastElementChild.value=""})
            let fileName = item.lastElementChild.value
           
            let a = []
            d3new.text(fileName).then(d => {
                a = d3new.csvParse(d.replace(/ +/g, ","))
                containers = {};
                let container = d3new.select("#visContainer")
                container.remove()
                
                ShowData(Array.from(a))
            })
        })
    })
    d3new.select("#downloadButton").on('click', function() {
        //console.log("here")
        downloadPng(document.getElementById('drTrafoContainer'));
    })
    
    function downloadPng(elem) {
        //console.log('Downloading... ', elem)
        domtoimage.toPng(elem)
        .then(function (dataUrl) {
            let link = document.createElement('a');
            let today=new Date()
            let date = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
            let time = today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();
            
            link.download = filename+"_"+date+"_"+time+'.png';
            alert("File "+link.download+" was downloaded")
            link.href = dataUrl;
            link.click();
        });
    }
}

let scale;
let logscale;
let scalel;
let svg;
let realtime;
let prevtime=null
let strtoPlotprev=null;
let sequenceLength = null;
let mouseactive=false;
function ShowData(data) {
    containers = {};
    preparePlotArea(drTrafoContainer); 
    let container = d3new.select("#drTrafoContainer");
    container.select('#loadingNotification').remove(); //remove the loading notification 
    
    prevtime=null
    strtoPlotprev=null
    sequenceLength=data[data.length - 1].structure.length; //length of the transcribed sequence, used for seeing when the transcription ends
    
    let visContainerWidth = d3new.select('#visContainer').node().getBoundingClientRect().width; //for resizing with window resize
    let lineChartWidth = visContainerWidth * .98; 
    let tableContainer = d3new.select(`#tableContainer`);
    tableContainer.selectAll("svg").remove()
    mouseactive=false
    const onResize = () => {
        //retain position we are at and if animation was on an remake plots accordingly!
        playAnimation = false
        
        tableContainer.selectAll("#timesvg").remove() //remove time scale
        //viscontainer.selectAll(".div").selectAll(".svg").remove() 
        viscontainer.selectAll("#treemapdiv").remove()//remove plots
        ShowData(data);// redraw plots
    }

    window.addEventListener("resize", debounce(onResize, 1000)); //when the window was resize, call the onResize function after 1000 ms

    let viscontainer = d3new.select('#visContainer')
    viscontainer.append('div').attr('id','treemapdiv').style('height', '500px')
    
    

    let filteredData = data.filter((d) => { return d.occupancy > occupancyTreshold })//select structures with high enough occupancy
    let nestedID=Array.from(d3new.group(filteredData, d => d.id)) //extract all the id's that occur, I actually only need id and structure in dot bracket 
                    // assign equal ocupancies to all the structures and create treemaps with the plots 
                    //such that later I only resize the plots, not regenerate them for every time step
                    //to have less lag
    //console.log(nestedID)
    let nestedData = Array.from(d3new.group(filteredData, d => d.time))//nest data by  time points to extract the structures to plot for every time step
    
    // havin the sequence length at the end, the end of transciption is identified as the first time step where the structures of that length occur
    let trascriptionSteps=[] 
    let AfterTrascription=[]
    let maxNoStr=0
    nestedData.forEach(el=>{
        if (el[1].length>maxNoStr){
        maxNoStr=el[1].length}
        //console.log(maxNoStr)
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
    
   // scale = d3new.scaleLinear()
    //    .domain([mintime, maxtime])
    //    .range([20, lineChartWidth-20]) 
    scalel = d3new.scaleLinear()
         .domain([minlintime, maxlintime])
         .range([30, (lineChartWidth-30)*.75])

    logscale = d3new.scaleLog() //    LOG SCALE, treat 0 as exception still TO DO!!!!!
          .domain([minlogtime, maxlogtime])
          .range([(lineChartWidth-30)*.75, lineChartWidth-30])


    const combinedScale = time => time < maxlintime
        ? scalel(time)
        : logscale(time);

    svg = d3new.select("#tableContainer")
        .append("svg")
        .attr("width", lineChartWidth)
        .attr("height", 120)
        .attr("id", "timesvg");
    //let x_axis = d3new.axisBottom().scale(scale);
    let x_axislog = d3new.axisBottom()
         .scale(logscale);
    let x_axislin = d3new.axisBottom()
         .scale(scalel);
    let rainbowScale = (t) => { return d3.hcl(360*t*t*t*t*t*t*t*t, 100, 55); };

    let nucleotideScale = d3new.scaleLinear()
        .range([80, 0]);
    if (sequenceLength == null)
        nucleotideScale.domain([0, data[data.length - 1].structure.length])
    else
        nucleotideScale.domain([0, sequenceLength]);
    var y_axis = d3new.axisLeft()
        .scale(nucleotideScale)



        calculateNucleotideColors(filteredData) 

        timer(2)
    let mostoccupiedpertime=[]
    nestedData.forEach(el=>{  
        console.log("here")
        let best=el[1][0]
        //console.log(best)
        let all=el[1]
        all.forEach(e=>{ //console.log(best.occupancy, "   " ,e.occupancy)
            if (e.occupancy>=best.occupancy){best=e}})
        mostoccupiedpertime.push([el[0], best])
        })


       // mostoccupiedpertime=Array.from(mostoccupiedpertime)
//SELECT NESTED DATA CU MOST OCCUPIED STRUCTURE
//TRANSLATE PANA LA TIME PE X-SCALE
//SI 80-SCALE(NT) PE Y
//WIDTH PANA LA NEXT TIME POINT
//HEIGHT CONSTANT
let mostocc=[mostoccupiedpertime[0]]
mostoccupiedpertime.forEach((el,i)=>{
    //console.log(mostocc[mostocc.length-1][1].id,"  ", el[1].id)

    if (el[1].id!=mostocc[mostocc.length-1][1].id){
        mostocc.push([el[0], el[1]])
    }
})
//console.log(mostocc)

mostocc.forEach((el,i)=>{//console.log(el[1], i, mostoccupiedpertime[i+1][0], combinedScale(mostoccupiedpertime[i+1][0]))
    let end=0
    if (i== mostocc.length-1){end=lineChartWidth-30}
    else{end=combinedScale(mostocc[i+1][0])}
    //console.log(i, " ", end)
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
        timer(3)    
       
                

    //Append group and insert axes

    svg.append("g").attr("width", lineChartWidth)
        .attr("height", 110)
        .attr("transform", "translate (30,10)")
        .call(y_axis)    
    // svg.append("g").attr("transform", "translate (0,90)").attr("height", 110)
    //     .call(x_axis);
     //console.log("here",scale(maxlintime), scale(maxlogtime))

    svg.append("g").attr("transform", "translate (0,90)").attr("height", 110).call(x_axislin);
    svg.append("g").attr("transform", "translate (0,90)").attr("height", 110).call(x_axislog).attr("color", "blue");
    
    //let join = viscontainer.selectAll("div").data([nestedData])
    //join.enter().append("div")
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

    let strToPlot;
    nestedData.forEach(element => {
         if (element[0] == mintime) {
              strToPlot = element[1] 
            } 
        })
    if (prevtime==null){
        prevtime = mintime
    }
    
    PLOT(prevtime)
    showLine(combinedScale(prevtime)) 

    svg.append("line") //append black line to mark end of transcription
            .attr("class", "transcriplengthLine")
            .attr("x1", scalel(maxlintime))  
            .attr("y1", 0)
            .attr("x2", scalel(maxlintime))  
            .attr("y2", 120)
            .style("stroke-width", 1.5)
            .style("stroke","black")
            .style("fill", "none");
    

    //toggle animation state on button click
    let delayPLOT = undefined;
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
    
    const animationDelay = 400;
    setInterval(() => {
        if (!playAnimation) {//console.log("aici ");\\ ruleaza o data pe secunda, nu e foarte frumos...
                 return;
        }
        const element = nestedData[elementIndex];
        PLOT(element[0])
        showLine(combinedScale(element[0]))
        elementIndex += 1;
        if (elementIndex >= nestedData.length)
            elementIndex = 0;
    }, animationDelay);

    let mousetime=30
    svg.on("click", function (event) {
        if (playAnimation) {playAnimation=!playAnimation};
        mouseactive=!mouseactive;
        
       // console.log("event", d3new.pointer(event)[0]);
        //scale invert for combined scale
        (d3new.pointer(event)[0]<scalel(maxlintime))
        ?mousetime = scalel.invert(d3new.pointer(event)[0]) 
        :mousetime= logscale.invert(d3new.pointer(event)[0])
       //console.log(mousetime-scale.invert(d3new.pointer(event)[0]) )
       
        
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
    timer(0)
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
            delayPLOT = setTimeout(PLOT, 10*maxNoStr, realtime);
            
            // PLOT(realtime)
            // timer("mouse")
           // timer(1)
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
    function formatColors (colors) {
                return colors.map(function(c) {
                  return c.rgb().toString();
                })
              }

    function makeTreemapData(data) {
        return [
            { name: "parent", parent: null, value: 0, str:"", colors: "" },
            ...data.map(el => (
                { 
                    name: el.id, parent: "parent", value: el.occupancy, str: el.structure, colors:formatColors(el.colors) }))
        ]
    }

    function PLOT(realtime) {       
         timer(1)
        nestedData.forEach(element => { 
            if (element[0] == realtime) {
                 strToPlot = element[1] 
                } 
            })
        
        if (strtoPlotprev!=strToPlot) {
          // console.log(strToPlot)
       
           //generate treemap data
        const treemapData = makeTreemapData(strToPlot);
       // console.log(treemapData)
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

            //  console.log(root.leaves())
        
        //const containers = {};
        viscontainer.select("#treemapdiv").remove()

        //what if I work with the join here 
        //in both- update dimensions
        //new, generate
        //only in old, delete
        


        viscontainer.append("div").attr("id", "treemapdiv") 
 //let cells=viscontainer.select("#treemapdiv").
            .style('position', 'relative')
            .style("width", `${svgWidth}px`)
            .style("height", `${svgHeight}px`)
            .selectAll(".svg").remove() // leave out
            .data(root.leaves())
            //cells.exit().remove() update size to 0
           // cells//
            .enter()
            .append("svg").attr("id",  function (d) { //console.log(d); // updare size 
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
            .style("border", "thin solid black")
            .each(function (d) {
               // console.log("d",d)
                let str=''
                let rectname="svg"+d.data.name
                if ( d.data.str != '') {
                    //timer() 
                    containers[rectname] = new FornaContainer('#' + rectname, 
                    {zoomable:false, editable:false,animation:false, transitionDuration:0, });//labelInterval:0
                   //timer("1")
                    containers[rectname].transitionRNA(d.data.str);  
                   //timer(2)
                   // console.log(containers)   
                   let colorStrings = d.data.colors.map(function(d, i) {
                       //console.log(d)
                    return `${i+1}:${d}`;
                });

                let colorString = colorStrings.join(' ');

                containers[rectname].addCustomColorsText(colorString);              
                
            }
                })
        //         ;
        
        // viscontainer.select("#treemapdiv").selectAll(".svg")
        //       .data(root.leaves())
        //       .enter()
            .append("text")
            .style('position', 'relative')
            .attr("x", function (d) { return 1 })    //  to adjust position (to the right)
            .attr("y", function (d) { return  10 })    //  to adjust position (lower)
            .text(function (d) {
                    return d.data.name
                    })
            .attr("font-size", "10px")
            .attr("font-family", "DejaVu Sans Mono")
            .attr("fill", "white");
              
        d3new.select("#tableContainer")
            .selectAll("table").remove()
        let structures = d3new.select("#tableContainer").append("table")
            .style("font-family", "DejaVu Sans Mono")
        //let colnames = ['ID',"Time" , 'Occupancy','Structure', 'Energy']
        //let columns = ['id', 'time', 'occupancy', 'structure', 'energy'];
        let th = structures.append("tr")
                th.append("td").text("ID")
                th.append("td").text("Time")
                th.append("td").text("Ocupancy")
                th.append("td").text("Structure")
                th.append("td").text("Energy")
        
        structures.selectAll(".tableData").data(strToPlot).enter()
            .append("tr").attr("class", "tableData")
            .selectAll("td").data(d => [d.id, d.time, Math.round(d.occupancy*1000)/1000, d.structure, d.energy]).enter()
            .append("td").text(dd =>dd)
           // .style("background-color", "white")
          
    } 
    else {strtoPlotprev=strToPlot}     
    return realtime
    }
    // function calculateColorPerTimePoint(nestedData) {
    //     nestedData.forEach((d) => {
    //         d.values.sort((a,b) => { return (+b.occupancy) - (+a.occupancy); });
    //     });
    // }

    function calculateNucleotideColors(data) {
        data.forEach(function(d, i) {
            // determine the colors of each nucleotide according to the position
            // of the stem that they're in
            // each 'd' is a line in the dr transfomer output
            d.time = +d.time;
            d.occupancy = +d.occupancy;

            // get a pairtable and a list of the secondary structure elements
            let pt = rnaUtilities.dotbracketToPairtable(d.structure);
            //console.log(pt)
            let elements = rnaUtilities.ptToElements(pt, 0, 1, pt[0], []);

            // store the colors of each nucleotide
            let colors = Array(pt[0]).fill(d3.hsl("white"));
            //console.log(elements)
        

            for (let i = 0; i < elements.length; i++) {
                if (elements[i][0] != 's')
                    continue;     //we're not interested in anything but stems

                // for each nucleotide in the stem
                // assign it the stem's average nucleotide number
                let averageBpNum = elements[i][2].reduce(
                    (a,b) => { return a+b }, 0) / elements[i][2].length;
                   
                // convert average nucleotide numbers to colors
                elements[i][2].map((d) => {
                    let nucleotideNormPosition = nucleotideScale(+averageBpNum);
                    colors[d-1] = rainbowScale(nucleotideNormPosition);
                    //console.log(elements[i])
                    //console.log(i, averageBpNum, nucleotideNormPosition,  colors[d-1])
                });


                // each structure gets its own set of structures
            }
            d.colors = colors;
            //console.log(d)
        });
    }



} 






function timer(lap){ 
    if(lap) console.log(`${lap} in: ${(performance.now()-timer.prev).toFixed(3)}ms`); 
    timer.prev = performance.now();
}

function debounce(func, time){
    var time = time || 100; // 100 by default if no param
    var _timer;
    return function(event){
        if (_timer) clearTimeout(_timer);
        _timer = setTimeout(func, time, event);
    };
}
