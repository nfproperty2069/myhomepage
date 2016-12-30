var opbeat = require('opbeat').start();
var express = require('express');
var fs = require('fs');
var app = express();
var moment = require('moment');

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
//app.use(bodyParser.urlencoded({ extended: true }));
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

    var body = req.body;
    body.time = new Date().toString();

    console.log(body);

    fs.appendFile(__dirname + '/public/files/coming projects',JSON.stringify(body,null,2), function (err,data) {

        if(err) throw err;

      // res.write(
      //     "<!DOCTYPE html>" +
      //     "<html lang='en' dir='ltr'>" +
      //     "<head>" +
      //     "<met charset='utf-8'>" +
      //     "<title>Hola Mundo</title>" +
      //     "</head>" +
      //     "<body>" +
      //     "<script type='text/javascript'>alert('Hello World')</script>" +
      //     "</body>" +
      //     "</html>");
        //res.redirect('/');
    //    res.end();
        res.redirect('/');


    })
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

