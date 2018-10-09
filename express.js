/* ------------- [START IMPORT MODULE] ------------ */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const conflog = require('../config/commonlog-kb.js');


/* ------------- [END SET ENVIRONMENT] ------------ */
/* ------------- [START STORE CONFIG] ------------ */

/* ------------- [END IMPORT MODULE] ------------ */
/* ------------- [START IMPORT OUR UTIL] ------------ */
//var logger = require('../utils/logger');

var uuid = require('uuid');
const smf = require('../cache_key_smf/cache-key-servmng.js');
const cacheSMFFunction = require('../modules/service/cacheSMFFunction');
const config = require('../constants/constants');


/* ------------- [END IMPORT OUR UTIL] ------------ */
/* ------------- [START IMPLEMENT] ------------ */
module.exports = function () {
 
  var app = express();
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
 
  console.log("Overriding 'Express' logger");

  function getRemoteIp(req ,res){
    var remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
    if(remoteIp.indexOf(':') > -1 ){
      var tmp = remoteIp.split(':');
      remoteIp = tmp.length > 0 ? tmp[tmp.length -1 ]:remoteIp;
    }
    return remoteIp;
  }

  app.use( function (req, res, next) {
    req.id = req.headers['x-tid'] || uuid.v4();
    var remoteIp = getRemoteIp(req, res);
    req.logbk = require('../utils/logs/logHandle.js').initSession(req.id);
    var headerLog = `FROMIP|${remoteIp}|REQUESTID|${req.id}|URL|${req.method} ${req.originalUrl}|REQHEADER|${JSON.stringify(req.headers)}|REQBOBY|${JSON.stringify(req.body)}`
    req.logbk.debug("Start Proccess",req.method , req.originalUrl , "..."); 
    req.headerLog = headerLog;
    next();
  });

  const logg = require('commonlog-kb').init(conflog ,app);
  logg.sessionID =  (req , res) => {
    return req.id 
  }

  let getKey = async (appname, kid, subject, header, appLog, detailLog, summaryLog, res) => {
    return cacheSMFFunction.getKey(appname, kid, subject, header, appLog, detailLog, summaryLog, res);
  };
  
  let postKey = async (appname, subject , header, appLog, detailLog,summaryLog, res) => {
    // await new Promise(r => setTimeout(r, 1000));  
    return cacheSMFFunction.postKey(appname, subject , header, appLog, detailLog,summaryLog, res);
  };
  smf.postKey( postKey );
  smf.getKey( getKey ) ; 

  function logResponseBody(req, res, next) {
    var oldWrite = res.write,
        oldEnd = res.end;
  
    var chunks = [];
  
    res.write = function (chunk) {
      chunks.push(chunk);
      oldWrite.apply(res, arguments);
    };
  
    res.end = function (chunk) {
      var body = '';

      if (typeof chunk !== 'string' && !(chunk instanceof Buffer)) {
          res["resBody"] = body ;
          oldEnd.apply(res, arguments);
          return ;
      }

      if (!(chunk instanceof String || typeof chunk === 'string' ) )
          chunks.push(chunk);
      try { 
        body =  chunks.length > 0? Buffer.concat(chunks).toString('utf8')  :'';
        res.body = body;
      } catch (error) {
        req.logbk.error(error);
      }

      res["resBody"] = body ;
      let log = `SUMMARY_CLIENT|${req.headerLog}|RESBODY|${body}|`;
      req.logbk.debug(log);
      req.logbk.debug("End Proccess",req.originalUrl);
     
        
      oldEnd.apply(res, arguments);
    };
    next();
  }
  
  app.use(logResponseBody);

  
  logg.info("load module");
  var load = require('express-load');
  var cwdPath = path.join(__dirname, '..');
  load('modules', {
    cwd: cwdPath,
    checkext:true, 
    extlist:['service.js']
  }).into(app);
  load('modules', {
    cwd: cwdPath ,
    checkext:true, 
    extlist:['ctrl.js']
  }).into(app);
  load('modules', {
    cwd: cwdPath,
    // verbose: true,
    checkext:true, 
    extlist:['route.js']
  }).into(app);
  /* ------------- [END LOAD API ROUTE] ------------ */
  /* ------------- [START NOT MATCH ROUTE - 404 ] ------------ */

  app.all('/error', function (req, res) {
    logger.error('Got Redirect Error');
    res.status(500).send({
      error: "Connection close!"
    });
    // Future Action.
  });
  // app.all('*', function (req, res) {
  //   logger.info('[TRACE] Server 404 request:' + req.originalUrl);
  //   res.status(500).send({
  //     error: "Connection close!"
  //   });
  //   // Future Action.
  // });
  /* ------------- [END NOT MATCH ROUTE - 404 ] ------------ */
  return app;
};
/* ------------- [END IMPLEMENT] ------------ */