
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$(function() {
    $('#new-toolbox').submit(function(e) {
	e.preventDefault();
	$.post('/tools/new', $(this).serializeObject(), function(dt) {
	    
	});
    });

    $('#add-link').submit(function(e) {
	e.preventDefault();
	$.post('/tools/' + $('#select-theme').val()  + '/new', 
	       $(this).serializeObject(), 
	       function(dt) {
	    
	});
    });

    $('.del-toolbox').each(function(dt) {
	$(this).click(function() {
	    var self = $(this);
	    $.ajax({
		type : 'DELETE',
		url : '/tools/' + self.attr("par-id"),
		success : function() {
		    self.css({'color':'red'});
		}
	    });
	});
    });

    $('.del-tool').each(function(dt) {

	$(this).click(function() {
	    var self = $(this);
	    $.ajax({
		type : 'DELETE',
		url : '/tools/' + self.attr("par-id") + '/' + self.attr("attr-id"),
		success : function() {
		    self.parent().parent().remove();
		}
	    });
	});
    });
});