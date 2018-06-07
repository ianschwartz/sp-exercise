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


// helper methods
function fc(array) {
	// The geoJSON data received from the wheel is in the Long/Lat format
	// , but Mapbox expects Lat/Long. This function reverses them.
	return [array[1], array[0]];
}

function roundToTwoDecimals(num) {
	return Math.round(num * 100) / 100;
}



function centerMap(data) {
	let center = fc(data.features[0].geometry.coordinates);
	map.setView(center, 13);
}

function placeFeatures(features) {
	featureLayer = L.mapbox.featureLayer(features).addTo(map);
	featureLayer.eachLayer((layer) => {
		console.log(layer.feature.properties.wheelData);
		let content = `
			<h2>${layer.feature.properties.time}</h2>
			<ul>
				<li>Speed: ${roundToTwoDecimals(layer.feature.properties.wheelData.speed)}mph</l1>
			</ul>
		`;
		layer.bindPopup(content);
	})
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
	}).catch(error => console.log('Error:', error))
}
