var express = require('express');
var router = express.Router();
const axios = require('axios');


router.get('/customFiled', async function (req, res) {
  console.log('1.1');
  var databuilding = await buildingReq(req);
  var dataFloor = await floorReq(databuilding.id);
  // res.send(JSON.stringify(databuilding+','+dataFloor));
  // console.log(JSON.stringify(databuilding));
  // console.log(JSON.stringify(dataFloor));
  var a ={};
  a.databuilding = databuilding;
  a.datafloor = dataFloor;

  res.send(a);

});

async function buildingReq(req) {
  var key = req.query.Key;
  var value = req.query.Value;
  var responseMesg;
  try {
    console.log('In Try');
    var sendReq = await axios.get('https://dashboard.situm.es/api/v1/projects', {
      headers: {
        'Content-Type': 'application/json',
        'X-API-EMAIL': 'sakda.ace@gmail.com',
        'X-API-KEY': '1a28a148832c74123bfd66d6b7256cb3d76101208bc82ecb4366cd58547773ab'
      }
    });
    var data = sendReq.data;
    if (key != null && value != null) {
      for (var x in data) {
        var fieldData = data[x].custom_fields;
        for (var myKey in fieldData) {
          if (fieldData[myKey].key === key && fieldData[myKey].value === value) {
            responseMesg = data[x];
            console.log('1x');
            return responseMesg;
          } else {
            responseMesg = 'Key or Value is not Match';
            console.log('2x');
          }
        }
      }
    } else if (key == null && value == null) {
      responseMesg = data;
      console.log('else if');
    }
  } catch (err) {
    console.log("error : " + err);
  }
  return responseMesg;
}


async function floorReq(buildingID) {
  try {
    var sendReq = await axios.get('https://dashboard.situm.es/api/v1/projects/'+buildingID+'/floors', {
      headers: {
        'Content-Type': 'application/json',
        'X-API-EMAIL': 'sakda.ace@gmail.com',
        'X-API-KEY': '1a28a148832c74123bfd66d6b7256cb3d76101208bc82ecb4366cd58547773ab'
      }
    });
    var responseMesg = sendReq.data;

  } catch (err) {
    console.log("error : " + err);
  }
  // console.log('xxxxx : ' + JSON.stringify(responseMesg));
  return responseMesg;
}





module.exports = router;



