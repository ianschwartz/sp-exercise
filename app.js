const token = "pk.eyJ1IjoiaWFuc2Nod2FydHoiLCJhIjoiY2ppM2p5MHpvMW11bjNrbncwb2JhdndwcCJ9.RGFucrA0HIuQo5Z988V-wg"
const myLocation = [44.376224, -71.161167];
let geoData;

L.mapbox.accessToken = token;
let map = L.mapbox.map('map', 'mapbox.streets');
let featureLayer = L.mapbox.featureLayer().addTo(map);


function fc(array) {
	// The geoJSON data received from the wheel is in the Long/Lat format
	// , but Mapbox expects Lat/Long. This function reverses them.
	return [array[1], array[0]];
}

function centerMap(data) {
	let center = fc(data.features[0].geometry.coordinates);
	map.setView(center, 13);
}

function getMapData(url) {
	console.log('fetching');
	fetch(url).then((res) => {
		console.log('fetch successful');
		return res.json();
	}).then((data) => {
		console.log('centering map');
		centerMap(data);
		return data.features;
	}).then((features) => {
		features.forEach((feature) => {
			console.log(feature);
			L.marker(fc(feature.geometry.coordinates)).addTo(map);
		})
	}).catch(error => console.error('Error:', error))

}

getMapData("./unpredictable-individual-points.geojson");