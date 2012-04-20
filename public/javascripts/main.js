


$(document).ready(function() {
    // Autocomplete
    // $('.search-query').keyup(function() {

    // 	$.getJSON('/company/search', {search : $(this).val()} , function(dt) {
    // 	    autocomplete_companies = dt;
    // 	    //console.log(dt);
    // 	    $('.search-query').data('typeahead').source = dt;
    // 	});
    // });
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
	    window.location = '/companyv2/show/' + ui.item.value;
            //$('#hidden').val(ui.item.uid);
            return false;
        }
    });
});
