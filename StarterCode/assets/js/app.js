// Define SVG area dimensions
const svgWidth = 800;
const svgHeight = 500;

let margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Define dimensions of the chart area
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Select id "scatter", append SVG and set its dimensions
let svg = d3
  .select("#scatter")
  .classed("graphic", true)
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

let chartGroup = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Import Data
d3.csv("assets/data/data.csv").then(function(data) {
  // Parse Data/Cast as numbers
  data.forEach(function(data) {
    data.age = +data.age;
    data.smokes = +data.smokes;
  });

  // Create scale functions
  var xLinearScale = d3
    .scaleLinear()
    .domain([d3.min(data, d => d.age) - 1, d3.max(data, d => d.age) + 1])
    .range([0, width]);

  var yLinearScale = d3
    .scaleLinear()
    .domain([d3.min(data, d => d.smokes) - 1, d3.max(data, d => d.smokes) + 1])
    .range([height, 0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to the chart
  chartGroup
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g").call(leftAxis);

  // Create the Circles
  var circlesGroup = chartGroup
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "11")
    .style("fill", "brown")
    .style("opacity", 0.8);

  // Create Labels for the Circles
  var textGroup = chartGroup
    .selectAll("label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "stateText")
    .attr("x", d => xLinearScale(d.age))
    .attr("y", d => yLinearScale(d.smokes))
    .attr("font-size", 8)
    .attr("font-weight", "bold")
    .attr("dy", "3")
    .text(d => d.abbr);

  // Create axes labels
  chartGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "aText")
    .attr("class", "active")
    .text("Smokers (%)");

  chartGroup
    .append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "aText")
    .attr("class", "active")
    .text("Age (Median)");
});
