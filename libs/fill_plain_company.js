/*
 * Script to fill all companies 
 * Strzelewicz Alexandre
 */

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/crunchbase');

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

StyleSchema = new Schema({
    name : String,
    permalink : String,
    meta : JSON,
    updated_at : { type : Date, default : Date.now },
    created_at : { type : Date, default : Date.now }
});

PlainCompany = new Schema({
    test : String
});


var Company = mongoose.model('company', StyleSchema);
var Product = mongoose.model('product', StyleSchema);

var PlainCompany = mongoose.model('plain_company', PlainCompany);

var FinancialOrganization = mongoose.model('financial-organization', StyleSchema);

var events = require('events');
var eventEmitter = new events.EventEmitter();
var heartrate = 0;

var CONCURRENT_CONNECTIONS = 15;
var MIN_RANGE = 2;

/*
 * Wget to get JSON
 */
var http = require('http');

function wget (host, path, https, callback) {
    var port = (https)? 443: 80, 
    client = http.createClient(port, host, https),
    request = client.request('get', path, { 'host': host }),
    response_body = '';

    request.end();
    request.on('response', function (response) {
	response.on('data', function (chunk) {
            response_body += chunk;
	});
	response.on('end', function () {
            callback(response_body);
	});
    });
}

/*
 * Main
 */

function fill_company(offset) {
    var q = Company.find({}).limit(CONCURRENT_CONNECTIONS).sort('_id', 1).skip(offset);

    q.execFind(function(err, docs) {    
	docs.forEach(function(company) {
	    var url = '/v/1/company/' + encodeURIComponent(company.permalink) + '.js';
	    wget('api.crunchbase.com', url, false, function (atom) {
		try {
		    new PlainCompany(JSON.parse(atom)).save(function() {
			g_offset++;
			eventEmitter.emit('heartbeat', company);
		    });
		}
		catch (err) {
		    
		}
	    });
	});    
    });    
}

var fs = require('fs');
var g_offset = 0;

fs.readFile('offset', 'ascii', function(err, data){
    if (err)
	throw "File offset not found (CREATE IT with a 0)";
    g_offset = parseInt(data);
    fill_company(g_offset);
});

/*
 * Avoid too much concurrent connections
 */


var exec = require('child_process').exec;
var sys = require('sys');

eventEmitter.on('heartbeat', function(message){ 
    heartrate++;
    process.stdout.write('                                            \r' +
			 g_offset + '/86148' + ' -- ' + message.name);
    if (heartrate == CONCURRENT_CONNECTIONS - MIN_RANGE) {
	setTimeout(function() {
	    heartrate = 0;
	    fill_company(g_offset);
	}, 20);
    }
});



process.on('exit', function () {
    console.log('FUCK');
});

process.on('SIGINT', function () {
    console.log('About to exit.');

    fs.writeFile('offset', g_offset, function (err) {
	console.log('Offset succesfully saved, quitting...');
	process.exit(code=0)
    });


});


