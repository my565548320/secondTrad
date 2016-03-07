var http = require('http');
var Q = require('q');
var querystring = require('querystring');

//url = "http://www.google.com"  network protocol must is http
exports.get = function (url) {
	var defer = Q.defer();
	var request = http.get(url, function (response) {
		response.setEncoding('utf8');
		var responseData = '';
		response.on('data', function(data) {
      responseData += data;
    });
    response.on('end',function() {
    	defer.resolve(JSON.parse(responseData));
    });
	});
	request.on('error',function(err){
		defer.reject(err);
	});
	request.end();
	return defer.promise;
};

// options layout
// network protocol must is http
// var options = {
//   hostname: 'www.google.com',
//   port: 80,
//   path: '/upload',
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'Content-Length': postData.length
//   }
// };
exports.post = function (options,post_data,type) {
	var defer = Q.defer();
	var post_type = type||'application/json';
	switch(post_type){
		case 'application/json':
			post_data = JSON.stringify(post_data);
			break;
		case 'application/x-www-form-urlencoded':
			post_data = querystring.stringify(post_data);
			break;
	}
	options.method = 'POST';
	options.headers = {
		'Accept':'application/json',
    'Content-Type': post_type,
	}
	var request = http.request(options, function(response) {
		response.setEncoding('utf8');
		var responseData = '';
		response.on('data', function(data) {
	        responseData += data;
	    });
	    response.on('end',function(){
	    	defer.resolve(JSON.parse(responseData));
	    });
	});
	request.write(post_data);
	request.on('error',function(err){
		defer.reject(err);
	});
	request.end();
	return defer.promise;
};