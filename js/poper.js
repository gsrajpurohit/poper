/*!
 * Poper - A popup box jQuery Plugin - v1.0.0
 *
 * Copyright 2017 Ganpat S Rajpurohit, Jaipur.
 *
 * Licensed MIT
 */
if (typeof Object.create !== 'function') {
    Object.create = function(obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function($, window, document, undefined) {
    $.each(['poper.showing', 'poper.show', 'poper.hiding', 'poper.hide'], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
            this.trigger(ev);
            return el.apply(this, arguments);
        };
    });
    var POPER = {
        name: 'poper',
        event_showing: 'poper.showing',
        event_show: 'poper.show',
        event_hiding: 'poper.hiding',
        event_hide: 'poper.hide',
        poper_el: {},
        splace_class: 'poper-splace',
        wrapper_class: 'poper-wrapper',
        header_class: 'poper-header',
        body_class: 'poper-body',
        footer_class: 'poper-footer',
        _init: function(el, options) {
            self = this;
            this.settings = $.extend({}, $.fn.poper.defaults, options);
            this.$el = $(el);
            this._getData();
            this._observer();

            /*$(el).on('click', function(event) {
                self.settings.onSelect.call(this)
            })*/

        },
        _getData: function(){
            var data = this.$el.data();
            this.settings = $.extend({}, this.settings, data);
        },
        _observer: function() {
            var self = this;
            var pr_event = this.settings.event || 'click';
            if(pr_event !== undefined) {
                if(pr_event == 'hover') {
                    pr_event = 'mouseenter';
                }
            }

            $(self.$el).on(pr_event, function(event){
                event.preventDefault();
                $(this).trigger(self.event_showing);
                self._build();
                $('body').addClass('poper-show')
            })
        },
        _build: function(){
            var self = this;
            if($('.' + this.splace_class).length > 0){
                $('.' + this.splace_class).remove();
            }
            this.poper_el.splace = this._build_splace();
            this.poper_el.wrapper = this._build_wrapper();
            this.poper_el.header = this._build_header();
            this.poper_el.body = this._build_body();
            this.poper_el.footer = this._build_footer();

            var $splace = this.poper_el.splace;
            var $wrapper = this.poper_el.wrapper;
            $wrapper.append(this.poper_el.header)
                    .append(this.poper_el.body)
                    .append(this.poper_el.footer);
            $splace.append(this.poper_el.wrapper)

            $splace.appendTo('body');
            $splace.animate({'opacity': 1}, 100, function(){
                $wrapper.show('slide', {direction: 'down'}, 300, function(){
                    self.poper_el.header.show('slide', {direction: 'up'}, 300 )
                    self.poper_el.footer.show('slide', {direction: 'down'}, 300 )
                } )
                self.$el.trigger(self.event_show);
            });

        },
        _build_splace: function(){
            var self = this;
            return $('<div />', {
                class: this.splace_class
            })
            .on('click', function(e){
                if (e.target !== this)
                    return;
                self._hide_callbacks();
            })
        },
        _build_wrapper: function(){
            var setting = this.settings;
            var $wrap = $('<div />', {
                class: this.wrapper_class + ' ' + this.name + '-' + setting.size + ' ' + setting.theme
            })
            .css('display', 'none')

            return $wrap;
        },
        _build_header: function(){
            var $content = this._header_content();
            var $header = $('<div />', {
                class: this.header_class
            })
            .css('display', 'none')

            $content.appendTo($header);
            return $header;
        },
        _header_content: function() {
            var self = this;
            var setting = this.settings;
            var $heading = $('<h3 />').text(setting.headerText);
            var $dismiss = $('<span />', {
                class: 'dismiss'
            })
            .text('x')
            .on('click', function(event) {
                event.preventDefault();
                self._hide_callbacks();
            })
            .appendTo($heading);

            return $heading;
        },
        _build_body: function(){
            var self = this;
            var setting = this.settings;
            var $body = $();
            if(setting.content != '' && setting.content !== undefined ){
                if( setting.remote) {
                    this._getContent(setting.content).done(function(response){
                        $body = $('<div />', { class: self.body_class })
                                    .html(response);
                        $('.poper-header').after($body);
                        self.poper_el.body = $body;
                    })
                }
                else {
                    $body = $('<div />', { class: this.body_class })
                                .html(setting.content);
                    return $body;
                }
            }
            else {
                $body = $('<div />', { class: this.body_class })
                            .html('');
                return $body;
            }
        },
        _build_footer: function() {
            var $content = this._footer_content();
            var $footer = $('<div />', {
                class: this.footer_class
            })
            .css('display', 'none')
            $content[0].appendTo($footer);
            $content[1].appendTo($footer);
            return $footer;
        },
        _footer_content: function() {
            var self = this;
            var setting = this.settings;
            var $btnOk = $('<a />', {class: 'btn-action btn-ok'})
                            .text('Ok')
                            .on('click', function(event) {
                                event.preventDefault();
                                self._hide_callbacks();
                            });
            var $btnClose = $('<a />', {class: 'btn-action btn-close'})
                            .text('Close')
                            .on('click', function(event) {
                                event.preventDefault();
                                self._hide_callbacks();
                            });

            return [$btnOk, $btnClose];
        },
        _hide_callbacks: function(){
            var self = this;
            self.$el.trigger(self.event_hiding);
            self.poper_el.splace.fadeOut(300);
            self.poper_el.header.hide('slide', {direction: 'up'}, 300 )
            self.poper_el.footer.hide('slide', {direction: 'down'}, 300, function(){
                self.poper_el.wrapper.hide('slide', { direction: 'up' }, 300, function(){
                    self.poper_el.splace.remove();
                    self.$el.trigger(self.event_hide);
                    $('body').removeClass('poper-show');
                });
            } )

        },
        _getContent: function(path) {
            var dfd = new $.Deferred();
            $.ajax({
                url: path,
                type: 'get',
                // dataType: 'json',
                success: function(response) {
                    dfd.resolve(response);
                }
            })
            return dfd.promise();
        },
        validURL: function(str) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            return regexp.test(str);
        }
    }

    $.fn.poper = function(options) {
        if ($.isPlainObject(options)) {
            return this.each(function() {
                var poper = Object.create(POPER);
                poper._init(this, options);
                $(this).data('poper', poper);
            });
        } else if (typeof options === 'string' && options.indexOf('_') !== 0) {
            var poper = $(this).data('poper');
            var method = poper[options];
            return method.apply(poper, $.makeArray(arguments).slice(1));
        }
        else{
            return this.each(function() {
                var poper = Object.create(POPER);
                poper._init(this, $.fn.poper.defaults);
                $(this).data('poper', poper);
            });
        }
    };

    $.fn.poper.defaults = {
        event: 'click', // click/hover
        theme: 'green', // red/green/blue/black
        size: 'mid', // big,mid,small
        headerText: "",
        content: "", // text/url
        onSelect: function() {}
    };


})(jQuery, window, document);
$('[data-poper=true]').poper();