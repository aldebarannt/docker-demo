var fs = require('fs');
var express = require('express'),
    app = express(),
    redis = require('redis'),
    RedisStore = require('connect-redis')(express),
    server = require('http').createServer(app);

var logFile = fs.createWriteStream('/var/log/nodeapp/nodeapp.log', {flags: 'a'});

app.configure(function() {
  app.use(express.logger({stream: logFile}));
  app.use(express.cookieParser('keyboard-cat'));
  app.use(express.session({
        store: new RedisStore({
            host: '192.168.99.100',
            port: 6379,
            db: 0
        }),
        cookie: {
            expires: false,
            maxAge: 30 * 24 * 60 * 60 * 1000
        }
    }));
});

var client = redis.createClient();//CREATE REDIS CLIENT
 
//GET KEY'S VALUE
app.get('/redis/get/:key', function(req, response) {
	client.get(req.params.key, function (error, val) {
		if (error !== null) console.log("error: " + error);
		else {
			response.send("The value for this key is " + val);
		}
	});
});
 
//SET KEY'S VALUE
app.get('/redis/set/:key/:value', function(req, response) {
	client.set(req.params.key, req.params.value, function (error, result) {
		if (error !== null) console.log("error: " + error);
		else {
			response.send("The value for '"+req.params.key+"' is set to: " + req.params.value);
		}
	});
});
 
app.get('/', function(req, res) {
  res.json({
    status: "ok"
  });
});

app.get('/hello/:name', function(req, res) {
  res.json({
    hello: req.params.name
  });
});

var port = process.env.HTTP_PORT || 3000;
server.listen(port);
console.log('Listening on port ' + port);