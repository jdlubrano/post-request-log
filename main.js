var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');

app.use(bodyParser.json());

AWS.config.update({
  region: 'us-west-2'
});

var dynamoClient = new AWS.DynamoDB.DocumentClient();

app.get('/', function (req, res) {
  console.log('GET /');
  res.sendFile(__dirname + '/index.html');
});

app.get('/requests', function (req, res) {
  console.log('GET /requests');
  dynamoClient.scan({ TableName: 'post_requests' }, function (err, result) {
    if (err) {
      console.log(err);
      res.status(503).send('Failed to query post_requests');
    } else {
      console.log('QUERY DONE');
      res.send(result.Items);
    }
  });
});

app.post('/requests', function (req, res) {
  console.log('POST /requests');
  var params = {
    TableName: 'post_requests',
    Item: req.body
  };
  dynamoClient.put(params, {}, function(err) {
    if (err) {
      console.log(err);
      res.status(500).send('Failed to put item');
    } else {
      console.log('successful put item');
      res.send('Nice!');
      io.emit('request received', req.body);
    }
  });
});

app.get('/app.js', function (req, res) {
  res.sendFile(__dirname + '/app.js');
});

http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

