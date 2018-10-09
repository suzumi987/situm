var express = require('express');
var router = express.Router();
var request = require('request');


/* GET home page. */

router.route('/info/:name')
.get(function (req, res, ) {
  res.send("Get " + req.params.name);

});

router.get('/customFiled', function (req, res) {
 var key = req.query.Key;
 var value = req.query.Value;

 // console.log(typeof value);
var https = require('https');
var options = {
  host: 'dashboard.situm.es',
  path: '/api/v1/projects',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-EMAIL': 'sakda.ace@gmail.com',
    'X-API-KEY': '1a28a148832c74123bfd66d6b7256cb3d76101208bc82ecb4366cd58547773ab'

  }
};
var req = https.request(options, function (resp) {
  //console.log('STATUS: ' + resp.statusCode);
  //console.log('HEADERS: ' + JSON.stringify(resp.headers));
  resp.setEncoding('utf8');
  var responseMesg ='';
  resp.on('data', function (chunk) {
    data = JSON.parse(chunk);
    if(key != null && value != null){
      for (var x in data) {
        var fieldData = data[x].custom_fields;
        for (var myKey in fieldData) {
          if (fieldData[myKey].key === key && fieldData[myKey].value === value) {
            responseMesg = data[x];
            console.log('1');
            return res.send(responseMesg);
          }else{
           responseMesg = 'Key or Value is not Match';
           console.log('2');
          }
        }
      }
     }else if(key == null && value == null){
       res.send(chunk);
       console.log('else if');
     }
     res.send(responseMesg);
  });
});
req.on('error', function (e) {
  console.log('problem with request: ' + e.message);
});
// write data to request body
req.write('data\n');
req.write('data\n');
req.end();

});

router.get('/floors', function (req, res) {
 var level = req.query.level;

 // console.log(typeof value);
var https = require('https');
var options = {
  host: 'dashboard.situm.es',
  path: '/api/v1/projects/4229/floors',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-EMAIL': 'sakda.ace@gmail.com',
    'X-API-KEY': '1a28a148832c74123bfd66d6b7256cb3d76101208bc82ecb4366cd58547773ab'

  }
};
var req = https.request(options, function (resp) {
 //  console.log('STATUS: ' + resp.statusCode);
 //  console.log('HEADERS: ' + JSON.stringify(resp.headers));
  resp.setEncoding('utf8');
  var responseMesg ='';
  resp.on('data', function (chunk) {
    data = JSON.parse(chunk);
   //  console.log(chunk);
    if(level != null){
      for (var x in data) {
        if(data[x].level == level){
           responseMesg = data[x];
           return res.send(responseMesg);
        }else{
         responseMesg = 'data not found';
        }
      }
     }else if(level == null){
       responseMesg = chunk;
     }
     res.send(responseMesg);
  });
});
req.on('error', function (e) {
  console.log('problem with request: ' + e.message);
});
// write data to request body
req.write('data\n');
req.write('data\n');
req.end();

});

// router.get('/info/:name', function(req, res, next) {
//   res.send("hello "+req.params.name);
// });

module.exports = router;






