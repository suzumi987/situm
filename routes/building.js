var express = require('express');
var router = express.Router();
const axios = require('axios');


/*   ............... URL Postman ...............
  http://localhost:3000/building?data=building&key=ais&value=1
  http://localhost:3000/building?data=building
  http://localhost:3000/building?data=floor&key=ais&value=1
  http://localhost:3000/building?data=floor
  http://localhost:3000/building?data=filter&key=ais&value=1
  http://localhost:3000/building?data=filter
*/


router.get('/', async function (req, res) {
  console.log('1.1');
  var databuilding = await buildingReq(req);
  var filterFL = await filterfloor(databuilding);
  var filterValue = await filterDatas(filterFL, req);

  if (req.query.data == 'building') {
    if (req.query.key != null && req.query.value != null) {
      res.send(databuilding);
    } else {
      res.send(databuilding);
    }
  } else if (req.query.data == 'floor') {
    if (req.query.key != null && req.query.value != null) {
      res.send(filterFL);
    } else {
      res.send(filterFL);
    }
  } else if (req.query.data == 'filter') {
    if (req.query.key != null && req.query.value != null) {
      res.send(filterValue);
    } else {
      res.send(filterValue);
    }
  }

});

async function buildingReq(req) {
  var key = req.query.key;
  var value = req.query.value;
  var responseMesg;
  try {
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
      console.log('All Buliding');
    }
  } catch (err) {
    console.log("error : " + err);
  }
  return responseMesg;
}


async function floorReq(buildingID) {
  console.log('1.3');
  try {
    var sendReq = await axios.get('https://dashboard.situm.es/api/v1/projects/' + buildingID + '/floors', {
      headers: {
        'Content-Type': 'application/json',
        'X-API-EMAIL': 'sakda.ace@gmail.com',
        'X-API-KEY': '1a28a148832c74123bfd66d6b7256cb3d76101208bc82ecb4366cd58547773ab'
      }
    });
    var responseMesg = sendReq.data;

  } catch (err) {
    console.log("error Floor : " + err);
  }
  // console.log('xxxxx : ' + JSON.stringify(responseMesg));
  return responseMesg;
}


async function filterfloor(databuilding) {
  console.log('1.2');
  var a = {};
  var b = {};
  var key = 'id';
  b[key] = [];
  console.log(databuilding.id);
  var v;
  if (typeof databuilding.id === "undefined") {
    for (var x in databuilding) {
      var dataFloor = await floorReq(databuilding[x].id);
      b[key].push(dataFloor);
    }
    a.dataBuilding = databuilding
    a.dataFloor = b;
  } else {
    var dataFloor = await floorReq(databuilding.id);
    a.dataBuilding = databuilding;
    a.dataFloor = dataFloor;
  }
  return a;
}

async function filterDatas(filterValue, req) {
  console.log('1.4');
  // console.log(filterValue);
  var a = {};
  var b = {};
  var key = 'floor';
  b[key] = [];
  var c = {};
  var keybuild = 'build';
  c[keybuild] = [];
  for (var x in filterValue) {
    var d = filterValue[x];
    if (x == 'dataBuilding') {
      if (req.query.key != null && req.query.value != null) {
        var v = {};
        v.name = d.name;
        v.location = d.location;
        c[keybuild].push(v);
      } else {
        for (var val in d) {
          var v = {};
          v.name = d[val].name;
          v.location = d[val].location;
          c[keybuild].push(v);
        }
      }
    } else if (x == 'dataFloor') {
      if (req.query.key != null && req.query.value != null) {
        for (var k in d) {
          var v = {};
          v.level = d[k].level;
          v.level_height = d[k].level_height;
          v.maps = d[k].maps;
          b[key].push(v);
        }
      } else {
        for (var k in d.id) {
          var s = d.id[k];
          for (var q in s) {
            console.log(s[q].level);
            var v = {};
            v.level = s[q].level;
            v.level_height = s[q].level_height;
            v.maps = s[q].maps;
            b[key].push(v);
          }
        }
      }
    }
  }
  a.dataBuilding = c;
  a.dataFloor = b;
  return a;
}

module.exports = router;