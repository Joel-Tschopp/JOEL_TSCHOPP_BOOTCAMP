package com.ajila.forms.joeltschopp.internal.model;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * This enum describes the different load types including their parameters and service to parse the parameter in or out of the url. The sequence is
 * <ul>
 *     <li>{@link #appendUrlParameter(Map, String...)} or {@link #appendUrlParameter(String, String...)}: use this two service to create the url with the parameters</li>
 *     <li>{@link #evaluate(SlingHttpServletRequest)}: use this method, when the url is loaded to evaluate which load type was used</li>
 *     <li>{@link #getCurrentParameterValues(SlingHttpServletRequest)}: use this method to get the current parameter values for this load type</li>
 * </ul>
 *
 * @author jtschopp
 * @author pschmidiger
 */
public enum FormLoadType {
    /**
     * This type loads existing data from the repository. Required parameters are:
     * <ul>
     *     <li>{@link RequestParameter#IDENTIFICATION}</li>
     * </ul>
     */
    DATA("data", new Parameter(RequestParameter.IDENTIFICATION.getName(), true)),
    /**
     * This type describes the pre-filling of data from the AEM Author.
     */
    DATA_REF("dataRef"),
    /**
     * This is the default type when opening an empty form without pre-filling.
     */
    INITIALIZE("initialize");

    public static final String PARAMETER_REQUIRED_MESSAGE = "Parameter ''%s'' is required.";
    private List<Parameter> parameters;
    private String name;

    FormLoadType(String name, Parameter... parameters) {
        this.name = name;

        if (parameters == null) {
            this.parameters = new ArrayList<>();
        } else {
            this.parameters = Arrays.asList(parameters);
        }
    }

    /**
     * Get the enumeration name.
     *
     * @return Enumeration name as {@link String}
     */
    public String getName() {
        return this.name;
    }

    /**
     * Get the {@link FormLoadType} based on the passed name.
     *
     * @param value Name as {@link String}
     * @return Resolved {@link FormLoadType}
     */
    public static FormLoadType getFormLoadType(String value) {
        for (FormLoadType type : values()) {
            if (type.getName().equalsIgnoreCase(value)) {
                return type;
            }
        }

        throw new IllegalArgumentException();
    }

    /**
     * Create the url for the form load type and set it into the redirectParameters.
     *
     * @param redirectParameters Set the values into the redirect parameters map.
     * @param values             Add all parameters and the optional ones with <code>null</code>.
     * @throws IllegalArgumentException If the number of values does not match the number of parameters or if an expected parameter is not set.
     */
    public void appendUrlParameter(Map<String, String> redirectParameters, String... values) throws IllegalArgumentException {
        if (parameters.size() != values.length) {
            throw new IllegalArgumentException(String.format("Expect %d value(s) for this parameters: %s", parameters.size(), Arrays.toString(parameters.toArray())));
        }
        redirectParameters.put(RequestParameter.TYPE.getName(), this.name());
        for (int i = 0; i < parameters.size(); i++) {
            Parameter parameter = parameters.get(i);
            String value = values[i];
            if (StringUtils.isNotEmpty(value)) {
                redirectParameters.put(parameter.name, value);
            } else if (parameter.required) {
                throw new IllegalArgumentException(String.format(PARAMETER_REQUIRED_MESSAGE, parameter.name));
            }
        }
    }

    /**
     * Create the url for the form load type and append it to the url..
     *
     * @param url    The url, on which the parameter will append.
     * @param values Add all parameters and the optional ones with <code>null</code>.
     * @return The modified url.
     * @throws IllegalArgumentException If the number of values does not match the number of parameters or if an expected parameter is not set.
     */
    public String appendUrlParameter(String url, String... values) throws IllegalArgumentException {
        if (parameters.size() != values.length) {
            throw new IllegalArgumentException(String.format("Expect %d value(s) for this parameters: %s", parameters.size(), Arrays.toString(parameters.toArray())));
        }
        String modifiedUrl = url.contains("?") ? url.concat("&") : url.concat("?");
        modifiedUrl = modifiedUrl.concat(String.format("%s=%s", RequestParameter.TYPE.getName(), this.name()));
        for (int i = 0; i < parameters.size(); i++) {
            Parameter parameter = parameters.get(i);
            String value = values[i];
            if (StringUtils.isNotEmpty(value)) {
                modifiedUrl = modifiedUrl.concat(String.format("&%s=%s", parameters.get(i).name, values[i]));
            } else if (parameter.required) {
                throw new IllegalArgumentException(String.format(PARAMETER_REQUIRED_MESSAGE, parameter.name));
            }
        }
        return modifiedUrl;
    }

    /**
     * Reads the parameters of the configured enum from the request and makes them available as parameter map.
     *
     * @param slingRequest The request that contains the current parameters.
     * @return The list of the found parameters with their values. Non-mandatory missing or empty parameters are not included in the list.
     * @throws IllegalArgumentException The exception is thrown if a mandatory parameter is not available on the request.
     */
    public Map<String, String> getCurrentParameterValues(SlingHttpServletRequest slingRequest) {
        Map<String, String> currentParameterValues = new HashMap<>();
        for (Parameter parameter : parameters) {
            String value = slingRequest.getParameter(parameter.name);
            if (StringUtils.isNotEmpty(value)) {
                currentParameterValues.put(parameter.name, value);
            } else if (parameter.required) {
                throw new IllegalArgumentException(String.format(PARAMETER_REQUIRED_MESSAGE, parameter.name));
            }
        }
        return currentParameterValues;
    }

    /**
     * Evaluates the correct form load typ using the URL. The procedure is as follows:
     * <ol>
     *     <li>Checks whether the parameter 'dataRef' is set and returns {@link FormLoadType#DATA_REF} if it is set</li>
     *     <li>Checks if the parameter 'type' is set and returns {@link FormLoadType#INITIALIZE} if it is not set</li>
     *     <li>Checks the value of the parameter 'type' and evaluates the correct type.</li>
     * </ol>
     *
     * @param slingRequest The request with the url that contains the information.
     * @return The evaluated form load type.
     * @throws IllegalArgumentException If the enum type does not exist.
     */
    public static FormLoadType evaluate(SlingHttpServletRequest slingRequest) {
        FormLoadType formLoadType = INITIALIZE;
        String dataRef = slingRequest.getParameter(RequestParameter.DATA_REF.getName());
        if (StringUtils.isNotEmpty(dataRef)) {
            formLoadType = FormLoadType.DATA_REF;
        } else {
            String type = slingRequest.getParameter(RequestParameter.TYPE.getName());
            if (StringUtils.isNotEmpty(type)) {
                formLoadType = FormLoadType.getFormLoadType(type);
            }
        }
        return formLoadType;
    }

    private static class Parameter {
        private final String name;
        private final boolean required;

        private Parameter(String name, boolean required) {
            this.name = name;
            this.required = required;
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj) {
                return true;
            }
            if (obj == null || getClass() != obj.getClass()) {
                return false;
            }
            Parameter parameter = (Parameter) obj;
            return name.equals(parameter.name);
        }

        @Override
        public int hashCode() {
            return name.hashCode();
        }

        @Override
        public String toString() {
            return "Parameter{"
                    + "name='" + name + '\''
                    + ", required=" + required
                    + '}';
        }
    }
}
