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
                videoMaxWidth : 1140,
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
                downloadIcon: false,
                facebook_comments: false,
                rootCssClass: ''
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
                    width : width,
                    height : height
                };

                $('#everlightbox-overlay').css( sliderCss );
                $("#everlightbox-slider .slide").each(function () {
                    $img = $(this).find("img");
                    var w = $img.width();
                    var h = $img.height();
                    var pos = $img.position();
                    if(w && h) {
                        $(this).find(".everlightbox-glass").css({
                            top: pos.top,
                            left: pos.left,
                            width: w,
                            height: h
                        });
                    }                    
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
                    var text = $this.getCurrentTitle();
                    var image = $( '#everlightbox-slider .slide.current img' ).attr("src");

                    var url = "http://pinterest.com/pin/create/button/?url=" + encodeURIComponent(location.href) + "&description=" + encodeURI(text);

                    url += ("&media=" + encodeURIComponent(qualifyURL(image)));

                    var w = window.open(url, "ftgw", "location=1,status=1,scrollbars=1,width=600,height=400");
                    w.moveTo((screen.width / 2) - (300), (screen.height / 2) - (200));
                });

                $('body').on('touchstart click', '.everlightbox-twitter', function (e) {
                    var text = $this.getCurrentTitle();
                    var image = $( '#everlightbox-slider .slide.current img' ).attr("src");

                    var w = window.open("https://twitter.com/intent/tweet?url=" + encodeURI(location.href.split('#')[0]) + "&text=" + encodeURI(text), "ftgw", "location=1,status=1,scrollbars=1,width=600,height=400");
                    w.moveTo((screen.width / 2) - (300), (screen.height / 2) - (200));
                });

                $('body').on('touchstart click', '.everlightbox-googleplus', function (e) {
                    var text = $this.getCurrentTitle();
                    var image = $( '#everlightbox-slider .slide.current img' ).attr("src");

                    var url = "https://plus.google.com/share?url=" + encodeURI(location.href);

                    var w = window.open(url, "ftgw", "location=1,status=1,scrollbars=1,width=600,height=400");
                    w.moveTo((screen.width / 2) - (300), (screen.height / 2) - (200));
                });

                $('body').on('touchstart click', '.everlightbox-houzz', function (e) {
                    var text = $this.getCurrentTitle();
                    var image = $( '#everlightbox-slider .slide.current img' ).attr("src");

                    var url = "http://www.houzz.com/imageClipperUpload?imageUrl=" + encodeURIComponent(qualifyURL(image)) +
                                    "&link=" + encodeURI(location.href) + "&title=" + encodeURI(text);

                    var w = window.open(url, "ftgw", "location=1,status=1,scrollbars=1,width=600,height=400");
                    w.moveTo((screen.width / 2) - (300), (screen.height / 2) - (200));
                });

                $('body').on('touchstart click', '.everlightbox-facebook', function (e) {
                    var text = $this.getCurrentTitle();
                    var image = $( '#everlightbox-slider .slide.current img' ).attr("src");

                    var url = "https://www.facebook.com/dialog/feed?app_id=1213605408691751&"+
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
                            $this.showBars();
                            $this.setTimeout();
                        } else {
                            $this.clearTimeout();
                            $this.hideBars();
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
             * Show navigation and title bars
             */
            showBars : function () {
                
            },

            /**
             * Hide navigation and title bars
             */
            hideBars : function () {
                
            },

            /**
             * Animate navigation and top bars
             */
            animBars : function () {
                
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

                        var $img = this;
                        var img_pos = this.position();

                        var $glass = $("<div class='everlightbox-glass'></div>");
                        $glass.css({
                            position: 'absolute',
                            top: img_pos.top,
                            left: img_pos.left,
                            width: $img.width(),
                            height: $img.height(),
                            zIndex: 1000
                        });

                        slide.append($glass);
                        
                        var title = null;
                        if ( elements[ index ] !== undefined ) {
                            title = elements[ index ].title;
                        }


                        if ( title ) {
                            $glass.append("<p class='everlightbox-caption'><span>"+title+"</span></p>");
                        }
                        
                        /*$glass.find(".everlightbox-caption").css({
                            top: img_pos.top + 4,
                            left: img_pos.left + 40,
                            right: img_pos.left + 40
                        });*/

                        $glass.append('<a class="everlightbox-close"><i class="ev-icon-cancel"></i></a>');
                        /*$glass.find(".everlightbox-close").css({
                            top: img_pos.top + 4,
                            right: img_pos.left + 4,
                        });*/

                        var social = [];
                        if(plugin.settings.facebookIcon)
                            social.push('<a title="Share on Facebook" class="button everlightbox-facebook"><i class="ev-icon-facebook"></i></a>');                        
                        if(plugin.settings.pinterestIcon)
                            social.push('<a title="Share on Pinterest" class="button everlightbox-pinterest"><i class="ev-icon-pinterest"></i></a>');
                        if(plugin.settings.tumblrIcon)
                            social.push('<a title="Share on Tumblr" class="button everlightbox-tumblr"><i class="ev-icon-tumblr"></i></a>');
                        if(plugin.settings.twitterIcon)
                            social.push('<a title="Share on Twitter" class="button everlightbox-twitter"><i class="ev-icon-twitter"></i></a>');
                        if(plugin.settings.houzzIcon)
                            social.push('<a share="Share on Houzz" class="button everlightbox-houzz"><i class="ev-icon-houzz"></i></a>');
                        if(plugin.settings.googleplusIcon)
                            social.push('<a title="Share on Google+" class="button everlightbox-googleplus"><i class="ev-icon-gplus"></i></a>');                        
                        if(plugin.settings.downloadIcon)
                            social.push('<a title="Download image" href="'+ this.attr("src") +'" download class="button everlightbox-download"><i class="ev-icon-install"></i></a>');                            
                        
            
                        if(social.length) {
                            $glass.append("<div class='everlightbox-social'>"+social.join('')+"</div>");
                            /*$glass.find(".everlightbox-social").css({
                                top: img_pos.top + $img.height() - 32,
                                right: img_pos.left + 4,
                                left: img_pos.left + 4
                            });*/
                        }

                        if(plugin.settings.facebook_comments)
                        {
                            $glass.append('<a title="Show comments" class="everlightbox-comments"><i class="ev-icon-commenting-o"></i></a>');
                            $glass.find(".everlightbox-comments").css({
                                /*top: img_pos.top + 4,
                                left: img_pos.left + 4*/
                            }).on("touchstart click", function () {
                                $(this).toggleClass("everlightbox-comments-active");
                                if($(this).hasClass("everlightbox-comments-active")) {
                                    if($glass.find(".fb-comments").length) {
                                        $glass.find(".fb-comments").show();
                                    } else {
                                        $glass.append('<div class="fb-comments" data-href="'+ $img.attr("src") + '" data-width="300" data-numposts="5"></div>');
                                        /*$glass.find(".fb-comments").css({
                                            top: img_pos.top + 64,
                                            left: img_pos.left + 4
                                        });*/
                                        if (typeof FB != "undefined" && FB != null)
                                            FB.XFBML.parse();
                                    }                                    
                                } else {
                                    $glass.find('.fb-comments').hide();
                                }                            
                            });                                                        
                        }                        

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

                return '<div class="everlightbox-video-container" style="max-width:' + plugin.settings.videoMaxWidth + 'px"><div class="everlightbox-video">' + iframe + '</div></div>';
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
            var everlightbox = new $.everlightbox( this, options );
            this.data( '_everlightbox', everlightbox );
        }
        return this.data( '_everlightbox' );

    };

}( window, document, jQuery ) );
