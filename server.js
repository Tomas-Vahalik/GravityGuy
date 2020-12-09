var http = require("http");
const fs = require('fs');

//var data = [];
http.createServer(function (req, res) {
    
    // initialize the body to get the data asynchronously
    req.body = "";

    // get the data of the body
    req.on('data', function (chunk) {
        req.body += chunk;
    });

    //all data
    req.on('end', function () {
        //console.log(req.method);
        var origin = req.headers['origin'];
        if (req.url == "/get/" && req.method == "GET") {                        
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            let rawData = fs.readFileSync('score.json');
            let data = JSON.parse(rawData);
            console.log("returning: " + JSON.stringify(data));
            res.end(JSON.stringify(data));
        }      
        else if (req.url == "/post/" && req.method == "POST") {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.writeHead(200);
            //data.push(JSON.parse(req.body))    


            fs.readFile("score.json", function (err, data) {
                var json = JSON.parse(data)
                json.push(JSON.parse(req.body))
                console.log(json);
                fs.writeFileSync("score.json", JSON.stringify(json))
            })           
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

}).listen(8888);