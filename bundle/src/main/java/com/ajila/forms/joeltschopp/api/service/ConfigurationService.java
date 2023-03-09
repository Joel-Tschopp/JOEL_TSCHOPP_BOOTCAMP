package com.ajila.forms.joeltschopp.api.service;

import com.ajila.cloud.api.model.security.Credentials;

/**
 * Provide the all project specific configurations.
 *
 * @author jtschopp
 * @author nsimmen
 */
public interface ConfigurationService {
    /**
     * Return the name of the application.
     *
     * @return The name of the application.
     */
    String getApplication();

    /**
     * Return the relative link to the confirmation page.
     *
     * @return The relative link to the confirmation page.
     */
    String getConfirmationPage();

    /**
     * Return the common dictionary for the project.
     *
     * @return The common dictionary.
     */
    String getDictionary();

    /**
     * Return the outbound url, from which the application is accessible.
     *
     * @return The outbound url of the application.
     */
    String getOutboundUrl();

    /**
     * Create the client credentials object for the storage service.
     *
     * @return The client credentials object.
     */
    Credentials getCredentials();

    /**
     * Specifies how long the data is temporarily stored in the ajila cloud.
     *
     * @return The time to live in seconds.
     */
    Integer getTimeToLive();
}
