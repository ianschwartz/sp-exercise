/*
	Originally I wanted to solve this problem using React but
	I couldn't figure out how to integrate the map tooling with React 
	without spending a lot of time on it. In the end, I decided to do
	it with vanilla JS and DOM manipulation, which is slow, but works.
*/

const token = "pk.eyJ1IjoiaWFuc2Nod2FydHoiLCJhIjoiY2ppM2p5MHpvMW11bjNrbncwb2JhdndwcCJ9.RGFucrA0HIuQo5Z988V-wg";
L.mapbox.accessToken = token;
let map = L.mapbox.map('map', 'mapbox.streets');
let featureLayer = L.mapbox.featureLayer().addTo(map);
let activeLayer;

// helper methodivs
function fc(array) {
	// The geoJSON data received from the wheel is in the Long/Lat format
	// , but Mapbox expects Lat/Long. This function reverses them.
	return [array[1], array[0]];
}

function roundToTwoDecimals(num) {
	return Math.round(num * 100) / 100;
}

function formateTimeStamp(time) {
	let newTime = new Date(time);
	return newTime.toLocaleString();
}

function centerMap(data) {
	let center = fc(data.features[0].geometry.coordinates);
	map.setView(center, 17);
}

function placeFeatures(features) {
	activeLayer = L.geoJSON(features).addTo(map);
	activeLayer.eachLayer((layer) => {
		let properties = layer.feature.properties
		let content = `
			<h2>${formateTimeStamp(properties.time)}</h2>
			<ul>
				<li>Speed: ${roundToTwoDecimals(properties.wheelData.speed)}kph</l1>
				<li>Altitude ${roundToTwoDecimals(properties.sensorData.phone.altitude)}meters</li>
				<li>Energy Efficiency ${roundToTwoDecimals(properties.wheelData.energyEfficiency)}W*h/km</li>
			<li>Battery Charge: ${roundToTwoDecimals(properties.wheelData.tripEnergyEfficiency)}%</li>
			</ul>
		`;
		layer.bindPopup(content);
	})
}

function clearFeatures() {
	map.removeLayer(activeLayer)
}

function updateStatistics(features) {
	let filteredFeatures = features.filter((feature) => {
		return feature.properties.wheelData.tripAverageSpeed;
	})
	let lastFeature = filteredFeatures[filteredFeatures.length-1];
	let statsList = document.getElementById('stats');
	statsList.innerHTML = `
		<li>Average Speed: ${roundToTwoDecimals(lastFeature.properties.wheelData.tripAverageSpeed)}kph</li>
		<li>Distance Traveled: ${roundToTwoDecimals(lastFeature.properties.wheelData.tripOdometer)}km</li>
		<li>Trip Energy Efficiency: ${roundToTwoDecimals(lastFeature.properties.wheelData.tripEnergyEfficiency)}W*h/km</li>
	`

}

function getMapData(url) {
	console.log('fetching');
	fetch(url).then((res) => {
		console.log('fetch successful');
		return res.json();
	}).then((data) => {
		console.log('centering map');
		centerMap(data);
		return data;
	}).then((features) => {
		placeFeatures(features);
		updateStatistics(features.features);
	}).catch(error => console.log('Error:', error))
}
