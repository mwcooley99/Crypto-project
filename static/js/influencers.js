var width = 960;
var height = 600;

var svg = d3
    .select('.chart')
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .classed('svg', true)
    .append('g')
    .attr('transform', 'translate(0,0)')

var defs = svg.append('defs');

defs.append('pattern')

var radiusScale = d3.scaleSqrt().domain([236000, 1270000]).range([20, 80])

var forceXPreferred = d3.forceX(function (d) {
    if (d.preferred_coin === "Bitcoin" || d.preferred_coin === "Bitcoin Cash")
        return width * 0.15
    if (d.preferred_coin === "Tron" || d.preferred_coin === "Ethereum")
        return width * 0.85
    else return width / 2
}).strength(0.03)

var forceYPreferred = d3.forceY(function (d) {
    if (d.preferred_coin === "Bitcoin" || d.preferred_coin === "Ethereum")
        return height * 0.3
    if (d.preferred_coin === "Tron" || d.preferred_coin === "Bitcoin Cash")
        return height * 0.75
    else
        return height / 2
}).strength(0.03)

var forceCollide = d3.forceCollide(function (d) {
    return radiusScale(d.twitter_followers) + 4
})

var forceXCombine = d3.forceX(width / 2).strength(0.1)
var forceYCombine = d3.forceY(height / 2).strength(0.1)

var forceXLocation = d3.forceX(function (d) {
    if (d.location === "Switzerland")
        return width * 0.5
    if (d.location === "Cyprus")
        return width * 0.55
    else if (d.location === "USA")
        return width * 0.1
    else if (d.location === "Japan")
        return width * 0.96
    else if (d.location === "Singapore")
        return width * 0.9
    else
        return width / 2
}).strength(0.03)

var forceYLocation = d3.forceY(function (d) {
    if (d.location === "Switzerland")
        return height * 0.55
    if (d.location === "Cyprus")
        return height * 0.65
    if (d.location === "USA")
        return height * 0.6
    if (d.location === "Europe")
        return height * 0.5
    if (d.location === "Singapore")
        return height * 0.9
    else
        return height / 2
}).strength(0.03)

var simulation = d3.forceSimulation()
    .force('x', forceXCombine)
    .force('y', forceYCombine)
    .force('collide', forceCollide)

d3.csv('/static/Resources/Influencers.csv').then(function(datapoints) {
    var tooltip = d3.select(".chart")
        .append("div")
        .attr("class", "tooltip-inf")

    var showTooltip = function (d) {
        tooltip
            .style("left", (d3.mouse(this)[0] + 70) + "px")
            .style("top", (d3.mouse(this)[1] + 70) + "px")
            .style("display", "block")
            .html('<div class="tooltip-content"><span class="name">' + d.name + '</span><div class="info">' + d.info + '</div>')
    }

    var moveTooltip = function (d) {
        tooltip
            .style("left", (d3.mouse(this)[0] + 70) + "px")
            .style("top", (d3.mouse(this)[1] + 70) + "px")
    }

    var hideTooltip = function (d) {
        tooltip
            .style("display", "none")
    }

    var clickInfluencer = function (d) {

    }

    defs.selectAll('.influencer-pattern')
        .data(datapoints)
        .enter()
        .append('pattern')
        .attr('class', 'influencer-pattern')
        .attr('id', function (d) {
            return d.name.toLowerCase().replace(/ /g, '-')
        })
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('patternContentUnits', 'objectBoundingBox')
        .append('image')
        .attr('height', 1)
        .attr('width', 1)
        .attr('preserveAspectRatio', 'none')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .attr('xlink:href', function (d) {
            return d.image_path
        })

    var circles = svg.selectAll('.influencer')
        .data(datapoints)
        .enter()
        .append('circle')
        .attr('class', 'influencer')
        .attr('r', function (d) {
            return radiusScale(d.twitter_followers)
        })
        .attr('fill', function (d) {
            return 'url(#' + d.name.toLowerCase().replace(/ /g, '-') + ')'
        })
        .attr('cx', 100)
        .attr('cy', 300)
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)
        .on("click", function (d) {
            var current = d3.select(this).style("fill")
            var face = 'url(#' + d.name.toLowerCase().replace(/ /g, '-') + ')'
            var alterEgo = 'url(#' + d.alter_ego + ')'

            if (current == alterEgo) {
                d3.select(this).style("fill", face);
            } else {
                d3.select(this).style("fill", alterEgo);
            }
        });

    d3.select('#combine').on('click', function () {
        d3.select('.chart .svg')
            .classed("combine", true)
            .classed("preferred", false)
            .classed("location", false)

        simulation
            .force('x', forceXCombine)
            .force('y', forceYCombine)
            .alphaTarget(0.1)
            .restart()
    })

    d3.select('#preferred_coin').on('click', function () {
        d3.select('.chart .svg')
            .classed("combine", false)
            .classed("preferred", true)
            .classed("location", false)

        simulation
            .force('x', forceXPreferred)
            .force('y', forceYPreferred)
            .alphaTarget(0.5)
            .restart()
    })

    d3.select('#location').on('click', function () {
        d3.select('.chart .svg')
            .classed("combine", false)
            .classed("preferred", false)
            .classed("location", true)

        simulation
            .force('x', forceXLocation)
            .force('y', forceYLocation)
            .alphaTarget(0.5)
            .restart()
    })

    simulation.nodes(datapoints)
        .on('tick', ticked)

    function ticked() {
        circles
            .attr('cx', function (d) {
                return d.x
            })
            .attr('cy', function (d) {
                return d.y
            })

    }
});