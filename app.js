var express = require('express');
var app = express();

var path = require('path');
global.appRoot = path.resolve(__dirname);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(appRoot + '/assets'));
app.use(express.static(appRoot + '/'));
app.use(express.static(appRoot + '/node_modules/bootstrap/dist'));

app.get('/', function (req, res) {
    res.sendFile(appRoot + '/index.html');
});

app.get('/pixel.gif', function (req, res) {
    console.log(req.query);
    const TRANSPARENT_GIF_BUFFER = Buffer.from('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64');
    res.writeHead(200, { 'Content-Type': 'image/gif' });
    res.end(TRANSPARENT_GIF_BUFFER, 'binary');
});

var server = app.listen(process.env.PORT, function () {
    console.log('Node server is running on port 5000..');
});
