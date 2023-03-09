window.ajila.forms.joeltschopp.common.progressbar = window.ajila.forms.joeltschopp.common.progressbar || {};


/**
 * This file contains all progressbar features.
 *
 * The functionality is used via the "wizard" panel layout.
 *
 * @protected Functionality extensions or changes should be made in the clientlibs/forms folder.
 * @file   This files defines the progressbar.js class.
 * @author jtschopp
 * @author nsimmen
 * @since  20200903
 */
(function (context) {

    var progressbar;
    var elementlist = [];
    var ignoreFirstScreenReaderOutput;

    /**
     * Initializes progressbar functionality.
     */
    context.initProgressbar = function () {
        progressbar = $('#ajila-progressbar');
        ignoreFirstScreenReaderOutput = false;
        observeProgress();
    };

    /**
     * Evaluates the current progressbar state.
     * @private
     */
    evaluateProgressbarState = function () {
        evaluateValidSteps();
        if (guideBridge.resolveNode('guide[0].guide1[0].guideRootPanel[0]').options.jsonModel['jcr:path'].includes("ajila-forms-joeltschopp/confirmation")) {
            progressbar.addClass("ajila-progressbar-completed");
            setProgressbarState(100);
        } else {
            var stepPercentage = Math.round(100 / elementlist.length);
            var newValue = getActiveRootItemIndex() * stepPercentage;
            setProgressbarState(newValue);
        }
    };

    /**
     * Sets the progressbar state.
     * @param value which ranges from 0 to 100.
     * @private
     */
    setProgressbarState = function (value) {
        var valuePercent = value.toString().concat("%");
        progressbar.width(valuePercent).attr('aria-valuenow', value);
        $(".progress-text p")[0].innerHTML = progressbar.attr('data-progressbar-text').format(value);
        if (ignoreFirstScreenReaderOutput || value == 100) {
            srSpeak(progressbar.attr('data-progressbar-aria-text').format(value), "polite");
        }
        ignoreFirstScreenReaderOutput = true;
    };

    /**
     * Gets the index of the current active panel in the elementlist.
     * @returns {number} which represents the index.
     * @private
     */
    getActiveRootItemIndex = function () {
        for (var i = 0; i < elementlist.length; i++) {
            if ($(elementlist[i]).hasClass("active")) {
                return i;
            }
        }
        return 0;
    };

    /**
     * Finds all relevant tabpanels in the root panel.
     * @private
     */
    evaluateValidSteps = function () {
        elementlist = [];
        var children = $('.PanelContainer > div').find("[role='tabpanel']");
        for (var i = 0; i < children.length; i++) {
            if (!$(children[i]).hasClass("hidden")) {
                elementlist.push(children[i]);
            }
        }
    };

    /**
     * Observes the progress in the adaptive form.
     * @private
     */
    observeProgress = function () {
        var config = {
            attributes: true,
            attributeFilter: ['class']
        };
        var observer = new MutationObserver(function (mutationsList) {
            evaluateProgressbarState();
        });
        $('.PanelContainer > div').find("[role='tabpanel']").each(function () {
            observer.observe(this, config);
        });
    };

    /**
     * Triggers screen reader output.
     * @param text which will be read.
     * @param priority in which the screen reader reads the message.
     * @private
     */
    srSpeak = function (text, priority) {
        var el = document.createElement("div");
        var id = "speak-" + Date.now();
        el.setAttribute("id", id);
        el.setAttribute("aria-live", priority || "polite");
        el.classList.add("sr-only");
        document.body.appendChild(el);

        window.setTimeout(function () {
            document.getElementById(id).innerHTML = text;
        }, 100);

        window.setTimeout(function () {
            document.body.removeChild(document.getElementById(id));
        }, 1000);
    };
}(window.ajila.forms.joeltschopp.common.progressbar));