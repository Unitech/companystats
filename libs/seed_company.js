/*
 * Script to grab all single set data from Crunchbase
 * Strzelewicz Alexandre
 */

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/crunchbase');

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

StyleSchema = new Schema({
    name : String,
    permalink : String,
    updated_at : { type : Date, default : Date.now },
    created_at : { type : Date, default : Date.now }
});

var Company = mongoose.model('company', StyleSchema);
var Product = mongoose.model('product', StyleSchema);
var FinancialOrganization = mongoose.model('financial-organization', StyleSchema);

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
 * Companies
 */
console.log('1# Making request');
wget('api.crunchbase.com', '/v/1/companies.js', false, function (atom) {
    console.log('2# Parsing request');
    var data = JSON.parse(atom);

    console.log('3# Processing data');
    data.forEach(function(data) {
	var instance = new Company({
	    name : data.name,
	    permalink : data.permalink
	}).save(function() {
	    console.log('Company ' + data.name + ' processed');   
	});
    });
});

/*
 * Products
 */
console.log('1# Making request');
wget('api.crunchbase.com', '/v/1/products.js', false, function (atom) {
    console.log('2# Parsing request');
    var data = JSON.parse(atom);

    console.log('3# Processing data');
    data.forEach(function(data) {
	var instance = new Product({
	    name : data.name,
	    permalink : data.permalink
	}).save(function() {
	    console.log('Product ' + data.name + ' processed');   
	});
    });
});

/*
 * Financial Organizations
 */
console.log('1# Making request');
wget('api.crunchbase.com', '/v/1/financial-organizations.js', false, function (atom) {
    console.log('2# Parsing request');
    var data = JSON.parse(atom);

    console.log('3# Processing data');
    data.forEach(function(data) {
	var instance = new FinancialOrganization({
	    name : data.name,
	    permalink : data.permalink
	}).save(function() {
	    console.log('Product ' + data.name + ' processed');   
	});
    });

});


// var instance = new Company({
//     name : 'Test'
// });

//instance.name = 'Test';
//instance.permalink = 'sisis';

// instance.save(function(err) {
//     console.log(err);
// //    process.exit(code=0)
// });

// Company.find({}, function(err, docs) {
//     console.log(docs);
// });
