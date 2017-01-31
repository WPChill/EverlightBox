/**
 * Module: WP-JS-Hooks
 * Props: Carl Danley & 10up
 */
!function(a){"use strict";var b=function(){function a(a,b,c,d){return"string"==typeof a&&"function"==typeof b&&(c=parseInt(c||10,10),h("actions",a,b,c,d)),k}function b(){var a=Array.prototype.slice.call(arguments),b=a.shift();return"string"==typeof b&&j("actions",b,a),k}function c(a,b){return"string"==typeof a&&g("actions",a,b),k}function d(a,b,c,d){return"string"==typeof a&&"function"==typeof b&&(c=parseInt(c||10,10),h("filters",a,b,c,d)),k}function e(){var a=Array.prototype.slice.call(arguments),b=a.shift();return"string"==typeof b?j("filters",b,a):k}function f(a,b){return"string"==typeof a&&g("filters",a,b),k}function g(a,b,c,d){if(l[a][b])if(c){var e,f=l[a][b];if(d)for(e=f.length;e--;){var g=f[e];g.callback===c&&g.context===d&&f.splice(e,1)}else for(e=f.length;e--;)f[e].callback===c&&f.splice(e,1)}else l[a][b]=[]}function h(a,b,c,d,e){var f={callback:c,priority:d,context:e},g=l[a][b];g?(g.push(f),g=i(g)):g=[f],l[a][b]=g}function i(a){for(var b,c,d,e=1,f=a.length;f>e;e++){for(b=a[e],c=e;(d=a[c-1])&&d.priority>b.priority;)a[c]=a[c-1],--c;a[c]=b}return a}function j(a,b,c){var d=l[a][b];if(!d)return"filters"===a?c[0]:!1;var e=0,f=d.length;if("filters"===a)for(;f>e;e++)c[0]=d[e].callback.apply(d[e].context,c);else for(;f>e;e++)d[e].callback.apply(d[e].context,c);return"filters"===a?c[0]:!0}var k={removeFilter:f,applyFilters:e,addFilter:d,removeAction:c,doAction:b,addAction:a},l={actions:{},filters:{}};return k};a.wp=a.wp||{},a.wp.hooks=new b}(window);

