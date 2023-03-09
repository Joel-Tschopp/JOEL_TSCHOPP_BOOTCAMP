window.ajila.forms.joeltschopp.common.prototype = window.ajila.forms.joeltschopp.common.prototype || {};
window.ajila.forms.joeltschopp.common.prototype.extension = window.ajila.forms.joeltschopp.common.prototype.extension || {};


/**
 * This file contains all prototype extensions features.
 *
 * Not all JavaScript functions are offered over browser boundaries. Missing functionalities are provided in this JavaScript object.
 *
 * @protected Functionality extensions or changes should be made in the clientlibs/forms folder.
 * @file   This files defines the prototype-extension.js class.
 * @author jtschopp
 * @author nsimmen
 * @since  20200903
 */
(function (context) {
    /**
     * Imitates the functionality of java String.format().
     * @returns {String} The replaced placeholders.
     */
    if (!String.prototype.format) {
        String.prototype.format = function () {
            var a = this;
            for (var k in arguments) {
                a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
            }
            return a;
        }
    }

    /**
     * Adds includes() functionality in IE.
     * @returns {String} The string which needs to be checked.
     */
    if (!String.prototype.includes) {
        String.prototype.includes = function (str) {
            return this.indexOf(str) !== -1;
        }
    }

    /**
     * Adds includes() functionality in IE.
     * @returns {Array} The array which needs to be checked.
     */
    if (!Array.prototype.includes) {
        Array.prototype.includes = function (str) {
            return this.indexOf(str) !== -1;
        }
    }
}(window.ajila.forms.joeltschopp.common.prototype.extension));