// var http = require("http");
// const fs = require('fs');

// let port = process.env.PORT || 5000;

var data = [];
// http.createServer(function (req, res) {

//     // initialize the body to get the data asynchronously
//     req.body = "";

//     // get the data of the body
//     req.on('data', function (chunk) {
//         req.body += chunk;
//     });


//     req.on('end', function () {
//         var origin = req.headers['origin'];
//         if (req.url == "/get/" && req.method == "GET") {
//             res.setHeader("Access-Control-Allow-Origin", origin);
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             //IN MEMORY SOLUTION
//             res.end(JSON.stringify(data));
//         }
//         else if (req.url == "/post/" && req.method == "POST") {
//             res.setHeader("Access-Control-Allow-Origin", origin);
//             res.writeHead(200);
//             //IN MEMORY SOLUTION
//             data.push(JSON.parse(req.body));
//             res.end('ok');
//         }
//         else if (req.method == "OPTIONS") {
//             console.log("options");
//             res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
//             res.setHeader("Access-Control-Allow-Origin", origin);
//             res.setHeader("Access-Control-Allow-Headers", "*");
//             res.end();
//         }
//     });
// }).listen(port, () => {console.log(port)});



// lib/app.ts
let express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
var path = require('path');


// Create a new express application instance
const app = express();

let port = process.env.PORT || 5000;


  /** set up middlewares */
  app.use(cors());
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(express.static( __dirname + '/view'));

  app.listen(port, function () {
    // console.log(`Example app listening on port ${port}!`);
  });
  app.get('/get', (req, res) => {
    res.send(JSON.stringify(data))
  })
  app.post('/post', function (req, res) {
    data.push(JSON.parse(req.body));
    res.send('saved')
  })

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/view/index.html'));
  })


