/**
 * User: akira
 * Date: 28.01.13
 * Time: 19:22
 */

!function ($) {
    "use strict"

    var Rotator = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.rotator.defaults, options);
        this.initialize();
    }
    Rotator.prototype = {
        constructor: Rotator,
        initialize: function () {
            this.$element.on('click', '.next', $.proxy(this.next, this));
            this.$element.on('click', '.prev', $.proxy(this.prev, this));
            this.$next = this.$element.find('.next');
            this.$prev = this.$element.find('.prev');
            this.$wrapper = this.$element.find(this.options.wrapper);
            this.reload()
        },
        reload: function () {

            this.$items = this.$wrapper.find(this.options.item);

            if (this.options.orientation != "horizontal") {
                this.singleSize = this.$items.first().outerHeight();
                this.visible = Math.floor(this.$wrapper.outerHeight() / this.singleSize);
            } else {
                this.singleSize = this.$items.first().outerWidth();
                this.visible = Math.floor(this.$wrapper.outerWidth() / this.singleSize);

            }

            this.currentPage = 1;
            this.pages = Math.ceil(this.$items.length / this.visible);
            this.checkControls();
        },
        next: function (e) {
            e.preventDefault();
            this.pageTo(this.currentPage + 1);
            this.$element.trigger('next', e);
        },
        prev: function (e) {
            e.preventDefault();
            this.pageTo(this.currentPage - 1);
            this.$element.trigger('prev', e);
        },
        checkControls: function () {
            var that = this;

            if (that.currentPage <= 1) {
                that.$prev.hide();
                that.$next.show();
            } else if (that.currentPage > that.pages) {
                that.$next.hide();
                that.$prev.show();
            } else {
                if (that.$next.is(":hidden")) that.$next.show();
                if (that.$prev.is(":hidden")) that.$prev.show();
            }
        },
        scrollTo: function (index) {
            console.log(this.currentPage)
//            TODO: HACK this.visible-1
            this.pageTo(Math.floor(index / (this.visible - 1)));
        },
        pageTo: function (page) {
            var that = this,
                dir = page < this.currentPage ? -1 : 1,
                n = Math.abs(this.currentPage - page),
                offset = this.singleSize * dir * this.visible * n;
//            var offesetByItem = (this.$items.length-page*(this.visible-1))

            var animateParams = {
                scrollLeft: '+=' + offset
            }

            if(this.options.orientation != "horizontal") {
                var animateParams = {
                    scrollTop: '+=' + offset
                }
            }

            this.$wrapper.filter(':not(:animated)').animate(animateParams, this.options.speed, function () {
                that.currentPage = page;
                that.checkControls();
                that.$element.trigger('page')
            });
        }
    }

    $.fn.rotator = function (option, args) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('rotator')
                , options = typeof option == 'object' && option;
            if (!data) $this.data('rotator', (data = new Rotator(this, options)));
            if (typeof option == 'string') data[option](args);
        })
    }

    $.fn.rotator.defaults = {
        wrapper: '.wrapper-outer',
        item: 'li',
        orientation: 'horizontal',
        speed : 600
    }

    $.fn.rotator.Constructor = Rotator
}(window.jQuery);