var opbeat = require('opbeat').start();
var express = require('express');
var fs = require('fs');
var app = express();
var circularJSON = require('circular-json');

var geoip = require('geoip-lite');

app.set('port', (process.env.PORT || 5000));

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
    console.log('location : '+JSON.stringify(geo));
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
            cnt: p
        });
    });

});

// app.get('/', function(request, response) {
// response.render('pages/index');
// });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


