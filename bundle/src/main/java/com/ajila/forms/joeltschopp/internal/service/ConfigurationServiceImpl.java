package com.ajila.forms.joeltschopp.internal.service;

import com.ajila.cloud.api.model.security.Credentials;
import com.ajila.cloud.api.service.CloudConfigurationService;
import com.ajila.forms.joeltschopp.api.service.ConfigurationService;

import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

/**
 * All configurations for the forms project will applied here and provided as an OSGi service. The related configuration is at /apps/ajila-forms-customers/ajila-forms-joeltschopp/conf.
 *
 * @author jtschopp
 * @author pschmidiger
 */
@Component(immediate = true, service = ConfigurationService.class)
@Designate(ocd = ConfigurationServiceImpl.Configuration.class)
public class ConfigurationServiceImpl implements ConfigurationService {
    private static final String DICTIONARY = "/apps/ajila-forms-customers/ajila-forms-joeltschopp/i18n/dictionary";
    private ConfigurationServiceImpl.Configuration configuration;

    @Reference
    private CloudConfigurationService cloudConfigurationService;

    @Activate
    protected void activate(ConfigurationServiceImpl.Configuration configuration) {
        this.configuration = configuration;
    }

    @Override
    public String getApplication() {
        return configuration.application();
    }

    @Override
    public String getConfirmationPage() {
        return configuration.confirmationpage();
    }

    @Override
    public String getDictionary() {
        return DICTIONARY;
    }

    @Override
    public String getOutboundUrl() {
        return configuration.outboundurl();
    }

    @Override
    public Credentials getCredentials() {
        return cloudConfigurationService.getCredentials(getApplication());
    }

    @Override
    public Integer getTimeToLive() {
        return configuration.ttl();
    }

    @ObjectClassDefinition(name = "Ajila Forms joeltschopp Configuration Service", description = "Ajila Forms joeltschopp Configuration Service")
    public @interface Configuration {
        /**
         * The name of the application.
         */
        @AttributeDefinition(
                name = "Application",
                description = "The name of the application",
                type = AttributeType.STRING
        )
        String application();

        /**
         * The relative link to the confirmation page.
         */
        @AttributeDefinition(
                name = "Confirmation Page",
                description = "The relative link to the confirmation page.",
                type = AttributeType.STRING
        )
        String confirmationpage();

        /**
         * The url on which the application is accessible from external.
         */
        @AttributeDefinition(
                name = "Outbound URL",
                description = "The url on which the application is accessible from external.",
                type = AttributeType.STRING
        )
        String outboundurl() default "http://localhost:4502";
        /**
         * The time to live in seconds.
         */
        @AttributeDefinition(
                name = "The time to live in seconds",
                description = "The time to live in seconds.",
                type = AttributeType.INTEGER
        )
        int ttl();
    }
}
