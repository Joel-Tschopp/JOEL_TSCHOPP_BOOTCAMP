(function ($) {
    $.widget("xfaWidget.ajila-forms-joeltschopp-removebutton", $.xfaWidget.xfaButton, {
        _widgetName: "ajila-forms-joeltschopp-removebutton",

        render: function () {
            var $input = $.xfaWidget.xfaButton.prototype.render.apply(this, arguments);
            ajila.forms.joeltschopp.common.accessibility.extendAriaLabel($input.get(0));
            return $input;
        }
    });
})(jQuery);
