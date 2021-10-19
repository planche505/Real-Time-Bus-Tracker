mapboxgl.accessToken = 'pk.eyJ1Ijoia3VobDAwMzMiLCJhIjoiY2t1dHhiNXo3NXRsZjJ2bnppMzE5bDV6MSJ9.GIlh-7x11ETqa67KaU-PbQ';

var map;
var markers = [];

// load map
function init(){
  map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-71.091525, 42.353350],
        zoom: 12
})
  addMarkers(); 
}

// Add bus markers to map
async function addMarkers(){
	// get bus data
	var locations = await getBusLocations();
    
	// loop through data, add bus markers
	locations.forEach(function(bus){
		var marker = getMarker(bus.id);		
		if (marker){
			moveMarker(marker, bus);
		} else {
			addMarker(bus);			
		}
	});

	// timer
	console.log(new Date());
	console.log(locations);
	setTimeout(addMarkers, 15000);
}

// Request bus data from MBTA
async function getBusLocations(){
	var url = 'https://api-v3.mbta.com/vehicles?api_key=ca34f7b7ac8a445287cab52fb451030a&include=trip';	
	var response = await fetch(url);
	var json     = await response.json();
	return json.data;
}

function addMarker(bus){
  var icon = getIcon(bus);
  var marker = new mapboxgl.Marker({
     color: icon
  })
  marker.setLngLat([bus.attributes.longitude, bus.attributes.latitude]);
  marker._element.id = bus.id;
  marker.addTo(map);
  markers.push(marker);
}


function getIcon(bus){
	// select icon based on bus direction
	if (bus.attributes.direction_id === 0) {
		return '#ca1c21'; 
	}
	return '#5b9fdb';	
}

function moveMarker(marker, bus) {
  marker.setLngLat([bus.attributes.longitude, bus.attributes.latitude]);	
}

function getMarker(id){
	var marker = markers.find(function(item){
		return item._element.id === id;
	});
	return marker;
}

window.onload = init;
