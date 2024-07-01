const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const json = data;
    const dataset = json.data;
    const title = json.source_name;
    document.getElementById("title").textContent = title;

    const width = 1100;
    const height = 500;
    const padding = 60;

    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const minDate = d3.min(dataset, (d) => d[0]);
    const maxDate = d3.max(dataset, (d) => d[0]);

    const xScale = d3
      .scaleTime()
      .domain([new Date(minDate), new Date(maxDate)])
      .range([padding, width - padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis)
      .style("font-size", "12px");

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[1])])
      .range([height - padding, padding]);

    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("x", (d) => xScale(new Date(d[0])))
      .attr("y", (d) => yScale(d[1]))
      .style("width", "5px")
      .style("height", (d) => height - padding - yScale(d[1]))
      .style("fill", (d, i) => {
        return i % 2 === 0 ? "blue" : "red";
      })
      .on("mouseover", (e, d) => {
        const tooltip = d3.select("#tooltip");

        tooltip
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("left", e.pageX + 10 + "px")
          .style("top", e.pageY - 10 + "px");

        const quarterOne = /01\-01/;
        const quarterTwo = /04\-01/;
        const quarterThree = /07\-01/;
        const quarterFour = /10\-01/;

        tooltip
          .attr("data-date", d[0])
          .html(
            `${d[0]
              .replace(quarterOne, "Q1")
              .replace(quarterTwo, "Q2")
              .replace(quarterThree, "Q3")
              .replace(quarterFour, "Q4")}: $${d[1]}Billion`
          );

        d3.select("#tooltip").style("opacity", "1");
      })
      .on("mouseleave", () => {
        d3.select("#tooltip").style("opacity", "0");
      });

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "rgba(0,0,0,0.8)")
      .style("color", "#fff")
      .style("padding", "10px")
      .style("font-size", "12px");
  });
