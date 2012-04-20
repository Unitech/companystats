
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/crunchbase');


/*
 * Models
 */

var schema = require('./schema.js');

var PlainCompany = mongoose.model('plain_company', schema.PlainSchema);
var Product = mongoose.model('product', schema.StyleSchema);
var ToolsLink = mongoose.model('tools_link', schema.ToolsLinksSchema);
var Tools = mongoose.model('tools_category', schema.ToolsCategorySchema);

/*
 * Configuration
 */

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


/*
 * Home page
 */
app.get('/', function(req, res) {
    var q = PlainCompany.find({}).limit(50).sort('founded_year', -1);
    q.execFind(function(err, docs) {
	res.render('companyv2/index', { company : docs });
    });
});


/*
 * Company V2
 */
app.get('/companyv2/show/:id', function(req, res) {
    var q = PlainCompany.findOne({'permalink' : req.params.id});    
    q.execFind(function(err, comp) {
	res.render('companyv2/show_company', {company : comp[0]});
    });
});

app.get('/companyv2/ajax', function(req, res) {
    var q = PlainCompany.find({}).limit(40).skip(req.query.offset);

    if (req.query.sort == 'newest')
	q.sort('founded_year', -1);
    else if (req.query.sort == 'biggest')
	q.sort('total_money_raised', -1, 'number_of_employees', 1);

    q.execFind(function(err, comp) {
	res.json(comp);
    });
});


/*
 * Products
 */
app.get('/products', function(req, res) {
    res.json('ok');
});




/*
 * Search bar (with autocomplete jquery)
 */ 
app.get('/company/search', function(req, res) {
    var q = PlainCompany.find({}, ['permalink', 'name']).limit(10);
    
    q.where('name').$regex(new RegExp("^" + req.query.term,"i"));
    q.execFind(function(err, docs) {
	var res_data = [];
	docs.forEach(function(doc) {
	    // Reformat data for autocomplete
	    res_data.push({
		label : doc.name, 
		value : doc.permalink
	    });
	});
	res.json(res_data);
    });
});


/*
 * LinkedIN
 */

// var linkedin_client = require('linkedin-js')('key', 'secret', 'http://localhost:3003/auth');

// app.get('/auth', function (req, res) {
//     linkedin_client.getAccessToken(req, res, function (error, token) {
//     // will enter here when coming back from linkedin
// 	req.session.token = token;

// 	res.render('auth');
//     });
// });



app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

