var express = require('express');
var router = express.Router();
var request = require('request');
var https = require('https');



router.get('/customFiled', async function (req, res) {
  console.log('1.1');
  // var retu = mainFunction(req);
  // var retu = building(req);
  var x = await building(req);
  console.log("test :" + x);
});



async function building(req) {
  var responseMesg = 'Datas';
  console.log('2');
  var key = req.query.Key;
  var value = req.query.Value;
  var getBuilding = {
    host: 'dashboard.situm.es',
    path: '/api/v1/projects',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-API-EMAIL': 'sakda.ace@gmail.com',
      'X-API-KEY': '1a28a148832c74123bfd66d6b7256cb3d76101208bc82ecb4366cd58547773ab'
    }
  };

  var dataBuilding = await https.request(getBuilding, function (resp) {
    console.log('3');
    // console.log('STATUS: ' + resp.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(resp.headers));
    resp.setEncoding('utf8');

    resp.on('data', function (chunk) {
      data = JSON.parse(chunk);
      if (key != null && value != null) {
        for (var x in data) {
          var fieldData = data[x].custom_fields;
          for (var myKey in fieldData) {
            if (fieldData[myKey].key === key && fieldData[myKey].value === value) {
              responseMesg = data[x];
              console.log('1x');
              // return responseMesg;
            } else {
              responseMesg = 'Key or Value is not Match';
              console.log('2x');
            }
          }
        }
      } else if (key == null && value == null) {
        res.send(chunk);
        console.log('else if');
      }
      //  console.log(responseMesg);
      // res.send(responseMesg);
      console.log('ccc');
      return responseMesg;
      
    });
  });
  dataBuilding.on('error', function (e) {
    console.log('problem with request: ' + e.message);
  });
  // write data to request body
  dataBuilding.write(responseMesg);
  dataBuilding.end();


  console.log('xxx');
  // return responseMesg;
};

var reqFloor = function () {

  
}

module.exports = router;



