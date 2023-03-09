(function ($) {
    $.widget("xfaWidget.ajila-forms-joeltschopp-tertiarybutton", $.xfaWidget.xfaButton, {
        _widgetName: "ajila-forms-joeltschopp-tertiarybutton",

        render: function () {
            var $input = $.xfaWidget.xfaButton.prototype.render.apply(this, arguments);
            $input.attr("data-suppress-panel-title", '');
            ajila.forms.joeltschopp.common.accessibility.extendAriaLabel($input.get(0), false);
            return $input;
        }
    });
})(jQuery);