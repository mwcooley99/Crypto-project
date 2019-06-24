

// Chart Params
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svgLine = d3
  .select("#multiline")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroupLine = svgLine.append("g")
  .attr("transform", `translate(${margin.left+50}, ${margin.top})`);

// Import data from an external CSV file
//var file = "crypto.csv"

// Function is called and passes csv data
//d3.csv(file).then(successHandle, errorHandle);
// d3.json("/crypto_top_10_line").then(function(data) {
//     console.log(data);
//   successHandle(data);
// });
successHandle(line_data);
// Read csv file
//If error exist, it will show in console
//function errorHandle(error) {
//   throw err;
//}

function successHandle(cryptoData) {

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
      data.date = parseTime(data.date);
      data.close = +data.close;
    
    // console.log(data);
    if(data.name == "Bitcoin")
    {
        bitcoin.push({ close: data.close,  date: data.date});
    }
    else if(data.name == "Ethereum")
    {
        ethereum.push({ close: data.close,  date: data.date});

    }
    else if (data.name =="Litecoin")
    {
        litcoin.push({ close: data.close,  date: data.date});
    }
    else if (data.name =="Monero")
    {
        monero.push({ close: data.close,  date: data.date});
    }

    else if (data.name =="Bitcoin Cash")
    {
        bitcoinCash.push({ close: data.close,  date: data.date});
    }
    else if (data.name =="Dash")
    {
        dash.push({ close: data.close,  date: data.date});
    }
    else if (data.name =="Bitcoin SV")
    {
        bitcoinSv.push({ close: data.close,  date: data.date});
    }
    else if (data.name =="EOS")
    {
        eos.push({ close: data.close,  date: data.date});
    }
    else if (data.name =="Stellar")
    {
        stellar.push({ close: data.close,  date: data.date});
    }
    else if (data.name =="Cardano")
    {
        cardano.push({ close: data.close,  date: data.date});
    }

    });

  // Create scaling functions
  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(cryptoData, d => d.date))
    .range([0, width]);

    var yMax = d3.max(cryptoData,(d=>d.close));
    var yMin = d3.min(cryptoData,(d=>d.close-1000));

  // console.log(d3.extent(cryptoData,d=>d.date));

  var yLinearScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([height, 0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xTimeScale).ticks(12)
    .tickFormat(d3.timeFormat("%d-%b-%y"));
  var leftAxis = d3.axisLeft(yLinearScale);


  // Add x-axis
  chartGroupLine.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y-axis to the left side of the display
  chartGroupLine.append("g")
    // Define the color of the axis text
    .classed("green", true)
    .call(leftAxis);

  // Line generators for each line
  
   

   
    var line1 = d3.line()
    .x(d => xTimeScale(d.date))
    .y(d=> yLinearScale(d.close));
    
    
//console.log(line1(bitcoin));



  // ---------------------------//
  //       HIGHLIGHT GROUP      //
  // ---------------------------//

  // What to do when one group is hovered
  var highlight = function(d){
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", .05)
    // expect the one that is hovered
    d3.selectAll("."+d).style("opacity", 1)
  }

  // And when it is not hovered anymore
  var noHighlight = function(d){
    d3.selectAll(".bubbles").style("opacity", 1)
  }



  // Append paths for lines
  chartGroupLine.append("path")
    .data(bitcoin)
    .attr("class","bitcoin")
    .attr("d", line1(bitcoin))
    .classed("black", true);

  
    chartGroupLine.append("path")
    .data(ethereum)
    .attr("class","ethereum")
    .attr("d", line1(ethereum))
    .classed("orange", true);


    chartGroupLine.append("path")
    .data(litcoin)
    .attr("class","litcoin")
    .attr("d", line1(litcoin))
    .classed("navyblue", true);

    chartGroupLine.append("path")
    .data(monero)
    .attr("class","monero")
    .attr("d", line1(monero))
    .classed("red", true);

    chartGroupLine.append("path")
    .data(bitcoinCash)
    .attr("class","bitcoinCash")
    .attr("d", line1(bitcoinCash))
    .classed("darkgreen", true);


    chartGroupLine.append("path")
    .data(dash)
    .attr("class","dash")
    .attr("d", line1(dash))
    .classed("yellowgreen", true);

    chartGroupLine.append("path")
    .data(bitcoinSv)
    .attr("class","bitcoinSv")
    .attr("d", line1(bitcoinSv))
    .classed("acquamarine", true);

    chartGroupLine.append("path")
    .data(eos)
    .attr("class","eos")
    .attr("d", line1(eos))
    .classed("lightskyblue", true);

    chartGroupLine.append("path")
    .data(stellar)
    .attr("class","stellar")
    .attr("d", line1(stellar))
    .classed("darkslategray", true);

    chartGroupLine.append("path")
    .data(cardano)
    .attr("class","cardano")
    .attr("d", line1(cardano))
    .classed("sandybrown", true);


  // Append axes titles
  chartGroupLine.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .style("font-weight","bold")
    .classed("date text", true)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "Maroon")
    .text("Date");

  chartGroupLine.append("text")
  .style("font-weight","bold")
  .attr("fill", "Maroon")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 20)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Close Price"); 



    chartGroupLine.selectAll("mylegend")
        .data(allGroup)
        .enter()
        .append("text")
        .style("font-weight","bold")
        .attr('x',30)
        .attr('y',  function(d,i){ return 30 + i*30})
        .text(function(d) { return d })
        .attr("class", function(d) {return (d+"_legend")})
        
        //.style("fill", function(d){ return Color(d.name) })
          .style("font-size", 15)
        .on("click", function(d){
          // is the element currently visible ?
          currentOpacity = d3.selectAll("." + d).style("opacity")
          // Change the opacity: from 0 to 1 or from 1 to 0
          d3.selectAll("." + d).transition().style("opacity", currentOpacity == 1 ? 0:1);

        });
}

