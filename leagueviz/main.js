let main = d3.select("main");
let scrolly = main.select("#scrolly");
let svg = scrolly.select("svg");
let article = scrolly.select("article");
let step = article.selectAll(".step");

const margin = { top: 40, right: 150, bottom: 60, left: 100 };
let svgWidth = window.innerWidth * 0.65;
let width = svgWidth - margin.left - margin.right;
let height = 500;

let scroller = scrollama();
let data;
let dataFaker;
let champStats;
let tooltip;

let xAxisGroup, yAxisGroup;
let xScatterScale, yScatterScale;
let isBarChart = false;


d3.csv("2024_LoL_esports_match_data_from_OraclesElixir.csv").then(function (d) {
    data = d.map(d => ({
        ...d 
    }));
    data = data.filter(d => (d["league"] == "LCK" || d["league"] == "LPL" || d["league"] == "LEC" || d["league"] == "LCS"))
    dataFaker = data.filter(d => (d["playername"] == "Faker"))
    dataFaker.forEach(d => {
        date = d.date.split(" ")[0]
        d["Date"] = d3.timeParse("%m/%d/%Y %H:%M")(d.date);
        d["month"] = d3.timeFormat("%b")(d["Date"]);
        d["year"] = d3.timeFormat("%Y")(d["Date"]);
        d.kills = parseInt(d.kills);
        d.assists = parseInt(d.assists);
        d.deaths = parseInt(d.deaths);
        d.kda =  (d.deaths == 0 ? d.kills + d.assists : (d.kills + d.assists) / d.deaths);
      });
    init();
});

function init() {
    handleResize();

    svg.selectAll('.barGroup').remove();
    svg.append('g')
        .attr('class', 'barGroup')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.append('g')
        .attr('class', 'scatterGroup')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    scroller
        .setup({
            step: "#scrolly article .step",
            offset: 0.33,
            debug: false
        })
        .onStepEnter(handleStepEnter)
        // .onStepExit(handleStepExit);

    window.addEventListener('resize', handleResize);

    const championStats = {};
    data.forEach(row => {
        const champion = row.champion;
        const result = row.result;
        const position = row.position
        const player = row.playername



        if (champion != '' && position === "mid") {
      
            if (!championStats[champion]) {
                championStats[champion] = { wins: 0, losses: 0, faker: false };
            }
    
            if (result == 1) {
                championStats[champion].wins += 1;
            } else if (result == 0) {
                championStats[champion].losses += 1;
            }

            if (player === "Faker") {
                championStats[champion].faker = true;
            }
        }
    })

    champStats = Object.entries(championStats)
    .map(([champion, stats]) => {
      const totalGames = stats.wins + stats.losses;
      const winRate = totalGames > 0 ? stats.wins / totalGames : 0;
      return {
        champion,
        wins: stats.wins,
        losses: stats.losses,
        faker: stats.faker,
        totalGames,
        winRate
      };
    })

    tooltip = d3.select("svg").append("text")
    .attr("class", "tooltip")
    .attr("x", 100)
    .attr("y", height + 50)
    .style("font-size", 16)
    .style("fill", "white")
    .style("opacity", 0);
}

function handleResize() {
    let stepH = Math.floor(window.innerHeight * 0.75);
    step.style("height", stepH + "px");

    svgWidth = window.innerWidth * 0.65;
    width = svgWidth - margin.left - margin.right;
    let svgHeight = height + margin.top + margin.bottom;

    svg
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    scroller.resize();
}

function handleStepEnter(response) {
    step.classed("is-active", (d, i) => i === response.index);

    switch (response.index) {
        case 0:
            createBar();
            break;
        case 1:
            highlight("winrate");
            break;
        case 2:
            if (response.direction === "up") {
                createBar();
                setTimeout(() => {
                    highlight("faker");
                }, 1000);
            }
            else{
                highlight("faker");
            }
                break;
        case 3:
            transitionToScatterChart();
            break;
        case 4:
            highlight("meta");
            break;
    }
}


