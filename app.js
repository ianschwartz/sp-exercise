/*
	Assumptions:
		0: Not going to spend much time on styling to stay within the 
			time constraints of the exercise
		1: The exercise said to use the framework of your choice. I chose MapBox
			which is a mapping library built on top of Leaflet.js. Leaflet has it's
			own state management, and attempting to use React was difficult because
			React's state management works to minimize side effects. In the end I chose
			to use vanilla JS.
*/
const token = "pk.eyJ1IjoiaWFuc2Nod2FydHoiLCJhIjoiY2ppM2p5MHpvMW11bjNrbncwb2JhdndwcCJ9.RGFucrA0HIuQo5Z988V-wg";
L.mapbox.accessToken = token;

// Creates a street map and appends it to div#map
let map = L.mapbox.map('map', 'mapbox.streets');
let featureLayer = L.mapbox.featureLayer().addTo(map);

/*
	The Trip object contains all the leaflet layers for each geojson file imported 
		by getMapData(). References to these are stored in an array object for easy manipulation.
*/

let trips = [];

function Trip(geojson, url) {
	this.geojson = geojson;
	this.tripID = url;

	// on creation, Trip() will add itself to the map by default.
	centerMap(geojson);
	this.featureLayer = L.geoJSON(geojson);
	this.featureLayer.eachLayer((layer) => {
		let properties = layer.feature.properties
		let content = `
			<h2>${formatTimeStamp(properties.time)}</h2>
			<ul>
				<li>Speed: ${roundToTwoDecimals(properties.wheelData.speed)}kph</l1>
				<li>Altitude ${roundToTwoDecimals(properties.sensorData.phone.altitude)}meters</li>
				<li>Energy Efficiency ${roundToTwoDecimals(properties.wheelData.energyEfficiency)}W*h/km</li>
				<li>Motor Temperature ${properties.wheelData.motorTemperature}°C</li>
				<li>Battery Charge: ${roundToTwoDecimals(properties.wheelData.tripEnergyEfficiency)}%</li>
			</ul>
		`;
		layer.bindPopup(content);
	});

	// using the plugin leaflet.heat to render the heatmaps
	function mapProperty(property) { // helper function to format data for leaflet.heat
		return geojson.features.map((feature) => {
			return [...fc(feature.geometry.coordinates), feature.properties.wheelData[property]/100]
		})
	}

	this.temperatureHeatMapLayer = L.heatLayer(mapProperty("motorTemperature"), {gradient: {0.0: 'black', 1.0: 'red'}});
	this.torqueLayer = L.heatLayer(mapProperty("riderTorque"), {
		radius: 40,
		gradient: {0.0: 'black', 0.5: 'green', 1.0: 'lightgreen',
	}});

	this.layers = [this.featureLayer, this.temperatureHeatMapLayer, this.torqueLayer];
}

// The following functions interact with the state of our Map object.
// RIght now they rely mostly on side effects, which is unfortunate
// But since Leaflet has its own state management, it was easier
// this way than to use more functional concepts.

function centerMap(data) { // centers the map on the first feature of the geojson
	let center = fc(data.features[0].geometry.coordinates);
	map.setView(center, 17);
}

function clearFeatures() {
	trips.forEach((trip) => {
		trip.layers.forEach((layer) => {
			map.removeLayer(layer);
		})
	})
}

function activateLayer(index, layer) {
	let myTrip = trips[index];
	let myLayer = myTrip[layer];
	centerMap(myTrip.geojson);
	myLayer.addTo(map);
}

function removeLayer(index, layer) {
	let myTrip = trips[index];
	let myLayer = myTrip[layer];
	map.removeLayer(myLayer);
}

// 
function listTrips() {
	let list = trips.reduce((string, trip, index) => {
		return string += `<li>
			<h4>${trip.tripID}</h4>
			<div>
				<button class="list-control" onclick="activateLayer(${index}, 'featureLayer')">Show DataPoints</button>
			</div>
			<div>
				<button class="list-control" onclick="removeLayer(${index}, 'featureLayer')">Remove DataPoints</button>
			</div>
			<div>
				<button class="list-control" onclick="activateLayer(${index}, 'temperatureHeatMapLayer')">Show Motor Temperature</button>
			</div>
			<div>
				<button class="list-control" onclick="removeLayer(${index}, 'temperatureHeatMapLayer')">Remove Motor Temperature</button>
			</div>
			<div>
				<button class="list-control" onclick="activateLayer(${index}, 'torqueLayer')">Show Torque </button>
			</div>
			<div>
				<button class="list-control" onclick="removeLayer(${index}, 'torqueLayer')">Remove Torque</button>
		</div></
		li>`
	}, "");
	let ul = document.getElementById('trips');
	ul.innerHTML = list;
}

// at the moment, the URLs are hardcoded into the HTML onclick function
//	that calls getMapData(). Ideally, I'd be calling an api with a list of 
//	trips and getting the URL's for each geojson file dynamically through API calls
//	
function getMapData(url) {
	console.log('fetching');
	fetch(url).then((res) => {
		console.log('fetch successful');
		return res.json();
	}).then((data) => {
		clearFeatures();
		let trip = new Trip(data, url);
		let id = trips.length;
		trips.push(trip);
		activateLayer(id, "featureLayer");
		listTrips();
	}).catch(error => console.log('Error:', error));
}

/* 
	Full disclosure:
		Because I was using an external library, and because of time limitations,
		I couldn't figure out how to write tests on functions that interact with 
		the MapBox/Leaflet library.

		The following exports are for testing in Jest.

*/
exports = {
	fc: fc,
	roundToTwoDecimals: roundToTwoDecimals,
	formatTimeStamp: formatTimeStamp
}