var opbeat = require('opbeat').start();
var express = require('express');
var fs = require('fs');
var app = express();
var moment = require('moment');
var bodyParser = require('body-parser');
var Nexmo = require('nexmo');
var nexmo = new Nexmo({
  apiKey: "695cef78",
  apiSecret: "e405b5f165ffc160"
});

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://root:123456@ds131900.mlab.com:31900/mydb';

var startTime = moment();
startTime = startTime.add(5,'hours').add(30,'minutes');
startTime = startTime.format('YYYY-MM-DD HH:mm');

var circularJSON = require('circular-json');

var geoip = require('geoip-lite');

app.set('port', (process.env.PORT || 5000));

//var bodyParser = require('body-parser');
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(opbeat.middleware.express());


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
var p;

app.get('/', function(request, response) {
    var count;
    var myip = '106.215.130.108';
    var ip = request.headers['x-forwarded-for'];
    var geo = geoip.lookup(ip);
    console.log('client ip : '+ip);
    if(geo != null) {
        console.log('client city : ' + geo.city);
    }
    fs.readFile('stats', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        count = data;

        count++;
        p = count;
        fs.writeFile("stats",p, function (err) {
            if(err) {
                return console.log(err);
            }
        } );
        response.render('pages/index', {
            cnt: p,
            start : startTime
        });
    });

});



// app.get('/', function(request, response) {
// response.render('pages/index');
// });

app.get("/download",function(req,res){
    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; pdfData=2009.jpg',
        'Content-Length': pdf.length
    });
    res.end(pdfData);
});

app.post("/sendresponse",function(req,res){

    console.log(req);
    var body = req.body;
    body.time = new Date().toString();

    console.log('body  -- '+JSON.stringify(body,null,2));

    MongoClient.connect(url, function(err, db) {
    if(err)
    {
      throw err;
    }
    else
    {
    console.log("Connected correctly to server");
    var collection = db.collection('users');

    collection.insert(body, function(err, result) {

      console.log('saved');
      nexmo.message.sendSms(
          '9971916627','919971916627', 'Hello My Master, 1 more entry came from '+' FName : '+body.firstname+'\nLName : '+body.lastname+'\nState : '+body.state+'\nMob : '+body.mob+'\nPDesc : '+body.des,
    (err, responseData) => {
      if (err) {
        console.log('error : '+err);
      } else {
        console.log(' res data '+JSON.stringify(responseData,null,2));
      }
    }
 );
        db.close();
      });
  }

    res.redirect('/');

  });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