function createBar() {
    d3.selectAll('.myCircles').remove()
    //d3.select('.scatterGroup').style('display', 'none');

    //d3.select('.barGroup').style('display', 'block');

    const group = d3.select('.barGroup');

    top10 = champStats.filter(champ => champ.totalGames >= 5)
    .sort((a, b) => b.totalGames - a.totalGames)
    .slice(0, 10);


    const xBarScale = d3.scaleBand()
        .range([0, width])
        .domain(top10.map(d => d.champion))
        .padding(0.2);

    yBarScale = d3.scaleLinear()
        .domain([0, d3.max(champStats, d => d.totalGames)])
        .range([height, 0]);

    group.selectAll(".bar")
        .data(top10)
        .join("rect")
        .attr('class', "bar")
        .transition()
        .duration(1000)
        .attr("x", d => xBarScale(d.champion))
        .attr("y", d => yBarScale(d.totalGames))
        .attr("width", xBarScale.bandwidth())
        .attr("height", d => height - yBarScale(d.totalGames))
        .style("opacity", 0.7)
        .attr("fill", "#69b3a2");

    // Axes
    if (!xAxisGroup) {
        xAxisGroup = group.append("g").attr("class", "x-axis");
        yAxisGroup = group.append("g").attr("class", "y-axis");
    }

    xAxisGroup
        .attr("transform", `translate(0, ${height})`)
        .transition()
        .duration(1000)
        .call(d3.axisBottom(xBarScale));

    yAxisGroup
        .attr("transform", `translate(0, 0)`)
        .transition()
        .duration(1000)
        .call(d3.axisLeft(yBarScale));

    isBarChart = true;
}

function highlight(name) {


    if (name === "winrate") {
        d3.selectAll(".bar")
            .transition()
            .duration(500)
            .style("opacity", d => d.winRate > 0.5 ? 0.9 : 0.3);
    } else if (name === "faker") {
        d3.selectAll(".bar")
            .transition()
            .duration(500)
            .style("opacity", d => d.faker == true ? 0.9 : 0.3);        
    } else if (name === "meta") {
        d3.selectAll(".myCircles")
            .transition()
            .duration(500)
            .style("opacity", d => champStats.filter(champ => champ.champion == d.champion)[0].winRate > 0.5 ? 0.9 : 0.3);
    }

}

function transitionToScatterChart() {
    isBarChart = false

    d3.selectAll('.bar').remove()

    //d3.select('.scatterGroup').style('display', 'block');


    const group = d3.select('.barGroup');
    const circleRadius = 7;
    console.log("scatter")

    const xScatter = d3.scaleTime()
        .domain([new Date(2024, 0, 17), d3.max(dataFaker, d => d.Date)])
        .range([0, width]);

    const yScatter = d3.scaleLinear()
      .domain(d3.extent(data, d => d.kda)).nice()
      .range([height, 0]); 

    group.selectAll(".myCircles")
        .data(dataFaker)
        .join("circle")
        .attr('class', "myCircles")
        .on("mouseover", function (event, d) {
            tooltip.style("opacity", .9);
            tooltip.html("Champion played: " + d["champion"] + "<br>") 
            tooltip.attr("x", event.x - svgWidth / 1.9)
                    .attr("y", event.y - 75)
          })
          .on("mouseout", function (d) {
            tooltip
                .style("opacity", 0);
        })
        .transition()
        .duration(1000)
        .attr("cx", d => xScatter(d.Date))
        .attr("cy", d => yScatter(d.kda))
        .attr("r", circleRadius)
        .style("opacity", 0.7)
        .attr("fill", d => d.result == 1 ? "green" : "red");

    // Update x-axis
    xAxisGroup
        .transition()
        .duration(1000)
        .call(d3.axisBottom(xScatter));

    // Update y-axis for bar chart
    yAxisGroup
        .transition()
        .duration(1000)
        .call(d3.axisLeft(yScatter));

}

