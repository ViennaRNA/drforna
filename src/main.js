import * as d3 from "d3"
const occupancyTreshold = 0.01

// document.addEventListener("DOMContentLoaded", start());
//document.onload =
start();
function start() {
    console.log('start', document.querySelectorAll('.forminput'));
    document.querySelectorAll('.fileinput').forEach((item) => {
        //console.log('123')
        item.addEventListener('change', (event) => {
            preparePlotArea(drTrafoContainer)
            let container = d3.select("#drTrafoContainer")
            container.select('#loadingNotification').remove()
            //console.log("File", event.target.files);
            
            let files = event.target.files
            for (let i = 0, f; f = files[i]; i++) {
                let reader = new FileReader()
                //console.log(reader)
                reader.onload = (val) => {                                   
                   let a = d3.csvParse(val.target.result.replace(/ +/g, ","))                   
                    ShowData(a)
                }            
                reader.readAsText(f);
            }

        });
    })

    document.querySelectorAll('.forminput').forEach((item) => {
        console.log('456');
        item.addEventListener('change', (event) => {
            console.log(event)
            let fileName = item.lastElementChild.value
            console.log("here", fileName)
            preparePlotArea(drTrafoContainer)
            let container = d3.select("#drTrafoContainer")
            container.select('#loadingNotification').remove()

            let a = []
            d3.text(fileName).then(d => {
                a = d3.csvParse(d.replace(/ +/g, ","))
                ShowData(Array.from(a))
            })
        })
    })
}
// d3.dsv(" ",fileName).then((data)=>{
//     console.log(data)            
//     // energy not taken because of double-tripple spacing in the original file format
//     ShowData(Array.from(data)) })

let scale;
let svg;
let realtime
let sequenceLength = null;



