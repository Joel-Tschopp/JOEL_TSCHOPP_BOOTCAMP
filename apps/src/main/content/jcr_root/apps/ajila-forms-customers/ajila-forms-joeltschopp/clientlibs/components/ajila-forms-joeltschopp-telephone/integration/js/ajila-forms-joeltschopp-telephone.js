window.ajila.forms.joeltschopp.component = window.ajila.forms.joeltschopp.component || {};
window.ajila.forms.joeltschopp.component.telephone = window.ajila.forms.joeltschopp.component.telephone || {};

(function (context) {
    /**
     * Handles the conversion from different phone numbers to the required format.
     * @param number The entered phone number.
     * @return number The converted phone number.
     */
    context.reformatNumber = function (number) {
        number = number.replace(/\s/g, '');

        if (this.leadingFirstDigit(number)) {
            return '0' + number;
        }
        return number;
    };

    /**
     * Checks if the entered phone number has only one leading digit.
     * @param number The entered phone number.
     * @return number The validation result.
     */
    context.leadingFirstDigit = function (number) {
        var numbers = /^0{1}[{0-9}]{9}$/;
        return !!number.match(numbers);
    };

}(window.ajila.forms.joeltschopp.component.telephone));