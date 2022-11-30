#!/usr/bin/env node

import minimist from 'minimist';
import fetch from 'node-fetch';
import moment from 'moment-timezone';

const args = minimist(process.argv.slice(2));

if (args.h != undefined) {
    console.log('Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE');
    console.log('    -h            Show this help message and exit.');
    console.log('    -n, -s        Latitude: N positive; S negative.');
    console.log('    -e, -w        Longitude: E positive; W negative.');
    console.log('    -z            Time zone: uses tz.guess() from moment-timezone by default.');
    console.log('    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.');
    console.log('    -j            Echo pretty JSON from open-meteo API and exit');
    process.exit(0);
}

if (args.n == undefined) {
    var latitude = Math.round(args.s * -100) / 100;
}
else {
    var latitude = Math.round(args.n * 100) / 100;
}

if (args.e == undefined) {
    var longitude = Math.round(args.w * -100) / 100;
}
else {
    var longitude = Math.round(args.e * 100) / 100;
}


if (args.z == undefined) {
    var timezone = moment.tz.guess();
}
else {
    var timezone = args.z;
}

// Make a request
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&daily=precipitation_hours&current_weather=true&timezone='+timezone);

// Get the data from the request
const data = await response.json();

if (args.j != undefined) {
    console.log(data);
    process.exit(0);
}

const days = args.d

if (days == 0) {
    if (data.daily.precipitation_hours[0] > 0) {
        console.log('You might need your galoshes today.');
    }
    else {
        console.log('You will not need your galoshes today.');
    }
} else if (days > 1) {
    if (data.daily.precipitation_hours[days] > 0) {
        console.log('You might need your galoshes in ' + days + ' days.');
    }
    else {
        console.log('You will not need your galoshes in ' + days + ' days.');
    }
} else {
    if (data.daily.precipitation_hours[1] > 0) {
        console.log('You might need your galoshes tomorrow.');
    }
    else {
        console.log('You will not need your galoshes tomorrow.');
    }
}
