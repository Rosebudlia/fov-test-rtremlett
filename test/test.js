const assert = require('assert');
const functions = require('../app/index.js');

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal([1,2,3].indexOf(4), -1);
        });
    });
});

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

describe ('Customer data parser/filter', function(){
    it ('should only add one customer to the array', function (){
        let clients = [];

        class Client {
            constructor(id, lat, long){
                this.idNr = id;
                this.lat = lat;
                this.long = long;
            }
        }

        functions.importCustomers('../app/testData.txt', function(err, data){
            if (err) done(err);
            else {
               let result = functions.parseCustomers(data);
            }
        });

        assert.equal(result.length, 1);
    })
});
