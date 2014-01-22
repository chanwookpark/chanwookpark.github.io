// https://github.com/felixge/node-formidable
var formidable = require('formidable'),
	http = require('http'),
	util = require('util');

var port = 8099;	

console.log("File upload server start on!(" + port + " port open..)");

http.createServer(function (req, res) {
	if(req.url = "/upload" && req.method.toLowerCase() == 'post' ) {
		var form = new formidable.IncomingForm();

		// from config
		form.encoding = 'utf-8';
		form.uploadDir = "/tmp/upload";
		form.type = true;

		form.parse(req, function(err, fields, files){
			res.writeHead(200, {'content-type': 'text/plain'});
			res.write('received uplod: ');
			res.end(util.inspect({fields: fields, files: files}));
			
			console.log("Upload File>> ");
			for( var i = 0 ; i < files.length ; i++) {
				var f = files[i];
				console.log(f.toJSON());
			}
		});

		return;
	} else if(req.url = "/main") {
			res.writeHead(200, {'content-type': 'text/plain'});
			res.write('Server startup!');
			res.end();
	}// if
}).listen(port);//http