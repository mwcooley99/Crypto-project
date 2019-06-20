
  // SVG wrapper dimensions are determined by the current width
  // and height of the browser window.
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

  // creating definitions (defs) with reusable components that we can use again and again
  //when you make defs, save them by itselfs
  var defs = svg.append('defs');

  // patterns make our photos to adjust to the size of the circle or square
  defs.append('pattern')
    
  // scale for circles radius
  var radiusScale = d3.scaleSqrt().domain([236000, 1270000]).range([20, 80])

  // putting forceX in var
  var forceXPreferred = d3.forceX(function(d){
    if(d.prefered_coin === "Bitcoin" || d.prefered_coin === "Bitcoin Cash")
    return width * 0.15
    if(d.prefered_coin === "Tron" || d.prefered_coin === "Ethereum")
    return width * 0.85
    else return width / 2
  }).strength(0.03)

  //putting forceY in var
  var forceYPreferred = d3.forceY(function(d){
    if(d.prefered_coin === "Bitcoin" || d.prefered_coin === "Ethereum")
    return height * 0.3
    if(d.prefered_coin === "Tron" || d.prefered_coin === "Bitcoin Cash")
    return height * 0.75
    else 
    return height / 2 
  }).strength(0.03)

  // putting forceCollide in var
  var forceCollide = d3.forceCollide(function(d){
    return radiusScale(d.twitter_followers) + 4
  })

  var forceXCombine = d3.forceX(width/2).strength(0.1)
  var forceYCombine = d3.forceY(height/2).strength(0.1)

  var forceXLocation = d3.forceX(function(d){
    if(d.location === "Europe")
    return width * 0.6
    else if(d.location === "USA")
    return width * 0.1
    else if(d.location === "Asia")
    return width * 0.9
    else 
    return width / 2
   }).strength(0.03)

   var forceYLocation = d3.forceY(function(d){
     console.log(d.location, d.name)
    if(d.location === "Europe")
    return height * 0.5
    if(d.location === "USA")
    return height * 0.7
    if(d.location === "Asia")
    return height * 0.7
    else 
    return height / 2
   }).strength(0.03)


  // simulation is a collection of forces about where we want our circles to go
  //and how we want our circles to interact
  var simulation = d3.forceSimulation()
  //getting circles to the middle
    .force('x', forceXCombine)
    .force('y', forceYCombine)
  //preventing circles to collide 
    .force('collide', forceCollide)

  d3.queue()
    .defer(d3.csv, './Resources/Influencers.csv')
    .await(ready)

  function ready (error, datapoints) {
    var tooltip = d3.select(".chart")
      .append("div")
        .attr("class", "tooltip")

    var showTooltip = function(d) {
      tooltip
        .style("display", "block")
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")
        .html('<div class="tooltip-content"><span class="name">'+d.name+'</span><div class="info">'+d.info+'</div>')
    }

    var moveTooltip = function(d) {
      tooltip
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")
    }

    var hideTooltip = function(d) {
      tooltip
        .style("display", "none")
    }

    defs.selectAll('.influencer-pattern')
    .data(datapoints)
    .enter()
    .append('pattern')
    .attr('class', 'influencer-pattern')
    .attr('id', function(d){
      return d.name.toLowerCase().replace(/ /g, '-')})
    .attr('height', '100%')
    .attr('width', '100%')
    .attr('patternContentUnits', 'objectBoundingBox')
    .append('image')
    .attr('height', 1)
    .attr('width', 1)
    .attr('preserveAspectRatio', 'none')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .attr('xlink:href', function(d) {
      return d.image_path})
   
    var circles = svg.selectAll('.influencer')
        .data(datapoints)
        .enter()
        .append('circle')
        .attr('class', 'influencer')
        .attr('r', function(d){
          return radiusScale(d.twitter_followers)
        })
        .attr('fill', function(d) {
          return 'url(#' + d.name.toLowerCase().replace(/ /g, '-') +')'})
        .attr('cx', 100)
        .attr('cy', 300)
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )


    d3.select('#combine').on('click', function(){
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

    d3.select('#preferred_coin').on('click', function(){
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

    d3.select('#location').on('click', function(){
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
        .attr('cx', function(d){
          return d.x
        })
        .attr('cy', function(d){
          return d.y
        })

    }

  }