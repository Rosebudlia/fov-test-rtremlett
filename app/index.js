const fs = require('fs');

const fovLat = 52.493256;
const fovLatRad = toRadians(fovLat);
const fovLong = 13.446082;

const earthR = 6371000; // Earth's radius in metres

let clients = [];

class Client {
    constructor(id, lat, long){
        this.idNr = id;
        this.lat = lat;
        this.long = long;
    }
}

//convert coordinate to radians
function toRadians (num) {
    return num * Math.PI / 180;
}

//pull the customer data from the text file
function importCustomers(path, callback) {
    try {
        let filename = require.resolve(path);
        fs.readFile(filename, 'utf8', callback);
    } catch (e) {
        callback(e);
    }
}

//parse the data and log a list of clients who should receive an invitation
function calculate (filepath) {
    importCustomers(filepath, function (err, data) {

        if (err) {
            console.log('ERROR: Failed to fetch customer data');
        } else {

            parseCustomers(data);

            for (let i = 0, len = clients.length; i < len; i++) {
                logInviteList(calcDistance(clients[i].lat, clients[i].long), clients[i].idNr);
            }
        }


    });
}

//clean and parse the data and check it for completeness
function parseCustomers (data){
    //split the data on new line or carriage break
    let dataSplit = data.split(/[\r\n]+/);
    let clientsSplit = [];

    for (let i = 0, len = dataSplit.length; i < len; i++) {

        // clean whitespace from the string
        let compactData = dataSplit[i].replace(/\s/g, "");

        //clean leading or trailing commas from the string
        let cleanData = compactData.replace(/(^,)|(,$)/g, "", "");

        //split the data set into the three values on the comma separator
        let clientData = cleanData.split(/,/);

        if (clientData.length !== 3) {
            console.log("ERROR: Client data incomplete at data set index " + i);
        }

        // each data set should have ID first, then latitude, then longitude
        else if (clientData[0].indexOf('id:') === -1) {
            console.log("ERROR: Client data missing ID at data set index " + i);
        }

        else if (clientData[0].length !== 39) {
            console.log("ERROR: Client ID incomplete at data set index " + i);

        }

        else if (clientData[1].indexOf('lat:') === -1) {
            console.log("ERROR: Client data missing latitude at data set index " + i);

        }

        else if (clientData[2].indexOf('long:') === -1) {
            console.log("ERROR: Client data missing longitude at data set index " + i);

        }

        else {
            //console.log(clientData);
            clientsSplit.push(clientData);
        }
    }

    for (let j = 0, cLen = clientsSplit.length; j < cLen; j++) {
        let id = clientsSplit[j][0].replace('id:', '');
        let lat = clientsSplit[j][1].replace('lat:', '');
        let long = clientsSplit[j][2].replace('long:', '');

        let client = new Client(id, lat, long);
        clients.push(client);
    }
}

//calculate the greater circle distance
function calcDistance (lat, long) {
    let lat2 = lat;
    let lon2 = long;
    let la1 = fovLatRad;
    let la2 = toRadians(lat2);
    let laDiff = toRadians(lat2-fovLat);
    let loDiff = toRadians(lon2-fovLong);

    let a = Math.sin(laDiff/2) * Math.sin(laDiff/2) +
        Math.cos(la1) * Math.cos(la2) *
        Math.sin(loDiff/2) * Math.sin(loDiff/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    let d = (earthR * c) / 1000;

    return d;

}

function logInviteList(distance, id){
    if (distance < 100) {
        console.log("PASS: Send invite to client ID " + id);
    }
}

//init

calculate('../app/customers.txt');

module.exports = {
    calcDistance: calcDistance,
    importCustomers: importCustomers,
    calculate: calculate,
    parseCustomers: parseCustomers
};









