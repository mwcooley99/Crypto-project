var idleTimeout;

function idled() {
    idleTimeout = null;
}

var coins = {
    "Bitcoin": {
        color: "indigo",
        dailyData: [],
        monthlyData: [],
    },
    "Monero": {
        color: "orange",
        dailyData: [],
        monthlyData: [],
    },
    "Ethereum": {
        color: "blue",
        dailyData: [],
        monthlyData: [],
    },
    "Litecoin": {
        color: "red",
        dailyData: [],
        monthlyData: [],
    },
    "Bitcoin Cash": {
        color: "darkgreen",
        dailyData: [],
        monthlyData: [],
    },
    "EOS": {
        color: "yellowgreen",
        dailyData: [],
        monthlyData: [],
    },
    "Stellar": {
        color: "brown",
        dailyData: [],
        monthlyData: [],
    },
    "Cardano": {
        color: "lightskyblue",
        dailyData: [],
        monthlyData: [],
    },
    "Bitcoin SV": {
        color: "darkslategray",
        dailyData: [],
        monthlyData: [],
    },
    "Dash": {
        color: "pink",
        dailyData: [],
        monthlyData: [],
    }
};

// Format the data and convert to numerical and date values

var parseTime = d3.timeParse("%Y-%m-%d 00:00:00");

function formatLineData(data) {
    data.forEach(function (data) {
        data.date = parseTime(data.date);
        data.close = +data.close;
        data.volume = +data.volume;
        coins[data.name].dailyData.push({
            close: data.close,
            date: data.date,
            volume: data.volume
        });
    });
    renderPriceChart(data);
}


function formatBubbleData(data) {
    data.forEach(function (data) {
        data.date = parseTime(data.date);
        data.close = +data.close;
        data.volume = +data.volume;
        coins[data.name].monthlyData.push({
            close: data.close,
            date: data.date,
            volume: data.volume
        });
    });
    renderVolumeChart(data);
}

// Call format and render functions
formatLineData(lineData);
formatBubbleData(bubbleData);


function renderPriceChart(data) {
    // Chart Params
    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {top: 20, right: 60, bottom: 60, left: 50};

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3
        .select(".price")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .classed('svg_trend', true);

    var lineChart = svg.append("g")
        .attr("transform", `translate(${margin.left + 50}, ${margin.top})`);

    // Create scaling functions
    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

    var yMax = d3.max(data, (d => d.close));
    var yMin = d3.min(data, (d => d.close - 1000));

    var yLinearScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xTimeScale).ticks(12)
        .tickFormat(d3.timeFormat("%d-%b-%y"));

    var leftAxis = d3.axisLeft(yLinearScale);

    // Add x-axis
    var xAxis = lineChart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Add y-axis to the left side of the display
    lineChart.append("g")
    // Define the color of the axis text
        .classed("green", true)
        .call(leftAxis);

    var line1 = d3.line()
        .x(d => xTimeScale(d.date))
        .y(d => yLinearScale(d.close));

    // ---------------------------//
    //       HIGHLIGHT GROUP      //
    // ---------------------------//

    // What to do when one group is hovered
    var highlight = function (d) {
        // reduce opacity of all groups
        d3.selectAll(".bubbles").style("opacity", .05)
        // expect the one that is hovered
        d3.selectAll("." + d).style("opacity", 1)
    };

    // And when it is not hovered anymore
    var noHighlight = function (d) {
        d3.selectAll(".bubbles").style("opacity", 1)
    };

    svg.on("dblclick", function () {
        xTimeScale.domain(d3.extent(data, function (d) {
            return d.date;
        }))
        xAxis.transition().call(d3.axisBottom(xTimeScale))
        Object.keys(coins).forEach(function (coin) {
            lineChart
                .select('.' + coin.replace(/\s+/g, '-').toLowerCase())
                .transition()
                .attr("d", line1(coins[coin].dailyData))
        })
    });

    var brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("end", function () {
            // What are the selected boundaries?
            extent = d3.event.selection

            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if (!extent) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                xTimeScale.domain([4, 8])
            } else {
                xTimeScale.domain([xTimeScale.invert(extent[0]), xTimeScale.invert(extent[1])])
                lineChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            }

            // Update axis and line position
            xAxis.transition().duration(1000).call(d3.axisBottom(xTimeScale))
            Object.keys(coins).forEach(function (coin) {
                lineChart
                    .select('.' + coin.replace(/\s+/g, '-').toLowerCase())
                    .transition()
                    .duration(1000)
                    .attr("d", line1(coins[coin].dailyData))
            })
        });

    lineChart
        .append("g")
        .attr("class", "brush")
        .call(brush);

    Object.keys(coins).forEach(function (coin) {
        lineChart.append("path")
            .data(coins[coin].dailyData)
            .attr("class", "line " + coin.replace(/\s+/g, '-').toLowerCase())
            .attr("d", line1(coins[coin].dailyData))
            .style("stroke", coins[coin].color)
            .style("fill", "none")
    });

    // Append axes titles
    lineChart.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .style("font-weight", "bold")
        .classed("date text", true)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "Maroon")
        .text("Date");

    lineChart.append("text")
        .style("font-weight", "bold")
        .attr("fill", "Maroon")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 20)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Close Price");

    lineChart.selectAll("mylegend")
        .data(Object.keys(coins))
        .enter()
        .append("text")
        .style("font-weight", "bold")
        .attr('x', 30)
        .attr('y', function (d, i) {
            return 30 + i * 30
        })
        .text(function (d) {
            return d
        })
        .style("fill", function (d) {
            return coins[d].color;
        })
        .style("font-size", 15)
        .on("click", function (d) {
            // is the element currently visible ?
            let currentClass = d.replace(/\s+/g, '-').toLowerCase();
            var currentOpacity = lineChart.selectAll("." + currentClass).style("opacity");

            // Change the opacity: from 0 to 1 or from 1 to 0
            lineChart.selectAll("." + currentClass).transition().style("opacity", currentOpacity == 1 ? 0 : 1);
        });
}

