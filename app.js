// Defining SVG area dimensions
var svg_Width = 1000;
var svg_Height = 650;

// Defining the chart's margins as an object
var margin_for_chart = {
  top: 25,
  right: 45,
  bottom: 65,
  left: 110
};

// Defining dimensions of the chart area
var chart_Width = svg_Width - margin_for_chart.left - margin_for_chart.right;
var chart_Height = svg_Height - margin_for_chart.top - margin_for_chart.bottom;

// Here we are selecting the body, appending SVG area to it, and setting the dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("width", svg_Width)
  .attr("height", svg_Height);

// In this step we append a group to the SVG area and shift it to the right and bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin_for_chart.left}, ${margin_for_chart.top})`);

// Here we are importing the data
d3.csv("data.csv", function(err, healthData) {
  if (err) throw err;

console.log(healthData)

  // Here we are parsing the data, and casting the poverty and healthcare values to a number for each piece of healthData
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

 // Here we are creating the linear scale for the horizontal axis and the vertical axis.
  var x_linear_scale = d3.scaleLinear().range([0, chart_Width]);
  var y_linear_scale = d3.scaleLinear().range([chart_Height, 0]);

  // This is where we create the axis functions
  var bottom_Axis = d3.axisBottom(x_linear_scale);
  var left_Axis = d3.axisLeft(y_linear_scale);

  var minimum_x;
  var maximum_x;
  var minimum_y;
  var maximum_y;
  
  minimum_x = d3.min(healthData, function(data) {
      return data.healthcare;
  });
  
  maximum_x = d3.max(healthData, function(data) {
      return data.healthcare;
  });
  
  minimum_y = d3.min(healthData, function(data) {
      return data.poverty;
  });
  
  maximum_y = d3.max(healthData, function(data) {
      return data.poverty;
  });
  
  x_linear_scale.domain([minimum_x, maximum_x]);
  y_linear_scale.domain([minimum_y, maximum_y]);
  console.log(minimum_x);
  console.log(maximum_y);

  // Here we are appending the axis to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${chart_Height})`)
    .call(bottom_Axis);

  chartGroup.append("g")
    .call(left_Axis);

   // Here we will be creating the circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthData)
  .enter()
  .append("circle")
  .attr("cx", d => x_linear_scale(d.healthcare +1.5))
  .attr("cy", d => y_linear_scale(d.poverty +0.3))
  .attr("r", "12")
  .attr("fill", "blue")
  .attr("opacity", .5);

// This is where we create the labels for the axes
  chartGroup.append("text")
  .style("font-size", "12px")
  .selectAll("tspan")
  .data(healthData)
  .enter()
  .append("tspan")
      .attr("x", function(data) {
          return x_linear_scale(data.healthcare +1.3);
      })
      .attr("y", function(data) {
          return y_linear_scale(data.poverty +.1);
      })
      .text(function(data) {
        return data.abbr
    });

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin_for_chart.left + 40)
    .attr("x", 0 - (chart_Height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healtcare(%)");

  chartGroup.append("g")
    .attr("transform", `translate(${chart_Width / 2}, ${chart_Height + margin_for_chart.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
});
