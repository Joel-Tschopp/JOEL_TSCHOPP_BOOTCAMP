(function ($) {
    $.widget("xfaWidget.ajila-forms-joeltschopp-textbox", $.xfaWidget.textField, {
        _widgetName: "ajila-forms-joeltschopp-textbox",

        render: function () {
            var initialAreaHeight = 0;
            var initialParentHeight = 0;
            var initialShortDescriptionTop = 0;

            this.element.on('change keyup keydown paste cut', 'textarea', function () {
                if (initialAreaHeight === 0 && initialAreaHeight === 0) {
                    initialAreaHeight = this.clientHeight;
                    initialParentHeight = this.parentElement.parentElement.clientHeight;

                    if ($(this.parentElement.parentElement).find('.short-description').length == 1) {
                        initialShortDescriptionTop = $(this.parentElement.parentElement).find('.short-description').css('top');
                        initialShortDescriptionTop = parseInt(initialShortDescriptionTop.replace('px', ''));
                    }
                }
                var heightDiff = this.scrollHeight - initialAreaHeight;
                $(this).outerHeight(0).outerHeight(this.scrollHeight);
                $(this.parentElement.parentElement).outerHeight(0).outerHeight(initialParentHeight + heightDiff);

                if (initialShortDescriptionTop > 0) {
                    $(this.parentElement.parentElement).find('.short-description').css('top', initialShortDescriptionTop + heightDiff);
                }
            });

            var $input = $.xfaWidget.textField.prototype.render.apply(this, arguments);
            ajila.forms.joeltschopp.common.accessibility.initializeAriaDescribedBy($input.get(0));
            ajila.forms.joeltschopp.common.accessibility.observeAriaInvalid($input.get(0));
            ajila.forms.joeltschopp.common.accessibility.extendAriaLabel($input.get(0));
            return $input;
        },

        getOptionsMap: function() {
            var parentOptionsMap = $.xfaWidget.textField.prototype.getOptionsMap.apply(this,arguments);
            return $.extend({},parentOptionsMap,{
                "required": function(required) {
                    this.$userControl.attr("aria-required", required);
                }
            })
        }
    });
})(jQuery);