function ShowData(data) {
    console.log(data)
    let tableContainer = d3.select(`#tableContainer`)
    //const lineChartWidth=1450
    let visContainerWidth = d3.select('#visContainer').node().getBoundingClientRect().width
    let lineChartWidth = visContainerWidth * .98;

    const onResize = () => {
        tableContainer.selectAll("#timesvg").remove()
        // redraw plots
        ShowData(data);
    }

    window.addEventListener("resize", debounce(onResize, 1000));


    let maxtime = d3.max(data, d => Number(d.time))
    let mintime = d3.min(data, d => Number(d.time))
    //console.log(maxtime, mintime)
    // console.log(Number(maxtime) + 0.001)  
   
    tableContainer.selectAll("p").remove()
    scale = d3.scaleLinear()
        .domain([mintime, maxtime])// + (maxtime-mintime)/100
        .range([20, lineChartWidth - 20])
    svg = d3.select("#tableContainer")
        .append("svg")
        .attr("width", lineChartWidth)
        .attr("height", 120)
        .attr("id", "timesvg");

    var x_axis = d3.axisBottom()
        .scale(scale)

    let nucleotideScale = d3.scaleLinear()
        .range([80, 0]);
    if (sequenceLength == null)
        nucleotideScale.domain([0, data[data.length - 1].structure.length])

    else
        nucleotideScale.domain([0, sequenceLength]);
    //calculateNucleotideColors(data);
    var y_axis = d3.axisLeft()
        .scale(nucleotideScale)

    svg.append("g").attr("width", lineChartWidth)
        .attr("height", 110)
        .attr("transform", "translate (20,10)")
        .call(y_axis)
    //Append group and insert axis
    svg.append("g").attr("transform", "translate (0,90)").attr("height", 110)
        .call(x_axis);


   
    


    let viscontainer = d3.select('#visContainer')
    var filteredData = data.filter((d) => { return d.occupancy > occupancyTreshold })
    console.log(filteredData)
    var nestedData = Array.from(d3.group(filteredData, d => d.time))
    let join = viscontainer.selectAll("div").data([nestedData])
    join.enter()
        .append("div")


    //draw points on x axis for existing time points
    const timePoints = nestedData.map(d => +d[0]);
    //console.log(timePoints);
    d3.select("#timesvg").selectAll('.timePoint').remove();
    d3.select("#timesvg").selectAll('.timePoint').data(timePoints)
        .enter()
            .append('circle')
                .attr('class', 'timePoint')
                .attr('cx', d => scale(d))
                .attr('cy', 90)
                .attr('r', 1)
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('strokeWidth', 1);

    let strToPlot
    nestedData.forEach(element => { if (element[0] == mintime) { strToPlot = element[1] } })
    let prevtime = mintime
    PLOT(mintime)
    showLine(scale(mintime))

    //toggle animation state on button click
    let playAnimation = false;
    let play = d3.select("#toggleAnimation");
    let elementIndex = 0;
    play.on("click", () => {playAnimation = !playAnimation
    
    nestedData.forEach(element => { if (element[0] == +prevtime) { elementIndex=nestedData.indexOf(element)}})
   //console.log("time", prevtime)
    //console.log("index", elementIndex)
     ;})

    //animate plot
    const animationDelay = 1000;
    
    
    
    
    setInterval(() => {
        if (!playAnimation) {//console.log("aici ");\\ ruleaza o data pe secunda, nu e foarte frumos...
                 return;}
        
        
        const element = nestedData[elementIndex];
        
        PLOT(element[0])
        
        showLine(scale(element[0]))
        elementIndex += 1;
        if (elementIndex >= nestedData.length)
            elementIndex = 0;
    }, animationDelay);



    drawCotranscriptionalLine()
    //rnaU=new rnaUtilities()
    //console.log(rnaU)
    //calculateNucleotideColors(data)

    svg.on("mouseover", function (event, d) {
        //console.log(d3.pointer(event)[0]);
        if (playAnimation) return;
        const mousetime = scale.invert(d3.pointer(event)[0]);
        //console.log(mousetime)

        for (let t in data) {
            //console.log(data[t].time)
            if (data[t].time <= mousetime) { realtime = data[t].time }//?? is there a way to only generate a new plot if the time has changed from the previous mouse position?
            //maybe something like a band scale instead of a continuous scale....
        }
        //console.log(realtime)
        //console.log(nestedData)
        if (prevtime != realtime) {
            prevtime = realtime
            PLOT(realtime)
        }

    }).on("mousemove", function (event, d) {
        if (playAnimation) return;
        //console.log(d3.pointer(event)[0]);
        const mousetime = scale.invert(d3.pointer(event)[0]);
        //console.log(d3.pointer(event)[0], "here")
        if (d3.pointer(event)[0] >= 20 && d3.pointer(event)[0] <= 1430) {
            showLine(d3.pointer(event)[0])
        }

        //console.log(mousetime)

        for (let t in data) {
            //console.log(data[t].time)
            if (data[t].time <= mousetime) { realtime = data[t].time }//?? is there a way to only generate a new plot if the time has changed from the previous mouse position?
            //maybe something like a band scale instead of a continuous scale....
        }
        console.log(realtime)
        //console.log(nestedData)
        if (prevtime != realtime) {
            prevtime = realtime
            PLOT(realtime)
        }
    })


    function showLine(coord) {
        svg.selectAll("line").remove()
        svg.append("line")
            .attr("x1", coord)  //<<== change your code here
            .attr("y1", 0)
            .attr("x2", coord)  //<<== and here
            .attr("y2", 120)
            .style("stroke-width", 1)
            .style("stroke", "red")
            .style("fill", "none");
    }

    function makeTreemapData(strToPlot) {
        return [
            { name: "parent", parent: null, value: 0 },
            ...strToPlot.map(el => ({ name: el.id, parent: "parent", value: el.occupancy }))
        ]
    }
    function PLOT(realtime) {
        nestedData.forEach(element => { if (element[0] == realtime) { strToPlot = element[1] } })
        //console.log(strToPlot)
        //generate treemap data
        const treemapData = makeTreemapData(strToPlot);
        //console.log(treemapData);
        const svgWidth = lineChartWidth

        const svgHeight = 500

        var root = d3.stratify()
            .id(function (d) { return d.name; })   // Name of the entity (column name is name in csv)
            .parentId(function (d) { return d.parent; })   // Name of the parent (column name is parent in csv)
            (treemapData);
        root.sum(d => +d.value)   // Compute the numeric value for each entity
        d3.treemap()
            .size([svgWidth, svgHeight])
            .padding(4)
            (root)

        viscontainer.selectAll(".treemapsvg").remove()
        viscontainer.append("svg").attr("class", "treemapsvg").attr("width", svgWidth).attr("height", svgHeight)
            .selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "black")
            .style("fill", "#62b6a2");
        viscontainer.selectAll(".treemapsvg").selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("x", function (d) { return d.x0 + 1 })    //  to adjust position (to the right)
            .attr("y", function (d) { return d.y0 + 8 })    //  to adjust position (lower)
            .text(function (d) { return d.data.name })
            .attr("font-size", "10px")
            .attr("fill", "white")

        d3.select("#tableContainer")
            .selectAll("table").remove()
        let structures = d3.select("#tableContainer").append("table")
        let th = structures.append("tr")
        th.append("td").text("ID")
        th.append("td").text("Time")
        th.append("td").text("Ocupancy")
        th.append("td").text("Structure")
        th.append("td").text("Energy")

        structures.selectAll(".tableData").data(strToPlot).enter()
            .append("tr").attr("class", "tableData")
            .selectAll("td").data(d => [d.id, d.time, d.occupancy, d.structure, d.energy]).enter()
            .append("td").text(dd => dd);
        //  .html(d => `<td>${d.id}</td><td>${d.time}</td><td>${d.struct}</td><td>${d.energy}</td>`)
        //structures.data(strToPlot).enter().append("tr")

        return realtime
    }
    function drawCotranscriptionalLine() {
        let rainbowScale = (t) => { return d3.hcl(t * 360, 100, 55); };
    }
}

function preparePlotArea(elementName, notificationContent = 'Loading...') {
    let container = d3.select(elementName)
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