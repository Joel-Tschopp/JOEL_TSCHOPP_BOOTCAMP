(function ($) {
    $.widget("xfaWidget.ajila-forms-joeltschopp-dropdownlist", $.xfaWidget.dropDownList, {
        _widgetName: "ajila-forms-joeltschopp-dropdownlist",

        render: function () {
            var id = this.element.find('select').attr('id');
            var $control = $.xfaWidget.dropDownList.prototype.render.apply(this, arguments);
            $control.attr('id', id);
            ajila.forms.joeltschopp.common.accessibility.initializeAriaDescribedBy($control.get(0));
            ajila.forms.joeltschopp.common.accessibility.observeAriaInvalid($control.get(0));
            ajila.forms.joeltschopp.common.accessibility.extendAriaLabel($control.get(0));
            return $control;
        }
    });
})(jQuery);