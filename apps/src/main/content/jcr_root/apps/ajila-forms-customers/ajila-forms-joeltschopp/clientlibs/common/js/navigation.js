window.ajila.forms.joeltschopp.common.navigation = window.ajila.forms.joeltschopp.common.navigation || {};

/**
 * This file contains all generic navigation features.
 *
 * @protected Functionality extensions or changes should be made in the clientlibs/forms folder.
 * @file   This files defines the navigation.js class.
 * @author jtschopp
  * @author pschmidiger
  * @since  20200903
 */
(function (context) {
    context.navigationErrorPanel = null;

    /**
     * Navigates to the next wizard step (ensuring validation and focus at top).
     *
     * @name nextStep Navigation to next step.
     * @param button Next Button.
     * @param navigationErrorPanel The panel, which shows the error.
     * @memberOf ajila.forms.joeltschopp.common.navigation
     */
    context.nextStep = function (button, navigationErrorPanel) {
        if (navigationErrorPanel != null) {
            navigationErrorPanel.visible = false;
        }

        var container = button.panel;

        if (ajila.forms.joeltschopp.common.validation.validateStep(container)) {
            ajila.forms.joeltschopp.common.step.executeLeaveScript(guideBridge.resolveNode(container.navigationContext.currentItem.somExpression));
            guideBridge.setFocus(container.somExpression, 'nextItem');
            window.scrollTo(0, 0);
            ajila.forms.joeltschopp.common.step.executeEnterScript(guideBridge.resolveNode(container.navigationContext.currentItem.somExpression));
        }
    };

    /**
     * Submit the form asynchronous and ensure that the existing terms and conditions are displayed before submission.
     * In case of success the form will be redirect to the thankYou page.
     * In case of error the form will not submitted and an error panel will show on the form.
     *
     * @name submit Submit
     * @param navigationErrorPanel The panel, which shows the error.
     * @param tnc The terms and conditions panel.
     * @memberOf ajila.forms.joeltschopp.common.navigation
     */
    context.submit = function (navigationErrorPanel, tnc) {
        if (navigationErrorPanel != null) {
            navigationErrorPanel.visible = false;
        }
        this.navigationErrorPanel = navigationErrorPanel;
        var that = this;
        ajila.forms.control.termsandconditions.reqisterCallback(function () {
            that.submitInternal(navigationErrorPanel);
        });
        if (tnc && !tnc.value) {
            tnc.visible = 'true';
        } else {
            this.submitInternal(navigationErrorPanel);
        }
    };

    /**
     * Do the internal submit logic.
     *
     * @name submitInternal Internal submit
     * @param navigationErrorPanel The panel, which shows the error.
     * @memberOf ajila.forms.joeltschopp.common.navigation
     */
    context.submitInternal = function (navigationErrorPanel) {
        if (navigationErrorPanel == null) return;
        guideBridge.registerConfig({"useAjax": true});
        guideBridge.submit({
                               validate: true,
                               error: function (guideResultObject) {
                                   context.displaySubmitErrorMessage(navigationErrorPanel, 'joeltschopp-common-unexpected-error-body');
                               },
                               success: function (guideResultObject) {
                                   if ('error' === guideResultObject.data.status) {
                                       context.displaySubmitErrorMessage(navigationErrorPanel, guideResultObject.data.messageBody);
                                   } else {
                                       window.location.href = JSON.parse(guideResultObject.data.afSuccessPayload).thankYouContent;
                                   }
                               }
                           });
    };

    /**
     * Displays the SubmitErrorMessage.
     *
     * @name displaySubmitErrorMessage Display submit error message.
     * @param panel Error Message panel.
     * @param messageKey the Error Message which is used in paragraph.
     * @memberOf ajila.forms.joeltschopp.common.navigation
     */
    context.displaySubmitErrorMessage = function (panel, messageKey) {
        var message = Granite.I18n.get(messageKey) || Granite.I18n.get('joeltschopp-common-unexpected-error-body');
        var $jqueryElement = $("#" + panel.id);
        $jqueryElement.attr('role', 'alert');
        $jqueryElement.find('p').text(message);
        panel.visible = true;
    };

    /**
     * Navigates to the first element of the inserted panel.
     *
     * @name forceFocus force focus.
     * @param prevPanel The panel before the inserted one.
     * @param newPanel The inserted panel.
     * @memberOf ajila.forms.joeltschopp.common.navigation
     */
    context.forceFocus = function (prevPanel, newPanel) {
        if (ajila.forms.joeltschopp.common.validation.validatePanel(prevPanel)) {
            $('#' + newPanel.id).find('input,textarea,select,button').first().focus();
        }
    };

    /**
     * Add a new panel instance.
     * Workaround for misbehaving rule editor when cascading repeatable panels are present.
     *
     * @name addInstance Add instance to repatable panel.
     * @param panel Panel to create new instance of.
     * @memberOf ajila.forms.joeltschopp.common.navigation
     */
    context.addInstance = function (panel) {
        panel.instanceManager.addInstance();
        var prevPanel = panel.instanceManager.instances[panel.instanceManager.instances.length - 2];
        var newPanel = panel.instanceManager.instances[panel.instanceManager.instances.length - 1];
        ajila.forms.joeltschopp.common.navigation.forceFocus(prevPanel, newPanel);
    };

    /**
     * Removes the instance associated with the button.
     * Implementation in JavaScript as rule editor logic did not work properly.
     *
     * @name removeInstance Remove instance to repeatable panel.
     * @param btnRemove Remove button
     * @memberOf ajila.forms.joeltschopp.common.navigation
     */
    context.removeInstance = function (btnRemove) {
        var index = btnRemove.parent.parent.instanceIndex;
        btnRemove.parent.parent.instanceManager.removeInstance(index);
    };
}(window.ajila.forms.joeltschopp.common.navigation));