function renderVolumeChart(data) {
    // Chart Params
    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {top: 20, right: 60, bottom: 60, left: 50};

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3
        .select(".volume")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .classed('svg_trend', true);

    var volumeChart = svg.append("g")
        .attr("transform", `translate(${margin.left + 50}, ${margin.top})`);//+height

    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(data, function (d) {
            return d.date
        }))
        .range([0, width]);

    var yMax = d3.max(data, (d => d.close));
    var yMin = d3.min(data, (d => d.close - 1000));

    var yLinearScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([height, 0]);

    var zLinearScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.volume))
        .range([2, 20]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xTimeScale).ticks(12)
        .tickFormat(d3.timeFormat("%Y-%b"));

    var leftAxis = d3.axisLeft(yLinearScale);

    volumeChart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Add y-axis to the left side of the display
    volumeChart.append("g")
    // Define the color of the axis text
    //.classed("green", true)
        .call(leftAxis);

    //Create Circles
    // ==============================
    var circlesGroup = volumeChart.selectAll("circle")
        .data(coins["Bitcoin"].monthlyData);

    Object.keys(coins).forEach(function (coin) {
        circlesGroup.enter()
            .data(coins[coin].monthlyData)
            .append("circle")
            .attr("cx", d => xTimeScale(d.date))
            .attr("cy", d => yLinearScale(d.close))
            .attr("r", d => zLinearScale(d.volume))
            .attr("class", "bubbles " + coin.replace(/\s+/g, '-').toLowerCase())
            .attr("fill", coins[coin].color)
            .style("font-size", "12px")
            .attr("opacity", "0.75")
            .exit()
            .remove();
    });

    volumeChart.append("text")
        .style("font-weight", "bold")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 20)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("fill", "Maroon")
        .text("Closing Price ($)");

    volumeChart.append("text")
        .style("font-weight", "bold")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .attr("fill", "Maroon")
        .text("Date");

    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white");

    var size = 20;

    //       HIGHLIGHT GROUP      //
    // ---------------------------//

    // What to do when one group is hovered
    var highlight = function (d) {
        // reduce opacity of all groups
        d3.selectAll(".bubbles").style("opacity", .001);
        // expect the one that is hovered
        d3.selectAll("." + d.replace(/\s+/g, '-').toLowerCase()).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function (d) {
        d3.selectAll(".bubbles").style("opacity", 1)
    }

    volumeChart.selectAll("circle")
        .append("circle")
        .data(Object.keys(coins))
        .enter()
        .attr("cx", 20)
        .attr("cy", function (d, i) {
            return 10 + i * (size + 5)
        })
        .attr("r", 7)
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight);

    // Add labels beside legend dots
    volumeChart.selectAll("mylegend")
        .data(Object.keys(coins))
        .enter()
        .append("text")
        .style("font-weight", "bold")
        .style("fill", function (d) {
            return coins[d].color;
        })
        .attr('x', 30)
        .attr("y", function (d, i) {
            return i * (size + 5) + (size / 2)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("font-size", 15)
        .text(function (d) {
            return d
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
}