// Set Up Map
var mapOpts = {
  center: [39.994481739481294, -75.1190185546875],
  zoom: 12,
  preferCanvas: true
};
var map = L.map('map', mapOpts);
//map.fitBounds([[39.84755795735592,-75.33050537109375],[40.14476441357181,-74.92195129394531]])

var tileOpts = {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
};
//var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', tileOpts).addTo(map);
var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {tileOpts}).addTo(map);


//Global Variables
var data;
var markers;
var currentSlide = 0;
var stringFilter = "";
var filteredStops;
var page1 ={
  title:"Service Before Pandemic",
  description:"SEPTA has a dense network within Philadelphia. On streets where buses operate, almost every intersection has a stop.",
  filter: _.filter(stops,function(stop){
    return stop;
  }),
  radius: 5,
  color: "blue",
  fillOpacity: 0,
  opacity: 0.5
};
var page2 ={
  title:"Stops with Service During the Pandemic",
  description:"In the spring of 2020 SEPTA implemented significant service cuts. SEPTA first started operating its Saturday schedule everyday. It further decreased its service to include only around 60 core routes.",
  filter: _.filter(stops,function(stop){
    return stop.arrival_Apr > 0;
  }),
  radius: 5,
  color: "blue",
  fillOpacity: 0,
  opacity: 0.5
};
var page3 ={
  title:"Number of Services at each Stop Per Day During the Pandemic",
  description:"Many of the services in Center City and University City were maintained, however at a lower frequency. The number displayed here is most likely an overestimate of the total trips operated. In reality, during this period SEPTA has allowed scheduled trips to be missed rather than assigning standby drivers to operate the trip.",
  filter: _.filter(stops,function(stop){
    return stop.arrival_Apr > 0;
  }),
  radius: 5,
  color: "blue",
  fillOpacity: 0,
  opacity: 0.5
};
var page4 ={
  title:"Number of Services at each Stop Before the Pandemic",
  description:"Prior to the pandemic, SEPTA operated at more stops at a higher frequency.",
  filter: _.filter(stops,function(stop){
    return stop;
  }),
  radius: 5,
  color: "blue",
  fillOpacity: 0,
  opacity: 0.5
};
var page5 ={
  title:"Changes in Number of Services ",
  description:"There are decreases in scheduled services throughout the entire system. The few stops with increases are the results of detours and SEPTA operating weekend schedule.",
  filter: _.filter(stops,function(stop){
    return stop;
  }),
  radius: 5,
  color: "blue",
  fillOpacity: 0,
  opacity: 0.5
};
var slides = [
  page1,
  page2,
  page3,
  page4,
  page5
];

var nextSlide = function(){
  removeMarker();
  var nextPage = currentSlide + 1;
  currentSlide = nextPage;
  createPage(slides[nextPage]);
}
var previousSlide = function(){
  removeMarker();
  var previousPage = currentSlide - 1;
  currentSlide = previousPage;
  createPage(slides[previousPage]);
}

var onStringFilterChange = function(e) {
  stringFilter = e.target.value.toLowerCase();
  console.log(stringFilter)
  removeMarker();
  filteredStopsUpdate = _.filter(filteredStops,function(filtered){
    var condition = true;
    return condition && filtered.stop_name.toLowerCase().includes(stringFilter);
  })
  makeMarker(filteredStopsUpdate,slides[currentSlide]);
};

var makeMarker = function(filteredStops,pageContent){
  markers = filteredStops.map(function(data){
    if(currentSlide == 0 || currentSlide == 1 ){
      var radius = 50;
      var marker = data.stop_name;
    }
    if(currentSlide == 2){
      var radius = data.arrival_Apr;
      var marker = data.stop_name+"<br>"+"Weekday Service: "+data.arrival_Apr;
    }
    if(currentSlide == 3){
      var radius = data.arrival_Feb;
      var marker = data.stop_name+"<br>"+"Weekday Service: "+data.arrival_Feb;
    }
    if(currentSlide == 4){
      var radius = data.change;
      var marker = data.stop_name+"<br>"+"Change in Service: "+data.change;
      if(data.change < 0){
        var color = "red";
      }else{
        var color = "blue";
      }
    }
    if(currentSlide != 4){
      var color = "blue";
    }
    return L.circleMarker([data.stop_lat,data.stop_lon],
      {radius: Math.abs(radius) / 50 , opacity:pageContent.opacity, fillOpacity:0, color:color})
      .bindPopup(marker);
  })

  markers.forEach(function(marker){
    marker.addTo(map);
  })
}

var createPage = function(pageContent){
  filteredStops = pageContent.filter;
  console.log(currentSlide);
  makeMarker(pageContent.filter,pageContent);

  
  $('#pageSubtitle').text(pageContent.title);
  $('#description').text(pageContent.description);
  $('#number').text(String(currentSlide+1));
  $('#str').val("");
  if(currentSlide === 0){
    $('#previous').prop("disabled",true);
    $('#previous').addClass("disabled");
  }else{
    $('#previous').prop("disabled",false);
    $('#previous').removeClass("disabled");
    $('#previous').addClass("hover");
  }
  if(currentSlide === slides.length - 1){
    $('#next').prop("disabled",true);
    $('#next').addClass("disabled");
  }else{
    $('#next').prop("disabled",false);
    $('#next').removeClass("disabled");
    $('#next').addClass("hover");
  }
}

var removeMarker = function(){
  markers.forEach(function(marker){
    map.removeLayer(marker);
  })
}

//Make Page
createPage(slides[currentSlide]); 
$('#next').click(nextSlide);
$('#previous').click(previousSlide);
$('#str').keyup(onStringFilterChange);