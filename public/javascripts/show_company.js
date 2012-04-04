
$(function() {
    console.log('asd');
    $.getJSON('http://api2.socialmention.com/search?q=buzcard&f=json&t=microblogs&lang=fr&callback=?', function(data) {
	console.log(data);
    });
});