
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
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

// Routes
app.get('/', function(req, res) {
    res.render('index');
});

/*
 * Products
 */
app.get('/product/list', function(req, res) {
    var q = Product.find({}).limit(50).sort('_id', 1);
    
    q.execFind(function(err, docs) {
	res.render('product/index', {products : docs});	
    });
});


/*
 * Company V2
 */
app.get('/companyv2/list', function(req, res) {
    var q = PlainCompany.find({}).limit(50).sort('founded_year', -1);
    q.execFind(function(err, docs) {
	res.render('companyv2/index2', { company : docs });
    });
});


app.get('/companyv2/show/:id', function(req, res) {
    var q = PlainCompany.findOne({'permalink' : req.params.id});    
    q.execFind(function(err, comp) {
	res.render('companyv2/show_company', {company : comp[0]});
    });
});


app.get('/companyv2/ajax', function(req, res) {
    var q = PlainCompany.find({}).limit(10).sort('founded_year', -1).skip(req.query.offset);
    q.execFind(function(err, comp) {
	res.json(comp);
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


/*
 * ToolBox
 */

app.get('/tools', function(req, res) {
    var q = Tools.find();
    q.execFind(function(err, tools) {
	res.render('tools', {tools : tools});
    });
});

app.post('/tools/new', function(req, res) {
    new Tools(req.body).save(function(dt) {
	res.json({success : true});
    });
});

app.post('/tools/:id/new', function(req, res) {
    var q = Tools.findOne({"_id" : req.params.id});

    q.execFind(function(err, tools) {
	tools[0].links.push(req.body);
	console.log(tools[0]);
	tools[0].save(function() {
	    res.json({success : true});
	});
    });

});

app.del('/tools/:par_id', function(req, res) {
    Tools.findById(req.params.par_id, function(err, post) {
	post.remove();
	post.save(function(err) {
	    res.json({success : true});
	});
    });
});

app.del('/tools/:par_id/:id', function(req, res) {
    Tools.findById(req.params.par_id, function(err, post) {
	post.links.id(req.params.id).remove();	
	post.save(function(err) {
	    res.json({success : true});
	});
    });
});



app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

