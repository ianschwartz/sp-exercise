// helper methods
function fc(array) {
	// The geoJSON data received from the wheel is in the Long/Lat format
	// , but Mapbox expects Lat/Long. This function reverses them.
	return [array[1], array[0]];
}

function roundToTwoDecimals(num) { // the wheel gives very precise numbers... Too precise for humans
	return Math.round(num * 100) / 100;
}

function formatTimeStamp(time) { // makes timestamps more readable for humans
	let newTime = new Date(time);
	return newTime.toLocaleString();
}

module.exports = {
	fc: fc,
	roundToTwoDecimals: roundToTwoDecimals,
	formatTimeStamp: formatTimeStamp
}