window.ajila.forms.joeltschopp.common.validation = window.ajila.forms.joeltschopp.common.validation || {};


/**
 * This file contains validation features.
 *
 * @protected Functionality extensions or changes should be made in the clientlibs/forms folder.
 * @file   This files defines the validation.js class.
 * @author jtschopp
 * @author rwegier
 * @since  20200903
 */
(function (context) {
    /**
     * Executes the validation on a panel.
     *
     * @name validatePanel Validate panel.
     * @param panel
     * @returns {*|PlatformMismatchEvent|boolean|ActiveX.IXMLDOMParseError|void}
     * @memberOf ajila.forms.joeltschopp.common.validation
     */
    context.validatePanel = function (panel) {
        var errorList = [];
        var validationResult = guideBridge.validate(errorList, panel.somExpression);
        return validationResult;
    };

    /**
     * Validates the current shown wizard panel.
     *
     * @name validateStep Validate step panel.
     * @param container The guide container
     * @returns Validation result
     * @memberOf ajila.forms.joeltschopp.common.validation
     */
    context.validateStep = function (container) {
        var errorList = [];
        var validationResult = guideBridge.validate(errorList, container.navigationContext.currentItem.somExpression);
        return validationResult ? ajila.forms.joeltschopp.common.step.executeValidationScript(guideBridge.resolveNode(container.navigationContext.currentItem.somExpression)) : validationResult;
    };

    /**
     *  Checks if the validation is called from server or from host.
     *
     * @name isServerSide Check if Server side
     * @returns {boolean} true if called from server.
     * @memberOf ajila.forms.joeltschopp.common.validation
     */
    context.isServerSide = function () {
        return !location.host;
    };
}(window.ajila.forms.joeltschopp.common.validation));