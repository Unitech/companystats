var go_offset = 50;

function bind_tooltip() {
    $(function () {
        $('div[rel=popover]')
	    .popover({
                html: true
            })
    })
}

$(function() {
    var $container = $('#container');

    $container.imagesLoaded( function(){
	$container.masonry({
	    itemSelector : '.item'
	    //isAnimated: true	    
	});

	bind_tooltip();
    });


    var $win = $(window);
    
    $(window).scroll(function() {


	// Streamed wall
	if ($win.height() + $win.scrollTop() > $(document).height() - 100) {
	    $.ajax({
		url : '/companyv2/ajax',
		type : 'GET',
		data : {
		    offset : go_offset
		},
		success : function(data) {
		    
		    go_offset += 20;
		    var rendu = "";
		    for (var i = 0; i < data.length; i++) {
			rendu += render_tpl(data[i]);
		    }
		    $container.append(rendu);
		    $container.masonry('reload');
		    bind_tooltip();
		}
	    });
	}
    });

});


function render_tpl(company) {
    if (!company.image) {
	return "";
    }
    var tpl = '  <a target="_blank" href="/companyv2/show/<%= permalink %>" title="<%= name %>"><div class="item transition" data-content="<b>Money Raised</b> : <%= comp.total_money_raised %><br/><b>Founded year</b> : <%= comp.founded_year %> <br/><b>Employees</b> : <%= comp.number_of_employees %><br/><%= comp.description %>" data-original-title="<%= comp.name %>" rel="popover"><img src="http://crunchbase.com/<%= image %>"/></div></a>';
    var compiled = _.template(tpl);
    return compiled({permalink : company.permalink, 
		     name : company.name,
		     comp : company,
		     image : company.image.available_sizes[0][1]});
}


