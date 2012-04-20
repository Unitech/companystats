
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/crunchbase');

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

PlainSchema = new Schema({
    name : String,
    tag_list: String,
    tag_list_array : Array
});

var Company = mongoose.model('plain_company', PlainSchema);
var count = 0;

function aaiaia(offset) {
    var query = Company.find().limit(100).skip(offset);

    query.execFind(function(err, comp) {
	comp.forEach(function(dt) {
	    if (dt.tag_list && dt.tag_list != '') {
		var arr = dt.tag_list.split(',');
		var f_arr = [];
		arr.forEach(function(tmp) {
		    f_arr.push(tmp.trim());
		});
		dt.tag_list_array = f_arr;
		dt.save(function(err) {
		    console.log(dt.name + " processed");
		});
	    }
	    //console.log(dt.tag_list);
	    return ;
	});
	offset += 100;
	aaiaia(offset);
    });
}

function modif() {
    aaiaia(0);
    
    
}

Company.count(function(err, dt) {
    modif();
});
