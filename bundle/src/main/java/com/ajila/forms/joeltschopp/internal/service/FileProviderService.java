package com.ajila.forms.joeltschopp.internal.service;

import com.ajila.cloud.api.model.security.Credentials;
import com.ajila.cloud.platform.api.service.CloudFileProvider;
import com.ajila.cloud.storage.api.repository.FileRepository;
import com.ajila.forms.fileupload.api.service.FileProvider;
import com.ajila.forms.fileupload.api.service.FileProviderRegistrationService;

import com.ajila.forms.joeltschopp.api.service.ConfigurationService;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.ComponentContext;

import java.util.Collections;
import java.util.List;

/**
 * OSGi service implementation, which extends the {@link FileProvider}.
 *
 * @author jtschopp
 * @author pschmidiger
 */
@Component(immediate = true, service = FileProviderService.class)
public class FileProviderService extends CloudFileProvider {
    @Reference
    private ConfigurationService configurationService;
    @Reference
    private FileProviderRegistrationService fileProviderRegistrationService;
    @Reference
    private FileRepository fileRepository;
    private String acceptValue;

    @Activate
    protected void activate(ComponentContext context) {
        fileProviderRegistrationService.register(this);
        acceptValue = "/".concat(configurationService.getApplication()).concat("/");
    }

    @Deactivate
    protected void deactivate(ComponentContext context) {
        fileProviderRegistrationService.deregister(this);
    }

    @Override
    protected List<String> getAcceptValues() {
        return Collections.singletonList(acceptValue);
    }

    @Override
    protected Credentials getCredentials() {
        return configurationService.getCredentials();
    }

    @Override
    protected FileRepository getFileRepository() {
        return fileRepository;
    }
}
