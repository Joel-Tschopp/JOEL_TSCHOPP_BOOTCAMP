package com.ajila.forms.joeltschopp.internal.model;

/**
 * The enum provides the subject and body messages as simple objects. The actual keys can be found here: /apps/ajila-forms-customers/ajila-forms-joeltschopp/i18n/dictionary.
 *
 * @author jtschopp
 * @author pschmidiger
 */
public enum ClientExceptionMessage {
    COMMUNICATION("joeltschopp-common-communication-error-body"),
    VALIDATION("joeltschopp-common-validation-error-body");

    private final String messageBody;

    ClientExceptionMessage(String messageBody) {
        this.messageBody = messageBody;
    }

    /**
     * Return the key for the body message.
     *
     * @return The key for the body message.
     */
    public String getBody() {
        return messageBody;
    }
}
