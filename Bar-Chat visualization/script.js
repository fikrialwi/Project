const apiUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

let dataset;
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    dataset = data;
    const w = 800;
    const h = 400;
    const quart = { 1: "Q1", 4: "Q2", 7: "Q3", 10: "Q4" };
    const padding = 60;
    const parseTime = d3.timeParse("%Y-%m-%d");
    dataset["data"].forEach((d) => {
      d[0] = parseTime(d[0]);
    });
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset["data"], (d) => d[1])])
      .range([h - padding, padding]);
    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(dataset["data"], (d) => d[0]),
        d3.max(dataset["data"], (d) => d[0]),
      ])
      .range([padding, w - padding]);
    const colorScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset["data"], (d) => d[1])])
      .range(["#FFA732", "#EF4040"]);

    const tooltip = d3.select(".tooltip");
    const svg = d3
      .select(".container")
      .append("svg")
      .attr("height", h)
      .attr("width", w);

    svg
      .selectAll("rect")
      .data(dataset["data"])
      .enter()
      .append("rect")
      .attr("width", w / dataset["data"].length - 0.5)
      .attr("height", (d) => h - yScale(d[1]) - padding)
      .attr("class", "bar")
      .attr("data-date", (d) => d[0].toISOString().split("T")[0])
      .attr("data-gdp", (d) => d[1])
      .attr("x", (d, i) => xScale(d[0]))
      .attr("y", (d) => yScale(d[1]))
      .attr("fill", (d) => colorScale(d[1]))
      .on("mouseover", (d, i) => {
        tooltip.transition().duration(200).style("opacity", 0.9);

        tooltip
          .attr("id", "tooltip")
          .attr("data-date", d[0].toISOString().split("T")[0])
          .html(
            `${d[0].getFullYear()} - ${quart[d[0].getMonth() + 1]} $${d[1]}`
          )
          .style("left", d3.event.pageX - 150 + "px")
          .style("top", d3.event.pageY - 100 + "px");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .append("title")
      .text((d) => `${d[0].getFullYear()}: ${d[1]}`);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h - padding})`)
      .call(xAxis);
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("id", "xLabel")
      .attr("y", padding)
      .attr("x", 0 - h / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("GDP Value");
    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);
  })
  .catch((error) => {
    console.error("Terjadi kesalahan dalam pengambilan data:", error);
  });
