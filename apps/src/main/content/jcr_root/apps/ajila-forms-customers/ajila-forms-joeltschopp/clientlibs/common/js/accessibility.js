window.ajila.forms.joeltschopp.common.accessibility = window.ajila.forms.joeltschopp.common.accessibility || {};

/**
 * This file contains all generic accessibility features.
 *
 * WCAG 2.0 AA is the standard for accessibility in Switzerland.AEM does not fully support this standard. Accordingly, there are changes to the components themselves
 * and the functions are provided at runtime by this JavaScript object. For more information see https://access-for-all.ch/en/.
 *
 * @protected Functionality extensions or changes should be made in the clientlibs/forms folder.
 * @file   This files defines the accessibility.js class.
 * @author jtschopp
 * @author pschmidiger
 * @since  20200903
 */
(function (context) {
    var self = {};

    /**
     * Initialize all accessibility relevant features.
     */
    context.initAccessibility = function () {
        var context = this;
        self.observeMandatoryAttributes();
        self.observeRepeatableElements();
        $(document).ready(function () {
            context.setAlertRoleOnInfoboxes();
        });
    };

    /**
     * If a short-description is available, the function adds the aria-describedby attribute to the field with the reference to the short-description id.
     *
     * @param field The dom node of the field (be aware that a jQuery object is not allowed here).
     */
    context.initializeAriaDescribedBy = function (field) {
        var $field = $(field);
        var shortDescriptionId = $field.attr('id').replace('widget', 'guideFieldShortDescription');
        if ($('#' + shortDescriptionId).length) {
            $field.attr('aria-describedby', shortDescriptionId);
        }
    };

    /**
     * Observe aria-invalid attribute and switch the aria-describedby between short-description (aria-invalid = false or missing) and error (aria-invalid = true).
     *
     * @param field The dom node of the field (be aware that a jQuery object is not allowed here).
     */
    context.observeAriaInvalid = function (field) {
        var config = {
            attributes: true,
            attributeFilter: ['aria-invalid']
        };
        var observer = new MutationObserver(function (mutationsList) {
            mutationsList.forEach(function (mutation) {
                var $control = $(mutation.target);
                var ariaInvalid = $control.attr(mutation.attributeName);
                var shortDescriptionId = $control.attr('id').replace('widget', 'guideFieldShortDescription');
                var errorId = $control.attr('id').replace('widget', 'guideFieldError');
                $control.removeAttr('aria-describedby');
                if ('true' == ariaInvalid) {
                    if ($('#' + errorId).length) {
                        $control.attr('aria-describedby', errorId);
                    }
                } else {
                    if ($('#' + shortDescriptionId).length) {
                        $control.attr('aria-describedby', shortDescriptionId);
                    }
                }
            });
        });
        observer.observe(field, config);
    };

    /**
     * Extend the aria-label of the input field with the panel title. Input fields directly under the root panel will be ignored. If a dynamic header title (.repeatcontainerheadertitle) is available, the logic takes this title and observe the
     * changes on this title.
     *
     * @param field The field where you want to extend the aria-label.
     */
    context.extendAriaLabel = function (field) {
        new MutationObserver(function (mutationsList, observer) {
            observer.disconnect();
            mutationsList.forEach(function (mutation) {
                var $element = $(mutation.target);
                var dataAriaLabelOrigin = $element.attr("aria-label");
                $element.attr("data-aria-label-origin", dataAriaLabelOrigin);
                var dataAriaLabel = $element.attr("aria-label");

                if ($element.attr("data-suppress-panel-title") == undefined) {
                    var $dynamicHeaderTitle = $element.closest('[data-repeatable]').find('.repeatcontainerheadertitle');
                    if ($dynamicHeaderTitle && $dynamicHeaderTitle.text() != '') {
                        dataAriaLabel = $dynamicHeaderTitle.text().concat(" - ").concat($element.attr("aria-label"));

                        // observe changes of the dynamic title and update the aria-label
                        new MutationObserver(function (mutationsList, observer) {
                            dataAriaLabel = mutationsList[0].target.textContent.concat(" - ").concat(dataAriaLabelOrigin);
                            $element.attr("data-aria-label", dataAriaLabel);
                            $element.attr("aria-label", dataAriaLabel);
                        }).observe($dynamicHeaderTitle.get(0), {childList: true});
                    } else {
                        var $panel = $element.closest('[data-panel]').not('[data-is-root]');
                        if ($panel && $panel.attr("data-panel")) {
                            dataAriaLabel = $panel.attr("data-panel").concat(" - ").concat($element.attr("aria-label"));
                        }
                    }
                }
                $element.attr("data-aria-label", dataAriaLabel);
                $element.attr("aria-label", dataAriaLabel);

                if (!$dynamicHeaderTitle || $dynamicHeaderTitle.text() == '') {
                    $element.closest('.repeatcontainer').each(function (index, row) {
                        self.updateRepeatableAriaLabel($(row), $element.attr('id'));
                    });
                }
            });
        }).observe(field, {attributes: true, attributeFilter: ['aria-label']});
    };

    /**
     * Observes the data-mandatory attribute and synchronize them to the aria-required attribute. AEM does not synchronize this attribute, while you change the field mandatory property at runtime via guideBridge.
     * @private
     */
    self.observeMandatoryAttributes = function () {
        var observer = new MutationObserver(function (mutationsList) {
            mutationsList.forEach(function (mutation) {
                var $control = $(mutation.target);
                var dataMandatory = $control.attr(mutation.attributeName);
                var ariaRequired = (dataMandatory == undefined ? false : dataMandatory);
                $control.find('input[type!="date"],textarea,select').attr('aria-required', ariaRequired);
                if (ariaRequired) {
                    $control.find('input[type="date"]').attr('required', '');
                } else {
                    $control.find('input[type="date"]').removeAttr('required');
                }
            });
        });
        $('.guideFieldNode').has('input,textarea,select').each(function () {
            observer.observe(this, {attributes: true, attributeFilter: ['data-mandatory']});
        });
    };

    /**
     * Observes repeating panel changes and sets aria-label indexation accordingly.
     * @private
     */
    self.observeRepeatableElements = function () {
        var observer = new MutationObserver(function (mutationsList) {
            mutationsList.forEach(function (mutation) {
                self.updateRepeatableAriaLabel($(mutation.target));
            });
        });
        $('.repeatcontainer > .row').each(function () {
            observer.observe(this, {childList: true});
        });
    };

    /**
     * Update the initial repeatable aria label.
     * @param $row The row, where the field is part of.
     * @param id The optional id to be sure, that only this id will be updated
     * @private
     */
    self.updateRepeatableAriaLabel = function ($row, id) {
        var index = 1;
        $row.find("[data-repeatable]").each(function (indexRepeatable, repeatable) {
            $repeatable = $(repeatable);
            // check if the data-repeatable is not in a nested .repeatcontainer child and directly connected to this row
            if ($row.closest('.repeatcontainer').attr('id') == $repeatable.closest('.repeatcontainer').attr('id')) {
                $repeatable.find('input,textarea,select,button').each(function (indexElement, element) {
                    var $element = $(element);
                    if (id == undefined || id == $element.attr('id')) {
                        var $dynamicHeaderTitle = $element.closest('[data-repeatable]').find('.repeatcontainerheadertitle');

                        if ($element.attr("data-aria-label") && (!$dynamicHeaderTitle || $dynamicHeaderTitle.text() == '')) {
                            $element.attr("aria-label", index + ". ".concat($element.attr("data-aria-label")));
                        }
                    }
                });
                index++;
            }
        });
    }

    /**
     * Sets alert role on infoboxes & triggers ScreenReader for infoboxes on the first form page.
     */
    context.setAlertRoleOnInfoboxes = function () {
        $('.infobox').parent().find('div > div').attr('role', 'alert');

        $("[role='tabpanel'][class='active']").find('.infobox').hide();
        $("[role='tabpanel'][class='active']").find('.infobox').show();
    };

    /**
     * Click event on click and keypress enter
     * @param event which is thrown.
     * @returns {boolean} validity of the keypress or click.
     */
    context.diverseAccess = function (event) {
        if (event.type === 'click') {
            return true;
        } else if (event.type === 'keypress') {
            var code = event.charCode || event.keyCode;
            if (code === 13) {
                return true;
            }
        } else {
            return false;
        }
    };
}(window.ajila.forms.joeltschopp.common.accessibility));