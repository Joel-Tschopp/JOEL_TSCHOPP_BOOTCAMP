(function ($) {
    $.widget("xfaWidget.ajila-forms-joeltschopp-numericbox", $.xfaWidget.numericInput, {
        _widgetName: "ajila-forms-joeltschopp-numericbox",

        render: function () {
            var $control = $.xfaWidget.numericInput.prototype.render.apply(this, arguments);
            ajila.forms.joeltschopp.common.accessibility.initializeAriaDescribedBy($control.get(0));
            ajila.forms.joeltschopp.common.accessibility.observeAriaInvalid($control.get(0));
            ajila.forms.joeltschopp.common.accessibility.extendAriaLabel($control.get(0));
            return $control;
        }
    });
})(jQuery);