let ukURL =  "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-kingdom/uk-counties.json";
let url2 = "http://34.78.46.186/Circles/Towns/50";

var margin = {top: 0, left:0,right:0,bottom:0},
height = 800,
width = 750;


let geoData, count, range, populationData, coords, county;


let tooltip = d3.select('#tooltip')

let coutrytip = d3.select('#countytip')


let canvas = d3.select('#canvas')
    .attr('width',width)
    .attr('height',height)
    .append("g")
    .attr("position", "center");


var prjctn = d3.geoAlbers()
.center([4.95, 55.2])
.rotate([5, 0])
.parallels([50, 60])
.scale(4000)
.translate([width / 2, height / 2]);

var path = d3.geoPath().projection(prjctn);

function drawMap() {
    canvas.selectAll('path')
        .data(geoData)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', 'county')
        .on("mouseover",function(d,i) {
            //console.log("just had a mouseover", d3.select(d));
            d3.select(this)
              .classed("active",true)
              //console.log(d.properties.NAME_1)
              coutrytip.transition()
              .style('visibility', 'visible')
              coutrytip.text("Country Name: " + d.properties.NAME_1 )
          
          })
          .on("mouseout",function(d){
            d3.select(this)
              .classed("active",false)
              coutrytip.transition()
              .style('visibility', 'hidden')
        });
        drawCircle()
}

function drawCircle(){
       circle = canvas.selectAll('.towns')
      .data(populationData)
      .enter()
      .append("circle")
      .attr("class","towns")
      .attr("cx",function(d){
        //console.log(d);
        var coords = prjctn([d.lng, d.lat])
        return coords[0];
    })
    .attr("cy",function(d){
        var coords = prjctn([d.lng, d.lat])
        return coords[1]
    })
    .attr("r", 8)
    .on("mouseover",function(d) {
    	//console.log("just had a mouseover", d3.select(d));
              d3.select(this)
              .classed("active",true)
        //console.log(d)
        tooltip.transition()
            .style('visibility', 'visible')
            tooltip.text("County:" + d['County'] + "\n Town:" + d['Town'] + "\n Population: " + d['Population']
            +"\n Longertide: " + d['lng']+ "\n Latitude: " + d['lat'] )
            coutrytip.transition()
            .style('visibility', 'visible')
            coutrytip.text("Country Name: " + geoData.properties.NAME_1 )
        })
  	.on("mouseout",function(d){
    	d3.select(this)
      	.classed("active",false)
          tooltip.transition()
          .style('visibility', 'hidden')
          coutrytip.transition()
          .style('visibility', 'hidden')
    })


    label_place() 

}

function label_place(){
    canvas.selectAll(".circle")
    .data(populationData)
    .enter()
    .append("text")
    .attr("class", "place-label") 
   .attr("dx", function(d){
    //console.log(d);
    var coords = prjctn([d.lng, d.lat])
    return coords[0]})
    .attr("dy",function(d){
        coords = prjctn([d.lng, d.lat])
        return coords[1]
    })
   .text(function(d) {
        return d.Town;})

}

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
// Display the default slider value
output.innerHTML = slider.value;


 // Update the current slider value (each time you drag the slider handle)
 slider.oninput = function() {
   count = this.value;
   output.innerHTML = this.value;
  
   
 }

function dataLoad(){
d3.json(ukURL).then(
 (data,error) => {
    if(error){
        console.log(error);
    }else{
        geoData = topojson.feature(data, data.objects.GBR_adm2).features;
        //console.log(geoData);
        d3.json(url2).then(
             (data,error) => {
                if(error){
                    console.log(error);
                }else{
                  
                  populationData = data;
                    //console.log(populationData);
                    drawMap();
                    
                    
                }
            })
    }
})

}

function loadNewData(){
    count = slider.value;

    d3.json("http://34.78.46.186/Circles/Towns/"+count).then(
        (data,error) => {
           if(error){
               console.log(error);
           }else{    
             populationData = data;
             var town = document.getElementsByClassName("towns");
             var name =  document.getElementsByClassName("place-label");
             while(town[0]){
                town[0].parentNode.removeChild(town[0]);
                name[0].parentNode.removeChild(name[0]);
             }

            drawCircle();
              
               
           }
           })

 //console.log(count)

}

    
window.onload = dataLoad;