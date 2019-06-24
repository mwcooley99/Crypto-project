// Chart Params
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 60, bottom: 60, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  //.attr("id", "chart")
  .attr("transform", `translate(${margin.left+50}, ${margin.top})`);//+height


d3.json("http://localhost:8000/data.json").then( function(data) {
  // alert(error);
  //console.log("Hello world");
  // console.log(data);

  successHandle(data) 
})

function successHandle(cryptoData) {

// Format the data and convert to numerical and date values


var allGroup = ["bitcoin","monero","ethereum","litcoin","bitcoinCash","eos","stellar","cardano","bitcoinSv","dash"]
// Format the data and convert to numerical and date values

 var parseTime = d3.timeParse("%Y-%m-%d 00:00:00");

  var bitcoin =[];
   var monero =[];
    var ethereum =[];
   var litcoin=[];
   var bitcoinCash=[];
    var eos=[];
    var stellar=[];
    var cardano=[]
    var bitcoinSv=[];
    var dash=[];

// Format the data
    cryptoData.forEach(function(data) 
    {
      //console.log(data);
      //console.log(parseTime(data.full_date));

      data.date = parseTime(data.full_date);
      data.close = +data.close;
      data.volume=+data.volume;
  

   if(data.name == "Bitcoin")
    {
        bitcoin.push({ close: data.close,  date: data.date, volume: data.volume});
    }
    else if(data.name == "Ethereum")
    { 
        ethereum.push({ close: data.close,  date: data.date,volume: data.volume});

    }
    else if (data.name =="Litecoin")
    {
        litcoin.push({ close: data.close,  date: data.date,volume: data.volume});
    }
    else if (data.name =="Monero")
    {
        monero.push({ close: data.close,  date: data.date,volume: data.volume});
    }

    else if (data.name =="Bitcoin Cash")
    {
        bitcoinCash.push({ close: data.close,  date: data.date,volume: data.volume});
    }
   else if (data.name =="Dash")
   {
       dash.push({ close: data.close,  date: data.date,volume: data.volume});
   }
     if (data.name =="Bitcoin SV")
    {
        bitcoinSv.push({ close: data.close,  date: data.date,volume: data.volume});
    }
    else if (data.name =="EOS")
    {
        eos.push({ close: data.close,  date: data.date,volume: data.volume});
    }
    else if (data.name =="Stellar")
    {
        stellar.push({ close: data.close,  date: data.date,volume: data.volume});
    }
    else if (data.name =="Cardano")
    {
        cardano.push({ close: data.close,  date: data.date,volume: data.volume});
    }

    });
console.log(bitcoinSv)

//xmin =d3.min(cryptoData,d=>d.date)
//xmax=d3.max(cryptoData,d=>d.date )
    var xTimeScale = d3.scaleTime()
    .domain(d3.extent(cryptoData, d => d.date))
    .range([0, width]);

    var yMax = d3.max(cryptoData,(d=>d.close));
    var yMin = d3.min(cryptoData,(d=>d.close-1000));

    var yLinearScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([height, 0]);

    var zLinearScale = d3.scaleLinear()
    .domain(d3.extent(cryptoData,d=>d.volume))
    .range([2,20]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xTimeScale).ticks(12)
    .tickFormat(d3.timeFormat("%Y-%b"));
  var leftAxis = d3.axisLeft(yLinearScale);

  chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// Add y-axis to the left side of the display
    chartGroup.append("g")
  // Define the color of the axis text
  .classed("green", true)
  .call(leftAxis);

  //Create Circles
  // ==============================
 var circlesGroup = chartGroup.selectAll("circle")
 .data(bitcoin)
  
  circlesGroup.enter()
  .append("circle")
  .attr("cx", d => xTimeScale(d.date))
  .attr("cy", d => yLinearScale(d.close))
  .attr("r", d=>zLinearScale(d.volume))
  .attr("class", "bubbles bitcoin")
  .attr("fill", "black")
  .style("font-size", "12px")
  .attr("opacity", "0.75")
  .exit()
  .remove();
  
  circlesGroup.enter()
  .data(ethereum)
  .append("circle")
  .attr("cx", d => xTimeScale(d.date))
  .attr("cy", d => yLinearScale(d.close))
  .attr("r", d=>zLinearScale(d.volume))
  .attr("class", "bubbles ethereum")
  .attr("id", "ethereum")
  .attr("fill", "orange")
  .style("font-size", "12px")
  .attr("opacity", "0.75")
  .exit()
  .remove();

  circlesGroup.enter()
  .data(monero)
  .append("circle")
  .attr("cx", d => xTimeScale(d.date))
  .attr("cy", d => yLinearScale(d.close))
  .attr("r", d=>zLinearScale(d.volume))
  .attr("class", "bubbles monero")
  .attr("fill", "red")
  .style("font-size", "12px")
  .attr("opacity", "0.75")
  .exit()
  .remove();

  circlesGroup.enter()
  .data(litcoin)
  .append("circle")
  .attr("cx", d => xTimeScale(d.date))
  .attr("cy", d => yLinearScale(d.close))
  .attr("r", d=>zLinearScale(d.volume))
  .attr("class", "bubbles litcoin")
  .attr("fill", "navy")
  .style("font-size", "12px")
  .attr("opacity", "0.75")
  .exit()
  .remove();

  circlesGroup.enter()
  .data(bitcoinCash)
  .append("circle")
  .attr("cx", d => xTimeScale(d.date))
  .attr("cy", d => yLinearScale(d.close))
  .attr("r", d=>zLinearScale(d.volume))
  .attr("class", "bubbles bitcoinCash")
  .attr("fill", "darkgreen")
  .style("font-size", "12px")
  .attr("opacity", "0.75")
  .exit()
  .remove();

  
  circlesGroup.enter()
  .data(dash)
  .append("circle")
  .attr("cx", d => xTimeScale(d.date))
  .attr("cy", d => yLinearScale(d.close))
  .attr("r", d=>zLinearScale(d.volume))
  .attr("class", "bubbles dash")
  .attr("fill", "yellowgreen")
  .style("font-size", "12px")
  .attr("opacity", "0.75")
  .exit()
  .remove();

  console.log(bitcoinSv);


  circlesGroup.enter()
  .data(bitcoinSv)
  .append("circle")
  .attr("cx", d => xTimeScale(d.date))
  .attr("cy", d => yLinearScale(d.close))
  .attr("r", d=>zLinearScale(d.volume))
  .attr("class", "bubbles bitcoinSv")
  .attr("fill", "aquamarine")
  .style("font-size", "12px")
  .attr("opacity", "0.75")
  .exit()
  .remove();


  console.log(stellar);
  circlesGroup.enter()
  .data(stellar)
  .append("circle")
  .attr("cx", d => xTimeScale(d.date))
  .attr("cy", d => yLinearScale(d.close))
  .attr("r", d=>zLinearScale(d.volume))
  .attr("class", "bubbles stellar")
  .attr("fill", "darkslategray")
  .style("font-size", "12px")
  .attr("opacity", "0.75")
  .exit()
  .remove();

  circlesGroup.enter()
  .data(cardano)
  .append("circle")
  .attr("cx", d => xTimeScale(d.date))
  .attr("cy", d => yLinearScale(d.close))
  .attr("r", d=>zLinearScale(d.volume))
  .attr("class", "bubbles cardano")
  .attr("fill", "sandybrown")
  .style("font-size", "12px")
  .attr("opacity", "0.75")
  .exit()
  .remove();

  circlesGroup.enter()
  .data(eos)
  .append("circle")
  .attr("cx", d => xTimeScale(d.date))
  .attr("cy", d => yLinearScale(d.close))
  .attr("r", d=>zLinearScale(d.volume))
  .attr("class", "bubbles eos")
  .attr("fill", "lightskyblue")
  .style("font-size", "12px")
  .attr("fill", "Maroon")
  .attr("opacity", "0.75")
  .exit()
  .remove();

      chartGroup.append("text")
      .style("font-weight","bold")
      .attr("transform", "rotate(-90)")
      .attr("y", 0- margin.left-20)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("fill", "Maroon")
      .text("Closing Price");

    chartGroup.append("text")
      .style("font-weight","bold")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .attr("fill", "Maroon")
      .text("Date");


      // Add one dot in the legend for each name.
    var size = 20


  //       HIGHLIGHT GROUP      //
  // ---------------------------//

  // What to do when one group is hovered
  var highlight = function(d){
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", .001)
    // expect the one that is hovered
    d3.selectAll("."+d).style("opacity", 1)
  }

  // And when it is not hovered anymore
  var noHighlight = function(d){
    d3.selectAll(".bubbles").style("opacity", 1)
  }
    
    chartGroup.selectAll("circle")
      .append("circle")
      .data(allGroup)
      .enter()
        .attr("cx", 390)
        .attr("cy", function(d,i){ return 10 + i*(size+5)}) 
        .attr("r", 7)
        .attr("class", function(d) {return d+"_legend"})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)


           // Add labels beside legend dots
    chartGroup.selectAll("mylegend")
    .data(allGroup)
    .enter()
    .append("text")
    .style("font-weight","bold")
    .attr('x',30)
  
      .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("class", function(d) {return d+"_legend"})
      .style("font-size", 15)
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)


}