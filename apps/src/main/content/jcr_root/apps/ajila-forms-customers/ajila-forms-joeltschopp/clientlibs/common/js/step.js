window.ajila.forms.joeltschopp.common.step = window.ajila.forms.joeltschopp.common.step || {};

/**
 * This file contains all generic step features. It has the responsiblity to execute the step script functions.
 *
 * @protected Functionality extensions or changes should be made in the clientlibs/forms folder.
 * @file   This files defines the step.js class.
 * @author jtschopp
  * @author aamrein
  * @since  20221019
 */
(function (context) {
    var self = {};

    /**
     * Executes the panel validation script.
     *
     * @name executeValidationScript Execute the step validation script.
     * @param panel The panel, which should be validated.
     * @returns {boolean} 'true' if the validation was successfully, otherwise 'false'.
     * @memberOf ajila.forms.joeltschopp.common.step
     */
    context.executeValidationScript = function (panel) {
        return self.execute(panel, panel.jsonModel.validationScript);
    };

    /**
     * Executes the panel enter script.
     *
     * @name executeEnterScript Execute the step enter script.
     * @param panel The panel, which was entered.
     * @memberOf ajila.forms.joeltschopp.common.step
     */
    context.executeEnterScript = function (panel) {
        self.execute(panel, panel.jsonModel.enterScript);
    };

    /**
     * Executes the panel leave script.
     *
     * @name executeLeaveScript Execute the step leave script.
     * @param panel The panel, which was leaved.
     * @memberOf ajila.forms.joeltschopp.common.step
     */
    context.executeLeaveScript = function (panel) {
        self.execute(panel, panel.jsonModel.leaveScript);
    };

    /**
     * Executes the entered Step JavaScript function.
     *
     * @name execute Execute step script.
     * @param panel Step panel.
     * @param script Step JavaScript function.
     * @returns {boolean} The validation result.
     * @memberOf ajila.forms.joeltschopp.common.step
     * @private
     */
    self.execute = function (panel, script) {
        if (script && script != '' && !ajila.forms.joeltschopp.common.validation.isServerSide()) {
            try {
                if (self.containsParameters(script)) {
                    return eval(script);
                } else {
                    return eval(script)(panel);
                }
            } catch (error) {
                console.log(error);
            }
        }
        return true;
    };

    /**
     * Check if a configured validation script contains parameters.
     *
     * @name containsParameters Contains parameter.
     * @param validationScript The validation script.
     * @returns {boolean} The validation result.
     * @memberOf ajila.forms.joeltschopp.common.step
     * @private
     */
    self.containsParameters = function (validationScript) {
        return validationScript.indexOf('(') > 0;
    };

}(window.ajila.forms.joeltschopp.common.step));