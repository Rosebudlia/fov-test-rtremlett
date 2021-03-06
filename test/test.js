const assert = require('assert');
const functions = require('../app/index.js');

describe ('Great Circle Distance Calc', function(){
   it ('should calculate 5.135km', function(){
       let lat1= 52.516601;
       let long1= 13.380617;
       let distance = 5.135;

       function roundThree(x) {
           return Number.parseFloat(x).toPrecision(4);
       }

       assert.equal(roundThree(functions.calcDistance(lat1, long1)), distance);
    });
});

describe ('Customer data importer', function(){
    it ('should get the customer data', function () {
        functions.importCustomers('../app/testData.txt', function(){
            if (e) done (e);
            else done();
        });
    })
});
