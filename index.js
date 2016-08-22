var opbeat = require('opbeat').start();

var express = require('express');
var fs = require('fs');
var app = express();
var circularJSON = require('circular-json');

var geoip = require('geoip-lite');

var ip = "207.97.227.239";
var geo = geoip.lookup(ip);

console.log(geo);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(opbeat.middleware.express());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
var p;
app.get('/', function(request, response) {
    var count;
    console.log('client ip : '+request.headers['x-forwarded-for']);
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


