(function ($) {
    $.widget("xfaWidget.ajila-forms-joeltschopp-telephone", $.xfaWidget.textField, {
        _widgetName: "ajila-forms-joeltschopp-telephone",

        render: function () {
            var $input = $.xfaWidget.textField.prototype.render.apply(this, arguments);
            ajila.forms.joeltschopp.common.accessibility.initializeAriaDescribedBy($input.get(0));
            ajila.forms.joeltschopp.common.accessibility.observeAriaInvalid($input.get(0));
            ajila.forms.joeltschopp.common.accessibility.extendAriaLabel($input.get(0));
            return $input;
        },

        getCommitValue: function () {
            var value = this.$userControl.val();
            return ajila.forms.joeltschopp.component.telephone.reformatNumber(value);
        },

        getOptionsMap: function() {
            var parentOptionsMap = $.xfaWidget.textField.prototype.getOptionsMap.apply(this, arguments);
            return $.extend({},parentOptionsMap,{
                "required": function(required) {
                    this.$userControl.attr("aria-required", required);
                }
            })
        }
    });
})(jQuery);