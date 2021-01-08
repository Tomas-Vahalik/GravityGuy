var http = require("http");
const fs = require('fs');

let port = process.env.PORT || 5000;

var data = [];
http.createServer(function (req, res) {

    // initialize the body to get the data asynchronously
    req.body = "";

    // get the data of the body
    req.on('data', function (chunk) {
        req.body += chunk;
    });


    req.on('end', function () {
        var origin = req.headers['origin'];
        if (req.url == "/get/" && req.method == "GET") {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            //IN MEMORY SOLUTION
            res.end(JSON.stringify(data));

            //FILE SOLUTION
            /*let rawData = fs.readFileSync('score.json');
            let data = JSON.parse(rawData);
            console.log("returning: " + JSON.stringify(data));
            res.end(JSON.stringify(data));*/
        }
        else if (req.url == "/post/" && req.method == "POST") {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.writeHead(200);
            //IN MEMORY SOLUTION
            data.push(JSON.parse(req.body));

            //FILE SOLUTION
            /*fs.readFile("score.json", function (err, data) {
                var json = JSON.parse(data)
                json.push(JSON.parse(req.body))
                console.log(json);
                fs.writeFileSync("score.json", JSON.stringify(json))
            })*/
            res.end('ok');
        }
        else if (req.method == "OPTIONS") {
            console.log("options");
            res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Access-Control-Allow-Headers", "*");
            res.end();
        }
    });

}).listen(port);