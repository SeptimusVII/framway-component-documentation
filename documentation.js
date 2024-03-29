module.exports = function(app){
	var Documentation = Object.getPrototypeOf(app).Documentation = new app.Component("documentation");
	// Documentation.debug = true;
	Documentation.createdAt      = "2.0.0";
	Documentation.lastUpdate     = "2.4.2";
	Documentation.version        = "1.1.1";
	Documentation.factoryExclude = true;
	// Documentation.loadingMsg     = "This message will display in the console when component will be loaded.";

	var arrManuals = ['utilities','margin-padding','backgrounds','borders','opacity','flex','grid','images','buttons','functions-mixins'];
	if(app.components.includes('modalFW'))
	    arrManuals.push('modalFW');
	Documentation.prototype.onCreate = function(){
		var doc = this;
		var html = {nav : '', content : ''};
		for(var manual of arrManuals){
			html.nav += '<button class="btn-sm btn-bg-secondary" data-manual="'+manual+'"">'+app.utils.capitalize(manual)+'</button> ';
			html.content += '<div class="tab block-std p-all-x2">'
						+ require('mustache-loader!html-loader?interpolate!./templates/manual_'+manual+'.html')()
						+ '</div>';
		}
		$(html.content).find('pre').each(function(){
			var trimHtml = $(this).html().split('\n').map(function(line){
				if(line.substr(0,4) == '    ') 
					return line.substr(4);
				else 
					return line;
			}).join('\n');
			html.content = html.content.replace($(this).html(),trimHtml.replace(/</g,'&lt;').trim());
	    });

		doc.$body = $(require('mustache-loader!html-loader?interpolate!./templates/index.html')({
			nav: html.nav,
			content: html.content
		}));

		doc.$el.html(doc.$body);
	    doc.$body.find('.copy').on('click',function(){
	    	this.classList.remove('copy');
	     	if(app.utils.copyToClipboard(this,true))
	        	notif_fade.success('Copied to clipboard !');
	    	this.classList.add('copy');
		});
		if (typeof app.updateUrlNavigation != 'undefined') {
			doc.$body.find('.tabs__nav button').on('click',function(){
				if (doc.$el.parent('.tab').hasClass('active'))
					setTimeout(function(){
						if(app.debug) console.log('app.updateUrlNavigation from documentation');
						app.updateUrlNavigation(doc.getNavState());
					})
			});
		}
	}

	Documentation.prototype.getNavState = function(){
		var doc = this;
		return {
			framnav: 'documentation',
			manual: doc.$body.find('.tabs__nav button[data-manual].active').attr('data-manual') || '',
		}
	}
	return Documentation;
}