function App(){
    const [countryData, setCountryData] = React.useState([]);
    const [dataType, setDataType] = React.useState("casesPerOneMillion");
    const [widthOfBar, setWidthOfBar] = React.useState(5);
    React.useEffect(() =>{
       async function fetchData(){
           const response = await fetch ("https://disease.sh/v3/covid-19/countries?sort=" + dataType);
           const data = await response.json();
           console.log(data);
           setCountryData(data);
       }
       fetchData(); 
    }, [dataType, widthOfBar]);
    return (
        <div className="container justify-content-center align-items-center">
            <h1>COVID STATS</h1>
            <label htmlFor="datatype">
            Data Type
            <select 
            name="datatype"
            id="datatype"
            onChange={(e) => setDataType(e.target.value)}
            value={dataType}>
            <option value="casesPerOneMillion">Case Per One Million</option>
            <option value="cases">Cases</option>
            <option value="deaths">Deaths</option>
            <option value="tests">Tests</option>
            <option value="deathsPerOneMillion">Deaths Per One Million</option>
            </select>
            </label>
            
            <label htmlFor="widthofbar">
            Bar Width
            <input
            name="widthofbar"
            type="number"
            id="widthofbar"
            value={widthOfBar}
            onChange = { (e) => setWidthOfBar(e.target.value)}
            />
            </label>
            <div className="visHolder">
                <BarChart 
                data={countryData} 
                height={500} 
                widthOfBar={widthOfBar}
                width={countryData.length * widthOfBar}
                dataType={dataType}/>
            </div>
        </div>
    )
}

function BarChart({data, height, width, widthOfBar, dataType}){
    React.useEffect(()=>{
        createBarChart();
    },[data])

    const createBarChart = () =>{
        const countryData = data.map((country) => country[dataType]);
        const countries = data.map((country) => country.country);
        let tooltip = d3.select(".visHolder")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);
        const dataMax = d3.max(countryData);
        const yScale = d3.scaleLinear().domain([0, dataMax]).range([0, height]);
        d3.select("svg").selectAll("rect").data(countryData).enter().append("rect");
        d3.select("svg")
        .selectAll("rect")
        .data(countryData)
        .style("fill", (d,i) => (i % 2 == 0 ? "#407294" : "#00ced1"))
        .attr("x", (d,i) => i * widthOfBar)
        .attr("y", (d) => height - yScale(d + dataMax * 0.1))
        .attr("height", (d,i) => yScale(d + dataMax * 0.1))
        .attr("width", widthOfBar)
        .on("mouseover", (d,i) =>{
            tooltip.style("opacity", 0.9)
            .html(countries[i] + `<br/> ${dataType} ` + d)
            .style("left", i + widthOfBar + 20 + "px")
            .style("top", d3.event.pageY - 170 + "px");
        })
        .on("mouseout", (d)=>{
            tooltip.style("opacity", 0);
        });
        }
    return (
        <>
        <svg width={width} height={height}></svg>
        </>
    )
}



ReactDOM.render(<App/>, document.getElementById('root'));