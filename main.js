// CHART START
//Definir constantes
//import * as d3Collection from 'd3-collection';

const width = 800
const height = 500

const margin = {
    top: 10,
    bottom: 40,
    left: 60,
    right: 10
}

let years = 0

//Declarar el svg
const svg = d3.select("#chart").append("svg")
    .attr('id', "svg")
    .attr("width", width)
    .attr("height", height)

const elementGroup = svg.append("g")
    .attr('id', "elementGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

//Definir la escala
let x = d3.scaleLinear()
    .range([0, width - margin.left - margin.right])
let y = d3.scaleBand()
    .range([height - margin.top - margin.bottom, 0]).padding(0.1)

//Definir ejes

const axisGroup = svg.append("g")
    .attr("id", "axisGroup")
const xAxisGroup = axisGroup.append("g")
    .attr("id", "xAxisGroup")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g")
    .attr("id", "yAxisGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

const xAxis = d3.axisBottom().scale(x).ticks(5)
const yAxis = d3.axisLeft().scale(y)

let data2
let grupo

//Data call
d3.csv("data.csv").then(data => {
    data.map(d => {
        d.year = +d.year
    })
    data2 = data
    //filtro los datos para eliminar los años de no mundial por WWII
    function filtroWinner (data2){
        if((data2.winner) !==""){
            return true
        }else
            return false;
    }
    data2 = data2.filter(filtroWinner)
    //Uso nest para obtener el número de repeticiones 
    grupo = d3.nest().key((d) => d.winner).entries(data2)
    //Defino los dominios de las escalas
    x.domain([0, d3.max(grupo.map(d=>d.values.length))])
    y.domain(grupo.map(d=>d.key))
    //Llamo los ejes
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    //Genero las barras de la grafica/Databinding
    elementGroup.selectAll("rect").data(grupo)
        .join("rect")
            .attr("class", "barra", d=>d.key)
            .attr("x", 0)
            .attr("y", (d, i) => y(d.key))
            .attr("width", d => x(d.values.length))
            .attr("height", y.bandwidth)
    
    //Encuentro la forma de sumar para cada winner 
    //el número de mundiales granados en años previos
    //selecciono el winnerOfWinners para el año seleccionado 
    winnerOfWinners = Math.max(grupo.values)

    years = data2.map(d=>d.year)

    slider(years)

    console.log(grupo)
    
})
 


// CHART END



// slider:
function slider() {    
    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(years))  // rango años
        .max(d3.max(years))
        .step(4)  // cada cuánto aumenta el slider
        .width(580)  // ancho de nuestro slider
        .ticks(years.length)  
        .default(years[years.length -1])  // punto inicio de la marca
        .on('onchange', val => {
            //val.data2.year

            //
            //Se debe retornar el valor de sliderTime    
            // conectar con la gráfica aquí
        });

    var gTime = d3
    .select('div#slider-time')  // div donde lo insertamos
    .append('svg')
    .attr('width', width * 0.8)
    .attr('height', 100)
    .append('g')
    .attr('transform', `translate(30,30)`);

    gTime.call(sliderTime);

    d3.select("p#value-time").text(sliderTime.value());
}