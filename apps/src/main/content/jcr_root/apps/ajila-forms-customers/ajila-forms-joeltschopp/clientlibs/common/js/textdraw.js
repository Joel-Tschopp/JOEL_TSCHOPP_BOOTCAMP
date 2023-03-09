window.ajila.forms.joeltschopp.common.textdraw = window.ajila.forms.joeltschopp.common.textdraw || {};

/**
 * This file contains textdraw replacement features.
 *
 * @protected Functionality extensions or changes should be made in the clientlibs/forms folder.
 * @file   This files defines the textdraw.js class.
 * @author jtschopp
 * @author rwegier
 * @since  20200903
 */
(function (context) {
    /**
     * Replaces placeholders contained in static TextDraw elements with the value of the element s value referenced by its somExpression.
     *
     * 1. Simple placeholder sample: ${guide[0].guide1[0].guideRootPanel[0].step_1[0].fldField[0]}
     *    Method call: replacePlaceholders(this) --> this is the static TextDraw element
     * 2. Placeholder sample with indices: ${guide[0].guide1[0].guideRootPanel[0].step_1[0].pnlPanel1[index0].pnlPanel2[index1].fldField[0]}
     *    Method call: replacePlaceholders(this,this.parent.parent.instanceIndex,this.parent.instanceIndex)
     * 3. Link placeholder: ${linkurl:guide[0].guide1[0].guideRootPanel[0].step_1[0].pnlPanel1[0].fldField[0]|linktext:hier}
     *    Method call: replacePlaceholders(this)
     *
     * @param textDraw Static TextDraw element
     * @param {...string} index - Optional indices can be provided
     */
    context.replacePlaceholders = function (textDraw, index) {
        var paragraphs = $('#' + textDraw.id + ' p');
        var originalArguments = arguments;

        // Iterate through HTML paragraphs
        $.each(paragraphs, function (pIndex, paragraph) {
            var pText = paragraph.innerHTML;

            // Find paragraphs with placeholders
            if (pText && pText.indexOf('${') != -1 && pText.indexOf('}') != -1) {
                var placeholders = pText.split('}');

                $.each(placeholders, function (phIndex, placeholder) {
                    // Find somExpression
                    if (placeholder.indexOf('${') != -1) {
                        var placeholderContent = placeholder.substring(placeholder.indexOf('${') + 2);

                        if (originalArguments.length > 1) {
                            for (var i = 1; i <= originalArguments.length; i++) {
                                placeholderContent = placeholderContent.replace('index' + (i - 1), originalArguments[i]);
                            }
                        }

                        // Link placeholder
                        if (isLinkPlaceholder(placeholderContent)) {
                            pText = processLinkPlaceholder(pText, placeholderContent);
                        }
                        // Regular placeholder
                        else {
                            var valueContainer = guideBridge.resolveNode(placeholderContent);

                            // Replace placeholder with value
                            if (valueContainer) {
                                var value = valueContainer.value;
                                if(value == null) {
                                    value = '';
                                }
                                pText = pText.replace('${' + placeholderContent + '}', value);
                            }
                        }
                    }
                    paragraph.innerHTML = pText;
                });
            }
        });
    };

    /**
     * Checks whether the placeholder content represents a link placeholder.
     * @param placeholderContent Placeholder content
     * @returns {boolean}
     * @private
     */
    isLinkPlaceholder = function (placeholderContent) {
        return (placeholderContent.indexOf('linkurl') != -1) && (placeholderContent.indexOf('linktext') != -1)
    };

    /**
     * Replaces a link placeholder with the generated HTML hyperlink.
     * @param text Text
     * @param placeholderText Link placeholder
     * @private
     */
    processLinkPlaceholder = function (text, placeholderText) {
        var placeholderValues = placeholderText.split('|');
        var somExpression = placeholderValues[0].replace('linkurl:', '');
        var linkText = placeholderValues[1].replace('linktext:', '');
        var url = '';
        var urlContainer = guideBridge.resolveNode(somExpression);

        if (urlContainer) {
            url = urlContainer.value;
        }

        return text.replace('${linkurl:' + somExpression + '|linktext:' + linkText + '}', '<a href="' + url + '" target="_blank">' + linkText + '</a>');
    };
}(window.ajila.forms.joeltschopp.common.textdraw));