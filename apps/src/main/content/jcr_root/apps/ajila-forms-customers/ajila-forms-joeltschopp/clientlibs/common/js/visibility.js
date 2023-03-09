window.ajila.forms.joeltschopp.common.visibility = window.ajila.forms.joeltschopp.common.visibility || {};

/**
 * This file contains visability features.
 *
 * @protected Functionality extensions or changes should be made in the clientlibs/forms folder.
 * @file   This files defines the visability.js class.
 * @author jtschopp
 * @author nsimmen
 * @since  20200903
 */
(function (context) {
    var groups;

    /***
     * Creates/adds a object to a specific group.
     * @param groupName Name of the group.
     * @param object Usually a form component.
     */
    context.addObject = function (groupName, object) {
        groups = groups || new Map();
        if (!groups.get(groupName)) {
            groups.set(groupName, [object]);
        } else {
            var existingObjects = groups.get(groupName);
            existingObjects.push(object);
            groups.set(groupName, existingObjects);
        }
    };

    /***
     * Sets the visibility of a specific group.
     * @param groupName Selects specific group.
     * @param visibility Defines the value of the visible property.
     */
    context.setGroupVisibility = function (groupName, visibility) {
        groups = groups || new Map();
        if (!groups.get(groupName)) {
            return;
        } else {
            groups.get(groupName).forEach(function (element) {
                element.visible = visibility;
            });
        }
    };

    /**
     * Reads out all group elements and shows only the element that matches the passed name.
     *
     * @param groupName The name of the group, which belong together.
     * @param name The name of the element to be displayed.
     */
    context.showByObjectName = function (groupName, name) {
        groups = groups || new Map();
        if (!groups.get(groupName)) {
            return;
        } else {
            groups.get(groupName).forEach(function (element) {
                if (element.name == name) {
                    element.visible = true;
                } else {
                    element.visible = false;
                }
            });
        }
    };

    /**
     * Handles the visible states of the provided elements when the content panel of a repeatable element has to be shown.
     * @param contentPanel Content panel
     * @param showButton Show button
     * @param hideButton Hide button
     */
    context.showRepeatContentPanel = function (contentPanel, showButton, hideButton) {
        contentPanel.visible = true;
        showButton.visible = false;
        hideButton.visible = true;
    };

    /**
     * Handles the visible states of the provided elements when the content panel of a repeatable element has to be hidden.
     * @param contentPanel Content panel
     * @param showButton Show button
     * @param hideButton Hide button
     */
    context.hideRepeatContentPanel = function (contentPanel, showButton, hideButton) {
        if (com.ajila.forms.joeltschopp.common.validation.validatePanel(contentPanel)) {
            contentPanel.visible = false;
            showButton.visible = true;
            hideButton.visible = false;
        }
    };
}(window.ajila.forms.joeltschopp.common.visibility));