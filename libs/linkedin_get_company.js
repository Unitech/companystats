/*
 * Script to fill all companies 
 * Strzelewicz Alexandre
 */

var mongoose = require('mongoose');
var jsdom = require("jsdom");

var db = mongoose.connect('mongodb://localhost/linkedin');

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

StyleSchema = new Schema({
    name : String,
    id : String
});

var Company = mongoose.model('company', StyleSchema);


/*
 * $('*:contains("Company Size")').each(function(){
 * if($(this).children().length < 1) 
 * $(this).css("border","solid 2px red") });
 */

for (var i = 5000; i < 5500; i++) {

    function scrapp(i) {
	jsdom.env({
	    html: 'http://www.linkedin.com/company/' + i,
	    scripts: [
		'http://code.jquery.com/jquery-1.5.min.js'
	    ],
	    done: function(errors, window) {
		var $ = window.$;
		var data = $('#section-header h1').html().trim();

		
		if (data != '') {
		    $('*:contains("Company Size")').each(function(dt, tot){
			if($(this).children().length < 1) {
			    var employees = $(this).next().html();

			    $('*:contains("Website")').each(function(dt, tot){
				
				if($(this).children().length < 1) {
				    var website = $(this).next().text().trim();
				    console.log(i);
				    console.log(data);
				    console.log(employees);
				    console.log(website);
				}
			    });;
			    
			}
		    });


		}		
	    }
	});
    }

    scrapp(i);
}