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
     * Simple Solution to autocomplete AHV number. Isn't completely working. Can't paste and it's possible to change the formatation.
     *
     context.formatAhvNumber = function (ahvTextbox) {
        var key;
        var oldNr = "";
        $("." + ahvTextbox.name).find("input").keydown(function(event){
            key = event.key;
        });

        $("." + ahvTextbox.name).find("input").on("input", function () {
            var ahvNr = this.value;
            if (key <= 9 && key >= 0) {
                if (ahvNr.length == 3) {
                    this.value = this.value + ".";
                } else if (ahvNr.length == 8) {
                    this.value = this.value + ".";
                } else if (ahvNr.length == 13) {
                    this.value = this.value + ".";
                } else if (ahvNr.length > 16) {
                    this.value = this.value.substring(0, 16);
                }
            } else {
                if (key != "Backspace" && key != "Delete") {
                    this.value = oldNr;
                }
            }
            oldNr = this.value;
        });
    }*/


    /**
     * Simple Solution to autocomplete AHV number. it's possible to change the formatation. Pasting is possible.
     *
    context.formatAhvNumber = function (ahvTextbox) {
        var key;
        var oldNr = "";

        function containsOnlyNumbers(str) {
            return /^[\.0-9]*$/.test(str);
        }

        function isPossibleAHVNr(str) {
            return /^756.[0-9]{4}.[0-9]{4}.[0-9]{2}/.test(str);
        }

        $("." + ahvTextbox.name).find("input").keydown(function (event) {
            key = event.key;
        });

        $("." + ahvTextbox.name).find("input").on("input", function () {
            if (key <= 9 && key >= 0) {
                if (this.value.length == 3 || this.value.length == 8 || this.value.length == 13) {
                    this.value = this.value + ".";
                } else if (this.value.length > 16) {
                    this.value = this.value.substring(0, 16);
                }
            } else {
                if (key != "Backspace" && key != "Delete") {
                    if (containsOnlyNumbers(this.value) == false) {
                        this.value = oldNr;
                    } else {
                        this.value = this.value.substring(0, 16);
                    }
                }
            }
            oldNr = this.value;
        });

        $("." + ahvTextbox.name).find("input").focusout(function () {
            if (isPossibleAHVNr(oldNr) == true) {
                console.log(oldNr + " is a correct AHV-nr");
            } else {
                console.log(oldNr + " is not a correct AHV-nr");
            }
        })
    }*/


    /**
     * Complex Solution to autocomplete AHV number. Checking every input
     */
    context.formatAhvNumber = function (ahvTextbox) {
        var key;
        var oldNr = "";

        function containsOnlyNumbers(str) {
            return /^[\.0-9]*$/.test(str);
        }

        function isPossibleAHVNr(str) {
            return /^756.[0-9]{4}.[0-9]{4}.[0-9]{2}/.test(str);
        }

        $("." + ahvTextbox.name).find("input").keydown(function (event) {
            key = event.key;
        });

        $("." + ahvTextbox.name).find("input").on("input", function () {
            if (key <= 9 && key >= 0) {
                if (this.value.length == 3 || this.value.length == 8 || this.value.length == 13) {
                    this.value = this.value + ".";
                } else if (this.value.length > 16) {
                    this.value = this.value.substring(0, 16);
                }
            } else {
                if (key != "Backspace" && key != "Delete") {
                    if (containsOnlyNumbers(this.value) == false) {
                        this.value = oldNr;
                    } else {
                        this.value = this.value.substring(0, 16);
                    }
                }
            }
            oldNr = this.value;
        });

        $("." + ahvTextbox.name).find("input").focusout(function () {
            if (isPossibleAHVNr(oldNr) == true) {
                console.log(oldNr + " is a correct AHV-nr");
            } else {
                console.log(oldNr + " is not a correct AHV-nr");
            }
        })
    }


}(window.ajila.forms.joeltschopp.common));

