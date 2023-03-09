(function ($) {
    $.widget("xfaWidget.ajila-forms-joeltschopp-timebox", $.xfaWidget.textField, {
        _widgetName: "ajila-forms-joeltschopp-timebox",

        render: function () {
            var $input = $.xfaWidget.textField.prototype.render.apply(this, arguments);
            ajila.forms.joeltschopp.common.accessibility.initializeAriaDescribedBy($input.get(0));
            ajila.forms.joeltschopp.common.accessibility.observeAriaInvalid($input.get(0));
            ajila.forms.joeltschopp.common.accessibility.extendAriaLabel($input.get(0));
            return $input;
        },

        getCommitValue: function () {
            var value = this.$userControl.val();
            return window.ajila.forms.joeltschopp.component.timebox.convertTime(value);
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