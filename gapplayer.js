(function($) {

	function GapPlayer(preview, options) {
		this.previewElement = preview;
		this.spinnerElement = $("<div class = 'spinner'></div>");
		this.options = options;
		this.gifLoaded = false;
		this.preventStart = false;
	}

	GapPlayer.prototype = {

		activate: function() {
			this.wrap();
			this.addSpinner();
			this.addControl();
			this.addEvents();
			if (this.options.autoLoad) {
				this.playElement.hide();
				this.spinnerElement.show();
				this.loadGif();
			}
			if (this.options.preLoad) {
				(new Image()).src = this.getGifSrc();
			}
		},

		wrap: function(){
			this.wrapper = this.previewElement.wrap("<div class='gapplayer-wrapper'></div>").parent();
			this.wrapper.css('width', this.previewElement.width());
			this.wrapper.css('height', this.previewElement.height());
			this.previewElement.addClass('gapplayer');
			this.previewElement.css('cursor','pointer');
		},

		getGifSrc: function(){
			var gifSrc;
			if (this.previewElement.attr('data-gif')) {
				gifSrc = this.previewElement.attr('data-gif');
			} else {
				gifSrc = this.previewElement.attr('src').replace(/\.[^/.]+$/, ".gif");
			}
			return gifSrc;
		},

		addControl: function(){
			this.playElement = $("<ins class='play-gif'>" + this.options.label + "</ins>");
			this.playElement.css('left', this.previewElement.width()/2 + this.playElement.width()/2);
			this.wrapper.append(this.playElement);
		},

		addEvents: function() {
			var onEvent = this.options.hover ? 'click mouseenter' : 'click',
				gp = this;
			gp.playElement.on(onEvent, function(e) {
				$(this).hide();
				gp.spinnerElement.show();
				gp.loadGif();
				e.preventDefault();
				e.stopPropagation();
			});
			gp.previewElement.on(onEvent, function(e) {
				if (gp.playElement.is(':visible') && ! gp.preventStart) {
					gp.playElement.hide();
					gp.spinnerElement.show();
					gp.loadGif();
				}
				e.preventDefault();
				e.stopPropagation();
			});
			if (gp.options.hover) {
				gp.previewElement.on('mouseleave', function(e) {
					gp.preventStart = false;
				});
			}
			gp.spinnerElement.on(onEvent, function(e) {
				e.preventDefault();
				e.stopPropagation();
			});
		},

		loadGif: function() {
			if (! this.gifLoaded) {
				this.enableAbort();
			}
			var that = this,
				onEvent = that.options.hover ? 'click mouseleave' : 'click',
				gifSrc = this.getGifSrc(),
				gifWidth = this.previewElement.width(),
				gifHeight = this.previewElement.height(),
				gp = this;
			gp.gifElement = $("<img src='" + gifSrc + "' width='" + gifWidth + "' height=' "+ gifHeight + " '/>");
			this.gifElement.load(function() {
				gp.gifLoaded = true;
				gp.resetEvents();
				$(this).css({'cursor': 'pointer',
							'position': 'absolute',
							'top': '0',
							'left': '0'});
				gp.previewElement.hide();
				gp.wrapper.append(gp.gifElement);
				gp.spinnerElement.hide();

				$(this).on(onEvent, function(e) {
					that.preventStart = that.options.hover && e.type == 'click';
					$(this).remove();
					gp.previewElement.show();
					gp.playElement.show();
					e.preventDefault();
					e.stopPropagation();
				});
			});
		},

		enableAbort: function() {
			var gp = this;
			this.previewElement.click(function(e) {
				gp.abortLoading(e);
			});
			this.spinnerElement.click(function(e) {
				gp.abortLoading(e);
			});
		},

		abortLoading: function(e) {
			this.spinnerElement.hide();
			this.playElement.show();
			e.preventDefault();
			e.stopPropagation();
			this.gifElement.off('load').on('load', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});
			this.resetEvents();
		},

		resetEvents: function() {
			this.previewElement.off('click');
			this.playElement.off('click');
			this.spinnerElement.off('click');
			this.addEvents();
		},

		addSpinner: function() {
			this.wrapper.append(this.spinnerElement);
			this.spinnerElement.hide();
		}

	};

	$.fn.gapPlayer = function(options) {
		return this.each(function() {
			options = $.extend({}, $.fn.gapPlayer.defaults, options);
			var gapPlayer = new GapPlayer($(this), options);
			gapPlayer.activate();
		});
	};

	$.fn.gapPlayer.defaults = {
		label: 'gif',
		autoLoad: false,
		preLoad: false,
		hover: false
	};

	// Start plugin
	var gifs = jQuery('img[data-gif]:not(.gapplayer)');
	gifs.imagesLoaded(function() {
		gifs.gapPlayer({
			autoLoad: gapParams.autoLoad == 'yes',
			preLoad: gapParams.preLoad == 'no',
			hover: gapParams.hover == 'yes'
		});
	});

})(jQuery);
