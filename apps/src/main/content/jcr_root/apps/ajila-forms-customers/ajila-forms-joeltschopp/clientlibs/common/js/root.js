window.ajila = window.ajila || {};
window.ajila.forms = window.ajila.forms || {};
window.ajila.forms.joeltschopp = window.ajila.forms.joeltschopp || {};
window.ajila.forms.joeltschopp.common = window.ajila.forms.joeltschopp.common || {};


/**
 * This file contains the initialize function.
 *
 *
 * @protected Functionality extensions or changes should be made in the clientlibs/forms folder.
 * @file   This files defines the root.js class.
 * @author jtschopp
 * @author pschmidiger
 * @since  20200903
 */
(function (context) {
    /**
     * Loads the header values and the backlink url from the submission meta data info.
     */
    context.initialize = function () {
        $(document).ready(function () {
            Granite.I18n.getDictionary();
            ajila.forms.joeltschopp.common.accessibility.setAlertRoleOnInfoboxes();
        });
        $('title').each(function (i, obj) {
            obj.text += ' - Ajila Forms joeltschopp'
        });

        ajila.forms.joeltschopp.common.progressbar.initProgressbar();
        ajila.forms.joeltschopp.common.accessibility.initAccessibility();
    };

    /**
     * This function gets the amount of specific char in a string.
     *
     * Returns the amount of (param)searchValue in (param)value.
     */
    function getValueCount(value, searchValue) {
        return value.split(searchValue).length - 1;
    }

    /**
     * This function handles when the user paste a string into the Input.
     *
     * Checks if (param)key is Backspace or Delete. Cut the (param)value to the (param)maxLength.
     * Check if user overstepped the (param)amount of the (param)searchValue in (param)value.
     * If yes (param)oldNr is returned. Else (param)value is returned.
     */
    function handlePaste(value, maxLength, amount, oldNr, key, searchValue) {
        if (key != "Backspace" && key != "Delete") {
            value = value.substring(0, maxLength)
            if (getValueCount(value, searchValue) > amount)
                return oldNr;
        }
        return value
    }

    /**
     * This function tests a Regex Pattern.
     *
     * Returns boolean from test if (param)value matches the pattern of (param)regex.
     */
    function checkRegex(regex, value) {
        return regex.test(value);
    }

    /**
     * This function validates the final Input
     *
     * Writes into console if the (param)value matches the final (param)regex pattern.
     */
    function validate(regex, value) {
        if (checkRegex(regex, value) == true)
            console.log(value + " is correct");
        else
            console.log(value + " is not correct");
    }

    /**
     * This function writes the helping char to support the User while tipping.
     *
     * Check if (param)searchValue in (param)value is smaller than (param)amount.
     * If yes the (param)value's length get checked if it is as long as the element.
     * If that is the case (param)value gets added the (param)searchValue.
     * Next the (param)value gets cut to the (param)maxLength and then returned.
     */
    function setHelpingChar(value, element, searchValue, amount, maxLength) {
        if (getValueCount(value, searchValue) < amount) {
            if (value.length == element)
                value = value + searchValue;
        }
        value = value.substring(0, maxLength);
        return value;
    }

    /**
     * This function decide if the User pasted the value or tipped.
     *
     * Check if (param)key matches the (param)inputRegex. If yes the (param)addCharArray gets looped.
     * For every (var)element the function setHelpingChar gets called.
     * If not the function handlePaste gets called. In the end the new filled (param)value gets returned.
     */
    function handleUserInput(value, searchValue, amount, maxLength, inputRegex, key, addCharArray, oldNr) {
        if (checkRegex(inputRegex, key))
            addCharArray.forEach(function (element) { value = setHelpingChar(value, element, searchValue, amount, maxLength) });
        else
            value = handlePaste(value, maxLength, amount, oldNr, key, searchValue)
        return value;
    }


    /**
     * Solution to autocomplete AHV number.
     */
    context.formatAhvNumber = function (ahvTextbox) {
        var searchValue = ".";
        var amount = 3;
        var maxLength = 16;
        var finalValidationRegex = /756[.]\d{4}[.]\d{4}[.]\d{2}$/;
        var inputRegex = /[0-9]/;
        var addCharArray = [3, 8, 13];

        var key = "";
        var oldNr = "";

        // when the user presses a key, the value of the key get written into key var
        $("." + ahvTextbox.name).find("input").keydown(function (event) {
            key = event.key;
        });

        // after every key press this event get called. Value contains value from the Input. This logic is on this event because the keydown was to slow.
        $("." + ahvTextbox.name).find("input").on("input", function () {
            this.value = handleUserInput(this.value, searchValue, amount, maxLength, inputRegex, key, addCharArray, oldNr);
            if (checkRegex(/^[\.0-9]*$/, this.value) == false)
                this.value = oldNr;
            oldNr = this.value;
        });

        // Event fires when user leaves the Input
        $("." + ahvTextbox.name).find("input").focusout(function () {
            validate(finalValidationRegex, oldNr);
        })
    }

    /**
     * Solution to autocomplete IBAN number.
     */
    context.formatIBAN = function (ibanTextbox) {
        var searchValue = " ";
        var amount = 5;
        var maxLength = 26;
        var finalValidationRegex = /CH[0-9]{2}(?:[ ]?[0-9]{4}){4}(?:[ ]?[0-9]{1,2})?$/;
        var inputRegex = /[0-9]/;
        var addCharArray = [4, 9, 14, 19, 24];

        var key = "";
        var oldNr = "";

        // when the user presses a key, the value of the key get written into key var
        $("." + ibanTextbox.name).find("input").keydown(function (event) {
            key = event.key;
        });

        // after every key press this event get called. Value contains value from the Input. This logic is on this event because the keydown was to slow.
        $("." + ibanTextbox.name).find("input").on("input", function () {
            if (this.value.length > 2) {
                this.value = handleUserInput(this.value, searchValue, amount, maxLength, inputRegex, key, addCharArray, oldNr);
            } else
                this.value = this.value.toUpperCase();
            oldNr = this.value;
        });

        // Event fires when user leaves the Input
        $("." + ibanTextbox.name).find("input").focusout(function () {
            validate(finalValidationRegex, oldNr.replaceAll(' ', ''));
        })
    }

    /**
     * Solution to autocomplete Telephone number.
     */
    context.formatPhone = function (phoneTextbox) {
        var searchValue = " ";
        var amount = 4;
        var maxLength = 16;
        var finalValidationRegex = /(\b(0041)|\B\+41)(\s?\(0\))?(\s)?[1-9]{2}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/;
        var inputRegex = /[0-9 +]/;
        var addCharArray = [3, 6, 10, 13];

        var maxLengthPlusOne = maxLength + 1;
        var key = "";
        var oldNr = "";

        // when the user presses a key, the value of the key get written into key var
        $("." + phoneTextbox.name).find("input").keydown(function (event) {
            key = event.key;
        });

        // after every key press this event get called. Value contains value from the Input. This logic is on this event because the keydown was to slow.
        $("." + phoneTextbox.name).find("input").on("input", function () {
            if (this.value == "00" && maxLength < maxLengthPlusOne) {
                addCharArray = addCharArray.map(num => num + 1);
                maxLength = maxLengthPlusOne;
            } else if (this.value == "+" && maxLength == maxLengthPlusOne) {
                addCharArray = addCharArray.map(num => num - 1);
                maxLength = maxLength - 1;
            }
            this.value = handleUserInput(this.value, searchValue, amount, maxLength, inputRegex, key, addCharArray, oldNr);
            if (checkRegex(/^[0-9 +]*$/, this.value) == false)
                this.value = oldNr;
            oldNr = this.value;
        });

        // Event fires when user leaves the Input
        $("." + phoneTextbox.name).find("input").focusout(function () {
            validate(finalValidationRegex, oldNr.replaceAll(' ', ''));
        })
    }
}(window.ajila.forms.joeltschopp.common));

