const apiUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    // Set up dimensions
    const w = 800;
    const h = 600;
    const padding = 60;
    const tooltip = d3.select(".tooltip");

    // Scaling
    const parseTime = d3.timeParse("%M:%S");

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Year) - 2, d3.max(data, (d) => d.Year)])
      .range([padding, w - padding]);

    const yScale = d3
      .scaleTime()
      .domain([
        d3.min(data, (d) => parseTime(d.Time)),
        d3.max(data, (d) => parseTime(d.Time)),
      ])
      .range([padding, h - padding]);

    // Create SVG
    const svg = d3
      .select(".chartBox")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // Create circles
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(parseTime(d.Time)))
      .attr("r", 5)
      .attr("fill", (d) => (d.Doping === "" ? "navy" : "orange"))
      .attr("stroke", "black")
      .attr("opacity", 0.8)
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => parseTime(d.Time).toISOString())
      .on("mouseover", (d, i) => {
        tooltip.transition().duration(200).style("opacity", 0.9);

        tooltip
          .html(
            `${d.Name}: ${d.Nationality}
            Year: ${d.Year}, Time: ${d.Time}
            ${d.Doping}`
          )
          .style("left", d3.event.pageX - 100 + "px")
          .style("top", d3.event.pageY - 100 + "px")
          .attr("data-year", d.Year);
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .append("title")
      .text(
        (d) => `${d.Name}: ${d.Nationality}
            Year: ${d.Year}, Time: ${d.Time}
            ${d.Doping}`
      );

    // Create axes
    const xAxis = d3
      .axisBottom(xScale)
      .tickPadding(10)
      .tickFormat(d3.format("d"));

    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => d3.timeFormat("%M:%S")(d))
      .ticks(d3.timeSecond.every(15))
      .tickPadding(10);

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h - padding})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    // Legend
    const legend = svg.append("g").attr("id", "legend");

    legend
      .append("rect")
      .attr("height", 15)
      .attr("width", 15)
      .attr("x", w - padding)
      .attr("y", h / 2 - padding)
      .attr("fill", "navy");

    legend
      .append("text")
      .attr("x", w - padding - 15)
      .attr("y", h / 2 - padding)
      .text("No doping allegations")
      .attr("dy", "9pt")
      .attr("class", "legend_text")
      .style("text-anchor", "end");

    legend
      .append("rect")
      .attr("height", 15)
      .attr("width", 15)
      .attr("x", w - padding)
      .attr("y", h / 2 - padding / 2)
      .attr("fill", "orange");

    legend
      .append("text")
      .attr("x", w - padding - 15)
      .attr("y", h / 2 - padding / 2)
      .text("Riders with doping allegations")
      .attr("dy", "9pt")
      .attr("class", "legend_text")
      .style("text-anchor", "end");
  })
  .catch((error) => {
    console.error("Terjadi kesalahan dalam pengambilan data:", error);
  });
