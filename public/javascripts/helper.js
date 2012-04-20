
Helpers = {};

Helpers.nav_tab = function(tabs) {
    var tpl = '<div class="subnav sorting-menu">' +
	'<ul class="nav nav-tabs">';
    
    for (var i = 0; i < tabs.length; i++) {
	tpl += '<li class="">' + 
	    '<a href="#newest" class="sort-btn" data-toggle="tab" data-sort="newest">Newest</a>' +
	    '</li>';

    }
    

};