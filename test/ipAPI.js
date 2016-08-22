var http = require('http');

http.get('http://ip-api.com/json', function(resp) {
    resp.on('data', function(ip) {
        console.log("My public IP address is: " + ip);
    });
});


$.get("http://ipinfo.io", function(response) { console.log(response.ip, response.country); }, "jsonp");