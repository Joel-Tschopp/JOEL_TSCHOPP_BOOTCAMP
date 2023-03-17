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
     * Solution to autocomplete AHV number.
     */
    context.formatAhvNumber = function (ahvTextbox) {
        // contains the key the user pressed
        var key;
        // contains the old AHV-nr which validated correctly
        var oldNr = "";

        // Tests if a string contains only numbers and dots
        function containsOnlyNumbers(str) {
            return /^[\.0-9]*$/.test(str);
        }

        // Tests if a string is a correct AHV-nr
        function isPossibleAHVNr(str) {
            return /756[.]\d{4}[.]\d{4}[.]\d{2}$/.test(str);
        }

        // get the amount of dots in string
        function getDotCount(str) {
            return str.split(".").length - 1;
        }

        // when the user presses a key, the value of the key get written into key var
        $("." + ahvTextbox.name).find("input").keydown(function (event) {
            key = event.key;
        });

        // after every key press this event get called. Value contains value from the Input. This logic is on this event because the keydown was to slow.
        $("." + ahvTextbox.name).find("input").on("input", function () {
            // Checking if the entered key is a single number
            if (key <= 9 && key >= 0) {
                // Write a dot after the correct length of the string is reached.
                if (this.value.length == 3 || this.value.length == 8 || this.value.length == 13 && getDotCount(this.value) <= 3)
                    this.value = this.value + ".";
                else if (this.value.length > 16)
                    this.value = this.value.substring(0, 16);
            } else {
                // When it's not a single number it get checked if the clicked key is backspace or delete. Because they have different treatment.
                if (key != "Backspace" && key != "Delete") {
                    // Checks if user pasted a string that contains only numbers. Single tapped letter keys get validated here too.
                    if (containsOnlyNumbers(this.value) == false)
                        this.value = oldNr;
                    else {
                        this.value = this.value.substring(0, 16);
                        // Check if there are already 3 dots
                        if (getDotCount(this.value) > 3)
                            this.value = oldNr;
                    }
                }
            }
            oldNr = this.value;
        });

        // Event fires when user leaves the Input
        $("." + ahvTextbox.name).find("input").focusout(function () {
            if (isPossibleAHVNr(oldNr) == true)
                console.log(oldNr + " is a correct AHV-nr");
            else
                console.log(oldNr + " is not a correct AHV-nr");
        })
    }
}(window.ajila.forms.joeltschopp.common));

