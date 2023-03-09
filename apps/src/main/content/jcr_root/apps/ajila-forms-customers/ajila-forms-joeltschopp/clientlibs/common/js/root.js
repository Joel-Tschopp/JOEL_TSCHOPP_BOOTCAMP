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
        $('title').each(function(i, obj){obj.text += ' - Ajila Forms joeltschopp'});

        ajila.forms.joeltschopp.common.progressbar.initProgressbar();
        ajila.forms.joeltschopp.common.accessibility.initAccessibility();
    };
}(window.ajila.forms.joeltschopp.common));