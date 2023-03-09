(function ($) {
    $.widget("xfaWidget.ajila-forms-joeltschopp-documentlist", $.xfaWidget.XfaCheckBox, {
        _widgetName: "ajila-forms-joeltschopp-documentlist",

        render: function () {
            var _self = this;
            this.element.on("click keypress", function () {
                if (ajila.forms.joeltschopp.common.accessibility.diverseAccess(event) === true) {
                    window.open(this.getAttribute("data-url"), '_blank');
                }
            });
            return this.element;
        }
    });
})(jQuery);