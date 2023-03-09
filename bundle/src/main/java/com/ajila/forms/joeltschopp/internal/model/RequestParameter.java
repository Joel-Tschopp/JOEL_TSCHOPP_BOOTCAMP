package com.ajila.forms.joeltschopp.internal.model;


/**
 * Collection of various request parameters.
 *
 * @author jtschopp
  * @author pschmidiger
 */
public enum RequestParameter {
    /**
     * The parameter which identifies the type of load service (see {@link FormLoadType} for possible values).
     */
    TYPE("type"),

    /**
     * The parameter which identifies a record from the temp box.
     */
    IDENTIFICATION("identification"),

    /**
     * Parameter which is used for the AEM prefilling.
     */
    DATA_REF("dataRef");

    private String name;

    RequestParameter(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }
}
