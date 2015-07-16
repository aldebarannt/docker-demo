var fs = require('fs');
var express = require('express'),
    app = express(),
    redis = require('redis'),
    RedisStore = require('connect-redis')(express),
    server = require('http').createServer(app);

var logFile = fs.createWriteStream('/var/log/nodeapp/nodeapp.log', {flags: 'a'});
var client = redis.createClient(6379, 'redis_primary', {});

app.configure(function() {
  app.use(express.logger({stream: logFile}));
  app.use(express.cookieParser('keyboard-cat'));
  app.use(express.session({
        store: new RedisStore({
            host: process.env.REDIS_HOST || 'redis_primary',
            port: process.env.REDIS_PORT || 6379,
            client: client
        }),
        cookie: {
            expires: false,
            maxAge: 30 * 24 * 60 * 60 * 1000
        }
    }));
});

//GET KEY'S VALUE
app.get('/redis/get/:key', function(req, res) {
	client.get(req.params.key, function (error, val) {
		if (error !== null) {
			res.json({
				ok: false
			});
		} else {
			res.json({
				ok: true,
				value: req.params.value
			});
		}
	});
});
 
//SET KEY'S VALUE
app.get('/redis/set/:key/:value', function(req, res) {
	client.set(req.params.key, req.params.value, function (error, result) {
		if (error !== null) {
			res.json({
				ok: false
			});
		} else {
			res.json({
				ok: true
			});
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