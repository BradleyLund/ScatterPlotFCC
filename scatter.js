fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(response => response.json())
  .then(data=> {

  
  const width = 900
  const height = 500
  const padding = 50
  
  //format data for x axis
//   var yearFormat = "%Y"
//   var parsedYear = data.map((d)=>{
//     return d3.timeParse(yearFormat)(d["Year"])
//   })
  
//   //format dat for y axis
//   var timeFormat = "%M:%S"
//   var parsedTime = data.map(d=> {
//     return d3.timeParse(timeFormat)(d["Time"])
//   })
  
  var xAxisScale = d3.scaleLinear()
    .range([padding,width-padding])
  
  var yAxisScale = d3.scaleTime()
    .range([0,height-padding])
  
  var timeFormat = d3.timeFormat("%M:%S")
  var xAxis = d3.axisBottom(xAxisScale)
    .tickFormat(d3.format("d"))
  
  var yAxis = d3.axisLeft(yAxisScale)
    .tickFormat(timeFormat)
  
 
  
  var tooltip = d3.select('body').append('div')
    .attr("id","tooltip")
    .style("opacity",0)
  
  const svg = d3.select("body")
    .append("svg")
    .attr("width",width)
    .attr("height",height)

data.forEach(d=> {
  var parsedTime = d.Time.split(':')
  d.Time = new Date(1970,0,1,0,parsedTime[0],parsedTime[1])
})
  
  xAxisScale.domain(d3.extent(data,d=>{
    return d.Year
  }))
  
  yAxisScale.domain(d3.extent(data,d=> {
    return d.Time
  }))
  
  var gX = svg.append("g")
    .attr('id','x-axis')
    .attr('transform','translate(0,'+(height-padding)+')')
    .call(xAxis)
  
  var gY = svg.append("g")
    .attr("transform","translate("+padding+",0)")
    .attr('id','y-axis')
    .call(yAxis)
  
 
  
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr("cx",(d)=>xAxisScale(d.Year))
    .attr("cy",(d)=>yAxisScale(d.Time))
    .attr("r",5)
    .attr("class","dot")
    .attr("data-xvalue",(d)=>d.Year)
    .attr("data-yvalue",(d)=>d.Time)
    .style("fill",d=>{
      if(d.Doping =='') {
        return 'green'
      } else {
        return 'red'
      }
    })
    .on('mouseover',(d)=>{
      tooltip.transition()
        .style('opacity',1)
        .attr("data-year",d.Year)
      tooltip.html(d.Name)
        .style("left",(d3.event.PageX)+"px")
        .style("top",(d3.event.PageY-28)+"px")
  })
    .on('mouseout',(d)=> {
      tooltip.transition()
        .style('opacity',0)
  })
  
  let color = [["red","Riders who were doped up"],["green","Riders who were green and clean"]]
    
  var legend = svg.append("g")
    .attr("id","legend")
    
  legend.selectAll('rect')
    .data(color)
    .enter()
    .append("rect")
    .attr("x",width-250)
    .attr("y",(d,i)=>{
    return i*25
  })
    .attr("width",20)
    .attr("height",20)
    .style("fill",d=>{
   return d[0] 
  })
  legend.selectAll('text')
    .data(color)
    .enter()
    .append("text")
    .attr("x",width-220)
    .attr("y",(d,i)=>{
    return i*25+16
  })
    .text(d=>d[1])
})