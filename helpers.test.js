const helpers = require('./scripts/helpers');

test('reverses latitude and longitude', () => {
  expect(helpers.fc([42.360082, -71.058880])).toEqual([-71.058880, 42.360082]);
});

test('fc should only return two values', () => {
	expect(helpers.fc([5, 6, 7])).toEqual([6, 5]);
})

test('rounds numbers down to second decimal place', () => {
	expect(helpers.roundToTwoDecimals(4.98127419)).toEqual(4.98);
})

test('rounds numbers up to second decimal place', () => {
	expect(helpers.roundToTwoDecimals(4.98927419)).toEqual(4.99);
})

test('formats time string to a human readable string', () => {
	expect(helpers.formatTimeStamp("2015-05-08T17:55:45")).toEqual("2015-5-8 17:55:45")
})