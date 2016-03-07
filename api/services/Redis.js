var Config = require('./Config');
var redis_config = {
	host: Config.basketball.redis_host,
 	port: Config.basketball.redis_port,
 	db:1
};
var redis = require("redis"),
		client = redis.createClient(redis_config);
client.auth(Config.basketball.redis_pass);
module.exports = {
	'set':function(key,value,expire_time){
		client.set(key,value,function(err,reply){
			if(err){
				console.log(err);
				return;
			}
			if(expire_time){
				client.expire(key,expire_time,function(err){
					if(err){
						console.log(err);
						return;
					}
				});
			}
		});
		client.end();
	},
	'get':function(key,callback){
		client.get(key,callback);
	},
	'hmset':function(key,abj,expire_time){
		client.hmset(key,obj,function(err,reply){
			if(err){
				console.log(err);
				return;
			}
			if(expire_time){
				client.expire(key,expire_time,function(err){
					if(err){
						console.log(err);
						return;
					}
				});
			}
		});
	},
	'hgetall':function(key,callback){
		client.hgetall(key,callback);
	}
};