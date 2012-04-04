
var Company = mongoose.model('company', StyleSchema);

/*
 * Company
 */
app.get('/company/list', function(req, res) {
    var q = Company.find({}).limit(50).sort('_id', 1);
    q.execFind(function(err, docs) {
	res.render('company/index', { title: 'Express', company : docs });
    });
});

app.get('/company/show/:id', function(req, res) {
    var q = Company.findOne({'permalink' : req.params.id});    
    q.execFind(function(err, comp) {
	res.render('company/show_company', {company : comp[0]});
    });
});

app.get('/companies/ajax', function(req, res) {
    var q = Company.find({}).limit(10).sort('_id', 1).skip(req.query.offset);
    q.execFind(function(err, comp) {
	res.json(comp);
    });
});
