package com.ajila.forms.joeltschopp.internal.model;

/**
 * Collection of parameters to identify the data in the payload by type.
 *
 * @author jtschopp
 * @author pschmidiger
 */
public enum Payload {
    FORMDATA("formdata"), DOCUMENT_ID("documentId");

    private String name;

    Payload(String name) {
        this.name = name;
    }

    /**
     * Get the name.
     *
     * @return Name as {@link String}
     */
    public String getName() {
        return this.name;
    }
}