var go_offset = 0;
var $container = null;
var current_sorting = null;

function render_tpl(company) {
    if (!company.image) {
	return "";
    }

    var screenshot;
    
    try {
	screenshot = 'http://crunchbase.com/' + company.screenshots[0].available_sizes[0][1];
    } catch(e) {
	screenshot = '';
    }
    
    var tpl = '  <a target="_blank" href="/companyv2/show/<%= permalink %>" title="<%= name %>"><div class="item transition" data-content="<b>Founded year</b> : <%= comp.founded_year %> <br/><b>Employees</b> : <%= comp.number_of_employees %><br/><%= comp.description %><br/>" data-original-title="<%= comp.name %>" rel="popover"><img src="http://crunchbase.com/<%= image %>"/></div></a>';
    var compiled = _.template(tpl);

    return compiled({
	permalink : company.permalink, 
	name : company.name,
	comp : company,
	screenshot : screenshot,
	image : company.image.available_sizes[0][1]
    });
}

function add_companies(sort, callback) {
    $.ajax({
	url : '/companyv2/ajax',
	type : 'GET',
	data : {
	    offset : go_offset,
	    sort : sort
	},
	success : function(data) {	    
	    var rendu = "";
	    for (var i = 0; i < data.length; i++)
		rendu += render_tpl(data[i]);
	    var treat = $(rendu);

	    treat.find('div[rel=popover]').each(function() {
		$(this).popover({
		    html : true
		});
	    });

	    $container.append(treat);
	    if (go_offset != 0)
		$container.masonry('reload');

	    go_offset += 30;
	    if (callback) callback();
	}
    });
}

function init_masonry() {
    var spinner_dom = '<img src="/images/spinner.png" height="200" width="200" class="spinner"/>';

    $container.append(spinner_dom);

    setTimeout(function() {
	$container.fadeOut(function(){
	    $(this).empty();
	    $('.popover').remove();
	    add_companies(gl_current_sorting, function() {
		$container.imagesLoaded(function(){
		    $container.masonry({
			itemSelector : '.item'
		    });
		});		
	    });
	    $container.show()
	});
    }, 500);
}

function handle_sorting() {
    var sorting_menu = $('.sorting-menu');
    
    $('.sort-btn').each(function() {
	$(this).click(function() {	    
	    gl_current_sorting = $(this).attr('data-sort');
	    $container.fadeOut(function() {
		$(this).empty().masonry('destroy').show();
		go_offset = 0;
		init_masonry();
	    });
	});
    });
}

$(function() {
    $container = $('#container');
    gl_current_sorting = 'newest';

    handle_sorting();
    init_masonry();
    
    // Infinite scroll
    var $win = $(window); 
    $(window).scroll(function() {
	if ($win.height() + $win.scrollTop() > 
	    $(document).height() - 100)
	    add_companies(gl_current_sorting);	
    });
});