;( function ( window, document, $, undefined ) {

    var qualifyURL = function (url) {
        var img = document.createElement('img');
        img.src = url; // set string url
        url = img.src; // get qualified url
        img.src = null; // no server request
        return url;
    };
    
    $.everlightbox = function( elem, options ) {

        // Default options
        var ui,
            defaults = {
                useCSS : true,
                useSVG : true,
                initialIndexOnArray : 0,
                vimeoColor : 'cccccc',
                beforeOpen: null,
                afterOpen: null,
                afterClose: null,
                afterMedia: null,
                nextSlide: null,
                prevSlide: null,
                loopAtEnd: false,
                keyboard: true,
                autoplayVideos: false,
                queryStringData: {},
                toggleClassOnLoad: '',
                facebookIcon: false,
                twitterIcon: false,
                pinterestIcon: false,
                houzzIcon: false,
                googleplusIcon: false,
                tumblrIcon: false,
                facebookLike: false,
                facebookCommentCount: false,
                downloadIcon: false,
                fullscreenIcon: false,
                facebookComments: false,
                closeBg: false,
                anchorButtonsToEdges: false,
                rootCssClass: '',
                facebookAppId: '1213605408691751'
            },

            plugin = this,
            elements = [], // slides array [ { href:'...', title:'...' }, ...],
            $elem,
            selector = elem.selector,
            isMobile = navigator.userAgent.match( /(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i ),
            isTouch = isMobile !== null || document.createTouch !== undefined || ( 'ontouchstart' in window ) || ( 'onmsgesturechange' in window ) || navigator.msMaxTouchPoints,
            supportSVG = !! document.createElementNS && !! document.createElementNS( 'http://www.w3.org/2000/svg', 'svg').createSVGRect,
            winWidth = window.innerWidth ? window.innerWidth : $( window ).width(),
            winHeight = window.innerHeight ? window.innerHeight : $( window ).height(),
            currentX = 0,
        /* jshint multistr: true */
            html = '<div id="everlightbox-overlay">\
					<div id="everlightbox-container">\
						<div id="everlightbox-slider"></div>\
						<a id="everlightbox-prev"><i class="ev-icon-left-open-big"></i></a>\
						<a id="everlightbox-next"><i class="ev-icon-right-open-big"></i></a>\
					</div>\
			</div>';

        plugin.settings = {};

        $.everlightbox.close = function () {
            ui.closeSlide();
        };

        $.everlightbox.extend = function () {
            return ui;
        };

        plugin.init = function() {

            plugin.settings = $.extend( {}, defaults, options );

            if ( $.isArray( elem ) ) {

                elements = elem;
                ui.target = $( window );
                ui.init( plugin.settings.initialIndexOnArray );

            } else {

                $( document ).on( 'click', selector, function( event ) {

                    // console.log( isTouch );

                    if ( event.target.parentNode.className === 'slide current' ) {

                        return false;
                    }

                    if ( ! $.isArray( elem ) ) {
                        ui.destroy();
                        $elem = $( selector );
                        ui.actions();
                    }

                    elements = [];
                    var index, relType, relVal;

                    // Allow for HTML5 compliant attribute before legacy use of rel
                    if ( ! relVal ) {
                        relType = 'data-rel';
                        relVal = $( this ).attr( relType );
                    }

                    if ( ! relVal ) {
                        relType = 'rel';
                        relVal = $( this ).attr( relType );
                    }

                    if ( relVal && relVal !== '' && relVal !== 'nofollow' ) {
                        $elem = $( selector ).filter( '[' + relType + '="' + relVal + '"]' );
                    } else {
                        $elem = $( selector );
                    }

                    $elem.each( function() {

                        var title = null,
                            href = null;

                        if ( $( this ).data( 'title' ) ) {
                            title = $( this ).data( 'title' );
                        }

                        if ( !title && $( this ).attr( 'title' ) ) {
                            title = $( this ).attr( 'title' );
                        }

                        if ( !title && $( this ).attr( 'data-caption-title' ) ) {
                            title = $( this ).attr( 'data-caption-title' );
                        }


                        if ( $( this ).attr( 'href' ) ) {
                            href = $( this ).attr( 'href' );
                        }

                        elements.push( {
                            href: href,
                            title: title
                        } );
                    } );

                    index = $elem.index( $( this ) );
                    event.preventDefault();
                    event.stopPropagation();
                    ui.target = $( event.target );
                    ui.init( index );
                } );
            }
        };

        plugin.next = function () {
            ui.getNext();
        };

        plugin.prev = function () {
            ui.getPrev();
        };

        ui = {

            /**
             * Initiate Swipebox
             */
            init : function( index ) {
                if ( plugin.settings.beforeOpen ) {
                    plugin.settings.beforeOpen();
                }
                this.target.trigger( 'everlightbox-start' );
                $.everlightbox.isOpen = true;
                this.build();
                this.openSlide( index );
                this.openMedia( index );
                this.preloadMedia( index+1 );
                this.preloadMedia( index-1 );
                if ( plugin.settings.afterOpen ) {
                    plugin.settings.afterOpen(index);
                }
                $(window).bind('everlightbox.next', this.getNext);
            },

            /**
             * Built HTML containers and fire main functions
             */
            build : function () {
                var $this = this, bg;

                $( 'body' ).append( html );

                $("#everlightbox-overlay").addClass('everlightbox-theme-'+plugin.settings.rootCssClass)
                                          .addClass(isMobile ? 'everlightbox-mobile' : 'everlightbox-no-mobile');

                $.each( elements,  function() {
                    $( '#everlightbox-slider' ).append( '<div class="slide"></div>' );
                } );

                $this.setDim();
                $this.actions();

                if ( isTouch ) {
                    $this.gesture();
                }

                // Devices can have both touch and keyboard input so always allow key events
                if(plugin.settings.keyboard)
                    $this.keyboard();

                $this.setupSocial();
                $this.resize();

            },

            /**
             * Set dimensions depending on windows width and height
             */
            setDim : function () {

                var width, height, sliderCss = {};

                // Reset dimensions on mobile orientation change
                if ( 'onorientationchange' in window ) {

                    window.addEventListener( 'orientationchange', function() {
                        if ( window.orientation === 0 ) {
                            width = winWidth;
                            height = winHeight;
                        } else if ( window.orientation === 90 || window.orientation === -90 ) {
                            width = winHeight;
                            height = winWidth;
                        }
                    }, false );


                } else {

                    width = window.innerWidth ? window.innerWidth : $( window ).width();
                    height = window.innerHeight ? window.innerHeight : $( window ).height();
                }

                sliderCss = {
                    width : '100%',
                    height : height
                };

                $('#everlightbox-overlay').css( sliderCss );
                $("#everlightbox-slider .slide").each(function (i, slide) {
                    $img = $(slide).find("img");
                    var w = $img.width();
                    var h = $img.height();
                    var pos = $img.position();
                    if(w && h && !plugin.settings.anchorButtonsToEdges) {
                        $(slide).find(".everlightbox-glass").css({
                            top: pos.top,
                            left: pos.left,
                            width: w,
                            height: h
                        });
                    }
                    var data = { slide: $(slide), width: w, height: h, position: pos };
                    wp.hooks.applyFilters('everlightbox.setDim', data);
                });
            },

            getCurrentTitle: function () {
                var slide = $( '#everlightbox-slider .slide.current' );
                if(slide.find(".everlightbox-caption").length) 
                    return slide.find(".everlightbox-caption").text();

                return document.title;
            },

            setupSocial: function () {
                var $this = this;

                $('body').on('touchstart click', '.everlightbox-pinterest', function (e) {
                    e.preventDefault();
                    var text = $this.getCurrentTitle();
                    var image = $( '#everlightbox-slider .slide.current img' ).attr("src");

                    var url = "http://pinterest.com/pin/create/button/?url=" + encodeURIComponent(location.href) + "&description=" + encodeURI(text);

                    url += ("&media=" + encodeURIComponent(qualifyURL(image)));

                    var w = window.open(url, "ftgw", "location=1,status=1,scrollbars=1,width=600,height=400");
                    w.moveTo((screen.width / 2) - (300), (screen.height / 2) - (200));
                });

                $('body').on('touchstart click', '.everlightbox-twitter', function (e) {
                    e.preventDefault();
                    var text = $this.getCurrentTitle();
                    var image = $( '#everlightbox-slider .slide.current img' ).attr("src");

                    var w = window.open("https://twitter.com/intent/tweet?url=" + encodeURI(location.href.split('#')[0]) + "&text=" + encodeURI(text), "ftgw", "location=1,status=1,scrollbars=1,width=600,height=400");
                    w.moveTo((screen.width / 2) - (300), (screen.height / 2) - (200));
                });

                $('body').on('touchstart click', '.everlightbox-googleplus', function (e) {
                    e.preventDefault();
                    var text = $this.getCurrentTitle();
                    var image = $( '#everlightbox-slider .slide.current img' ).attr("src");

                    var url = "https://plus.google.com/share?url=" + encodeURI(location.href);

                    var w = window.open(url, "ftgw", "location=1,status=1,scrollbars=1,width=600,height=400");
                    w.moveTo((screen.width / 2) - (300), (screen.height / 2) - (200));
                });

                $('body').on('touchstart click', '.everlightbox-houzz', function (e) {
                    e.preventDefault();
                    var text = $this.getCurrentTitle();
                    var image = $( '#everlightbox-slider .slide.current img' ).attr("src");

                    var url = "http://www.houzz.com/imageClipperUpload?imageUrl=" + encodeURIComponent(qualifyURL(image)) +
                                    "&link=" + encodeURI(location.href) + "&title=" + encodeURI(text);

                    var w = window.open(url, "ftgw", "location=1,status=1,scrollbars=1,width=600,height=400");
                    w.moveTo((screen.width / 2) - (300), (screen.height / 2) - (200));
                });

                $('body').on('touchstart click', '.everlightbox-facebook', function (e) {
                    e.preventDefault();
                    var text = $this.getCurrentTitle();
                    var image = $( '#everlightbox-slider .slide.current img' ).attr("src");

                    var url = "https://www.facebook.com/dialog/feed?app_id="+plugin.settings.facebookAppId+"&"+
                        "link="+encodeURIComponent(location.href)+"&" +
                        "display=popup&"+
                        "name="+encodeURIComponent(document.title)+"&"+
                        "caption=&"+
                        "description="+encodeURIComponent(text)+"&"+
                        "picture="+encodeURIComponent(qualifyURL(image))+"&"+
                        "ref=share&"+
                        "actions={%22name%22:%22View%20the%20gallery%22,%20%22link%22:%22"+encodeURIComponent(location.href)+"%22}&"+
                        "redirect_uri=http://everlightbox.io/facebook_redirect.html";

                    var w = window.open(url, "ftgw", "location=1,status=1,scrollbars=1,width=600,height=400");
                    w.moveTo((screen.width / 2) - (300), (screen.height / 2) - (200));
                });

                $('body').on('touchstart click', '.everlightbox-tumblr', function (e) {
                    e.preventDefault();
                    var text = $this.getCurrentTitle();
                    var image = $( '#everlightbox-slider .slide.current img' ).attr("src");

                    var url = "http://www.tumblr.com/share/link?url=" + encodeURIComponent(qualifyURL(image)) +
                        "&name=" + encodeURI(text);

                    var w = window.open(url, "ftgw", "location=1,status=1,scrollbars=1,width=600,height=400");
                    w.moveTo((screen.width / 2) - (300), (screen.height / 2) - (200));
                });
            },

            /**
             * Reset dimensions on window resize event
             */
            resize : function () {
                var $this = this;

                $( window ).resize( function() {
                    $this.setDim();
                } ).resize();
            },

            /**
             * Check if device supports CSS transitions
             */
            supportTransition : function () {

                var prefixes = 'transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition'.split( ' ' ),
                    i;

                for ( i = 0; i < prefixes.length; i++ ) {
                    if ( document.createElement( 'div' ).style[ prefixes[i] ] !== undefined ) {
                        return prefixes[i];
                    }
                }
                return false;
            },

            /**
             * Check if CSS transitions are allowed (options + devicesupport)
             */
            doCssTrans : function () {
                if ( plugin.settings.useCSS && this.supportTransition() ) {
                    return true;
                }
            },

            /**
             * Touch navigation
             */
            gesture : function () {

                var $this = this,
                    index,
                    hDistance,
                    vDistance,
                    hDistanceLast,
                    vDistanceLast,
                    hDistancePercent,
                    vSwipe = false,
                    hSwipe = false,
                    hSwipMinDistance = 10,
                    vSwipMinDistance = 50,
                    startCoords = {},
                    endCoords = {},
                    bars = $( 'dummy' ),
                    slider = $( '#everlightbox-slider' );

                bars.addClass( 'visible-bars' );
                $this.setTimeout();

                $( 'body' ).bind( 'touchstart', function( event ) {

                    $( this ).addClass( 'touching' );
                    index = $( '#everlightbox-slider .slide' ).index( $( '#everlightbox-slider .slide.current' ) );
                    endCoords = event.originalEvent.targetTouches[0];
                    startCoords.pageX = event.originalEvent.targetTouches[0].pageX;
                    startCoords.pageY = event.originalEvent.targetTouches[0].pageY;

                    $( '#everlightbox-slider' ).css( {
                        '-webkit-transform' : 'translate3d(' + currentX +'%, 0, 0)',
                        'transform' : 'translate3d(' + currentX + '%, 0, 0)'
                    } );

                    $( '.touching' ).bind( 'touchmove',function( event ) {
                        event.preventDefault();
                        event.stopPropagation();
                        endCoords = event.originalEvent.targetTouches[0];

                        if ( ! hSwipe ) {
                            vDistanceLast = vDistance;
                            vDistance = endCoords.pageY - startCoords.pageY;
                            if ( Math.abs( vDistance ) >= vSwipMinDistance || vSwipe ) {
                                var opacity = 0.75 - Math.abs(vDistance) / slider.height();

                                slider.css( { 'top': vDistance + 'px' } );
                                slider.css( { 'opacity': opacity } );

                                vSwipe = true;
                            }
                        }

                        hDistanceLast = hDistance;
                        hDistance = endCoords.pageX - startCoords.pageX;
                        hDistancePercent = hDistance * 100 / winWidth;

                        if ( ! hSwipe && ! vSwipe && Math.abs( hDistance ) >= hSwipMinDistance ) {
                            $( '#everlightbox-slider' ).css( {
                                '-webkit-transition' : '',
                                'transition' : ''
                            } );
                            hSwipe = true;
                        }

                        if ( hSwipe ) {

                            // swipe left
                            if ( 0 < hDistance ) {

                                // first slide
                                if ( 0 === index ) {
                                    // console.log( 'first' );
                                    $( '#everlightbox-overlay' ).addClass( 'leftSpringTouch' );
                                } else {
                                    // Follow gesture
                                    $( '#everlightbox-overlay' ).removeClass( 'leftSpringTouch' ).removeClass( 'rightSpringTouch' );
                                    $( '#everlightbox-slider' ).css( {
                                        '-webkit-transform' : 'translate3d(' + ( currentX + hDistancePercent ) +'%, 0, 0)',
                                        'transform' : 'translate3d(' + ( currentX + hDistancePercent ) + '%, 0, 0)'
                                    } );
                                }

                                // swipe rught
                            } else if ( 0 > hDistance ) {

                                // last Slide
                                if ( elements.length === index +1 ) {
                                    // console.log( 'last' );
                                    $( '#everlightbox-overlay' ).addClass( 'rightSpringTouch' );
                                } else {
                                    $( '#everlightbox-overlay' ).removeClass( 'leftSpringTouch' ).removeClass( 'rightSpringTouch' );
                                    $( '#everlightbox-slider' ).css( {
                                        '-webkit-transform' : 'translate3d(' + ( currentX + hDistancePercent ) +'%, 0, 0)',
                                        'transform' : 'translate3d(' + ( currentX + hDistancePercent ) + '%, 0, 0)'
                                    } );
                                }

                            }
                        }
                    } );

                    return false;

                } ).bind( 'touchend',function( event ) {
                    event.preventDefault();
                    event.stopPropagation();

                    $( '#everlightbox-slider' ).css( {
                        '-webkit-transition' : '-webkit-transform 0.4s ease',
                        'transition' : 'transform 0.4s ease'
                    } );

                    vDistance = endCoords.pageY - startCoords.pageY;
                    hDistance = endCoords.pageX - startCoords.pageX;
                    hDistancePercent = hDistance*100/winWidth;

                    // Swipe to bottom to close
                    if ( vSwipe ) {
                        vSwipe = false;
                        if ( Math.abs( vDistance ) >= 2 * vSwipMinDistance && Math.abs( vDistance ) > Math.abs( vDistanceLast ) ) {
                            var vOffset = vDistance > 0 ? slider.height() : - slider.height();
                            slider.animate( { top: vOffset + 'px', 'opacity': 0 },
                                300,
                                function () {
                                    $this.closeSlide();
                                } );
                        } else {
                            slider.animate( { top: 0, 'opacity': 1 }, 300 );
                        }

                    } else if ( hSwipe ) {

                        hSwipe = false;

                        // swipeLeft
                        if( hDistance >= hSwipMinDistance && hDistance >= hDistanceLast) {

                            $this.getPrev();

                            // swipeRight
                        } else if ( hDistance <= -hSwipMinDistance && hDistance <= hDistanceLast) {

                            $this.getNext();
                        }

                    } else { // Top and bottom bars have been removed on touchable devices
                        // tap
                        if ( ! bars.hasClass( 'visible-bars' ) ) {
                            $this.setTimeout();
                        } else {
                            $this.clearTimeout();
                        }
                    }

                    $( '#everlightbox-slider' ).css( {
                        '-webkit-transform' : 'translate3d(' + currentX + '%, 0, 0)',
                        'transform' : 'translate3d(' + currentX + '%, 0, 0)'
                    } );

                    $( '#everlightbox-overlay' ).removeClass( 'leftSpringTouch' ).removeClass( 'rightSpringTouch' );
                    $( '.touching' ).off( 'touchmove' ).removeClass( 'touching' );

                } );
            },

            /**
             * Set timer to hide the action bars
             */
            setTimeout: function () {
                if ( plugin.settings.hideBarsDelay > 0 ) {
                    var $this = this;
                    $this.clearTimeout();
                    $this.timeout = window.setTimeout( function() {
                            $this.hideBars();
                        },

                        plugin.settings.hideBarsDelay
                    );
                }
            },

            /**
             * Clear timer
             */
            clearTimeout: function () {
                window.clearTimeout( this.timeout );
                this.timeout = null;
            },

            /**
             * Keyboard navigation
             */
            keyboard : function () {
                var $this = this;
                $( window ).bind( 'keyup', function( event ) {
                    event.preventDefault();
                    event.stopPropagation();

                    if ( event.keyCode === 37 ) {

                        $this.getPrev();

                    } else if ( event.keyCode === 39 ) {

                        $this.getNext();

                    } else if ( event.keyCode === 27 ) {

                        $this.closeSlide();
                    }
                } );
            },

            /**
             * Navigation events : go to next slide, go to prevous slide and close
             */
            actions : function () {
                var $this = this,
                    action = 'touchend click'; // Just detect for both event types to allow for multi-input

                if ( elements.length < 2 ) {

                    $( '#everlightbox-bottom-bar' ).hide();

                } else {
                    $( '#everlightbox-prev' ).bind( action, function( event ) {
                        event.preventDefault();
                        event.stopPropagation();
                        $this.getPrev();
                        $this.setTimeout();
                    } );

                    $( '#everlightbox-next' ).bind( action, function( event ) {
                        event.preventDefault();
                        event.stopPropagation();
                        $this.getNext();
                        $this.setTimeout();
                    } );
                }

                $( 'body' ).on(action, '.everlightbox-close', function() {
                    $this.closeSlide();
                } );
            },

            /**
             * Set current slide
             */
            setSlide : function ( index, isFirst ) {

                isFirst = isFirst || false;

                var slider = $( '#everlightbox-slider' );

                currentX = -index*100;

                if ( this.doCssTrans() ) {
                    slider.css( {
                        '-webkit-transform' : 'translate3d(' + (-index*100)+'%, 0, 0)',
                        'transform' : 'translate3d(' + (-index*100)+'%, 0, 0)'
                    } );
                } else {
                    slider.animate( { left : ( -index*100 )+'%' } );
                }

                $( '#everlightbox-slider .slide' ).removeClass( 'current' );
                $( '#everlightbox-slider .slide' ).eq( index ).addClass( 'current' );
                

                if ( isFirst ) {
                    slider.fadeIn();
                }

                $( '#everlightbox-prev, #everlightbox-next' ).removeClass( 'disabled' );

                if ( index === 0 ) {
                    $( '#everlightbox-prev' ).addClass( 'disabled' );
                } else if ( index === elements.length - 1 && plugin.settings.loopAtEnd !== true ) {
                    $( '#everlightbox-next' ).addClass( 'disabled' );
                }
            },

            /**
             * Open slide
             */
            openSlide : function ( index ) {
                $( 'html' ).addClass( 'everlightbox-html' );
                if ( isTouch ) {
                    $( 'html' ).addClass( 'everlightbox-touch' );

                } else {
                    $( 'html' ).addClass( 'everlightbox-no-touch' );
                }
                $( window ).trigger( 'resize' ); // fix scroll bar visibility on desktop
                this.setSlide( index, true );
                wp.hooks.applyFilters('everlightbox.openSlide', index);
            },

            /**
             * Set a time out if the media is a video
             */
            preloadMedia : function ( index ) {
                var $this = this,
                    src = null;

                if ( elements[ index ] !== undefined ) {
                    src = elements[ index ].href;
                }

                if ( ! $this.isVideo( src ) ) {
                    setTimeout( function() {
                        $this.openMedia( index );
                    }, 1000);
                } else {
                    $this.openMedia( index );
                }
            },

            /**
             * Open
             */
            openMedia : function ( index ) {
                var $this = this,
                    src,
                    slide;

                if ( elements[ index ] !== undefined ) {
                    src = elements[ index ].href;
                }

                if ( index < 0 || index >= elements.length ) {
                    return false;
                }

                slide = $( '#everlightbox-slider .slide' ).eq( index );

                if ( ! $this.isVideo( src ) ) {
                    slide.addClass( 'slide-loading' );
                    $this.loadMedia( src, function() {
                        slide.removeClass( 'slide-loading' );
                        slide.html(this);
                        slide.prepend("<div class='everlightbox-backstage'></div>");

                        if(plugin.settings.closeBg)
                            slide.find(".everlightbox-backstage").click(function () {
                                $this.closeSlide();
                            });

                        var $img = this;
                        var img_pos = this.position();

                        var $glass = $("<div class='everlightbox-glass'></div>");
                        $glass.css({
                            top: plugin.settings.anchorButtonsToEdges ? 0 : img_pos.top,
                            left: plugin.settings.anchorButtonsToEdges ? 0 : img_pos.left,
                            width: plugin.settings.anchorButtonsToEdges ? '100%' : $img.width(),
                            height: plugin.settings.anchorButtonsToEdges ? '100%' : $img.height(),
                            zIndex: 1000
                        });

                        slide.append($glass);
                        $glass.append("<div class='everlightbox-top-bar'></div>");
                        var $topbar = $glass.find(".everlightbox-top-bar");

                        $glass.append("<div class='everlightbox-bottom-bar'></div>");
                        var $bottombar = $glass.find(".everlightbox-bottom-bar");

                        $topbar.append("<div class='everlightbox-right-side'></div>");
                        var $topbarRight = $topbar.find(".everlightbox-right-side");

                        $topbar.append("<div class='everlightbox-left-side'></div>");
                        var $topbarLeft = $topbar.find(".everlightbox-left-side");
                        
                        var title = null;
                        if ( elements[ index ] !== undefined ) {
                            title = elements[ index ].title;
                        }

                        if ( title ) {
                            $topbar.append("<p class='everlightbox-caption'><span>"+title+"</span></p>");
                        }
                        
                        if(plugin.settings.fullscreenIcon) {
                            $topbarRight.append('<a title="Fullscreen" data-status="off" class="everlightbox-fullscreen everlightbox-button"><i class="ev-icon-resize-full"></i><i class="ev-icon-resize-small"></i></a>');
                            $topbarRight.find(".everlightbox-fullscreen").on("touchstart click", function () {

                                var status = $(this).data("status");
                                if(status == "off") {
                                    var elem = document.getElementById("everlightbox-overlay");
                                    if (elem.requestFullscreen) {
                                        elem.requestFullscreen();
                                    } else if (elem.msRequestFullscreen) {
                                        elem.msRequestFullscreen();
                                    } else if (elem.mozRequestFullScreen) {
                                        elem.mozRequestFullScreen();
                                    } else if (elem.webkitRequestFullscreen) {
                                        elem.webkitRequestFullscreen();
                                    }
                                    $(this).data("status", "on");
                                    $(this)
                                } else {
                                    if (document.cancelFullScreen) {
                                        document.cancelFullScreen();
                                    } else if (document.mozCancelFullScreen) {
                                        document.mozCancelFullScreen();
                                    } else if (document.webkitCancelFullScreen) {
                                        document.webkitCancelFullScreen();
                                    }
                                    $(this).data("status", "off");
                                }
                                $(this).toggleClass("on");
                            });
                        }

                        $topbarRight.append('<a class="everlightbox-close everlightbox-button"><i class="ev-icon-cancel"></i></a>');

                        var social = [];
                        if(plugin.settings.facebookIcon)
                            social.push('<a title="Share on Facebook" class="everlightbox-button everlightbox-facebook"><i class="ev-icon-facebook"></i></a>');
                        if(plugin.settings.pinterestIcon)
                            social.push('<a title="Share on Pinterest" class="everlightbox-button everlightbox-pinterest"><i class="ev-icon-pinterest"></i></a>');
                        if(plugin.settings.tumblrIcon)
                            social.push('<a title="Share on Tumblr" class="everlightbox-button everlightbox-tumblr"><i class="ev-icon-tumblr"></i></a>');
                        if(plugin.settings.twitterIcon)
                            social.push('<a title="Share on Twitter" class="everlightbox-button everlightbox-twitter"><i class="ev-icon-twitter"></i></a>');
                        if(plugin.settings.houzzIcon)
                            social.push('<a share="Share on Houzz" class="everlightbox-button everlightbox-houzz"><i class="ev-icon-houzz"></i></a>');
                        if(plugin.settings.googleplusIcon)
                            social.push('<a title="Share on Google+" class="everlightbox-button everlightbox-googleplus"><i class="ev-icon-gplus"></i></a>');
                        if(plugin.settings.downloadIcon)
                            social.push('<a title="Download image" href="'+ this.attr("src") +'" download class="everlightbox-button everlightbox-download"><i class="ev-icon-install"></i></a>');
                        if(plugin.settings.facebookLike)
                            social.push('<div class="everlightbox-button fb-like" data-href="'+ this.attr("src") +'" data-layout="everlightbox-button" data-action="like" data-size="small" data-show-faces="false" data-share="false"></div>');

                        if(social.length) {
                            $bottombar.append("<div class='everlightbox-social'>" + social.join('') + "</div>");
                            $bottombar.find(".everlightbox-social").children().last().addClass("last-element");
                        }

                        if(plugin.settings.facebookLike) {
                            if (typeof FB != "undefined" && FB != null)
                                FB.XFBML.parse($glass.find(".everlightbox-social").get(0));
                        }

                        if(plugin.settings.facebookComments)
                        {
                            $topbarLeft.append('<a title="Show comments" class="everlightbox-comments everlightbox-button"><i class="ev-icon-commenting-o"></i></a>');

                            if(plugin.settings.facebookCommentCount)  {
                                $.get(everlightbox_ajax_object.ajaxurl, {
                                    url: $img.attr("src"),
                                    action: 'fetch_comments_count',
                                    everlightbox: plugin.settings.nonce
                                }, function (r) {
                                    if(r) {
                                        try {
                                            var data = JSON.parse(r);
                                            if(data && data.share && data.share.comment_count && data.share.comment_count > 0)
                                                $topbarLeft.append("<span class='everlightbox-comment-count'>"+ data.share.comment_count +" " +
                                                    plugin.settings.labels["comments"] +  "</span>");
                                        } catch(err) {
                                            console.info(err);
                                        }
                                    }
                                });
                            }

                            $topbar.on("touchstart click", ".everlightbox-comments, .everlightbox-comment-count", function () {
                                $topbarLeft.find(".everlightbox-comments").toggleClass("everlightbox-comments-active");
                                if($topbarLeft.find(".everlightbox-comments").hasClass("everlightbox-comments-active")) {
                                    if($topbar.find(".fb-comments").length) {
                                        $topbar.find(".fb-comments").show();
                                    } else {
                                        $topbar.append('<div class="fb-comments" data-href="'+ $img.attr("src") + '" data-width="300" data-numposts="5"></div>');
                                        if (typeof FB != "undefined" && FB != null)
                                            FB.XFBML.parse($topbar.get(0));
                                    }                                    
                                } else {
                                    $glass.find('.fb-comments').hide();
                                }                            
                            });                                                        
                        }
                        wp.hooks.applyFilters('everlightbox.openMedia', slide);
                        if ( plugin.settings.afterMedia ) {
                            plugin.settings.afterMedia( index );
                        }
                    } );
                } else {
                    slide.html( $this.getVideo( src ) );

                    if ( plugin.settings.afterMedia ) {
                        plugin.settings.afterMedia( index );
                    }
                }

            },


            /**
             * Check if the URL is a video
             */
            isVideo : function ( src ) {

                if ( src ) {
                    if ( src.match( /(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || src.match( /vimeo\.com\/([0-9]*)/ ) || src.match( /youtu\.be\/([a-zA-Z0-9\-_]+)/ ) ) {
                        return true;
                    }

                    if ( src.toLowerCase().indexOf( 'everlightboxvideo=1' ) >= 0 ) {

                        return true;
                    }
                }

            },

            /**
             * Parse URI querystring and:
             * - overrides value provided via dictionary
             * - rebuild it again returning a string
             */
            parseUri : function (uri, customData) {
                var a = document.createElement('a'),
                    qs = {};

                // Decode the URI
                a.href = decodeURIComponent( uri );

                // QueryString to Object
                if ( a.search ) {
                    qs = JSON.parse( '{"' + a.search.toLowerCase().replace('?','').replace(/&/g,'","').replace(/=/g,'":"') + '"}' );
                }

                // Extend with custom data
                if ( $.isPlainObject( customData ) ) {
                    qs = $.extend( qs, customData, plugin.settings.queryStringData ); // The dev has always the final word
                }

                // Return querystring as a string
                return $
                    .map( qs, function (val, key) {
                        if ( val && val > '' ) {
                            return encodeURIComponent( key ) + '=' + encodeURIComponent( val );
                        }
                    })
                    .join('&');
            },

            /**
             * Get video iframe code from URL
             */
            getVideo : function( url ) {
                var iframe = '',
                    youtubeUrl = url.match( /((?:www\.)?youtube\.com|(?:www\.)?youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/ ),
                    youtubeShortUrl = url.match(/(?:www\.)?youtu\.be\/([a-zA-Z0-9\-_]+)/),
                    vimeoUrl = url.match( /(?:www\.)?vimeo\.com\/([0-9]*)/ ),
                    qs = '';
                if ( youtubeUrl || youtubeShortUrl) {
                    if ( youtubeShortUrl ) {
                        youtubeUrl = youtubeShortUrl;
                    }
                    qs = ui.parseUri( url, {
                        'autoplay' : ( plugin.settings.autoplayVideos ? '1' : '0' ),
                        'v' : ''
                    });
                    iframe = '<iframe width="560" height="315" src="//' + youtubeUrl[1] + '/embed/' + youtubeUrl[2] + '?' + qs + '" frameborder="0" allowfullscreen></iframe>';

                } else if ( vimeoUrl ) {
                    qs = ui.parseUri( url, {
                        'autoplay' : ( plugin.settings.autoplayVideos ? '1' : '0' ),
                        'byline' : '0',
                        'portrait' : '0',
                        'color': plugin.settings.vimeoColor
                    });
                    iframe = '<iframe width="560" height="315"  src="//player.vimeo.com/video/' + vimeoUrl[1] + '?' + qs + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';

                } else {
                    iframe = '<iframe width="560" height="315" src="' + url + '" frameborder="0" allowfullscreen></iframe>';
                }

                return '<div class="everlightbox-video-container"><div class="everlightbox-video">' + iframe + '</div></div>';
            },

            /**
             * Load image
             */
            loadMedia : function ( src, callback ) {
                // Inline content
                if ( src.trim().indexOf('#') === 0 ) {
                    callback.call(
                        $('<div>', {
                            'class' : 'everlightbox-inline-container'
                        })
                            .append(
                            $(src)
                                .clone()
                                .toggleClass( plugin.settings.toggleClassOnLoad )
                        )
                    );
                }
                // Everything else
                else {
                    if ( ! this.isVideo( src ) ) {
                        var img = $( '<img>' ).on( 'load', function() {
                            callback.call( img );
                        } );

                        img.attr( 'src', src );
                    }
                }
            },

            /**
             * Get next slide
             */
            getNext : function () {
                var $this = this,
                    src,
                    index = $( '#everlightbox-slider .slide' ).index( $( '#everlightbox-slider .slide.current' ) );
                if ( index + 1 < elements.length ) {

                    src = $( '#everlightbox-slider .slide' ).eq( index ).contents().find( 'iframe' ).attr( 'src' );
                    $( '#everlightbox-slider .slide' ).eq( index ).contents().find( 'iframe' ).attr( 'src', src );
                    index++;
                    $this.setSlide( index );
                    $this.preloadMedia( index+1 );
                    if ( plugin.settings.nextSlide ) {
                        plugin.settings.nextSlide(index);
                    }
                } else {

                    if ( plugin.settings.loopAtEnd === true ) {
                        src = $( '#everlightbox-slider .slide' ).eq( index ).contents().find( 'iframe' ).attr( 'src' );
                        $( '#everlightbox-slider .slide' ).eq( index ).contents().find( 'iframe' ).attr( 'src', src );
                        index = 0;
                        $this.preloadMedia( index );
                        $this.setSlide( index );
                        $this.preloadMedia( index + 1 );
                        if ( plugin.settings.nextSlide ) {
                            plugin.settings.nextSlide(index);
                        }
                    } else {
                        $( '#everlightbox-overlay' ).addClass( 'rightSpring' );
                        setTimeout( function() {
                            $( '#everlightbox-overlay' ).removeClass( 'rightSpring' );
                        }, 500 );
                    }
                }
            },

            /**
             * Get previous slide
             */
            getPrev : function () {
                var index = $( '#everlightbox-slider .slide' ).index( $( '#everlightbox-slider .slide.current' ) ),
                    src;
                if ( index > 0 ) {
                    src = $( '#everlightbox-slider .slide' ).eq( index ).contents().find( 'iframe').attr( 'src' );
                    $( '#everlightbox-slider .slide' ).eq( index ).contents().find( 'iframe' ).attr( 'src', src );
                    index--;
                    this.setSlide( index );
                    this.preloadMedia( index-1 );
                    if ( plugin.settings.prevSlide ) {
                        plugin.settings.prevSlide(index);
                    }
                } else {
                    $( '#everlightbox-overlay' ).addClass( 'leftSpring' );
                    setTimeout( function() {
                        $( '#everlightbox-overlay' ).removeClass( 'leftSpring' );
                    }, 500 );
                }
            },
            /* jshint unused:false */
            nextSlide : function ( index ) {
                // Callback for next slide
            },

            prevSlide : function ( index ) {
                // Callback for prev slide
            },

            /**
             * Close
             */
            closeSlide : function () {
                $( 'html' ).removeClass( 'everlightbox-html' );
                $( 'html' ).removeClass( 'everlightbox-touch' );
                $( window ).trigger( 'resize' );
                this.destroy();
            },

            /**
             * Destroy the whole thing
             */
            destroy : function () {
                $( window ).unbind( 'keyup' );
                $( 'body' ).unbind( 'touchstart' );
                $( 'body' ).unbind( 'touchmove' );
                $( 'body' ).unbind( 'touchend' );
                $( '#everlightbox-slider' ).unbind();
                $( '#everlightbox-overlay' ).remove();

                if ( ! $.isArray( elem ) ) {
                    elem.removeData( '_everlightbox' );
                }

                if ( this.target ) {
                    this.target.trigger( 'everlightbox-destroy' );
                }

                $.everlightbox.isOpen = false;

                if ( plugin.settings.afterClose ) {
                    plugin.settings.afterClose();
                }
            }
        };

        plugin.init();
    };

    $.fn.everlightbox = function( options ) {

        if ( ! $.data( this, '_everlightbox' ) ) {
            window.everlightbox = new $.everlightbox( this, options );
            this.data( '_everlightbox', everlightbox );
        }
        return this.data( '_everlightbox' );

    };

}( window, document, jQuery ) );
