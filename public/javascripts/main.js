
MAIN = {};

MAIN.autocomplete = function() {
    var search_bar = $('.search-query');
    
    search_bar.autocomplete({
    	source : '/company/search',
	parse : function(dt) {
	    console.log(dt);
	},
	formatItem: function(data, i, n, value) {
            return "<img src='images/" + value + "'/> " + value.split(".")[0];
        },
	select: function(event, ui){
            search_bar.val(ui.item.label);
	    // Redirect
	    window.location = '/companyv2/show/' + ui.item.value;
            return false;
        }
    });
};

MAIN.trends = function() {
    $('.trendy-widget').click(function() {
	console.log('ok');
    });
};

$(document).ready(function() {
    // Autocomplete
    MAIN.autocomplete();
    // Trends
    MAIN.trends();
});
