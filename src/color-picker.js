/**
 * ColorPick jQuery plugin
 * https://github.com/philzet/ColorPick.js
 * Copyright (c) 2017-2019 Phil Zet (a.k.a. Phil Zakharchenko)
 * Licensed under the MIT License
 */
(function($) {

    "use strict";

    $.fn.colorPicker = function(config) {

        return this.each(function() {
            new $.colorPicker(this, config || {});
        });

    };

    $.colorPicker = function(element, options) {

        options = options || {};

        this.options = $.extend({}, $.fn.colorPicker.defaults, options);
        if ( options.str ) {
            this.options.str = $.extend({}, $.fn.colorPicker.defaults.str, options.str);
        }

        $.fn.colorPicker.defaults = this.options;
        this.color = this.options.initialColor.toUpperCase();
        this.element = $(element);

        var dataInitialColor = this.element.data('initialcolor');
        if ( dataInitialColor ) {
            this.color = dataInitialColor;
            this.appendToStorage(this.color);
        }

        var uniquePalette = [];
        $.each($.fn.colorPicker.defaults.palette.map(function(x) {
            return x.toUpperCase()

        }), function(i, el) {
            if ($.inArray(el, uniquePalette) === -1) uniquePalette.push(el);
        });

        this.palette = uniquePalette;

        return this.element.hasClass(this.options.pickerClass) ? this : this.init();
    };

    $.fn.colorPicker.defaults = {
        "initialColor": '',
        "paletteLabel": 'Colors:',
        "allowRecent": true,
        "recentMax": 5,
        "recentLabel": 'Recents:',
        "allowCustomColor": false,
        "palette": [
            '#1abc9c',
            '#16a085',
            '#2ecc71',
            '#27ae60',
            '#3498db',
            '#2980b9',
            '#9b59b6',
            '#8e44ad',
            '#34495e',
            '#2c3e50',
            '#f1c40f',
            '#f39c12',
            '#e67e22',
            '#d35400',
            '#e74c3c',
            '#c0392b',
            '#ecf0f1',
            '#bdc3c7',
            '#95a5a6',
            '#7f8c8d'
        ],
        'onColorSelected': function() {
            if ( this.color ) {
                this.element.css({
                    'background-image': 'none'
                });
            }
            this.element.css({
                'background-color': this.color,
                'color': this.color
            });
        }
    };

    $.colorPicker.prototype = {

        init: function() {

            var self = this;
            var o = this.options;

            $.proxy($.fn.colorPicker.defaults.onColorSelected, this)();

            this.element.click(function(event) {

                if ( event.target != event.currentTarget ) {
                    return;
                }

                var offset = $(self.element).offset();

                event.preventDefault();
                self.show(self.element, event.pageX - offset.left, event.pageY - offset.top);

                $('.color-custom-hash').val(self.color);

                $('.color-picker-button').click(function(event) {
                    self.color = $(event.target).attr('hexValue');
                    self.appendToStorage($(event.target).attr('hexValue'));
                    self.hide();
                    $.proxy(self.options.onColorSelected, self)();
                    return false;
                });

                $('.color-custom-hash').click(function(event) {
                    return false;

                }).keyup(function(event) {

                    var hash = $(this).val();
                    if ( hash.indexOf('#') !== 0 ) {
                        hash = "#" + hash;
                    }

                    if ( /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hash) ) {
                        self.color = hash;
                        self.appendToStorage(hash);
                        $.proxy(self.options.onColorSelected, self)();
                        $(this).removeClass('error');

                    } else {
                        $(this).addClass('error');
                    }
                });

                return false;

            }).blur(function() {
                self.element.val(self.color);
                $.proxy(self.options.onColorSelected, self)();
                self.hide();
                return false;
            });

            $(document).on('click', function(event) {
                if ($.contains(self.element[0], event.target)) {
                    return;
                }
                self.hide();
                return true;
            });

            return this;
        },

        appendToStorage: function(color) {
            if ( $.fn.colorPicker.defaults.allowRecent === true ) {
                var storedColors = JSON.parse(localStorage.getItem('color-picker-recent'));
                if ( storedColors == null ) {
                    storedColors = [];
                }
                if ( $.inArray(color, storedColors) == -1 ) {
                    storedColors.unshift(color);
                    storedColors = storedColors.slice(0, $.fn.colorPicker.defaults.recentMax)
                    localStorage.setItem('color-picker-recent', JSON.stringify(storedColors));
                }
            }
        },

        show: function(element, left, top) {

            $('.color-picker-wrapper').remove();

            var wrapper  = '<div class="color-picker-wrapper">';
                wrapper += '<div id="color-picker" style="display:none;top:';
                wrapper += top + 'px;left:' + left + 'px"><span>';
                wrapper += $.fn.colorPicker.defaults.paletteLabel;
                wrapper += '</span></div></div>';

            $(element).prepend(wrapper);

            $.each(this.palette, function(index, item) {
                $('#color-picker').append('<div class="color-picker-button" hexValue="' + item + '" style="background:' + item + '"></div>');
            });

            if ( $.fn.colorPicker.defaults.allowCustomColor === true ) {
                $('#color-picker').append('<input type="text" style="margin-top:5px" class="color-custom-hash">');
            }

            if ( $.fn.colorPicker.defaults.allowRecent === true ) {

                $('#color-picker').append('<span style="margin-top:5px">' + $.fn.colorPicker.defaults.recentLabel + '</span>');

                if ( JSON.parse(localStorage.getItem('color-picker-recent')) == null 
                  || JSON.parse(localStorage.getItem('color-picker-recent')) == [] ) {
                    $('#color-picker').append('<div class="color-picker-button color-picker-dummy"></div>');

                } else {
                    $.each(JSON.parse(localStorage.getItem('color-picker-recent')), function(index, item) {
                        $('#color-picker').append('<div class="color-picker-button" hexValue="' + item + '" style="background:' + item + '"></div>');
                        if ( index == $.fn.colorPicker.defaults.recentMax - 1 ) {
                            return false;
                        }
                    });
                }
            }
            $('#color-picker').fadeIn(200);
        },

        hide: function() {
            $('.color-picker-wrapper').fadeOut(200, function() {
                $('.color-picker-wrapper').remove();
                return this;
            });
        },

    };

}(jQuery));