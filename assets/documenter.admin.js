
(function($) {

	// Language strings
	Symphony.Language.add({
		'View Documentation': false,
		'Hide Documentation': false
	});

	/**
	 * A Symphony extension enabling addition of documentation 
	 * to any page in the back end, including user-defined 
	 * section indexes and entry editors.
	 *
	 * @author: Craig Zheng, https://github.com/czheng
	 * 			rewritten by Nils Hörrmann, post@nilshoerrmann.de
	 * @source: https://github.com/czheng/documenter
	 */
	$(document).ready(function() {
		var wrapper = $('#wrapper'),
			title = $('#documenter-title'),
			button = $('a.documenter.button'),
			help = button.text(),
			drawer = $('#documenter-drawer'),
			content = drawer.children();
		
		// Don't execute inside subsections
		if(window.top !== window) {
			button.remove();
			return;	
		}
								
	/*---- Events -----------------------------------------------------------*/
		
		// Toggle documentation
		button.click(function() {

			// Hide documentation
			if(button.is('.active')) {
				hide('fast');
			}
			
			// Show documentation
			else {
				button.fadeOut('fast');
				show('fast');
			}
		});
						
		// Detect resized notices
		$(window).bind('resize', function() {
			notice();
		});
		
		// Toggle content blocks
		content.delegate('h3', 'click', function() {
			var headline = $(this);
			toggle(headline);
		});
		
	/*---- Functions --------------------------------------------------------*/
		
		// Show documentation
		var show = function(speed) {
			
			// Open drawer
			drawer.animate({
				width: 300,
				overflow: 'auto',
				opacity: 1
			}, speed, function() {
			
				// Set height
				setHeight(0);
				
				// Set state
				wrapper.addClass('documenter');
				button.text('×').attr('title', Symphony.Language.get('Hide Documentation')).addClass('active').fadeIn('fast');			
			});	
			
			// Store state
			if(localStorage) {
				localStorage.setItem('documenter-' + Symphony.Context.get('root'), 'active');
			}
		};
		
		// Hide documentation
		var hide = function(speed) {
			notice();
		
			// Close drawer
			drawer.animate({
				width: 0,
				overflow: 'hidden',
				opacity: 0.3
			}, 'fast', function() {
			
				// Set minimum height
				wrapper.css({
					'min-height': '100%'
				});
			
				// Set state
				wrapper.removeClass('documenter');
				button.text(help).attr('title', Symphony.Language.get('View Documentation')).removeClass('active');
			});
			
			// Store state
			if(localStorage) {
				localStorage.removeItem('documenter-' + Symphony.Context.get('root'));
			}
		};
		
		// Check notices
		var notice = function() {
			var message = $('#notice'),
				height = message.outerHeight();
				
			// System messages active
			if($('#notice').is(':visible')) {
				button.css('top', 16 + height);
				drawer.css('padding-top', height);
			}
			
			// System messages inactive
			else {
				button.css('top', 16);
				drawer.css('padding-top', 0);
			}
		};
		
		// Toggle content blocks
		var toggle = function(headline) {
			var blocks = [];

			// Toggle content block
			headline.find('a.toggle').toggleClass('open');
			headline.next('div.block').slideToggle('fast', function() {
				setHeight('fast');
			});
			
			// Store open content blocks
			content.find('h3:has(.open)').each(function() {
				var text = $(this).text();
				blocks.push(text);
			});
			
			if(localStorage) {
				localStorage.setItem('documenter-' + Symphony.Context.get('root') + '-blocks', JSON.stringify(blocks));
			}
		};
		
		// Load
		var load = function() {
			var status = 'inactive',
				blocks = [];
		
			// Load storage
			if(localStorage) {
				status = localStorage.getItem('documenter-' + Symphony.Context.get('root'));
				blocks = $.parseJSON(localStorage.getItem('documenter-' + Symphony.Context.get('root') + '-blocks'));
			}

			// Prepare content toggling
			content.find('h3').each(function() {
				var headline = $(this),
					button = $('<a class="documenter toggle"><span>›</span></a>');
				
				// Add control
				headline.append(button);
				
				// Wrap content blocks
				headline.nextUntil('h3, div.note').wrapAll('<div class="block" />');
				
				// Restore state
				if($.inArray(headline.text(), blocks) >= 0) {
					button.toggleClass('open');
					headline.next('.block').show(); 
				}
				else {
					headline.next('.block').hide(); 
				}
			});
			
			// Display Documenter
			if(status == 'active') {
				show(0);
			}
			else {
				hide(0);
			}		
		};
		
		// Set minimum height
		var setHeight = function(speed) {
			var height = drawer.outerHeight();
		
			// Compare to body
			if(height < $('body').height()) {
				height = '100%';
			}
			
			// Set height
			wrapper.animate({
				'min-height': height
			}, speed);			
		};
			
	/*---- Initialisation ---------------------------------------------------*/
		
		// Check for existing system messages
		notice();
		
		// Prepare Documenter
		load();
	});

})(jQuery.noConflict());	
