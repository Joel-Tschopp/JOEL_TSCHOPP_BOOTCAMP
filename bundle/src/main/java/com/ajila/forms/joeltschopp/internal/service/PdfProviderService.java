package com.ajila.forms.joeltschopp.internal.service;

import com.ajila.cloud.api.model.security.Credentials;
import com.ajila.cloud.api.service.CloudConfigurationService;
import com.ajila.cloud.platform.api.service.CloudPdfProvider;
import com.ajila.cloud.storage.api.repository.FileRepository;
import com.ajila.forms.pdf.api.service.PdfProviderRegistrationService;
import com.ajila.forms.pdf.api.service.PdfRenderOptions;
import com.ajila.forms.pdf.api.service.PdfService;

import com.ajila.forms.joeltschopp.internal.model.FormModel;
import com.ajila.forms.joeltschopp.api.service.ConfigurationService;

import com.adobe.aemds.guide.model.FormSubmitInfo;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.ComponentContext;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * OSGi service implementation, which extends the {@link CloudPdfProvider}.
 *
 * @author jtschopp
 * @author pschmidiger
 */
@Component(immediate = true, service = PdfProviderService.class)
public class PdfProviderService extends CloudPdfProvider {
    @Reference
    private PdfService pdfService;
    @Reference
    private ConfigurationService configurationService;
    @Reference
    private PdfProviderRegistrationService pdfProviderRegistrationService;
    @Reference
    private FileRepository fileRepository;
    @Reference
    private CloudConfigurationService cloudConfigurationService;
    @Reference
    private ValidationService validationService;
    private String acceptValue;

    @Activate
    protected void activate(ComponentContext context) {
        pdfProviderRegistrationService.register(this);
        acceptValue = "/".concat(configurationService.getApplication()).concat("/");
    }

    @Deactivate
    protected void deactivate(ComponentContext context) {
        pdfProviderRegistrationService.deregister(this);
    }

    @Override
    public UUID create(FormSubmitInfo formSubmitInfo) {
        validationService.validate(formSubmitInfo, "nutzungsbedingungen", "termsAndConditions", "tac");
        FormModel formModel = new FormModel(formSubmitInfo.getData());
        formSubmitInfo.setData(formModel.marshall());
        PdfRenderOptions pdfOptions = new PdfRenderOptions().setDoFlatten(true).setSupportAccessibility(true);
        pdfService.render(formSubmitInfo, pdfOptions);
        return super.create(formSubmitInfo);
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

    @Override
    protected PdfService getPdfService() {
        return pdfService;
    }
}
